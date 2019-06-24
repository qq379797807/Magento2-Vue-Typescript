<?php
namespace App\Component\Helper;

use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\UrlInterface;
use Silk\Restful\ApiException;

// class Category extends \Silk\Restful\Helper\singleLoginCategory
// {
//     const THE_DAY_BEFORE_YESTERDAY = 'tdby';
//     const YESTERDAY = 'yesterday';
//     const TODAY = 'today';
//     const TOMORROW = 'tomorrow';
//     const THE_DAY_AFTER_TOMORROW = 'tdat';

//     protected $sql;

//     protected $filterSql;

//     protected $sqlLeft;

//     protected $sqlWhere = '';

//     protected $sqlSort = '';

//     protected $sqlPage = '';

//     protected $pageType;

//     protected $categoryId_nameMapping;

//     protected $data = [];

//     protected $filterOptions = [];

//     protected $attrCode_backendType = [];

//     protected $attrOption_lable = [];

//     protected $current_carrier = '';


//     public function getLeftFilterInfo($productCollection)
//     {

//         $product_ids = [];
//         $filter_groups = [];
//         foreach ($productCollection as $product) {
//             $product_ids[] = $product->getId();
//         }
//         $productIdsParams = '\'' . implode('\',\'', $product_ids) . '\'';
//         $this->filterOptions = $this->getProductListFilters();
//         $filter_left = array_diff(array_keys($this->attrCode_backendType), array_keys($this->data['filters']));

//         $helper = $this->getObject('Silk\Restful\Helper\Data');
//         $cName_code_id = $helper->getAttributeIdByCode('name',3);
//         $cActive_code_id = $helper->getAttributeIdByCode('is_active',3);

//         foreach ($this->attrCode_backendType as $code => $info) {
//             if (!in_array($code, $filter_left)) {
//                 continue;
//             }
//             if ($code != 'price') {
//                 $id = $info['id'];
//                 $type = $info['type'];
//                 $code_default = $code . '_default';

//                 $current_sql_code = "SELECT $code.value value_final, $code_default.value value_default FROM  catalog_product_entity e INNER JOIN catalog_product_entity_$type AS $code_default ON ($code_default.`row_id` = `e`.`row_id`) AND ($code_default.`attribute_id` = $id) AND $code_default.`store_id` = 0 LEFT JOIN catalog_product_entity_$type AS $code ON ($code.`row_id` = `e`.`row_id`) AND ($code.`attribute_id` = $id) AND ($code.`store_id` = 1) WHERE ((IF($code.value_id > 0, $code.value, $code_default.value) > 0)) and e.row_id in ($productIdsParams)";
//                 $filter_results = $this->query($current_sql_code);
//                 $filter_group = [];
//                 $option_group = [];
//                 $filter_options = [];
//                 if (isset($filter_results) && $filter_results) {
//                     foreach ($filter_results as $filter) {
//                         $option_str = $filter['value_final'] ? $filter['value_final'] : $filter['value_default'];
//                         $option_arr = explode(',', $option_str);
//                         foreach ($option_arr as $option_id) {
//                             $option_group[$option_id][] = 1;
//                         }
//                     }

//                 }
//                 foreach ($option_group as $opt_id => $count) {
//                  if($opt_id && isset($this->attrOption_lable[$opt_id])){
//                          $filter_options[$opt_id]['label'] = $this->attrOption_lable[$opt_id];
//                          $filter_options[$opt_id]['count'] = count($count);
//                      }

//                 }
//                 if(count($filter_options) >1){
//                     $filter_group['id'] = $id;
//                     $filter_group['attribute_id'] = $code;
//                     $filter_group['label'] = $this->attrCode_backendType[$code]['label'];
//                     $filter_group['option'] = $filter_options;
//                     $filter_groups[] = $filter_group;
//                 }

//             } else {
//                 $leftOptions = [];
//                 $leftPriceOptions = [];
//                 $filterOptions = $this->getCatgoryPriceFilterOptions($productIdsParams);

//                 foreach ($filterOptions as $option) {
//                     if (isset($option['option_id']) && $option['option_id']) {

//                         $leftCollection = clone $productCollection;
//                         $price = $option['option_id'];
//                         $collection = $this->filterByPrices($leftCollection, $price);

//                         $count = $collection->getSize();
//                         if ($count) {
//                             $leftOptions[$option['option_id']]['count'] = $count;
//                             $leftOptions[$option['option_id']]['price_label'] = $option['price_label'];
//                         }
//                         if (count($leftOptions) > 1) {
//                             $leftPriceOptions['id'] = $this->attrCode_backendType['price']['id'];
//                             $leftPriceOptions['attribute_code'] = $code;
//                             $leftPriceOptions['label'] = $this->attrCode_backendType['price']['label'];
//                             $leftPriceOptions['option'] = $leftOptions;
//                         }


//                     }

//                 }
//                 if($leftPriceOptions)
//                     $filter_groups[] = $leftPriceOptions;
//             }

//         }


//         if($this->data['categoryId'] == 157){
//             $cate_filter = [];

//             $sql = "select cp.category_id,v.value,count(*) count from catalog_category_product_index cp inner join catalog_category_entity e on cp.category_id = e.entity_id left join catalog_category_entity_varchar v on cp.category_id = v.row_id left join catalog_category_entity_int i on cp.category_id = i.row_id  where v.attribute_id = ? and i.attribute_id = ? and i.value = 1 and e.level = 3 AND cp.product_id in ($productIdsParams) and cp.store_id=1 AND cp.is_parent=1 group by cp.category_id";
//             $params=array($cName_code_id,$cActive_code_id);
//             $fetchResults =$this->query($sql,$params);
//             if(isset($fetchResults) && $fetchResults){
//                 foreach($fetchResults as $result){
//                     $cate_filter['label'] = 'category';
//                     $cate_filter['attribute_code'] = 'cat';
//                     $cate_filter['option'][$result['category_id']]['label'] = $result['value'];
//                     $cate_filter['option'][$result['category_id']]['count'] = $result['count'];
//                 }

//             }
//             $filter_groups[] = $cate_filter;
//         }
//         return $filter_groups;

//     }

//     /**
//      * prepare product list sort sql
//      */
//     protected function prepareProductListSortSql()
//     {
//         switch ($this->data['sortField']) {
//             case 'price':
//                 if (!$this->data['isPriceCode']) {
//                     $this->sqlLeft .= " LEFT JOIN catalog_product_index_price epi ON e.entity_id =epi.entity_id AND epi.customer_group_id = {$this->data['groupId']}";
//                 }

