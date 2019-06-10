<?php
namespace App\Component\Helper;

use Magento\Framework\App\ResourceConnection;
use Magento\Framework\App\ObjectManager;

class Data extends \Magento\Framework\App\Helper\AbstractHelper {
    protected $conn;
    protected $objManager;

    /**
     * @param \Magento\Framework\App\Helper\Context $context
     */
    public function __construct(\Magento\Framework\App\Helper\Context $context
    ) {
        $this->objManager = ObjectManager::getInstance();
        parent::__construct($context);
    }

    protected function getConnection() {
        if ($this->conn)
            return $this->conn;
        $this->conn = $this->objManager->get("Magento\Framework\App\ResourceConnection")->getConnection();

        return $this->conn;
    }

    protected function query($sql, $params = null) {

        $stmt = $this->prequery($sql, $params);
        return $stmt->fetchAll();
    }

    protected function prequery($sql, $params = null) {
        $stmt = $this->getConnection()->prepare($sql);
        if ($params != null) {
            $params = is_array($params) ? $params : [$params];
            $stmt->execute($params);

        } else {
            $stmt->execute();
        }

        return $stmt;
    }

    public function formatPrice($price)
    {
        $priceHelper = $this->getObject('Magento\Framework\Pricing\PriceCurrencyInterface');
        $formatPrice = $priceHelper->format($price);

        return $formatPrice;
    }

    public function getShippingMethodData($qupteId)
    {
        $sql = "SELECT r.code, r.method_description 
FROM quote_shipping_rate r 
WHERE r.address_id=(SELECT address_id FROM quote_address WHERE quote_id=? AND address_type='shipping') 
ORDER BY r.rate_id DESC";
        $parms = [$qupteId];
        $result = $this->query($sql, $parms);

        return $result;
    }

    public  function  getVersion(){
        $sql ="SELECT * FROM sk_app_version order by id desc limit 0,1;";
        $results = $this->query($sql, null);
        $ret =[];
        $ret['hasversion'] =false;
        $ret['name'] ="";
        $ret['version'] ="";
        $ret['force'] =false;
        $ret['update_url'] ="";
        $ret['description'] ="";
        foreach ($results as $row)
        {
            $ret['hasversion'] =true;
            $ret['name'] =$row['name'];
            $ret['version'] =$row['version'];
            $ret['force'] =$row['force']==0?false:true;
            $ret['update_url'] =$row['update_url'];
            $ret['description'] =$row['description'];
        }
        return $ret;
    }
    public  function  getInitAds($baseUrl){
        $sql ="SELECT ads_image,ads_url FROM sk_app_ads where ads_status =1;";
        $results = $this->query($sql, null);
        $ret =[];

        foreach ($results as $row)
        {

            if($row['ads_image']=="")
            {
                continue;
            }
            $_ret =[];
            $_ret['ads_image'] =$baseUrl.$row['ads_image'];
            $_ret['ads_url'] =$row['ads_url'];
            $ret[]=$_ret;
        }
        return $ret;
    }
    public function getThemeSetting($theme_id) {
        $sql = "SELECT theme_id,theme_path,area,code FROM theme WHERE theme_id=?";
        $parms = [$theme_id];
        $results = $this->query($sql, $parms);
        $ret = [];
        foreach ($results as $row) {
            $ret['themeId'] = $row['theme_id'];
            $ret['theme'] = $row['theme_path'];
            $ret['area'] = $row['area'];
        }

        return $ret;
    }

    public function mblogGetPostTagIds($tag_id) {
        $sql = "SELECT post_id FROM mageplaza_blog_post_tag WHERE   tag_id =?";
        $parms = [$tag_id];
        $results = $this->query($sql, $parms);

        $postIds = [];
        foreach ($results as $row) {

            $postIds[] = $row['post_id'];

        }

        return $postIds;
    }

    public function mblogGetPids($postId) {
        $sql = "SELECT entity_id FROM mageplaza_blog_post_product WHERE  post_id =?";
        $parms = [$postId];
        $results = $this->query($sql, $parms);
        $ids = '';
        foreach ($results as $row) {
            $ids .= $row['entity_id'] . ",";

        }

        return $ids;
    }

    public function getProductUrl($product_id, $store_id, $baseurl) {
        $target = 'catalog/product/view/id/' . $product_id;
        $sql = "SELECT request_path FROM url_rewrite WHERE entity_id =? AND entity_type ='product' AND target_path =? AND store_id =?";
        $parms = [$product_id, $target, $store_id];

        $results = $this->query($sql, $parms);

        foreach ($results as $row) {
            $target = $row['request_path'];
            break;
        }

        return $baseurl . $target;

    }

