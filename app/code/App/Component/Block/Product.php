<?php
namespace App\Component\Block;

use Magento\ConfigurableProduct\Model\Product\Type\Configurable;

class Product extends \Magento\Framework\View\Element\Template
{
    private $current_store;
    private $storeManger;
    private $_jsonHelper;
    protected $scopeConfig;
    protected $categoryHelper;
    protected $urlEncoder;
    protected $_catalogData;

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManger,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \App\Component\Helper\Category $categoryHelper,
        \Magento\Catalog\Helper\Data $catalogData,
        \Magento\Framework\Url\EncoderInterface $urlEncoder
    )
    {
        $this->scopeConfig = $scopeConfig;
        $this->categoryHelper = $categoryHelper;
        parent::__construct($context);
        $this->storeManger = $storeManger;
        $this->request = $request;
        $this->_jsonHelper = $JsonHelper;
        $this->urlEncoder = $urlEncoder;
        $this->_catalogData = $catalogData;
    }

    public function getObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function customerSession()
    {
        return $this->getObject('Magento\Customer\Model\Session');
    }

    public function getCurrentStore()
    {
        if($this->current_store)
        {
            return $this->current_store;
        }
        $this->current_store =$this->storeManger->getStore();
        return $this->current_store;
    }

    public function getProductInfo ($version)
    {
        $data = array();
        $params = $this ->request->getParams();
        $id = $params['id'];
        $size = $version == 'mobile' ? '400x400' : '800x800';
        $baseMediaUrl = $this ->_storeManager-> getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA );
        $helper = $this->getObject('App\Component\Helper\Data');
        $email_to_friend_helper = $this->getObject('Magento\Catalog\Helper\Product');
        $currentStore = $this->getCurrentStore();
        $baseUrl = $currentStore->getBaseUrl('media') . 'catalog/product/';
        $website_id = $currentStore->getWebsite()->getId();
        $store_id = $currentStore->getId();
        $product = $this->getObject('Magento\Catalog\Model\Product')->load($id);
        $data['product_id'] = $id;
        // $data['review_average'] = $helper->getProductReviewAverage($id);
        $data['product_type'] = $helper->getProductType($id);
        // $stockinfo = $helper->getProductQty($id,$product->getTypeId());
        // $data['status'] = $stockinfo['status'] == true ? 'In Stock': 'Out Of Stock';
        // $data['name'] = $helper->getProductsValue($id,$store_id,'name');
        // $data['sku'] = $helper->getProductSkuById($id);
        // $data['short_description'] = $helper->getProductsValue($id,$store_id,'listing_description');
        // $data['description'] = $helper->getProductsValue($id,$store_id,'description');
        // $vedio = $helper->getProductsValue($id,$store_id,'short_description');
        // if(preg_match('/iframe/',$vedio)){
        //     $data['vedio'] = $vedio;
        // }

        // $convert = $this->getObject("Magento\Checkout\Helper\Data");
        // $prices = $helper->getMiniPrice($id,$website_id);
        // if($data['product_type']=="simple")
        // {
        //     $data['price'] =$helper->getProductsValue($id,$store_id,'price');
        //     $data['qty'] =$stockinfo['qty'];
        //     $data['max_sale_qty'] =$stockinfo['max_sale_qty'];

        // } else if($data['product_type']=="configurable") {
        //     $data['price'] =0;
        // }
        // if(array_key_exists('final_price',$prices))
        // {
        //     $data['price'] =$prices['final_price'];
        //     $data['price_label'] =$convert->convertPrice($data['price']);
        // }
        // if(array_key_exists('price',$prices))
        // {
        //     if($prices['price']>$data['price'])
        //     {
        //         $data['origin_price'] =$prices['price'];
        //         $data['origin_price_label'] =$convert->convertPrice($data['origin_price']);
        //     }

        // }

        // if(!isset($data['origin_price']))
        // {
        //     $data['origin_price'] =$data['price'];
        // }

        // $data['images'] = $this->getImage($id,$store_id,$helper,$size);
        // $simpleIds = $helper->getConfigLimiteds($id);
        // $relateProduct = array();
        // if($simpleIds) {
        //     foreach ($simpleIds as $simid) {
        //         $status = $helper->getProductsValue($simid, $store_id, 'status');

        //         $simleProduct = array();
        //         $simleProduct['id'] = $simid;
        //         $simleProduct['images'] = $this->getImage($simid, $store_id, $helper, $size);
        //         $simleProduct['price'] = $helper->getProductsValue($simid, $store_id, 'price');
        //         $simleProduct['price_label'] = $convert->convertPrice($simleProduct['price']);
        //         $prices = $helper->getMiniPrice($simid, $website_id);

        //         if (array_key_exists('final_price', $prices)) {
        //             $simleProduct['price'] = $prices['final_price'];
        //             $simleProduct['price_label'] = $convert->convertPrice($simleProduct['price']);
        //         }
        //         if (array_key_exists('price', $prices)) {
        //             if ($prices['price'] > $simleProduct['price']) {
        //                 $simleProduct['origin_price'] = $prices['price'];
        //                 $simleProduct['origin_price_label'] = $convert->convertPrice($prices['price']);
        //             }

        //         }
        //         if (!isset($simleProduct['origin_price'])) {
        //             $simleProduct['origin_price'] = $simleProduct['price'];
        //         }

        //         $key = 'key_' . $simid;
        //         $stockinfo = $helper->getProductQty($simid);
        //         $simleProduct['status'] = $stockinfo['status'];
        //         if ($status != 1)
        //             $simleProduct['qty'] = $stockinfo['qty'];

        //         $simleProduct['max_sale_qty'] = $stockinfo['max_sale_qty'];
        //         $relateProduct[$key] = $simleProduct;
        //     }
        // }

        // $data['configproduct'] =$relateProduct;
        // $data['configattr'] =$helper->_getConfigAttribute($id);
        // $data['email_to_friends'] = $email_to_friend_helper->getEmailToFriendUrl($product);
        // $data['type'] = $this->_request->getParam('type', '');
        // $data['is_in_wishlist'] = $helper->inWishList($id);
        // $manualData = $helper->getProductsValue($id,$store_id,'manual_data');
        // $manualData = $this->convertMediaPath($manualData,$baseMediaUrl);
        // $data['user_guide'] = $manualData;

        // $software_updates = $helper->getProductsValue($id,$store_id,'support_data');
        // $software_updates = $this->convertMediaPath($software_updates,$baseMediaUrl);
        // $data['software_updates'] = $software_updates;

        // $data['related'] =$this->getRelateProduct($product,$store_id,$website_id,$helper);
        // $data['upsell'] =$this->getUpsellProduct($product,$store_id,$website_id,$helper);
        // $data['crossSell'] =$this->getCrossSellProduct($product,$store_id,$website_id,$helper);
        return $data;
    }

    public function convertMediaPath($data,$baseMediaUrl){

        $reg="/media\s*url=[\"\']([^\"\']+)/";
        $reg_replace = '/{{.*}}/i';
        $result = preg_match_all($reg,$data,$matches);
        if($result && isset($matches[1])){
            foreach($matches[1] as $key => $match){

                $replacement = $baseMediaUrl.$match;
                $data = preg_replace($reg_replace, $replacement, $data, 1);

            }
        }
        return $data;
    }

    private function getRelateProduct($product,$store_id,$website_id,$helper)
    {
        $relatedProducts = $product->getRelatedProductCollection();
        $relatedProducts->addAttributeToFilter("status", 1);
        $relatedProducts->addAttributeToFilter("visibility", array('in'=>[2,4]));
        $convert = $this->getObject("Magento\Checkout\Helper\Data");
        $imageHelper = $this->getObject("Magento\Catalog\Helper\Image");
        $data=[];
        $size ='800x800';
        if (!empty($relatedProducts)) {
            foreach ($relatedProducts as $relatedProduct) {
                $relaId = $relatedProduct->getId();
                $type = $relatedProduct ->getData('type_id');
                $data[$relaId]['type'] = $type;
                $data[$relaId]['id'] = $relaId;
                $data[$relaId]['name'] = $helper->getProductsValue($relaId,$store_id,'name');


                $prices = $helper->getMiniPrice($relaId,$website_id);

                $stockinfo =$helper->getProductQty($relaId,$relatedProduct->getTypeId());
                if($type=="simple")
                {
                    $data[$relaId]['price'] =$helper->getProductsValue($relaId,$store_id,'price');
                    $data[$relaId]['price'] =$helper->getProductsValue($relaId,$store_id,'price');
                    $data[$relaId]['status'] =$stockinfo['status'];
                    $data[$relaId]['qty'] =$stockinfo['qty'];


                }else if($type=="configurable")
                {
                    $data[$relaId]['status'] =$stockinfo['status'];
                    $data[$relaId]['price'] =0;
                }
                if(array_key_exists('final_price',$prices))
                {
                    $data[$relaId]['price'] =$prices['final_price'];
                    $data[$relaId]['price_label'] =$convert->convertPrice($data[$relaId]['price']);
                }
                if(array_key_exists('price',$prices))
                {
                    if($prices['price']>$data[$relaId]['price'])
                    {
                        $data[$relaId]['origin_price'] =$prices['price'];
                        $data[$relaId]['origin_price_label'] =$convert->convertPrice($data[$relaId]['origin_price']);
                    }

                }

                if(!isset($data['origin_price'])) {
                    $data[$relaId]['origin_price'] =$data[$relaId]['price'];
                }

                $data[$relaId]['images'] = $this->getImage($relaId,$store_id,$helper,$size);
                $data[$relaId]['url'] = $relatedProduct->getProductUrl();
            }
        }

        return $data;
    }

    private function getUpsellProduct($product,$store_id,$website_id,$helper)
    {
        $upsellProducts = $product->getUpsellProductCollection();
        $upsellProducts->addAttributeToFilter("status", 1);
        $upsellProducts->addAttributeToFilter("visibility", array('in'=>[2,4]));
        $convert = $this->getObject("Magento\Checkout\Helper\Data");
        $imageHelper = $this->getObject("Magento\Catalog\Helper\Image");
        $data=[];
        $size ='800x800';
        if (!empty($upsellProducts)) {
            foreach ($upsellProducts as $upsellProduct) {
                $relaId = $upsellProduct->getId();
                $type = $upsellProduct ->getData('type_id');
                $data[$relaId]['type'] = $type;
                $data[$relaId]['id'] = $relaId;
                $data[$relaId]['name'] = $helper->getProductsValue($relaId,$store_id,'name');


                $prices = $helper->getMiniPrice($relaId,$website_id);
                $stockinfo =$helper->getProductQty($relaId,$upsellProduct->getTypeId());
                if($type=="simple")
                {
                    $data[$relaId]['price'] =$helper->getProductsValue($relaId,$store_id,'price');
                    $data[$relaId]['price'] =$helper->getProductsValue($relaId,$store_id,'price');
                    $data[$relaId]['status'] =$stockinfo['status'];
                    $data[$relaId]['qty'] =$stockinfo['qty'];
                    $data[$relaId]['max_sale_qty'] =$stockinfo['max_sale_qty'];

                }else if($type=="configurable")
                {
                    $data[$relaId]['status'] =$stockinfo['status'];
                    $data[$relaId]['price'] =0;
                }
                if(array_key_exists('final_price',$prices))
                {
                    $data[$relaId]['price'] =$prices['final_price'];
                    $data[$relaId]['price_label'] =$convert->convertPrice($data[$relaId]['price']);
                }
                if(array_key_exists('price',$prices))
                {
                    if($prices['price']>$data[$relaId]['price'])
                    {
                        $data[$relaId]['origin_price'] =$prices['price'];
                        $data[$relaId]['origin_price_label'] =$convert->convertPrice($data[$relaId]['origin_price']);
                    }

                }

                if(!isset($data['origin_price']))
                {
                    $data[$relaId]['origin_price'] =$data[$relaId]['price'];
                }


                $data[$relaId]['images'] = $this->getImage($relaId,$store_id,$helper,$size);
                $data[$relaId]['url'] = $upsellProduct->getProductUrl();

            }
        }
        return $data;

    }

    private function getCrossSellProduct($product,$store_id,$website_id,$helper)
    {
        $CrossSellProducts = $product->getCrossSellProductCollection();
        $CrossSellProducts->addAttributeToFilter("status", 1);
        $CrossSellProducts->addAttributeToFilter("visibility", array('in'=>[2,4]));
        $convert = $this->getObject("Magento\Checkout\Helper\Data");
        $imageHelper = $this->getObject("Magento\Catalog\Helper\Image");
        $data=[];
        $size ='800x800';
        if (!empty($CrossSellProducts)) {
            foreach ($CrossSellProducts as $CrossSellProduct) {
                $relaId = $CrossSellProduct->getId();
                $type = $CrossSellProduct ->getData('type_id');
                $data[$relaId]['type'] = $type;
                $data[$relaId]['id'] = $relaId;
                $data[$relaId]['name'] = $helper->getProductsValue($relaId,$store_id,'name');


                $prices = $helper->getMiniPrice($relaId,$website_id);
                $stockinfo =$helper->getProductQty($relaId,$CrossSellProduct->getTypeId());
                if($type == "simple") {
                    $data[$relaId]['price'] =$helper->getProductsValue($relaId,$store_id,'price');
                    $data[$relaId]['price'] =$helper->getProductsValue($relaId,$store_id,'price');
                    $data[$relaId]['status'] =$stockinfo['status'];
                    $data[$relaId]['qty'] =$stockinfo['qty'];

                }else if($type=="configurable") {
                    $data[$relaId]['status'] =$stockinfo['status'];
                    $data[$relaId]['price'] =0;
                }
                if(array_key_exists('final_price',$prices)) {
                    $data[$relaId]['price'] =$prices['final_price'];
                    $data[$relaId]['price_label'] =$convert->convertPrice($data[$relaId]['price']);
                }
                if(array_key_exists('price',$prices))
                {
                    if($prices['price']>$data[$relaId]['price'])
                    {
                        $data[$relaId]['origin_price'] =$prices['price'];
                        $data[$relaId]['origin_price_label'] =$convert->convertPrice($data[$relaId]['origin_price']);
                    }

                }

                if(!isset($data['origin_price']))
                {
                    $data[$relaId]['origin_price'] =$data[$relaId]['price'];
                }

                $data[$relaId]['images'] = $this->getImage($relaId,$store_id,$helper,$size);
                $data[$relaId]['url'] = $CrossSellProduct->getProductUrl();

            }
        }
        return $data;
    }

    public function getImage($id,$store_id,$helper,$size)
    {
        $gallerys = $helper->getGallery($id,$store_id);
        $retArr = array();
        $baseImage = $helper->getProductsValue($id,$store_id,'image');
        $retArr[] = $helper->resizeProductImage($baseImage,$size);
        foreach ($gallerys as $subitem)
        {
            if($subitem==$baseImage)
            {
                continue;
            }
            $retArr[] = $helper->resizeProductImage($subitem,'800x800');
        }

        return $retArr;
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
        $path = $this->_catalogData->getBreadcrumbPath();
        $path = array_merge($home, $path);
        $result['breadcrumbs'] = $path;

        return $this->_jsonHelper->jsonEncode($result);
    }
}