//                 $this->sqlSort = " ORDER BY epi.final_price " . $this->data['sortDir'];
//                 break;
//             case 'name':
//                 $code = "name";
//                 $this->sqlLeft .= " LEFT JOIN catalog_product_entity_int $code ON e.row_id =$code.row_id AND $code.attribute_id=(SELECT attribute_id FROM eav_attribute WHERE entity_type_id =4 and attribute_code LIKE '$code')";
//                 $this->sqlSort = " ORDER BY $code.value " . $this->data['sortDir'];
//                 break;
//             case 'position':
//                 $this->sqlSort = " ORDER BY cp.position " . $this->data['sortDir'];
//                 break;
//             case 'bestseller':
//                 $this->sqlLeft .= " LEFT JOIN (SELECT SUM(qty_ordered) AS sellerqty,product_id FROM sales_order_item GROUP BY product_id) td ON td.product_id=cp.product_id";
//                 $this->sqlSort = " ORDER BY td.sellerqty desc";
//                 break;
//             default:
//                 if ($this->data['keywords'] != '') {
//                     $this->sqlSort = " ORDER BY trev.relevance desc";
//                 }
//         }
//     }

//     /**
//      * prepare product list search sql
//      */
//     protected function prepareProductListSearchSql()
//     {
//         $word = '';
//         if ($this->data['keywords'] != '') {
//             $keyArr = explode(' ', $this->data['keywords']);

//             foreach ($keyArr as $value) {
//                 if ($value != "") {

//                     $word .= " " . $value . "*";
//                 }
//             }

//             $word = trim($word);

//             $this->sqlLeft .= " inner join (SELECT `main_select`.`entity_id`, MAX(score) AS `relevance` FROM (SELECT `search_index`.`entity_id`, ((0) + LEAST((MATCH (data_index) AGAINST (? IN BOOLEAN MODE)), 1000000) * POW(2, search_weight)) AS `score` FROM `catalogsearch_fulltext_scope" . $this->data['storeId'] . "` AS `search_index` LEFT JOIN `catalog_eav_attribute` AS `cea` ON search_index.attribute_id = cea.attribute_id LEFT JOIN `cataloginventory_stock_status` AS `stock_index` ON search_index.entity_id = stock_index.product_id AND stock_index.website_id = 0 WHERE (stock_index.stock_status = 1) AND (MATCH (data_index) AGAINST (? IN BOOLEAN MODE))) AS `main_select` GROUP BY `entity_id` ORDER BY `relevance` DESC ) trev ON trev.entity_id =cp.product_id ";

//             $this->data['params'] = [$word, $word];
//         }
//     }

//     /**
//      * prepare product list page sql
//      */
//     protected function prepareProductListPageSql()
//     {
//         $start = ($this->data['page'] - 1) * $this->data['pageSize'];
//         $this->sqlPage = " limit {$start},{$this->data['pageSize']};";
//     }

//     /**
//      * @return array
//      */
//     public function getProductListFilters()
//     {
//         $results = $this->getCatgoryFilterOptions();

//         return $results;
//     }

//     public  function getTarget($path,$storeId){
//         $sql ="SELECT entity_type,entity_id FROM url_rewrite where request_path like ? and store_id =?";
//         $params = [$path, $storeId];

//         $results = $this->query($sql, $params);
//         $ret =[];
//         foreach ($results as $row)
//         {
//             $ret['type'] =$row['entity_type'];
//             $ret['id'] =$row['entity_id'];
//         }
//         return $ret;
//     }


//     /**
//      * @param $key
//      * @return mixed|null
//      */
//     public function getData($key)
//     {
//         if (isset($this->data[$key])) {
//             return $this->data[$key];
//         }

//         return null;
//     }

//     /**
//      * @param $key
//      * @param $value
//      */
//     public function setData($key, $value)
//     {
//         $this->data[$key] = $value;
//     }


//     /**
//      * @param array $attributeCodes
//      * @return array
//      */
//     protected function getCatgoryPriceFilterOptions($productIdsParams){

//         $productIds = $productIdsParams;
//         $sql = "SELECT MAX(min_price) max_price, MIN(min_price) min_price FROM catalog_product_index_price cpip 
//                         WHERE cpip.entity_id IN ($productIds) AND cpip.website_id=1";

//         $fetchResults = $this->query($sql);
//         $maxPrice = 0;
//         $minPrice = 0;
//         foreach ($fetchResults as $price) {
//             $maxPrice = $price['max_price'];
//         }
//         $cal_step = 1000;
//         if(($maxPrice-$minPrice)/$cal_step > 1){
//             $step = $cal_step;
//         }else{
//             $cal_step = ($cal_step/10);
//             if(($maxPrice-$minPrice)/$cal_step > 1){
//                 $step = $cal_step;
//             }else{
//                 $step = $cal_step/10;
//             }
//         }

//         $priceFilterCount = ($maxPrice-$minPrice)/$step > 5 ? 5 : ceil(($maxPrice-$minPrice)/$step);

//         /** @var \Magento\Framework\Pricing\PriceCurrencyInterface $priceConvert */
//         $priceConvert = $this->objManager->create('Magento\Framework\Pricing\PriceCurrencyInterface');
//         $options = [];
//         for ($i=0; $i<$priceFilterCount; $i++) {
//             $cminPrice = floor($minPrice+$step*$i);
//             $cmaxPrice = floor($minPrice+$step*($i+1)) - 0.01;
//             $foptionId = $cminPrice.'-'.$cmaxPrice;
//             $priceLabel = $priceConvert->convertAndFormat($cminPrice).'-'.$priceConvert->convertAndFormat($cmaxPrice);


//             if($i == $priceFilterCount - 1){
//                 $foptionId = $cminPrice.'-';
//                 $priceLabel = $priceConvert->convertAndFormat($cminPrice).'+';
//             }

//             $options[] = [
//                 'option_id' => $foptionId,
//                 'price_label' => $priceLabel
//             ];
//         }
//         return $options;
//     }
//     protected function getCatgoryFilterOptions(){
//         $attributes = [];

//         $sql = "select attribute_id,attribute_code,frontend_label,backend_type from eav_attribute where attribute_id in (select attribute_id from catalog_eav_attribute where is_filterable = 1)";

//         $results = $this->query($sql);

//         foreach ($results as $result) {
//             $label = $result['frontend_label'];
//             if($result['attribute_code'] != 'price') {
//                 $sql = "SELECT eao.option_id,eaov.value FROM eav_attribute_option eao 
//                 LEFT JOIN eav_attribute_option_value eaov ON eao.option_id=eaov.option_id
//                 WHERE attribute_id = ?
//                 AND eaov.store_id IN (0,?)
//                 GROUP BY eao.option_id";