    public function getProductsValue($id, $storeId, $code) {
        $attInfos = $this->getAttributeInfo($code);
        $attId = 0;
        $typename = "";
        if (count($attInfos) > 0) {
            $attId = $attInfos['attid'];
            $typename = $attInfos['tyle'];
        } else {
            return "";
        }
        $row_id = $this->getRowId($id);
        $sql = "SELECT et.value FROM catalog_product_entity_" . $typename . " et  WHERE et.store_id IN(0,?) AND  et.row_id =? and et.attribute_id=? ORDER BY et.store_id ASC LIMIT 0,1;";

        $parms = [$storeId, $row_id, $attId];

        $results = $this->query($sql, $parms);
        $ret = "";
        foreach ($results as $row) {
            $ret = $row['value'];
            break;
        }

        return $ret;
    }

    private function getAttributeInfo($code) {
        $sql = "SELECT attribute_id,backend_type FROM eav_attribute WHERE attribute_code LIKE ? AND entity_type_id =4";
        $parms = [$code];
        $results = $this->query($sql, $parms);
        $ret = [];
        foreach ($results as $row) {
            $ret['attid'] = $row['attribute_id'];
            $ret['tyle'] = $row['backend_type'];
        }

        return $ret;

    }

    public function getAttributeIdByCode($code,$entity_type_id = 4) {
        $sql = "SELECT attribute_id FROM eav_attribute WHERE attribute_code = ? AND entity_type_id =?";
        $parms = [$code,$entity_type_id];
        $results = $this->query($sql, $parms);
        $attribute_id = '';
        foreach ($results as $row) {
            $attribute_id = $row['attribute_id'];
        }

        return $attribute_id;

    }

    public function getProductType($entity_id) {
        $sql = "SELECT type_id FROM catalog_product_entity WHERE entity_id=?";
        $parms = [$entity_id];
        $results = $this->query($sql, $parms);
        $type_id = '';
        foreach ($results as $row) {
            $type_id = $row['type_id'];
        }

        return $type_id;
    }
    public function getProductReviewAverage($entity_id){
        $sql = "select percent from rating_option_vote_aggregated where entity_pk_value = ?";
        $parms = [$entity_id];
        $results = $this->query($sql, $parms);
        $reviewAverage = '';
        foreach ($results as $row) {
            $reviewAverage = $row['percent'];
        }

        return $reviewAverage;
    }

    public function getRowId($entity_id) {
        $sql = "SELECT row_id FROM catalog_product_entity WHERE entity_id=?";
        $parms = [$entity_id];
        $results = $this->query($sql, $parms);
        $ret = 0;
        foreach ($results as $row) {
            $ret = $row['row_id'];
        }

        return $ret;
    }
    public function getEntityIdByRowId($row_Id) {
        $sql = "SELECT entity_id FROM catalog_product_entity WHERE row_id=?";
        $parms = [$row_Id];
        $results = $this->query($sql, $parms);
        $ret = 0;
        foreach ($results as $row) {
            $ret = $row['entity_id'];
        }

        return $ret;
    }

    public function getProductSkuById($entity_id) {
        $sql = "SELECT sku FROM catalog_product_entity WHERE entity_id=?";
        $parms = [$entity_id];
        $results = $this->query($sql, $parms);
        $sku = '';
        foreach ($results as $row) {
            $sku = $row['sku'];
        }

        return $sku;
    }

    public function getMiniPrice($id, $website_id) {
        $row_id = $this->getRowId($id);
        $ret = [];


        $type_id = $this->getProductType($id);
        if ($type_id == "configurable") {
            $sql = "SELECT price,final_price FROM catalog_product_index_price pr LEFT JOIN  catalog_product_super_link sl ON pr.entity_id =sl.product_id 
LEFT JOIN catalog_product_entity e ON e.entity_id=pr.entity_id
LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
WHERE pr.website_id =? AND sl.parent_id=? and es.value=1 order by (pr.price-pr.final_price) desc,price asc";

            $status_code_id = $this->getAttributeIdByCode('status');
            $parms = [$status_code_id, $website_id, $row_id ];
            $results = $this->query($sql, $parms);

            foreach ($results as $row) {
                $ret['final_price'] = $row['final_price'];
                $ret['price'] = $row['price'];
                break;
            }

        } else {
            $sql = "SELECT price,final_price FROM catalog_product_index_price pr 
LEFT JOIN catalog_product_entity e ON e.entity_id=pr.entity_id
LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
WHERE pr.website_id =? AND pr.entity_id=?  and es.value=1 ";

            $status_code_id = $this->getAttributeIdByCode('status');
            $parms = [$status_code_id, $website_id, $row_id ];
            $results = $this->query($sql, $parms);

            foreach ($results as $row) {
                $ret['final_price'] = $row['final_price'];
                $ret['price'] = $row['price'];
                break;
            }
        }

        return $ret;
    }


