<?php
namespace App\Component\Block;

use Magento\ConfigurableProduct\Model\Product\Type\Configurable;

class Product extends \Magento\Framework\View\Element\Template
{
    private $currentStore;
    private $storeManger;
    private $jsonHelper;
    protected $scopeConfig;
    protected $urlEncoder;
    protected $catalogData;

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManger,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Catalog\Helper\Data $catalogData,
        \Magento\Framework\Url\EncoderInterface $urlEncoder
    )
    {
        parent::__construct($context);
        $this->scopeConfig = $scopeConfig;
        $this->storeManger = $storeManger;
        $this->request = $request;
        $this->jsonHelper = $JsonHelper;
        $this->urlEncoder = $urlEncoder;
        $this->catalogData = $catalogData;
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
        $data['type'] = $this->_request->getParam('type', '');
        $data['email_to'] = $emailHelper->getEmailToFriendUrl($product);

        $reviewHelper = $this->createObject('Magento\Review\Block\Product\Review');
        $data['review_url'] = $reviewHelper->getProductReviewUrl();

        return $data;
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