//                 $params = [$result['attribute_id'], $this->getCurrentStore()->getId()];
//                 $fetchResults = $this->query($sql, $params);

//                 $options = [];
//                 foreach ($fetchResults as $option) {
//                     $isActive = 0;
//                     $options[] = [
//                         'option_id' => $option['option_id'],
//                         'label' => $option['value'],
//                         'is_active' => $isActive
//                     ];
//                     $this->attrOption_lable[$option['option_id']] = $option['value'];
//                 }


//                 $attributes[] = [
//                     'attribute_id' => $result['attribute_id'],
//                     'attribute_code' => $result['attribute_code'],
//                     'label' => $label,
//                     'options' => $options
//                 ];
//             }

//         }
//         return $attributes;
//     }


//     /**
//      * @return array
//      */
//     public function getSortOptions()
//     {
//         $sorts = [
//             [
//                 'code' => 'position_asc',
//                 'label' => __('Position Asc')
//             ],
//             [
//                 'code' => 'position_desc',
//                 'label' => __('Position Desc')
//             ],
//             [
//                 'code' => 'price_desc',
//                 'label' => __('Price High To Low')
//             ],
//             [
//                 'code' => 'price_asc',
//                 'label' => __('Price Low To High')
//             ],
//             [
//                 'code' => 'name_desc',
//                 'label' => __('Name Desc')
//             ],
//             [
//                 'code' => 'name_asc',
//                 'label' => __('Name Asc')
//             ],
//             [
//                 'code' => 'bestseller_desc',
//                 'label' => __('Best Seller')
//             ],
//         ];

//         foreach ($sorts as &$sort) {
//             if ($this->data['sortField'].'_'.$this->data['sortDir'] == $sort['code']) {
//                 $sort['is_active'] = 1;
//             } else {
//                 $sort['is_active'] = 0;
//             }
//         }

//         return $sorts;
//     }

//     public function getCategoryRowId($category_id)
//     {
//         $sql = "SELECT row_id FROM catalog_category_entity WHERE entity_id=?";
//         $params = [$category_id];
//         $result = $this->query($sql, $params);

//         $rowId = '';
//         foreach ($result as $value) {
//             $rowId = $value['row_id'];
//         }

//         return $rowId;
//     }

//     public function getCategorieId_NameMapping()
//     {
//         $objectManger = \Magento\Framework\App\ObjectManager::getInstance();
//         $categoryHelper = $objectManger->create('Magento\Catalog\Helper\Category');
//         $categories = $categoryHelper ->getStoreCategories($sorted = false, $asCollection = false, $toLoad = true);
//         $arr = array();
//         $sub = array();
//         foreach ($categories as $category) {
//             $loadCategory = $objectManger->create('Magento\Catalog\Model\Category')->load($category->getId());
//             $subCategories = $loadCategory->getChildrenCategories();
//             foreach ($subCategories as $subCategory) {
//                 if(!$subCategory->getIsActive()){continue;}


//                 $sub[$subCategory->getId()] = $subCategory->getName();

//             }
//         }
//         $this->categoryId_nameMapping = $sub;
//         return $arr;
//     }

//     /**
//      * @param bool $isMobile
//      * @return array
//      */
//     public function getCategoryInfo($isMobile = false)
//     {
//         $attributeCodes = "'name',";
//         if ($isMobile) {
//             $attributeCodes .= "'header_image_mobile','header_image_url_mobile','footer_image_mobile','footer_image_url_mobile'";
//         } else {
//             $attributeCodes .= "'header_image','header_image_url','footer_image','footer_image_url'";
//         }

//         $sql = "SELECT ccev.value,ea.attribute_code,ccev.store_id FROM eav_attribute ea
//                 LEFT JOIN catalog_category_entity_varchar ccev ON ccev.attribute_id=ea.attribute_id
//                 WHERE row_id=? AND ea.attribute_code IN ($attributeCodes) AND ccev.store_id IN(0,?)
//                 UNION SELECT ccet.value,ea.attribute_code,ccet.store_id FROM eav_attribute ea
//                 LEFT JOIN catalog_category_entity_text ccet ON ccet.attribute_id=ea.attribute_id
//                 WHERE row_id=? AND ea.attribute_code IN ($attributeCodes) AND ccet.store_id IN(0,?)
//                 ORDER BY store_id ASC ";

//         $row_id = $this->getCategoryRowId($this->data['categoryId']);
//         $params = [$row_id, $this->data['storeId'], $row_id, $this->data['storeId']];
//         $results = $this->query($sql, $params);

//         $info = [
//             'name' => '',
//             'header_image' => '',
//             'header_image_url' => '',
//             'footer_image' => '',
//             'footer_image_url' => '',
//         ];
//         foreach ($results as $row) {
//             switch ($row['attribute_code']) {
//                 case 'name':
//                     $info['name'] = $row['value'];
//                     break;
//                 case 'header_image':
//                 case 'header_image_mobile':
//                     $info['header_image'] = $this->getMediaUrl($row['value']);
//                     break;
//                 case 'header_image_url':
//                 case 'header_image_url_mobile':
//                     $info['header_image_url'] = $this->getImageUrl($row['value']);
//                     break;
//                 case 'footer_image':
//                 case 'footer_image_mobile':
//                     $info['footer_image'] = $this->getMediaUrl($row['value']);
//                     break;
//                 case 'footer_image_url':
//                 case 'footer_image_url_mobile':
//                     $info['footer_image_url'] = $this->getImageUrl($row['value']);
//                     break;
//             }
//         }

//         return $info;
//     }

//     /**
//      * @param $imagePath
//      * @return string
//      */
//     protected function getMediaUrl($imagePath)
//     {
//         $mediaUrl = $this->_urlBuilder->getBaseUrl(['_type' => UrlInterface::URL_TYPE_MEDIA]);
//         $imagePath = trim($imagePath, '/');

//         return $mediaUrl.'catalog/category/'.$imagePath;
//     }

//     public function getTrendingSearchKws($storeId) {
//         // return ['aaa','bb','cc'];

//         $sql = "SELECT query_text FROM search_query where store_id =? and display_in_terms = 0 ORDER BY updated_at DESC LIMIT 12";

//         $parms = [$storeId];

//         $results = $this->query($sql, $parms);
//         $kws = [];
//         foreach($results as $line){
//             $kws[] = $line['query_text'];
//         }

//         // return ['aa','bb'];
//         return $kws;
//     }

//     /**
//      * @param $imagePath
//      * @return string
//      */
//     protected function getImageUrl($imagePath)
//     {
//         $imagePath = trim($imagePath, '/');

//         return $this->_urlBuilder->getBaseUrl().$imagePath;
//     }

