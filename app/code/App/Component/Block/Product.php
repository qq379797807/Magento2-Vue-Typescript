<?php
namespace App\Component\Block;

use Magento\Framework\DataObject;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
class Product extends \Magento\Framework\View\Element\Template
{
    private $currentStore;
    private $storeManger;
    private $jsonHelper;
    private $scopeConfig;
    private $urlEncoder;
    private $catalogData;
    private $imageHelper;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManger,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Catalog\Helper\Data $catalogData,
        \Magento\Framework\Url\EncoderInterface $urlEncoder,
        \Magento\Catalog\Helper\Image $imageHelper
    )
    {
        parent::__construct($context);
        $this->scopeConfig = $scopeConfig;
        $this->storeManger = $storeManger;
        $this->request = $request;
        $this->jsonHelper = $JsonHelper;
        $this->urlEncoder = $urlEncoder;
        $this->catalogData = $catalogData;
        $this->imageHelper = $imageHelper;
    }

    public function createObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->create($className);
    }

    public function getObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function getCurrentStore()
    {
        if($this->currentStore)
        {
            return $this->currentStore;
        }
        $this->currentStore =$this->storeManger->getStore();
        
        return $this->currentStore;
    }

    public function getProductInfo($version)
    {
        $data = array();
        $params = $this ->request->getParams();
        $id = $params['id'];
        $baseMediaUrl = $this ->_storeManager-> getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA );
        $emailHelper = $this->getObject('Magento\Catalog\Helper\Product');
        $product = $this->getObject('Magento\Catalog\Model\Product')->load($id);
        $data['product_id'] = $id;
        $type = $product->getTypeId();
        $data['product_type'] = $type;
        $data['email_to'] = $emailHelper->getEmailToFriendUrl($product);

        $viewHelper = $this->createObject('Magento\Catalog\Block\Product\View');
        $data['default_qty'] = $viewHelper->getProductDefaultQty();
        $data['product_action'] = $viewHelper->getSubmitUrl($product);

        $reviewHelper = $this->createObject('Magento\Review\Block\Product\Review');
        $data['review_url'] = $reviewHelper->getProductReviewUrl();
        $data['product_grallery'] = $this->getProductGallery();

        $configurableHelper = $this->createObject('Magento\Swatches\Block\Product\Renderer\Configurable');
        $data['configurable'] = $type === 'configurable' ? [
            'jsonConfig' =>  $this->jsonHelper->jsonDecode($configurableHelper->getJsonConfig()),
            'mediaCallback' => $configurableHelper->getMediaCallback()
        ] : [];

        return $data;
    }

    public function getProductGallery () {
        $gallery = [];
        $galleryHelper = $this->createObject('Magento\Catalog\Block\Product\View\Gallery');
        $images = $galleryHelper->getGalleryImages();

        foreach ($images as $image) {
            $imageItem = new DataObject([
                'thumb' => $image->getData('small_image_url'),
                'img' => $image->getData('medium_image_url'),
                'full' => $image->getData('large_image_url'),
                'caption' => ($image->getLabel() ?: $galleryHelper->getProduct()->getName()),
                'position' => $image->getData('position'),
                'isMain'   => $galleryHelper->isMainImage($image),
                'type' => str_replace('external-', '', $image->getMediaType()),
                'videoUrl' => $image->getVideoUrl(),
            ]);
            foreach ($galleryHelper->getGalleryImagesConfig()->getItems() as $imageConfig) {
                $imageItem->setData(
                    $imageConfig->getData('json_object_key'),
                    $image->getData($imageConfig->getData('data_object_key'))
                );
            }
            $gallery[] = $imageItem->toArray();
        }

        if (empty($gallery)) {
            $gallery[] = [
                'thumb' => $this->imageHelper->getDefaultPlaceholderUrl('thumbnail'),
                'img' => $this->imageHelper->getDefaultPlaceholderUrl('image'),
                'full' => $this->imageHelper->getDefaultPlaceholderUrl('image'),
                'caption' => '',
                'position' => '0',
                'isMain' => true,
                'type' => 'image',
                'videoUrl' => null,
            ];
        }

        return $gallery;
    }

    public function getProductJson($version = 'pc')
    {
        $result = $this->getProductInfo($version);
        $home = array(
            'home'=>
                [
                    'label' => 'Home',
                    'link' => $this->_storeManager->getStore()->getBaseUrl()
                ]
        );
        $path = $this->catalogData->getBreadcrumbPath();
        $path = array_merge($home, $path);
        $result['breadcrumbs'] = $path;

        return $this->jsonHelper->jsonEncode($result);
    }
}