    public function getConfigAttribute($product_id) {
        $row_id = $this->getRowId($product_id);
        $sql = "SELECT GROUP_CONCAT(sl.product_id) AS limitids,sa.attribute_id,ce.value AS option_id,ev.value,e.attribute_code,e.frontend_label FROM catalog_product_super_link sl 
LEFT JOIN catalog_product_super_attribute sa ON sl.parent_id =sa.product_id
LEFT JOIN catalog_product_entity_int ce ON (sl.product_id =ce.row_id AND sa.attribute_id =ce.attribute_id)
LEFT JOIN eav_attribute_option_value ev ON (ce.value =ev.option_id AND ev.store_id =0)
LEFT JOIN eav_attribute e ON(e.attribute_id =sa.attribute_id)
WHERE sl.parent_id =?
GROUP BY sa.attribute_id,ce.value,ev.value,e.attribute_code
ORDER BY sa.attribute_id DESC";

        $parms = [$row_id];
        $results = $this->query($sql, $parms);
        $ret = [];
        $att = [];
        $product = [];
        foreach ($results as $row) {
            $key_attribute_id = "key_" . $row['attribute_id'];
            $key_option_id = "key_" . $row['option_id'];
            $ids = $row['limitids'];
            $idArr = explode(",", $ids);
            $att[$key_attribute_id][$key_option_id] = $idArr;
        }
        $ret['conf'] = $att;

        $sqlqty = "SELECT sl.product_id,IFNULL(csi.max_sale_qty,1) AS qty FROM catalog_product_super_link sl LEFT JOIN cataloginventory_stock_item csi ON sl.product_id =csi.product_id WHERE sl.parent_id =?";
        $qtyResult = $this->query($sqlqty, $parms);
        $defaultQty = 0;
        foreach ($qtyResult as $row) {
            $product_id = 'key_' . $row['product_id'];
            $qty = $row['qty'];
            $product[$product_id] = $qty;
            if ($defaultQty == 0)
                $defaultQty = $qty;
        }
        $ret['product'] = $product;

        $baseQty = 1;
        if ($defaultQty > 0) {
            $baseQty = $defaultQty;
        } else {
            $sqloneqty = "SELECT IFNULL(csi.max_sale_qty,1) AS qty FROM cataloginventory_stock_item csi WHERE csi.product_id =?";
            $params = [$product_id];
            $qtyOneResult = $this->query($sqloneqty, $params);
            foreach ($qtyOneResult as $subrow) {
                $baseQty = $subrow['qty'];
            }
        }
        $ret['baseqty'] = $baseQty;

        return $ret;
    }

    public function getConfigLimiteds($entity_id) {
        $row_id = $this->getRowId($entity_id);
        $sql = 'select product_id from catalog_product_super_link sl  where sl.parent_id =?';
        $params = [$row_id];
        $Results = $this->query($sql, $params);
        $ids = [];
        foreach ($Results as $row) {
            $ids[] = $row['product_id'];
        }

        return $ids;
    }

    public function getGallery($product_id, $store_id) {
        $sql = "SELECT  distinct eg.value FROM catalog_product_entity_media_gallery_value ev LEFT JOIN catalog_product_entity_media_gallery eg ON  ev.value_id =eg.value_id LEFT JOIN catalog_product_entity e ON ev.row_id =e.row_id WHERE  e.entity_id =:product_id and ev.disabled =0 AND ev.store_id IN(0,:store_id)";
        $parms = ['product_id' => $product_id, 'store_id' => $store_id];

        $results = $this->query($sql, $parms);
        $ret = [];
        foreach ($results as $row) {
            $ret[] = $row['value'];
        }

        return $ret;

    }

    public function resizeProductImage($imageFile, $size) {
        $imageObj = $this->createObject("Magento\Catalog\Model\Product\Image");
        $imageObj->setDestinationSubdir("image");
        $imageObj->setSize($size);
        $imageObj->setBaseFile($imageFile);
        if ( !$imageObj->isCached()) {
            $imageObj->resize();
            $imageObj->saveFile();
        }

        return $imageObj->getUrl();
    }