//     public function getUnboxingReviewsCounts($storeId){
//         $sql ="SELECT COUNT(1) AS reviews FROM review re LEFT JOIN review_store res ON re.review_id =res.review_id WHERE  status_id =1 and is_show_home = 1 AND res.store_id =?";


//         $parms = [$storeId];
//         $results =$this->query($sql,$parms);
//         $ret =0;
//         foreach ($results as $row) {
//             $ret =$row['reviews'];
//         }
//         return $ret;
//     }

//     public function getReviewImagesHtml($reviewId) {

//         $sql = "SELECT path FROM sk_review_images WHERE review_id =?";
//         $params = [$reviewId];
//         $results = $this->query($sql, $params);
//         $html = '';
//         foreach ($results as $line) {
//             $url = $this->getReviewImageUrl($line['path']);
//             $html .= '<a href="'.$url.'" onclick="imagePreview(\'page_ads_image_image\');return false;" ><img height="22" width="22" class="small-image-preview v-middle" src="'.$url.'" /></a>';
//         }
//         return $html;
//     }



//     public function getUnboxingReviews($currentpage, $pagesize, $storeId =0) {
//         $start = ($currentpage - 1) * $pagesize;

//         $sql = "SELECT re.review_id,re.entity_pk_value,re.priority,re.created_at,red.title,red.detail,red.nickname,red.customer_id, IFNULL(rev.percent,100) AS percent,
//                 (SELECT GROUP_CONCAT(ri.path SEPARATOR ',') FROM sk_review_images ri WHERE ri.review_id=re.review_id) images FROM review re 
//                 LEFT JOIN review_detail red ON re.review_id =red.detail_id 
//                 LEFT JOIN review_store res ON re.review_id = res.review_id
//                 LEFT JOIN rating_option_vote rev ON re.review_id =rev.review_id AND rev.rating_id=1
//                 WHERE  re.status_id =1  and re.is_show_home = 1 AND res.store_id =?
//                 GROUP BY re.review_id
//                 ORDER BY re.priority desc,re.created_at DESC 
//                 LIMIT $start,$pagesize";

//         $parms = [$storeId];

//         $results = $this->query($sql, $parms);

//         foreach ($results as &$result) {
//             if ($result['images']) {
//                 $images = explode(',', $result['images']);

//                 $resultImages = [];
//                 foreach ($images as $image) {
//                     if ($image) {
//                         $resultImages[] = $this->getReviewImageUrl($image);
//                     }
//                 }
//                 $result['images'] = $resultImages;
//             } else {
//                 $result['images'] = [];
//             }
//         }

//         return $results;
//     }

//     public function getReviews($id, $currentpage, $pagesize ,$storeId = 0)
//     {
//         $start = ($currentpage - 1) * $pagesize;

//         $sql = "SELECT re.review_id,re.created_at,red.title,red.detail,red.nickname,red.customer_id, rev.percent
//                 FROM review re 
//                 LEFT JOIN review_detail red ON re.review_id =red.review_id 
//                 LEFT JOIN review_store res ON re.review_id = res.review_id
//                 LEFT JOIN rating_option_vote rev ON re.review_id =rev.review_id AND rev.rating_id in (1,4)
//                 WHERE re.entity_pk_value =? AND re.status_id =1 AND res.store_id =?
//                 GROUP BY re.review_id
//                 ORDER BY re.created_at DESC 
//                 LIMIT $start,$pagesize";

//         $parms = array($id, $storeId);

//         $results = $this->query($sql, $parms);

//         foreach ($results as &$result) {
//             if (isset($result['images']) && $result['images']) {
//                 $images = explode(',', $result['images']);

//                 $resultImages = [];
//                 foreach ($images as $image) {
//                     if ($image) {
//                         $resultImages[] = $this->getReviewImageUrl($image);
//                     }
//                 }
//                 $result['images'] = $resultImages;
//             } else {
//                 $result['images'] = [];
//             }
//         }

//         return $results;
//     }

//     /**
//      * @param $imagePath
//      * @return string
//      */
//     protected function getReviewImageUrl($imagePath)
//     {
//         $mediaUrl = $this->_urlBuilder->getBaseUrl(['_type' => UrlInterface::URL_TYPE_MEDIA]);
//         $imagePath = trim($imagePath, '/');

//         return $mediaUrl.'catalog/product/reviews/'.$imagePath;
//     }


//     private function createTemporaryTable($word,$store_id)
//     {
//         $helper = $this->getObject('Silk\Restful\Helper\Data');
//         $visibility_code_id = $helper->getAttributeIdByCode('visibility');
//         $connection = $this->getConnection();
//         $tableName = 'search_tmp';
//         $connection->dropTemporaryTable($tableName);

//         $select = "create TEMPORARY table search_tmp SELECT main_select.entity_id, SUM(score) AS relevance FROM (SELECT DISTINCT eav_index.entity_id, (((0)) * 1 + LEAST((MATCH (data_index) AGAINST ('".$word."' IN BOOLEAN MODE)), 1000000) * POW(2, search_weight)) AS score FROM catalog_product_index_eav AS eav_index INNER JOIN catalogsearch_fulltext_scope".$store_id." AS search_index ON eav_index.entity_id = search_index.entity_id INNER JOIN catalog_eav_attribute AS cea ON search_index.attribute_id = cea.attribute_id INNER JOIN cataloginventory_stock_status AS stock_index ON stock_index.product_id = eav_index.entity_id AND stock_index.website_id = 0 AND stock_index.stock_id = 1 WHERE (eav_index.store_id = '1') AND (eav_index.attribute_id = ? AND eav_index.value in ('3', '4') AND eav_index.store_id = '1') AND (MATCH (data_index) AGAINST ('".$word."' IN BOOLEAN MODE))) AS main_select GROUP BY entity_id ORDER BY relevance DESC, entity_id DESC LIMIT 10000";
//         $params= array($visibility_code_id);
//         $connection->query($select,$params);
//         return $tableName;
//     }

//     private function createTemporaryStockTable()
//     {
//         $connection = $this->getConnection();
//         $tableName = 'configurable_simple_stock';
//         $connection->dropTemporaryTable($tableName);
//         $select = "create TEMPORARY table configurable_simple_stock select c.entity_id,c.type_id,c.pid,IF(sum(is_in_stock) > 1, 1, sum(is_in_stock)) stock_sum from (select e.entity_id,type_id,IFNULL(l.product_id,e.entity_id) as pid from catalog_product_entity e left join catalog_product_super_link l on e.entity_id = l.parent_id) as c left join cataloginventory_stock_item i on c.pid = i.product_id group by c.entity_id";
//         $connection->query($select);
//         return $tableName;
//     }

//     private function createPageTemporaryTable($final_page_sql,$storeId)
//     {
//         $connection = $this->getConnection();
//         $tableName = 'search_page_tmp';
//         $connection->dropTemporaryTable($tableName);

//         $select = "create TEMPORARY table search_page_tmp ".$final_page_sql;
//         $connection->query($select);
//         return $tableName;
//     }



//     public function getProductList($pageType, $post_data, $page = 1, $pageSize = 12, $version = 'pc', $sort , $keywords = '', $storeId = 0)
//     {
//         $this->pageType = $pageType;
//         if(isset($post_data['cat']) && $post_data['cat']){
//             $categoryId = $post_data['cat'];
//         }else{
//             $categoryId = $post_data['id'];
//         }

//         $store_id = $this->getCurrentStore()->getId();
//         $this->data['categoryId'] = $categoryId;
//         $this->data['keywords'] = $keywords;



//         $groupId = 0;
//         if($this->customerSession->isLoggedIn()) {
//             $groupId =$this->customerSession->getCustomer()->getGroupId();
//         }

//         $this->getAttributeType(); //get  code,backend_type,attribute_id mapping of filterable attributes
//         $filters = $this->getFilters($post_data);
//         $this->data['group_id'] = $groupId;
//         $this->data['filters'] = $filters;

//         $this->getCatgoryFilterOptions(); // get option_id,option_value mapping of filterable attributes


//         $category_ids = [$categoryId];
//         $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
//         $productCollection = $objectManager->create('Magento\Catalog\Model\ResourceModel\Product\Collection');
//         $productCollection->addAttributeToSelect('*');

//         $productCollection->addAttributeToFilter("status", 1);
//         $configurable_simple_stock =$this->createTemporaryStockTable();

//         $productCollection->getSelect()->joinleft(
//                 array('at_button_buy'=> 'catalog_product_entity_varchar'),
//                 "at_button_buy.row_id = e.row_id and at_button_buy.attribute_id = '244' and at_button_buy.store_id = 0",
//                 array('button_buy' => 'at_button_buy.value'));
//         $productCollection->getSelect()->joinleft(
//             array('c_simple'=>$configurable_simple_stock),
//             'e.entity_id = c_simple.entity_id',
//             array());

//         if($this->pageType == 'category_search'){
//             $productCollection->addAttributeToFilter("visibility", array('in'=>[3,4]));
//             $word = '';
//             if ($this->data['keywords'] != '') {
//                 $words_str = $this->data['keywords'];
//                 $words_str = preg_replace('/\(/', '' ,$words_str);
//                 $words_str = preg_replace('/\)/', '' ,$words_str);
//                 $keyArr = explode(' ', $words_str);

//                 foreach ($keyArr as $value) {
//                     if ($value != "") {

//                         $word .= " " . $value . "*";
//                     }
//                 }
//                 $word = trim($word);
//                 $tableName = $this->createTemporaryTable($word,$store_id);
//                 $productCollection->getSelect()->join(array('trev' => $tableName), 'trev.entity_id = e.entity_id',array(''));
//                 //save search results count to search_terms
//                 $searchCollection = clone $productCollection;
//                 $num_results = $searchCollection -> count();
//                 if($num_results > 0){
//                     $connection = $this->getConnection();
//                     $tableName = 'search_query';
//                     $select = "update $tableName set num_results = $num_results where query_text = '".trim($keywords)."' ";
//                     $connection->query($select);
//                 }

//             }
//             unset($post_data['id'],$post_data['q']);
//             $selectedFilters = $post_data;
//         }else{
//             $productCollection->addCategoriesFilter(array('in' => $category_ids));
//             $productCollection->getSelect()->joinleft(
//                 array('p_simple'=>'catalog_category_product'),
//                 'e.entity_id = p_simple.product_id and p_simple.category_id = "'.$categoryId.'"',
//                 array('p_simple.position'));

//             $productCollection->addAttributeToFilter("visibility", array('in'=>[2,4]));
//             $productCollection->getSelect()->where("at_button_buy.value != '' or c_simple.stock_sum > 0" );
//             unset($post_data['id']);
//             $selectedFilters = $post_data;
//         }
//         $i = 1;
//         foreach($filters as $code => $info){
//             if(count($info) == 1){
//                 $value = $info[0];
//                 $attribute_id = $this->attrCode_backendType[$code]['id'];
//                 if($code != 'price'){
//                     $alias = "catalog_product_index_eav_".$i;
//                     $joinConditions = "e.entity_id = ".$alias.".entity_id and ".$alias.".store_id = ". $store_id." and ".$alias.".attribute_id = ".$attribute_id." and ".$alias.".source_id = ".$alias.".entity_id";
//                     $productCollection->getSelect()->join(
//                         [$alias => "catalog_product_index_eav"],
//                         $joinConditions,
//                         []
//                     )->columns($alias.".value")
//                         ->where($alias.".value in (".$value.")");

//                     $i++;

//                 }else{
//                     $productCollection = $this->filterByPrices($productCollection,$value);
//                 }


//             }

//         }

//         $this->getCategorieId_NameMapping();
//         $selectedFilterArr =[];
//         $filterCollection = clone $productCollection;
//         $results_count = $filterCollection -> count();
//         $leftFilters =  $this->getLeftFilterInfo($filterCollection);

//         foreach($selectedFilters as $code => $value){
//             if($code == 'cat'){
//                 $selectedFilterArr[$code]['option_id'] = $value;
//                 $selectedFilterArr[$code]['option_label'] = $this->categoryId_nameMapping[$value];
//                 $selectedFilterArr[$code]['attribute_label'] = 'Category';
//             }elseif($code == 'price'){
//                 $selectedFilterArr[$code]['option_id'] = $value;
//                 $selectedFilterArr[$code]['attribute_label'] = 'Price';
//                 $priceArr = explode('-',$value);
//                 $selectedFilterArr[$code]['arr'] = $priceArr;

//             }else{
//                 $selectedFilterArr[$code]['value'] = $value;
//                 $selectedFilterArr[$code]['label'] = $this->attrOption_lable[$value];
//                 $selectedFilterArr[$code]['attribute_label'] = $this->attrCode_backendType[$code]['label'];
//                 if($this->attrCode_backendType[$code]['label'] == "Carrier"){
//                     $this->current_carrier = $this->attrOption_lable[$value];
//                 }
//             }