    public function getObject($className) {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function createObject($className) {
        return \Magento\Framework\App\ObjectManager::getInstance()->create($className);
    }

    public function getColorLable($option_id) {
        $sql = "select value from eav_attribute_option_value where store_id = 0 and option_id = :option_id";
        $parms = ['option_id' => $option_id];

        $results = $this->query($sql, $parms);
        $ret='';
        foreach ($results as $row) {
            $ret = $row['value'];
        }

        return $ret;
    }

    public function _getConfigAttribute($product_id) {
        $sql = "SELECT GROUP_CONCAT(sl.product_id) AS limitids,sa.attribute_id,ce.value as option_id,ev.value,IFNULL(sw.value,'') as swatch,e.attribute_code,e.frontend_label FROM catalog_product_super_link sl 
JOIN catalog_product_entity e_main on e_main.row_id = sl.parent_id
LEFT JOIN catalog_product_super_attribute sa ON sl.parent_id =sa.product_id
LEFT JOIN catalog_product_entity se ON sl.product_id =se.entity_id
LEFT JOIN catalog_product_entity_int ce ON (se.row_id =ce.row_id AND sa.attribute_id =ce.attribute_id)
LEFT JOIN eav_attribute_option_swatch sw ON (ce.value =sw.option_id AND sw.store_id =0)
LEFT JOIN eav_attribute_option_value ev ON (ce.value =ev.option_id AND ev.store_id =0)
LEFT JOIN eav_attribute e ON(e.attribute_id =sa.attribute_id)
WHERE e_main.entity_id = ?
GROUP BY sa.attribute_id,ce.value,ev.value,sw.value,e.attribute_code
ORDER BY sa.attribute_id DESC ";
        $parms = [$product_id];
        $results = $this->query($sql, $parms);
        $ret = [];
        $attr = [];
        $attribute_id = 0;
        foreach ($results as $row) {
            $cid = $row['attribute_id'];
            if ($cid != $attribute_id) {
                if (count($attr) > 0) {
                    $newItem = [];
                    $firstItem = $attr[0];
                    $newItem['showcolor'] = $firstItem['showcolor'];
                    $newItem['attribute_id'] = $firstItem['attribute_id'];
                    $newItem['code'] = $firstItem['code'];
                    $newItem['frontend_label'] = $firstItem['frontend_label'];
                    $newItem['options'] = $attr;

                    $ret[] = $newItem;
                }
                $attribute_id = $cid;
                $attr = [];
            }
            $subitem = [];
            $subitem['attribute_id'] = $cid;
            $subitem['code'] = $row['attribute_code'];
            $subitem['option_id'] = $row['option_id'];
            $subitem['swatch'] = $row['swatch'];
            $subitem['showcolor'] = true;
            if ($row['swatch'] == "") {
                $subitem['showcolor'] = false;
            }
            $subitem['label'] = $row['value'];
            $subitem['frontend_label'] = $row['frontend_label'];
            $ids = $row['limitids'];
            $subitem['product_ids'] = explode(",", $ids);
            $attr[] = $subitem;
        }

        if (count($attr) > 0) {

            $newItem = [];
            $firstItem = $attr[0];
            $newItem['showcolor'] = $firstItem['showcolor'];
            $newItem['attribute_id'] = $firstItem['attribute_id'];
            $newItem['code'] = $firstItem['code'];
            $newItem['frontend_label'] = $firstItem['frontend_label'];
            $newItem['options'] = $attr;

            $ret[] = $newItem;
        }

        return $ret;
    }


    public function getProductQty($product_id, $type ='simple') {
        $ret = [];
        if($type == 'simple'){
            $sql = "select qty,max_sale_qty,is_in_stock from cataloginventory_stock_item where product_id =?";
            $parms = [$product_id];
            $results = $this->query($sql, $parms);
            $ret['status'] = false;
            foreach ($results as $row) {
                $ret['qty'] = $row['qty'];
                $ret['max_sale_qty'] = $row['max_sale_qty'];
                if($row['is_in_stock']==1){
                    $ret['status'] = $row['qty'] > 0 ? true : false;
                }
                break;
            }
            if (($ret['max_sale_qty'] > $ret['qty'] || $ret['max_sale_qty']==0) && $ret['qty'] > 0) {
                $ret['max_sale_qty'] = $ret['qty'];
            }
        }elseif($type == 'configurable'){
            $sql = "select e.row_id,link.parent_id,sum(stock.is_in_stock) stock_status from catalog_product_super_link as link join catalog_product_entity e on e.row_id = link.parent_id  left join cataloginventory_stock_item as stock on  link.product_id = stock.product_id where e.entity_id = ? group by link.parent_id;";
            $parms = [$product_id];
            $results = $this->query($sql, $parms);
            $ret['status'] = false;
            foreach ($results as $row) {
                    $ret['status'] = $row['stock_status']>0 ? true : false;

                break;
            }
        }
        return $ret;
    }

    public function getAttributeSetId($product_id) {
        $sql = 'select attribute_set_id from  catalog_product_entity where entity_id=?';
        $parms = [$product_id];
        $results = $this->query($sql, $parms);
        $attributeSetId = 0;
        foreach ($results as $row) {
            $attributeSetId = $row['attribute_set_id'];
        }

        return $attributeSetId;
    }

    public function getGroupInfo($name, $attSetId) {
        $sql = "SELECT attribute_group_id FROM `eav_attribute_group` where attribute_set_id =:setid and attribute_group_name like :name";
        $parms = ['setid' => $attSetId, 'name' => $name];
        $groupId = 0;
        $results = $this->query($sql, $parms);
        foreach ($results as $row) {
            $groupId = $row['attribute_group_id'];
            break;
        }

        $sql = 'select e.frontend_label,e.attribute_id,e.backend_type,e.frontend_input,e.attribute_code,ea.attribute_group_id,ea.sort_order from eav_entity_attribute ea left join eav_attribute e on ea.attribute_id =e.attribute_id 
where  ea.attribute_set_id =:setid and ea.attribute_group_id =:groupId order by ea.sort_order asc';
        $parms = ['setid' => $attSetId, 'groupId' => $groupId];
        $results = $this->query($sql, $parms);
        $retAtt = [];
        foreach ($results as $row) {
            $subItem = [];
            $subItem['label'] = __(ucwords(strtolower($row['frontend_label'])));
            $subItem['attribute_id'] = $row['attribute_id'];
            $subItem['backend_type'] = $row['backend_type'];
            $subItem['frontend_input'] = $row['frontend_input'];

            $subItem['code'] = $row['attribute_code'];
            $retAtt[] = $subItem;
        }

        return $retAtt;

    }

    public function getProductsFullValue($id, $storeId, $attId, $typename) {

        $row_id = $this->getRowId($id);
        $sql = "SELECT et.value FROM catalog_product_entity_" . $typename . " et  WHERE et.store_id IN(0,?) AND  et.row_id =? and et.attribute_id=? ORDER BY et.store_id ASC LIMIT 0,1;";

        $parms = [$storeId, $row_id, $attId];

        $results = $this->query($sql, $parms);
        $ret = "";
        foreach ($results as $row) {
            $ret = $row['value'];
            break;
        }


        return $ret;
    }

    public function getSimpleProduct($entity_id, $super_attribute) {
        $ids = $this->getConfigLimiteds($entity_id);
        foreach ($ids as $id) {
            $row_id = $this->getRowId($id);
            if ($this->checkIsMappedProduct($row_id, $super_attribute)) {
                return $id;
            }
        }

        return 0;
    }

    public function checkIsMappedProduct($row_id, $super_attribute) {
        foreach ($super_attribute as $key => $value) {
            if ( !$this->checkAttributeMapped($row_id, $key, $value)) {
                return false;
            }
        }

        return true;
    }

    public function checkAttributeMapped($row_id, $attributeId, $value) {
        $sql = "select value from catalog_product_entity_int  where row_id =? and attribute_id =?";
        $parms = [$row_id, $attributeId];
        $results = $this->query($sql, $parms);
        $ret = -1;
        foreach ($results as $row) {
            if ($row['value'] == $value) {
                return true;
            } else {
                return false;
            }
        }

        return false;

    }

    public function getFeatureUPSProduct($productId, $type, $storeId, $baseUrl) {
        $retArr = $this->_getFeatureUPSProduct($productId, $type, $storeId, $baseUrl);
        if (count($retArr) == 0) {
            $retArr = $this->getOldFeatureImages($productId, $type, $storeId, $baseUrl);
        }

        return $retArr;
    }

    public function getProductRewardPoint($quote) {
        $result = [];
        $earn_points = [];
        $available_points = [];

        $scopeConfig = $this->createObject('\Magento\Framework\App\Config\ScopeConfigInterface');

        $rewardPointProportion = $scopeConfig->getValue('rewardpoint_customfee/rewardpoint_customfee/rewardpoint_proportion', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        $items = $quote->getAllVisibleItems();

        $storeId = $quote->getStoreId();

        foreach ($items as $item) {
            $simpleId = $this->getSimpleIdByItemId($item->getId());
            if ($simpleId == 0) {
                $simpleId = $item->getProduct()->getId();
            }

            //$product = $productObject->load($item['product_id']);
            // 可赚积分

            $earn_point = $this->getProductsValue($simpleId, $storeId, 'earn_point');
            if ($earn_point) {
                $earn_point = $earn_point * $item['qty'];
            } else {
                $earn_point = $item->getPrice() * $rewardPointProportion * $item['qty'];
            }
            // 可用积分
            $available_point = $this->getProductsValue($simpleId, $storeId, 'available_point');
            if ($available_point != "") {
                $available_point = $available_point * $item['qty'];
            } else {
                $available_point = $available_point;
            }

            $earn_points[] = $earn_point;
            $available_points[] = $available_point;
        }

        $result['earn_points'] = (int)array_sum($earn_points);
        $result['used_point'] = 0-(int)$quote->getRewardpoint();

        $result['available_points'] = (int)array_sum($available_points);

        return $result;
    }

    public function _getFeatureUPSProduct($productId, $type, $storeId, $baseUrl) {
        $sql = "select path from sk_product_feature_images where product_id =? and type =? and store_id =?";
        $parms = [$productId, $type, $storeId];
        $results = $this->query($sql, $parms);
        $ret = [];
        foreach ($results as $row) {
            $path = $row['path'];
            if (strlen($path) > 0) {
                $ret[] = $baseUrl . substr($path, 1);
            }
        }

        if (count($ret) == 0) {
            if ($storeId == 0) {

                return $ret;
            } else {
                return $this->_getFeatureUPSProduct($productId, $type, 0, $baseUrl);
            }
        } else {

            return $ret;
        }


    }

    public function getOldFeatureImages($productId, $type, $storeId, $baseUrl) {
        $row_id = $this->getRowId($productId);
        $baseUrl = str_replace("/pub/", "", $baseUrl);
        $baseUrl = str_replace("/media/catalog/product/", "", $baseUrl);
        $baseUrl = str_replace("media/catalog/product/", "", $baseUrl);
        $baseUrl = str_replace("/pub/media/catalog/product/", "", $baseUrl);
        $sql = "SELECT value FROM catalog_product_entity_text where attribute_id =? and row_id =? and store_id in(0,$storeId) order by store_id desc;";
        $description_image_m_first = $this->getAttributeIdByCode('description_image_m_first');
        $parms = [$description_image_m_first,$row_id];


        $results = $this->query($sql, $parms);

        $baseContent = "";
        foreach ($results as $row) {
            $baseContent = $row['value'];
        }


        $strRep = '/img-l=\"\/pub[\?\w=&_\-\.\/]+\"/';
        if ($type == "mobile") {
            $strRep = '/img-s=\"\/pub[\?\w=&_\-\.\/]+\"/';
        }

        $isMatched = preg_match_all($strRep, $baseContent, $matches);

        $singleList = [];
        foreach ($matches as $matchItems) {
            foreach ($matchItems as $_item) {

                $item = substr($_item, 7, strlen($_item) - 8);
                //$item =substr($item,strlen($item)-1);
                if ( !in_array($item, $singleList)) {
                    $singleList[] = $baseUrl . $item;
                }
            }
        }

        return $singleList;
    }

    public function getItemInfo($quote_id, $productId, $simpleId) {
        $sql = "select item_id,qty from  quote_item where product_id =? and quote_id =? and parent_item_id is null ";
        $parms = [$productId, $quote_id];
        $results = $this->query($sql, $parms);
        $ret = [];
        foreach ($results as $row) {
            $ret['item_id'] = $row['item_id'];
            $ret['qty'] = $row['qty'];
            if ($productId == $simpleId) {

                return $ret;
            }
            if ($this->checkIsTheSimple($ret['item_id'], $simpleId)) {

                return $ret;
            }
        }

        return [];

    }

    public function checkIsTheSimple($item_id, $simpleId) {
        $sql = "select product_id,qty from  quote_item where parent_item_id =?";
        $parms = [$item_id];
        $results = $this->query($sql, $parms);
        $productId = 0;
        foreach ($results as $row) {
            $productId = $row['product_id'];
        }
        if ($productId == 0) {
            return false;
        }
        if ($productId == $simpleId) {
            return true;
        }

        return false;
    }

    public function getAttributeFrontend($id, $store_id) {
        $sql = "SELECT frontend_label FROM eav_attribute WHERE  attribute_id =?";
        $parms = [$id];
        $results = $this->query($sql, $parms);
        $ret = '';
        foreach ($results as $row) {
            $ret = $row['frontend_label'];
        }

        $storeValue = $this->getFrontLabelByStoreId($id, $store_id);
        if (strlen($storeValue) > 0) {
            $ret = $storeValue;
        }

        return $ret;

    }

    public function getFrontLabelByStoreId($id, $store_id) {
        $sql = "select value from eav_attribute_label  WHERE  attribute_id =? and store_id in(0,$store_id) order by store_id desc limit 0,1";
        $parms = [$id];
        $results = $this->query($sql, $parms);
        $ret = '';
        foreach ($results as $row) {
            $ret = $row['value'];
        }


        return $ret;

    }

    public function getAttributeFrontendValue($id, $store_id) {
        $sql = "select value from eav_attribute_option_value  WHERE  option_id =? and store_id in(0,$store_id) order by store_id desc limit 0,1";
        $parms = [$id];
        $results = $this->query($sql, $parms);
        $ret = '';
        foreach ($results as $row) {
            $ret = $row['value'];
        }


        return $ret;

    }

    public function getSimpleIdByItemId($item_id) {
        $sql = "select product_id from  quote_item where parent_item_id =?";
        $parms = [$item_id];
        $results = $this->query($sql, $parms);
        $productId = 0;
        foreach ($results as $row) {
            $productId = $row['product_id'];
        }


        return $productId;
    }

    public function getCrollSell($quote_id) {
        $sql = "select distinct product_id from  quote_item where quote_id =? and parent_item_id is null ";
        $parms = [$quote_id];
        $retIds = [];
        $parentIds = [];
        $results = $this->query($sql, $parms);
        foreach ($results as $row) {
            $parentIds[] = $this->getRowId($row['product_id']);
        }

        if (count($parentIds) > 0) {
            $sql = "select distinct product_id from  quote_item where quote_id =? ";
            $parms = [$quote_id];
            $existsIds = [];
            $results = $this->query($sql, $parms);
            foreach ($results as $row) {
                $existsIds[] = $row['product_id'];
            }

            $sql = "select linked_product_id from catalog_product_link where product_id in(" . implode(',', $parentIds) . ") and link_type_id =5";
            $parms = [];

            $results = $this->query($sql, $parms);
            foreach ($results as $row) {

                if ( !in_array($row['linked_product_id'], $existsIds))
                    $retIds[] = $row['linked_product_id'];
            }

        }

        return $retIds;

    }

    public function getRelateProducts($product_id) {

        $row_id = $this->getRowId($product_id);
        $sql = "select linked_product_id from catalog_product_link where product_id =? and link_type_id =4";
        $parms = [$row_id];
        $retIds = [];
        $results = $this->query($sql, $parms);
        foreach ($results as $row) {

            $retIds[] = $row['linked_product_id'];
        }

        return $retIds;

    }

    public function getShippingTime() {
        $sql = "SELECT id,start,end FROM sk_shipping_time WHERE STATUS =1 ORDER BY POSITION ASC ";
        $parms = [];
        $results = $this->query($sql, $parms);

        return $results;
    }

    public function getShippingDate() {
        $sql = "SELECT id,start_date,end_date,allow FROM sk_shipping_date WHERE STATUS =1 ORDER BY ID ASC ";
        $parms = [];
        $results = $this->query($sql, $parms);

        return $results;
    }

    public function getShippingTimeById($id) {
        $sql = "SELECT id,start,end FROM sk_shipping_time WHERE STATUS =1 and id =? ORDER BY POSITION ASC ";
        $parms = [$id];
        $results = $this->query($sql, $parms);


        return $results;
    }

    private $singure_key = "HSIJD:JSADIKXC*KKJXYXCOO*JXXIIIYA#LNCSBAASD;";

    public function encrypt($txt) {
        $id = serialize($txt);
        $key = $this->singure_key;
        /*fdakinel;injajdji*/
        $data['iv'] = base64_encode(substr('ASJDJASMKCIVADSAKDDSFKDSNCASNVHU', 0, 16));
        $data['value'] = openssl_encrypt($txt, 'AES-256-CBC', $key, 0, base64_decode($data['iv']));
        $code = openssl_decrypt($data['value'], 'AES-256-CBC', $key, 0, base64_decode($data['iv']));


        $encrypt = base64_encode(json_encode($data));

        return $encrypt;
    }

    public function decrypt($encrypt) {
        $key = $this->singure_key;
        $encrypt = json_decode(base64_decode($encrypt), true);
        $iv = base64_decode($encrypt['iv']);

        $id = openssl_decrypt($encrypt['value'], 'AES-256-CBC', $key, 0, $iv);


        if ($id) {
            return $id;
        } else {
            return false;
        }
    }

    public function getAttachinfo($id,$websiteId,$storeId){
        $relates =$this->getAttributeInfo("relate_sku");

        $attId =0;
        if(array_key_exists('attid',$relates))
        {
            $attId =$relates['attid'];
        }
        $sku =$this->getProductSkuById($id);

        $rowId =$this->getBundleProductRowId($sku,$attId);
        if($rowId==0)
            return [];
        $entityId =0;
        if($rowId>0)
        {
            $entityId =$this->getEntityIdByRowId($rowId);
        }
        if($entityId==0)
            return [];

        $options =$this->getBuldleOption($rowId);
        if(count($options)==0)
            return [];
        $ret =[];
        foreach ($options as $_option)
        {
            $option_id =$_option['option_id'];

            $items =$this->getBundleOptionSelection($rowId,$option_id,$storeId,$websiteId);
            if(count($items)>0)
            {
                $_option['options'] =$items;
                $ret[]=$_option;
            }else{
                return [];
            }

        }
        $data =[];
        $data['product'] =$entityId;
        $data['option'] =$ret;

        return $data;
    }
    public function getBundleOptionSelection($row_id,$option_id,$storeId,$websiteId){
        $sql ="SELECT selection_id,product_id,selection_price_value FROM catalog_product_bundle_selection where parent_product_id =? and option_id =? order by position asc;";
        $parms = [$row_id,$option_id];
        $results = $this->query($sql, $parms);
        $ret =[];
        $convert = $this->getObject("Magento\Checkout\Helper\Data");
        foreach ($results as $row)
        {
            $price =$row['selection_price_value'];
            $productId =$row['product_id'];
            $name =$this->getProductsValue($productId,$storeId,"name");
            $_oldprice =$this->getProductsValue($productId,$storeId,"price");
            $status =$this->getProductsValue($productId,$storeId,"status");
            $_destatus =$this->getProductsValue($productId,0,"status");
            $image =$this->getProductsValue($productId,$storeId,"image");
            $qty =$this->getQty($productId);
            if($qty<=0)
                continue;
            $subItem =[];
            $subItem['selection_id'] =$row['selection_id'];
            $subItem['product_id'] =$productId;
            $subItem['price'] =$price;
            $subItem['price_label'] =$convert->convertPrice($price);
            $subItem['name'] =$name;
            $subItem['status'] =$status;
            $subItem['image'] =$this->resizeProductImage($image,'300x300');
            $subItem['oldprice'] =$_oldprice;
            $subItem['oldprice_label'] =$convert->convertPrice($_oldprice);
            $ret[]=$subItem;

        }
        return $ret;
    }
    public function getBuldleOption($row_id){
        $sql ="SELECT bo.option_id,bo.required,bov.title FROM catalog_product_bundle_option bo
left join catalog_product_bundle_option_value bov 
on bo.option_id =bov.option_id and bo.parent_id =bov.parent_product_id
where bo.parent_id =? order by bo.position asc";
        $parms = [$row_id];
        $results = $this->query($sql, $parms);
        $ret =[];
        foreach ($results as $row)
        {
            $subItem =[];
            $subItem['option_id'] =$row['option_id'];
            $subItem['title'] =$row['title'];
            $subItem['required'] =$row['required']=="1";

            if(strtolower(trim($row['title']))=="base")
            {
                $subItem['show']=false;
            }else{
                $subItem['show']=true;
            }

            $ret[] =$subItem;
        }


        return $ret;
    }

    public function getQty($product_id){
        $sqloneqty = "SELECT stock_status,qty FROM cataloginventory_stock_status 
where product_id =? and website_id =0;";
        $params = [$product_id];
        $results = $this->query($sqloneqty, $params);
        $baseQty =0;
        foreach ($results as $row)
        {
            $status =$row['stock_status']=="1";
            $qty =$row['qty'];
            if($status)
            {
                $baseQty =$qty;
            }
        }

        return $baseQty;
    }
    public function getBundleProductRowId($sku,$attributeId){
        $sql ="SELECT e.row_id FROM catalog_product_entity_varchar e
 LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=? where e.value =? and e.attribute_id =? and es.value =1;";
        $status_code_id = $this->getAttributeIdByCode('status');
        $parms = [$status_code_id,$sku,$attributeId];
        $results = $this->query($sql, $parms);
        $retId  =0;
        foreach ($results as $row)
        {
            $retId =$row['row_id'];
        }

        return $retId;
    }

    public function getBundleLabel($id,$option_id,$storeId){
        $sql ="SELECT title FROM catalog_product_bundle_option_value
where parent_product_id =? and option_id =? and store_id in(0,?)
order by store_id desc limit 0,1";
        $rowId =$this->getRowId($id);
        $parms = [$rowId,$option_id,$storeId];
        $results = $this->query($sql, $parms);
        $title ="";
        foreach ($results as $row)
        {
            $title =$row['title'];
        }
        return $title;
    }
    public function getBundleSelectionValue($id,$select_option_id,$storeId){
        $sql ="SELECT product_id  FROM catalog_product_bundle_selection
where parent_product_id =? and selection_id =? ";
        $rowId =$this->getRowId($id);
        $parms = [$rowId,$select_option_id];
        $results = $this->query($sql, $parms);
        $product_id ="";
        foreach ($results as $row)
        {
            $product_id =$row['product_id'];
        }
        $name ="";
        if($product_id>0)
        {
            $name =$this->getProductsValue($product_id,$storeId,"name");
        }
        return $name;
    }

   public function getHomeCarrier($store_id){
       $sql ="select option_id,value from eav_attribute_option_value where option_id in (select option_id from  eav_attribute_option where attribute_id = ?) and store_id = ? ";
       $carrier_filter_code_id = $this->getAttributeIdByCode('carrier_filter');
       $params = [$carrier_filter_code_id,$store_id];
       $results = $this->query($sql, $params);
       $carrier_option_value= [];
       if(isset($results) && $results){
           foreach ($results as $row)
           {
               $carrier_option_value[$row['option_id']] =$row['value'];
           }
       }

       return $carrier_option_value;
   }

    public function getFormatString($name){
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $product = $objectManager->create('Magento\Catalog\Model\Product');
        return $product->formatUrlKey($name);
    }

    public function checkEmailIsExist($email)
    {
        $sql = "SELECT email FROM customer_entity  WHERE email = '$email'";
        $parms = array($email);
        $data = $this->query($sql,$parms);

        if (empty($data)) {
            $result = false;
        } else {
            $result = true;
        }
        return $result;
    }

    public function inWishList($product_id)
    {
        $session = $this->getObject('Magento\Customer\Model\Session');
        if ($session->isLoggedIn()) {
            $customer_id = $session->getCustomer()->getId();
            $wishlist = $this->getObject("Magento\Wishlist\Model\Wishlist")->loadByCustomerId($customer_id);

            if ($wishlist->getItemsCount() == 0) {
                return false;
            } else {
                $itemCollection = $wishlist->getItemCollection();
                $wishlistProductIds = [];
                foreach ($itemCollection as $item) {
                    $wishlistProductIds[] = $item->getProductId();
                }
                return in_array($product_id, $wishlistProductIds) ? true : false;
            }
        } else {
            return false;
        }
    }

    public function saveRegisterProduct($insertData){
        $this->getConnection()->insertOnDuplicate('zte_product_register', $insertData);
        return true;
    }
}