//         }
//         if(isset($sort['product_list_order']) && $sort['product_list_order']=="bestseller"){
//             $productCollection->getSelect()->joinLeft(
//                 'sales_order_item',
//                 'e.entity_id = sales_order_item.product_id',
//                 array('qty_ordered'=>'SUM(sales_order_item.qty_ordered)'))
//                 ->group('e.entity_id')
//                 ->order('qty_ordered '.$sort['product_list_dir']);
//         }elseif(isset($sort['product_list_order']) && $sort['product_list_order']=="new"){
//             $productCollection->getSelect()->order('created_at '.$sort['product_list_dir']);
//         }
//         else{
            
//             if($this->pageType == 'category_search'){
//                 $productCollection->getSelect()
//                     ->order('relevance desc');
//             }else{
//                 $productCollection->getSelect()
//                     ->order('stock_sum desc')->order('p_simple.position');
//             }
//         }
        
//         $productCollection
//             ->setPageSize($pageSize) // only get 12 products
//             ->setCurPage($page)  // first page (means limit 0,10)
//             ->load();
//         $products = $this->formatProducts($productCollection);

//         $canNextLoad = 1;

//         if($this->pageType != 'category_search' && count($filters) == 1 && isset(array_keys($filters)[0]) && array_keys($filters)[0]=='carrier_filter'){
//             $baseMediaurl = $this->getCurrentStore()->getBaseUrl('media').'carrier/';
//             $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
//             $product = $objectManager->create('Magento\Catalog\Model\Product');
//             $carrier_name = $product->formatUrlKey($this->attrOption_lable[$filters['carrier_filter'][0]]);
//             $carrier_image = $baseMediaurl.$carrier_name.'.png';
//             $selectedFilterArr['carrier_filter']['carrier_image'] = $carrier_image;
//         }

//         $results = [
//             'count' => $results_count,
//             'cannextload' => $canNextLoad,
//             'left_filters' => $leftFilters,
//             'filters' => $selectedFilterArr,
//             'items' => $products,
//             'info' => ''
//         ];

//         return $results;
//     }

//     public function getSearPageList($page,$page_size,$kws,$storeId){
//         if(!$kws){
//             return '';
//         }
//         $matchFeilds = array(
//             'title',
//             'meta_keywords',
//             'meta_description',
//             'content_heading',
//             'content'
//         );
//         $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
//         $pageCollection = $objectManager->get('\Magento\Cms\Model\ResourceModel\Page\CollectionFactory')->create();
//         $pageCollection
//             ->addFieldToFilter('is_active', 1)
//             ->addFieldToFilter('store_id', array('in' => [0,$storeId]));

//         $page_data = [];
//         $pages = [];

//         $sql_kws_all = '';
//         if ($kws != '') {
//             $kws = trim($kws);
//             $sql_page_start = "SELECT `s`.`page_id`, (CASE WHEN `s`.`title` LIKE '$kws'";
//             foreach([4,3] as $w){
//                 foreach($matchFeilds as $feild){
//                     if($w == 3){
//                         $sql_kws_all .= " THEN $w ELSE 0 END+CASE WHEN s.$feild LIKE '%$kws%' ";
//                     }else{
//                         $sql_kws_all .= " THEN $w ELSE 0 END+CASE WHEN s.$feild LIKE '$kws' ";
//                     }

//                 }
//             }
//             $kwsArr = explode(' ', $kws);

//             $sql_kws_part2 = '';
//             $sql_kws_part1 = '';
//             $sql_page_middle = '';
//             $i  = 0;
//             foreach ($kwsArr as $value) {
//                 if ($value != "") {
//                     $i++;
//                    $value = trim($value);
//                    foreach($matchFeilds as $key => $feild){
//                        if($i == 1){
//                            $sql_page_middle = " THEN 2 ELSE 0 END+CASE WHEN (LENGTH(s.title) - LOCATE('$value', s.title)) / LENGTH(s.title) ";
//                        }
//                        $sql_kws_part2 .= " THEN 2 ELSE 0 END+CASE WHEN s.$feild LIKE '%$value%' ";

//                        $nextFeild = isset($matchFeilds[$key + 1]) ? $matchFeilds[$key + 1] : '';

//                        $nextValue = isset($kwsArr[$i]) ? $kwsArr[$i] : '';

//                        if($key == count($matchFeilds) - 1 && $i != count($kwsArr)){

//                            $sql_kws_part1 .=" THEN 1*(LENGTH(s.$feild) - LOCATE('$value', s.$feild)) / LENGTH(s.$feild) ELSE 0 END+CASE WHEN (LENGTH(s.title) - LOCATE('$nextValue', s.title)) / LENGTH(s.title) ";
//                        }elseif($key == count($matchFeilds) - 1 && $i == count($kwsArr)){
//                            $sql_kws_part1 .=" THEN 1*(LENGTH(s.$feild) - LOCATE('$value', s.$feild)) / LENGTH(s.$feild) ELSE 0 END ) AS `relevance` FROM `cms_page` AS `s` ";
//                        }else {
//                            $sql_kws_part1 .= " THEN 1*(LENGTH(s.$feild) - LOCATE('$value', s.$feild)) / LENGTH(s.$feild) ELSE 0 END+CASE WHEN (LENGTH(s.$nextFeild) - LOCATE('$value', s.$nextFeild)) / LENGTH(s.$nextFeild) ";

//                        }
//                    }

//                 }
//             }
//             $sql_page_where = '';
//             foreach($kwsArr as $k => $kws){
//                 $kws = trim($kws);
//                 if($k == 0){
//                     $sql_page_where .= " where CONCAT(IFNULL(title,''),IFNULL(meta_description,''),IFNULL(content,''),IFNULL(meta_keywords,''),IFNULL(content_heading,'')) like '%$kws%' ";
//                 }else{
//                     $sql_page_where .= " AND  CONCAT(IFNULL(title,''),IFNULL(meta_description,''),IFNULL(content,''),IFNULL(meta_keywords,''),IFNULL(content_heading,'')) like '%$kws%' ";
//                 }

//             }
//             $final_page_sql = $sql_page_start . $sql_kws_all . $sql_kws_part2 . $sql_page_middle . $sql_kws_part1 . $sql_page_where . " ORDER BY `relevance` desc LIMIT 100000";
//             $tableName = $this->createPageTemporaryTable($final_page_sql,$storeId);
//             $pageCollection->getSelect()->join(array('page_trev' => $tableName), 'page_trev.page_id = main_table.page_id',array(''));

//             $collection_count = clone $pageCollection;
//             $page_count = $collection_count->count();

//             $pageCollection
//                 ->setPageSize($page_size) // only get 12 products
//                 ->setCurPage($page)  // first page (means limit 0,10)
//                 ->load();

//             $pages = $this->formatPages($pageCollection);
//             $page_data['count'] = $page_count;
//             $page_data['items'] = $pages;

//         }
//       return $page_data;
//     }

//     public function filterByPrices($productCollection, $price){
//         $websiteId = $this->getCurrentStore()->getWebsiteId();
//         $groupId = $this->data['group_id'];
//         $prices = explode('-', $price);
//         $startPrice = 0;
//         $endPrice = 0;
//         if (count($prices) == 2) {
//             if ($prices[0] != "") {
//                 $startPrice = $prices[0];
//             }
//             if ($prices[1] != "") {
//                 $endPrice = $prices[1];
//             }
//         }
//         $condition = "catalog_product_index_price.min_price >= " . $startPrice;
//         if($endPrice){
//             $condition .= " and catalog_product_index_price.min_price <= ".$endPrice;
//         }
//         $joinConditions = 'e.entity_id = catalog_product_index_price.entity_id';
//         $productCollection->getSelect()->join(
//             ['catalog_product_index_price'],
//             $joinConditions,
//             []
//         )->columns("catalog_product_index_price.min_price")
//             ->where("catalog_product_index_price.website_id = ". $websiteId." and catalog_product_index_price.customer_group_id = ".$groupId." and ".$condition);

//         return $productCollection;
//     }


//     public function getAttributeType(){
//         $sql = "select attribute_id,attribute_code,backend_type,frontend_label from eav_attribute where attribute_id in (select attribute_id from catalog_eav_attribute where is_filterable = 1)";

//         $results = $this->query($sql);
//         if(isset($results) && $results){
//             foreach ($results as $result) {
//                 $this->attrCode_backendType[$result['attribute_code']]['type'] = $result['backend_type'];
//                 $this->attrCode_backendType[$result['attribute_code']]['id'] = $result['attribute_id'];
//                 $this->attrCode_backendType[$result['attribute_code']]['label'] = $result['frontend_label'];
//             }
//         }
//     }

//     /**
//      * @param array $productIds
//      * @return array
//      * @throws ApiException
//      */
//     public function getProductListByRelatedIds( $productIds)
//     {
//         if(is_array($productIds) && count($productIds) >=1) {
//             $collection = $this->prepareProductCollectionByIds($productIds);
//             $products = $this->formatProducts($collection);
//             return $products;
//         } else {
//             return [];
//         }

//     }

//     public function formatPages(\Magento\Cms\Model\ResourceModel\Page\Collection $collection){
//         $pages = [];
//         $helper = $this->getObject('Magento\Cms\Helper\Page');
//         $pageFilterProvider = $this->getObject('Magento\Cms\Model\Template\FilterProvider');

//         foreach($collection as $page){

//             $attribs = $page->getContent();

//             $array = array();
//             $shortText = '';
//             preg_match('/short_text="([^"]*)"/i', $attribs, $array);
//             if (!empty($array[1]))
//                 $shortText = $array[1];

//             if($shortText){
//                 $content = $shortText;
//             }else{
//                 $_html = $pageFilterProvider->getPageFilter()->filter($page->getContent());

//                 $_html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $_html);
//                 $_html = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $_html);

//                 $words = explode(" ",strip_tags($_html));
//                 $content =  implode(" ",array_splice($words,0,40));
//             }

//             $pageUrl = $helper -> getPageUrl($page->getId());
//             $pages[] = [
//                 'page_id' => $page ->getId(),
//                 'page_title' => $page -> getTitle(),
//                 'page_content' => $content,
//                 'page_url' => $pageUrl
//             ];
//         }
//         return $pages;
//     }

//     /**
//      * @param \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
//      * @return array
//      */
//     public function formatProducts(\Magento\Catalog\Model\ResourceModel\Product\Collection $collection)
//     {
//         $products = [];
//         $helper = $this->getObject('Silk\Restful\Helper\Data');
//         $websiteId = $this->getCurrentStore()->getWebsiteId();

//         $product_block = $this->getObject('Silk\Restful\Block\Product');


//         /** @var \Magento\Catalog\Model\Product $product */
//         foreach ($collection as $product) {
//             $promotionPrice = 0;
//             $finalPrice = $product->getFinalPrice();
//             $maxPrice = $product->getPrice();
//             $prices = $this->getMiniPrice($product->getId(), $websiteId);
//             if (count($prices) > 0) {
//                 $finalPrice = $prices['final_price'];
//                 $maxPrice = $prices['price'];
//             }
//             //Get product status
//             $stockinfo =$helper->getProductQty($product->getId(),$product->getTypeId());
//             $stock_stauts = $stockinfo['status'];

//             $carrierLabel = [];
//             $carriers = $product->getCarrierFilter();
//             $carrierArr = explode(',',$carriers);

//             if($carrierArr){
//                 foreach($carrierArr as $carrier){
//                     if($carrier && isset($this->attrOption_lable[$carrier])){
//                         $carrierLabel[]= $this->attrOption_lable[$carrier];
//                     }

//                 }
//                 if(in_array($this->current_carrier, $carrierLabel)){
//                     $carrierLabel = array();
//                     $carrierLabel[] = $this->current_carrier;
//                 }
//             }
//             $stock_stauts =  $stock_stauts ? 'In Stock' : 'Out Of Stock';
//             if($product->getButtonBuy()){
//                 $stock_stauts = '';
//             }
//             $iotProducts = $product_block->getIotProducts();
//             $is_iot_product = in_array($product->getId(),$iotProducts) ? 1 : 0;

//             $phone_type_opt = $product->getPhoneTypeFilter();
//             $phone_type = isset($this->attrOption_lable[$phone_type_opt]) ? $this->attrOption_lable[$phone_type_opt] : '';

//             $products[] = [
//                 'imgurl' => $this->imageHelper->init($product, "category_page_grid")->getUrl(),
//                 'name' => $product->getName(),
//                 'id' => $product->getId(),
//                 'is_in_wishlist' => $helper->inWishList($product->getId()),
//                 'list_show' => $product->getlist_show() ?: '',
//                 'carrier' => $product->getButtonBuy() ? $carrierLabel : [],
//                 'final_price' => $finalPrice,
//                 'max_price' => $maxPrice,
//                 'final_price_label' => $promotionPrice!=0 ? $this->checkoutHelper->convertPrice($promotionPrice) : $this->checkoutHelper->convertPrice($finalPrice),
//                 'max_price_label' => $this->checkoutHelper->convertPrice($maxPrice),
//                 'product_url' => $product->getProductUrl(),
//                 'type' => $product->getTypeId(),
//                 'status' => $stock_stauts,
//                 'short_description' => $product->getListingDescription(),
//                 'is_iot_product' => $is_iot_product,
//                 'phone_type' => $phone_type
//             ];
//         }

//         return $products;
//     }

//     /**
//      * @param array $products
//      * @param $ids
//      * @param $sorts
//      */
//     protected function sortProducts(array &$products, $ids, $sorts = [])
//     {
//         if (!empty($sorts['code']) && $sorts['code'] == 'price') {
//             $dir = $sorts['dir'] == 'desc' ? SORT_DESC : SORT_ASC;
//             array_multisort(array_column($products, 'final_price'), $dir, $products);
//         } else {
//             usort($products, function ($a, $b) use ($ids) {
//                 $aid = $a['id'];
//                 $bid = $b['id'];

//                 $aidPos = array_search($aid, $ids);
//                 $bidPos = array_search($bid, $ids);

//                 return $aidPos > $bidPos ? 1 : -1;
//             });
//         }
//     }

//     /**
//      * @param $sort
//      * @return array
//      */
//     public function getSorts($sort)
//     {
//         $sorts = [
//             'code' => 'position',
//             'dir' => 'desc'
//         ];

//         if ($sort == "name_asc") {
//             $sorts['code'] = "name";
//             $sorts['dir'] = "asc";
//         } else if ($sort == "name_desc") {
//             $sorts['code'] = "name";
//             $sorts['dir'] = "desc";
//         } else if ($sort == "price_desc") {
//             $sorts['code'] = "price";
//             $sorts['dir'] = "desc";
//         } else if ($sort == "price_asc") {
//             $sorts['code'] = "price";
//             $sorts['dir'] = "asc";
//         } else if ($sort == "position_asc") {
//             $sorts['code'] = "position";
//             $sorts['dir'] = "asc";
//         } else if ($sort == "position_desc") {
//             $sorts['code'] = "position";
//             $sorts['dir'] = "desc";
//         } else if ($sort == "relevance") {
//             $sorts['code'] = "relevance";
//             $sorts['dir'] = "desc";
//         } else if ($sort == "bestseller_desc") {
//             $sorts['code'] = "bestseller";
//             $sorts['dir'] = "desc";
//         }

//         return $sorts;
//     }

//     /**
//      * @param $filters
//      * @return array
//      */
//     protected function getFilters($post_data)
//     {

//         $results = [];
//         unset($post_data['id']);
//         unset($post_data['q']);
//         unset($post_data['cat']);
//         unset($post_data['product_list_order']);
//         unset($post_data['product_list_dir']);
//         if ($post_data) {
//             foreach ($post_data as $attrCode => $optionId) {

//                 $results[$attrCode] =explode(',',$optionId);
//             }
//         }
//         return $results;
//     }



//     /**
//      * @param string $form_key
//      * @param int $productId
//      * @param string $title
//      * @param string $detail
//      * @param int $percent
//      * @param string $nickname
//      * @param array $images
//      * @return array|string
//      * @throws ApiException
//      */
//     public function saveReview($form_key, $productId, $title, $detail, $percent, $nickname, $images = [])
//     {
//         $results = array();

//         if (!$this->validate($form_key)) {

//             $results['ret_code'] = 100;
//             $results['msg'] =__("Your page is overtime, please refresh it and submit it again.");
//             return $results;
//         }

//         try {
//             $data = [
//                 'title' => $title,
//                 'detail' => $detail,
//                 'nickname' => $nickname
//             ];
//             $this->reviewHelper->saveReview($productId, $data, $percent, $images);
//         } catch (\Exception $e) {
//             return $e->getMessage();
//         }

//         return $results;
//     }

//     /**
//      * @param string $date
//      * @return array
//      */
//     protected function getDateTime($date)
//     {
//         /** @var \Magento\Framework\Stdlib\DateTime\TimezoneInterface $localeDate */
//         $localeDate = $this->createObject('Magento\Framework\Stdlib\DateTime\TimezoneInterface');

//         switch ($date) {
//             case self::THE_DAY_BEFORE_YESTERDAY:
//                 $startDate = $localeDate->date('-2 day')->setTime(0, 0, 0)->format('Y-m-d H:i:s');
//                 $endDate = $localeDate->date('-2 day')->setTime(23, 59, 0)->format('Y-m-d H:i:s');
//                 break;
//             case self::YESTERDAY:
//                 $startDate = $localeDate->date('-1 day')->setTime(0, 0, 0)->format('Y-m-d H:i:s');
//                 $endDate = $localeDate->date('-1 day')->setTime(23, 59, 0)->format('Y-m-d H:i:s');
//                 break;
//             case self::TODAY:
//             default:
//                 $startDate = $localeDate->date()->setTime(0, 0, 0)->format('Y-m-d H:i:s');
//                 $endDate = $localeDate->date()->setTime(23, 59, 0)->format('Y-m-d H:i:s');
//                 break;
//             case self::TOMORROW:
//                 $startDate = $localeDate->date('+1 day')->setTime(0, 0, 0)->format('Y-m-d H:i:s');
//                 $endDate = $localeDate->date('+1 day')->setTime(23, 59, 0)->format('Y-m-d H:i:s');
//                 break;
//             case self::THE_DAY_AFTER_TOMORROW:
//                 $startDate = $localeDate->date('+2 day')->setTime(0, 0, 0)->format('Y-m-d H:i:s');
//                 $endDate = $localeDate->date('+2 day')->setTime(23, 59, 0)->format('Y-m-d H:i:s');
//                 break;
//         }

//         $startDate = $localeDate->convertConfigTimeToUtc($startDate);
//         $endDate = $localeDate->convertConfigTimeToUtc($endDate);

//         $result['date_start_end'] = [
//             'attribute_start' => 'flash_sales_start_date',
//             'attribute_end' => 'flash_sales_end_date',
//             'start_date' => $startDate,
//             'end_date' => $endDate
//         ];

//         return $result;
//     }


//     /**
//      * @param string $attributeStart
//      * @param string $attributeEnd
//      * @return array
//      */
//     protected function getCurrentDateTime($attributeStart, $attributeEnd)
//     {
//         /** @var \Magento\Framework\Stdlib\DateTime\TimezoneInterface $localeDate */
//         $localeDate = $this->createObject('Magento\Framework\Stdlib\DateTime\TimezoneInterface');

//         $time = $localeDate->convertConfigTimeToUtc($localeDate->date()->format('Y-m-d H:i:s'));

//         return [
//             'current_time' => [
//                 'current_time' => $time,
//                 'attribute_start' => $attributeStart,
//                 'attribute_end' => $attributeEnd,
//             ]
//         ];
//     }

//     /**
//      * @param $version
//      * @return bool
//      */
//     protected function prepareVersion($version)
//     {
//         if ($version == 'mob') {
//             return true;
//         }

//         return false;
//     }
// }