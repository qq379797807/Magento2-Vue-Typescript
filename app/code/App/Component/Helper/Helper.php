<?php
namespace App\Component\Helper;

use Magento\Framework\App\ResourceConnection;
use Magento\Framework\App\ObjectManager;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;

class Helper extends \Magento\Framework\App\Helper\AbstractHelper
{
	protected $conn;
	protected $objManager;
    protected $productCollectionFactory;
    private $current_store;
    protected $categoryHelper;
    protected $catalogConfig;
    protected $imageHelper;
    protected $scopeConfig;
    protected $checkoutHelper;

    public function getCurrentStore()
    {
        if ($this->current_store) {
            return $this->current_store;
        }
        $this->current_store = $this->storeManger->getStore();
        return $this->current_store;
    }

	public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Catalog\Model\Config $catalogConfig,
        \Magento\Catalog\Helper\Image $imageHelper,
        \Magento\Checkout\Helper\Data $checkoutHelper,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \App\Component\Helper\Data $helper,
        \Magento\Store\Model\StoreManagerInterface $storeManger
	) {
		$this->objManager =ObjectManager::getInstance();
		$this->catalogConfig =$catalogConfig;
        $this->storeManger = $storeManger;
        $this->helper =$helper;
        $this->customerSession = $customerSession;
        $this->imageHelper = $imageHelper;
        $this->checkoutHelper = $checkoutHelper;
        $this->productCollectionFactory =$this->getObject("\Magento\Catalog\Model\ResourceModel\Product\CollectionFactory");
        $this->scopeConfig = $scopeConfig;
        $this->categoryHelper =$this;
		parent::__construct($context);
    }

    public function getObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function createObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->create($className);
    }

    public function customerSession()
    {
        return $this->getObject('Magento\Customer\Model\Session');
    }
    
	 protected function getConnection(){
    	if($this->conn)
    		return $this->conn;
    	$this->conn =$this->objManager->get("Magento\Framework\App\ResourceConnection")->getConnection();
    	return $this->conn;
    }

    protected function query($sql,$params=null)
    {
        $stmt =$this->prequery($sql,$params);
        return $stmt->fetchAll();
    }

    protected function prequery($sql,$params=null)
    {
        $stmt=$this->getConnection()->prepare($sql);
        if ($params!=null) {
            $params=is_array($params)?$params:array($params);
            $stmt->execute($params);

        } else {
            $stmt->execute();
        }

        return $stmt;
    }

    public function getUrl($route = '', $params = [])
    {
        return $this->_urlBuilder->getUrl($route, $params);
    }

    public function getProductTypeById($entity_id){
        $sql ="SELECT type_id FROM catalog_product_entity WHERE entity_id=?";
        $parms =array($entity_id);
        $results =$this->query($sql,$parms);
        $ret ='';
        foreach ($results as $row) {
            $ret =$row['type_id'];
        }

        return $ret;
    }

    public function getMiniPrice($id,$website_id){
        $row_id =$this->getRowId($id);
        $ret =array();
        $helper = $this->getObject('App\Component\Helper\Data');

        $type_id =$this->getProductTypeById($id);
        $status_code_id = $helper->getAttributeIdByCode('status');

           if($type_id=="configurable")
           {
            $sql ="SELECT price,final_price,min_price FROM catalog_product_index_price pr LEFT JOIN  catalog_product_super_link sl ON pr.entity_id =sl.product_id 
LEFT JOIN catalog_product_entity e ON e.entity_id=pr.entity_id
LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
WHERE pr.website_id =? AND sl.parent_id=? and es.value=1  order by (pr.price-pr.final_price) desc,price asc";

            $parms =array($status_code_id,$website_id,$row_id);
            $results =$this->query($sql,$parms);

            foreach ($results as $row) {
                $ret['final_price'] =$row['final_price'];
                $ret['price'] =$row['price'];
                break;
            }

           }else{
        $sql ="SELECT price,final_price FROM catalog_product_index_price pr 
LEFT JOIN catalog_product_entity e ON e.entity_id=pr.entity_id
LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
WHERE pr.website_id =? AND pr.entity_id=?  and es.value=1 ";

        $parms =array($status_code_id,$website_id,$id);
        $results =$this->query($sql,$parms);

        foreach ($results as $row) {
            $ret['final_price'] =$row['final_price'];
            $ret['price'] =$row['price'];
            break;
        }
        }
        return $ret;
    }

    public function getReviewCounts($id , $storeId = 0){
        $sql ="SELECT COUNT(1) AS reviews FROM review re LEFT JOIN review_store res ON re.review_id =res.review_id WHERE entity_pk_value =? AND status_id =1 AND res.store_id = ?";
        $parms =array($id, $storeId);
        $results =$this->query($sql,$parms);
        $ret =0;
        foreach ($results as $row) {
            $ret =$row['reviews'];
        }
        return $ret;
    }

    public function getReviews($id,$currentpage,$pagesize){
        $start =($currentpage-1)*$pagesize;
        $sql ="SELECT re.priority,re.created_at,red.title,red.detail,red.nickname,red.customer_id, IFNULL(rev.percent,100) AS percent FROM review re LEFT JOIN review_detail red ON re.review_id =red.detail_id LEFT JOIN rating_option_vote rev ON re.review_id =rev.review_id AND rev.rating_id=1 WHERE re.entity_pk_value =? AND re.status_id =1  ORDER BY re.priority desc,re.created_at DESC LIMIT $start,$pagesize;";
        $parms =array($id);
        $results =$this->query($sql,$parms);

        return $results;
    }

    public function getSummaryReviews($id){
        $sql ="SELECT IFNULL(rev.percent,100) AS percent,COUNT(re.entity_pk_value) AS rowcount FROM review re 
LEFT JOIN review_detail red ON re.review_id =red.detail_id
LEFT JOIN rating_option_vote rev ON re.review_id =rev.review_id AND rev.rating_id=1
WHERE re.entity_pk_value =? AND re.status_id =1 
GROUP BY IFNULL(rev.percent,100)";
        $parms =array($id);
        $results =$this->query($sql,$parms);
        return $results;
    }

     public function getCateproducts($catid,$size=12)
     {
        $helper = $this->getObject('App\Component\Helper\Data');
        $status_code_id = $helper->getAttributeIdByCode('status');
        $visibility_code_id = $helper->getAttributeIdByCode('visibility');

        $sql ="SELECT distinct cp.product_id  FROM catalog_category_product cp
            LEFT JOIN catalog_product_entity e ON cp.product_id =e.entity_id
            LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
            LEFT JOIN catalog_product_entity_int ev ON e.row_id =ev.row_id AND ev.attribute_id=?
            INNER JOIN cataloginventory_stock_status stock_status_index ON e.entity_id = stock_status_index.product_id AND stock_status_index.website_id = 0 AND stock_status_index.stock_id = 1
            WHERE category_id=? AND (stock_status_index.stock_status = 1)  AND es.value=1 AND ev.value IN(2,3,4) ORDER BY POSITION ASC limit 0,$size;";
        $parms =array($status_code_id,$visibility_code_id,$catid);

        $results =$this->query($sql,$parms);

        $ret =array();
        foreach ($results as $row) {
            $ret[] =$row['product_id'];
        }
        return $ret;
    }
        public function getCount($catid,$filter,$groupId){
            $helper = $this->getObject('App\Component\Helper\Data');
            $status_code_id = $helper->getAttributeIdByCode('status');
            $visibility_code_id = $helper->getAttributeIdByCode('visibility');
        $sql ="SELECT count(cp.product_id) as totals  FROM catalog_category_product cp
LEFT JOIN catalog_product_entity e ON cp.product_id =e.entity_id
LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
LEFT JOIN catalog_product_entity_int ev ON e.row_id =ev.row_id AND ev.attribute_id=?";
$sqlleft ="";
$sqlwhere ="";
$sqlSort ="";
$isPriceCode =false;

foreach ($filter as $code => $value) {
    if($code=="price")
    {
        $isPriceCode =true;
        $sqlleft .=" LEFT JOIN catalog_product_index_price epi ON e.entity_id =epi.entity_id AND epi.customer_group_id = $groupId";
        $prices =explode('-', $value);
        $startPrice =0;
        $endPrice =0;
        if(count($prices)==2)
        {
            if($prices[0]!="")
            {
               $startPrice = $prices[0];
            }
            if($prices[1]!="")
            {
               $endPrice = $prices[1];
            }

            if($startPrice>0)
            {
                $sqlwhere .=" and epi.final_price >=$startPrice ";
            }

            if($endPrice>0)
            {
                $sqlwhere .=" and epi.final_price <$endPrice ";
            }
        }
    }else{
        $sqlleft .=" LEFT JOIN catalog_product_entity_int $code ON e.row_id =$code.row_id AND $code.attribute_id=(SELECT attribute_id FROM eav_attribute WHERE attribute_code LIKE '$code')";
        $sqlwhere .=" and $code.value =$value";
    }

}

$sql .=$sqlleft;
$sql .=" WHERE category_id=? AND es.value=1 AND ev.value IN(2,3,4)";
$sql .=$sqlwhere;


        $parms =array($status_code_id,$visibility_code_id,$catid);
        $results =$this->query($sql,$parms);

        $ret =0;
        foreach ($results as $row) {
            $ret =$row['totals'];
        }
        return $ret;
    }
    public function getKeyword($keyword){
        $keyArr =explode(' ', $keyword);
        $word ='';
        foreach ($keyArr as $value) {
            if($value !="")
            {

                $word.=" ".$value."*";
            }
        }
        $word =trim($word);

        $sql ="SELECT `main_select`.`entity_id`, MAX(score) AS `relevance` FROM (SELECT `search_index`.`entity_id`, ((0) + LEAST((MATCH (data_index) AGAINST (? IN BOOLEAN MODE)), 1000000) * POW(2, search_weight)) AS `score` FROM `catalogsearch_fulltext_scope1` AS `search_index` LEFT JOIN `catalog_eav_attribute` AS `cea` ON search_index.attribute_id = cea.attribute_id LEFT JOIN `cataloginventory_stock_status` AS `stock_index` ON search_index.entity_id = stock_index.product_id AND stock_index.website_id = 0 WHERE (stock_index.stock_status = 1) AND (MATCH (data_index) AGAINST (? IN BOOLEAN MODE))) AS `main_select` GROUP BY `entity_id` ORDER BY `relevance` DESC ";
    $parms =array($word,$word);

        $results =$this->query($sql,$parms);

        return $results;


    }
    public function getCateproductsByFilter($catid,$filter,$sorts,$page,$groupId,$size=12,$searchword ='',$storeId=0){
        $helper = $this->getObject('App\Component\Helper\Data');
        $status_code_id = $helper->getAttributeIdByCode('status');
        $visibility_code_id = $helper->getAttributeIdByCode('visibility');
        $sql ="SELECT DISTINCT(cp.product_id) as product_id   FROM catalog_category_product cp
LEFT JOIN catalog_product_entity e ON cp.product_id =e.entity_id
LEFT JOIN catalog_product_entity_int es ON e.row_id =es.row_id AND es.attribute_id=?
LEFT JOIN catalog_product_entity_int ev ON e.row_id =ev.row_id AND ev.attribute_id=? 
INNER JOIN cataloginventory_stock_status stock_status_index ON e.entity_id = stock_status_index.product_id AND stock_status_index.website_id = 0 AND stock_status_index.stock_id = 1 
";
$sqlleft =" AND (stock_status_index.stock_status = 1) ";
$sqlwhere ="";
$sqlSort ="";
$isPriceCode =false;

foreach ($filter as $code => $value) {
    if($code=="price")
    {
        $isPriceCode =true;
        $sqlleft .=" LEFT JOIN catalog_product_index_price epi ON e.entity_id =epi.entity_id AND epi.customer_group_id = $groupId";
        $prices =explode('-', $value);
        $startPrice =0;
        $endPrice =0;
        if(count($prices)==2)
        {
            if($prices[0]!="")
            {
               $startPrice = $prices[0];
            }
            if($prices[1]!="")
            {
               $endPrice = $prices[1];
            }

            if($startPrice>0)
            {
                $sqlwhere .=" and epi.final_price >=$startPrice ";
            }

            if($endPrice>0)
            {
                $sqlwhere .=" and epi.final_price <$endPrice ";
            }
        }
    }else{
        $sqlleft .=" LEFT JOIN catalog_product_entity_int $code ON e.row_id =$code.row_id AND $code.attribute_id=(SELECT attribute_id FROM eav_attribute WHERE  entity_type_id =4 and attribute_code LIKE '$code')";
        $sqlwhere .=" and $code.value =$value";
    }

}

if($sorts['code']=="price")
{

    if(!$isPriceCode)
    {
        $sqlleft .=" LEFT JOIN catalog_product_index_price epi ON e.entity_id =epi.entity_id AND epi.customer_group_id = $groupId";
    }

    $sqlSort =" ORDER BY epi.final_price ".$sorts['dir'];

}else if($sorts['code']=="name"){
    $code ="name";
  $sqlleft .=" LEFT JOIN catalog_product_entity_int $code ON e.row_id =$code.row_id AND $code.attribute_id=(SELECT attribute_id FROM eav_attribute WHERE entity_type_id =4 and attribute_code LIKE '$code')";
  $sqlSort =" ORDER BY $code.value ".$sorts['dir'];
}else if($sorts['code']=="position"){
     $sqlSort =" ORDER BY cp.position ".$sorts['dir'];

}else if($sorts['code']=="bestseller"){
    $sqlleft .=" LEFT JOIN (SELECT SUM(qty_ordered) AS sellerqty,product_id FROM sales_order_item GROUP BY product_id) td ON td.product_id=cp.product_id";
    $sqlSort =" ORDER BY td.sellerqty desc";

}else{
    if($searchword!='')
    {

        $sqlSort =" ORDER BY trev.relevance desc";
    }
}
$word ='';
if($searchword!='')
{
   $keyArr =explode(' ', $searchword);

    foreach ($keyArr as $value) {
            if($value !="")
            {

                $word.=" ".$value."*";
            }
        }

        $word =trim($word);

        $sqlleft .=" inner join (SELECT `main_select`.`entity_id`, MAX(score) AS `relevance` FROM (SELECT `search_index`.`entity_id`, ((0) + LEAST((MATCH (data_index) AGAINST (? IN BOOLEAN MODE)), 1000000) * POW(2, search_weight)) AS `score` FROM `catalogsearch_fulltext_scope".$storeId."` AS `search_index` LEFT JOIN `catalog_eav_attribute` AS `cea` ON search_index.attribute_id = cea.attribute_id LEFT JOIN `cataloginventory_stock_status` AS `stock_index` ON search_index.entity_id = stock_index.product_id AND stock_index.website_id = 0 WHERE (stock_index.stock_status = 1) AND (MATCH (data_index) AGAINST (? IN BOOLEAN MODE))) AS `main_select` GROUP BY `entity_id` ORDER BY `relevance` DESC ) trev ON trev.entity_id =cp.product_id ";

        $parms =array($word,$word);
}

$sql .=$sqlleft;
if($searchword!="")
{
    $sql .=" WHERE  es.value=1 AND ev.value IN(2,3,4)";
}else{
    $sql .=" WHERE category_id=? AND es.value=1 AND ev.value IN(2,3,4)";
}
//$sql .=" WHERE category_id=? AND es.value=1 AND ev.value IN(2,3,4)";
$sql .=$sqlwhere;
$start =($page-1)*$size;
$sql .=$sqlSort;
$sql .=" limit $start,$size;";

$parms =array($status_code_id,$visibility_code_id,$catid);
if($searchword!="")
{
     $parms =array($status_code_id,$visibility_code_id,$word,$word);
}

        $results =$this->query($sql,$parms);

        $ret =array();
        foreach ($results as $row) {
            $ret[] =$row['product_id'];
        }
        return $ret;
    }

    public function getAttributeLabel($attId){
       $sql ="SELECT  frontend_label,attribute_code,epv.option_id,IFNULL(epw.type,0) AS swatchflag,epw.value AS swatch FROM eav_attribute ea LEFT JOIN eav_attribute_option ep ON ea.attribute_id =ep.attribute_id ";
       $sql .=" LEFT JOIN eav_attribute_option_value epv ON ep.option_id =epv.option_id AND epv.store_id=0 ";
       $sql .=" LEFT JOIN eav_attribute_option_swatch epw ON ep.option_id =epw.option_id AND epw.store_id  =0 ";
       $sql .=" WHERE ea.attribute_id =?";
       $parms =array($attId);
         $results =$this->query($sql,$parms);
    }
    public function getRowId($entity_id){
        $sql ="SELECT row_id FROM catalog_product_entity WHERE entity_id=?";
        $parms =array($entity_id);
        $results =$this->query($sql,$parms);
        $ret =0;
        foreach ($results as $row) {
            $ret =$row['row_id'];
        }

        return $ret;
    }
    public function getConfigAttribute($product_id){
        $row_id =$this->getRowId($product_id);
      $sql ="SELECT GROUP_CONCAT(sl.product_id) AS limitids,sa.attribute_id,ce.value AS option_id,ev.value,e.attribute_code,e.frontend_label FROM catalog_product_super_link sl 
LEFT JOIN catalog_product_super_attribute sa ON sl.parent_id =sa.product_id
LEFT JOIN catalog_product_entity_int ce ON (sl.product_id =ce.row_id AND sa.attribute_id =ce.attribute_id)
LEFT JOIN eav_attribute_option_value ev ON (ce.value =ev.option_id AND ev.store_id =0)
LEFT JOIN eav_attribute e ON(e.attribute_id =sa.attribute_id)
WHERE sl.parent_id =?
GROUP BY sa.attribute_id,ce.value,ev.value,e.attribute_code
ORDER BY sa.attribute_id DESC";

  $parms =array($row_id);
        $results =$this->query($sql,$parms);
        $ret =array();
        $att =array();
        $product =array();
        foreach ($results as $row) {
             $key_attribute_id ="key_".$row['attribute_id'];
             $key_option_id ="key_".$row['option_id'];
             $ids =$row['limitids'];
             $idArr =explode(",", $ids);
             $att[$key_attribute_id][$key_option_id] =$idArr;
        }
        $ret['conf'] =$att;

        $sqlqty ="SELECT sl.product_id,IFNULL(csi.max_sale_qty,1) AS qty FROM catalog_product_super_link sl LEFT JOIN cataloginventory_stock_item csi ON sl.product_id =csi.product_id WHERE sl.parent_id =?";
        $qtyResult =$this->query($sqlqty,$parms);
        $defaultQty =0;
        foreach ($qtyResult as $row) {
            $product_id ='key_'.$row['product_id'];
            $qty =$row['qty'];
            $product[$product_id] =$qty;
            if($defaultQty==0)
                $defaultQty =$qty;
        }
        $ret['product'] =$product;

        $baseQty =1;
        if($defaultQty>0)
        {
            $baseQty =$defaultQty;
        }else{
            $sqloneqty ="SELECT IFNULL(csi.max_sale_qty,1) AS qty FROM cataloginventory_stock_item csi WHERE csi.product_id =?";
            $params =array($product_id);
            $qtyOneResult =$this->query($sqloneqty,$params);
            foreach ($qtyOneResult as $subrow) {
                $baseQty =$subrow['qty'];
            }
        }
        $ret['baseqty'] =$baseQty;
        return $ret;
    }

    public function getGallery($product_id,$store_id){
        $sql ="SELECT  distinct eg.value FROM catalog_product_entity_media_gallery_value ev LEFT JOIN catalog_product_entity_media_gallery eg ON  ev.value_id =eg.value_id LEFT JOIN catalog_product_entity e ON ev.row_id =e.row_id WHERE e.entity_id =:product_id AND ev.store_id IN(0,:store_id)";
        $parms =array('product_id'=>$product_id,'store_id'=>$store_id);

        $results =$this->query($sql,$parms);
        $ret =array();
        foreach ($results as $row) {
            $ret[] =$row['value'];


        }

        return $ret;

    }
    private function getAttributeInfo($code){
        $sql ="SELECT attribute_id,backend_type FROM eav_attribute WHERE attribute_code LIKE ? AND entity_type_id =4";
          $parms =array($code);
        $results =$this->query($sql,$parms);
        $ret =array();
        foreach ($results as $row) {
            $ret['attid'] =$row['attribute_id'];
            $ret['tyle'] =$row['backend_type'];
        }
        return $ret;

    }
     public function getProductsValue($id,$storeId,$code){
        $attInfos =$this->getAttributeInfo($code);
        $attId =0;
        $typename ="";
        if(count($attInfos)>0)
        {
            $attId =$attInfos['attid'];
            $typename =$attInfos['tyle'];
        }else{
            return "";
        }

        $sql ="SELECT et.value FROM catalog_product_entity_".$typename." et LEFT JOIN catalog_product_entity e ON et.row_id =e.row_id WHERE et.store_id IN(0,?) AND  e.entity_id =? and et.attribute_id=? ORDER BY et.store_id desc LIMIT 0,1;";

        $parms =array($storeId,$id,$attId);

        $results =$this->query($sql,$parms);
        $ret ="";
        foreach ($results as $row) {
            $ret =$row['value'];
            break;
        }

        return $ret;
    }

    public function getProductUrl($product_id,$store_id,$baseurl){
        $target ='catalog/product/view/id/'.$product_id;
        $sql ="SELECT request_path FROM url_rewrite WHERE entity_id =? AND entity_type ='product' AND target_path =? AND store_id =?";
        $parms =array($product_id,$target,$store_id);

        $results =$this->query($sql,$parms);

        foreach ($results as $row) {
            $target =$row['request_path'];
            break;
        }

        return  $baseurl.$target;

    }
    public function getCategoryUrl($cateId,$store_id,$baseurl){
        $target ='catalog/category/view/id/'.$cateId;
        $sql ="SELECT request_path FROM url_rewrite WHERE entity_id =? AND entity_type ='category' AND target_path =? AND store_id =?";
        $parms =array($cateId,$target,$store_id);


        $results =$this->query($sql,$parms);

        foreach ($results as $row) {
            $target =$row['request_path'];
            break;
        }

        return  $baseurl.$target;
    }

    public function getCategories(){
        $sql ="select entity_id,row_id,parent_id from catalog_category_entity e where e.`level` =?;";
        $parms =array(1);

        $results =$this->query($sql,$parms);
        $retArr =array();
        $store_id =0;
        foreach ($results as $row)
        {
            $row_id =$row['row_id'];
            $entity_id =$row['entity_id'];
            $data =$this->getChildNodes($entity_id,0,$row_id);
            $retArr =array_merge($retArr,$data);
        }
        return $retArr;
    }
    public function getCategoryName($row_id,$store_id){
        $helper = $this->getObject('App\Component\Helper\Data');
        $cName_id = $helper->getAttributeIdByCode('name',3);
        $sql ="SELECT value FROM catalog_category_entity_varchar WHERE row_id=?  AND attribute_id=? AND store_id IN(0,?) ORDER BY store_id DESC ";
        $params=array($row_id,$cName_id,$store_id);
        $results=$this->query($sql,$params);
        $name ="";
        foreach ($results as $row) {
            $name =$row['value'];
            break;
        }
        return $name;

    }
    public function getCategoryIconUrl($row_id,$store_id,$baseMedia){
        $helper = $this->getObject('App\Component\Helper\Data');
        $cImage_id = $helper->getAttributeIdByCode('image',3);
        $sql ="SELECT value FROM catalog_category_entity_varchar WHERE row_id=?  AND attribute_id=? AND store_id IN(0,?) and value is not null and value <>'' ORDER BY store_id DESC ";
        $params=array($row_id,$cImage_id,$store_id);
        $results=$this->query($sql,$params);
        $name ="";
        foreach ($results as $row) {
            $name =$baseMedia."catalog/category/".$row['value'];
            break;
        }
        return $name;

    }

    public function getChildNodes($parentId,$store_id,$row_id)
    {
        $data =array();
        $rootName =$this->getCategoryName($row_id,$store_id);
        $sql ="SELECT row_id,entity_id FROM catalog_category_entity WHERE parent_id =? ORDER BY POSITION ASC ";
        $params=array($parentId);
        $results=$this->query($sql,$params);
        $data =array();
        foreach ($results as $row) {
            $row_id =$row['row_id'];
            $key_id ="key_".$row['row_id'];
            $entity_id =$row['entity_id'];
            if($this->checkIsActive($row_id,$store_id))
            {
                $subItem =array();
                $subItem['value'] =$entity_id;
                $subRoot =$rootName."->".$this->getCategoryName($row_id,$store_id);
                $subItem['label'] =$subRoot;

                $data[]=$subItem;
                $params=array($entity_id);
                $results1=$this->query($sql,$params);
                foreach ($results1 as $subrow)
                {
                    $row_id =$subrow['row_id'];
                    $entity_id =$subrow['entity_id'];
                    if($this->checkIsActive($row_id,$store_id))
                    {
                        $subItem =array();
                        $subItem['value'] =$entity_id;
                        $_subRoot =$subRoot."->".$this->getCategoryName($row_id,$store_id);
                        $subItem['label'] =$_subRoot;

                        $data[]=$subItem;
                    }
                }
            }
        }


        return $data;
    }
    public function getCateRowId($entity_id){
        $sql ="SELECT row_id FROM catalog_category_entity WHERE entity_id=?";
        $parms =array($entity_id);
        $results =$this->query($sql,$parms);
        $ret =0;
        foreach ($results as $row) {
            $ret =$row['row_id'];
        }

        return $ret;
    }
    protected function checkIsActive($row_id,$store_id){
        $helper = $this->getObject('App\Component\Helper\Data');
        $is_active_code_id = $helper->getAttributeIdByCode('is_active',3);
        $sql ="SELECT value FROM catalog_category_entity_int WHERE attribute_id =? AND store_id IN(0,?) AND row_id=? ORDER BY store_id DESC ";

        $params=array($is_active_code_id,$store_id,$row_id);
        $results=$this->query($sql,$params);
        $ret =false;
        foreach ($results as $row) {
            $value =$row['value'];
            if($value=="1")
            {
                $ret =true;
            }

            break;

        }

        return $ret;;
    }

    public function getHomeAds($store_id,$version,$baseurl,$baseMediaUrl,$page){
        $start =($page-1)*3;
        $stdTimezone = $this->getObject('Magento\Framework\Stdlib\DateTime\Timezone');
        $dateTimeNow = $stdTimezone->date()->format('Y-m-d H:i:s');

        $sql ="SELECT end_at,name,content_type,ads_type,banner_image,url,content_location,content_desc,content_title,special_price,orinal_price,relate_category,title_position FROM `sk_manage_ads` where status =1 and version =:version and start_at < '{$dateTimeNow}' and end_at >'{$dateTimeNow}' and store_id =:store_id order by sort_by asc LIMIT $start,3;";


        $params=array('store_id'=>$store_id,'version'=>$version);


        $results=$this->query($sql,$params);

        $ret =array();
        foreach ($results as $row)
        {

            $type =$row['content_type'];
            $name =$row['name'];

            if($type=="product")
            {
                $productModul =$this->convertToProduct($row,$store_id,$baseurl,$baseMediaUrl);

                if($productModul!==false)
                    $ret[]=$productModul;
            }else if($type=="ads")
            {

                $adsModul =$this->convertToAdsmodule($row,$store_id,$baseMediaUrl);

                if($adsModul!==false)
                    $ret[]=$adsModul;
            }
        }
        return $ret;
    }
    public function convertToAdsmodule($row,$store_id,$baseMediaUrl){
        $banner_image =$row['banner_image'];
        $retData =array();
        $retData['banner'] =$baseMediaUrl.$banner_image;
        if(!$banner_image)
        {
            return false;
        }
        $url =$row['url'];
        $retData['url'] =$url;
        if(!$url)
        {
            return false;
        }
        $title_position =$row['title_position'];
        if(!$title_position)
        {
            return false;
        }
        $retData['name'] =$row['name'];
        $retData['title_position'] =$title_position=="none"?false:true;
        $ads_type =$row['ads_type'];
        $retData['type'] ='ads';
        if($ads_type=="base")
        {
            $retData['ads_type'] ='base';
        }else if($ads_type=="content"){
            $retData['ads_type'] ='base';
            // $retData['content_title'] =$row['content_title'];
            // $retData['content_desc'] =$row['content_desc'];
            // $retData['content_location'] =$row['content_location'];

        }else if($ads_type=="timer"){

            $retData['ads_type'] ='timer';
            $retData['content_title'] =$row['content_title'];
            $retData['content_desc'] =$row['content_desc'];
            $retData['content_location'] =$row['content_location'];
            $retData['expired_at'] =strtotime($row['end_at']);

            $stdTimezone = $this->getObject('Magento\Framework\Stdlib\DateTime\Timezone');
            $dateTimeNow = $stdTimezone->date()->format('Y-m-d H:i:s');

            $retData['now'] =strtotime($dateTimeNow);
            $convert = $this->getObject("Magento\Checkout\Helper\Data");
            $retData['special_price'] =$convert->convertPrice($row['special_price']);
            $retData['orinal_price'] =$convert->convertPrice($row['orinal_price']);

        }else{
            return false;
        }
        return $retData;

    }
    public function convertToProduct($row,$store_id,$baseurl,$baseMediaUrl){
        $title_position =$row['title_position'];
        if(!$title_position)
        {
            return false;
        }

        $cateIdstr =$row['relate_category'];
        $cateIds =explode(',',$cateIdstr);

        if(count($cateIds)>0)
        {
            $retData =array();
            $retData['name'] =$row['name'];
            $retData['type'] ='product';

            $retData['title_position'] =$row['title_position']=="none"?false:true;
            $relateCates =array();
            foreach ($cateIds as $cateId)
            {
                $rowid =$this->getCateRowId($cateId);
                if($this->checkIsActive($rowid,$store_id))
                {

                    $productIds = $this->getCateproducts($cateId);

                    if(count($productIds)>0)
                    {
                        $productItems =array();

                        foreach ($productIds as $id)
                        {
                           $productInfo =$this->getProductsInfo($id , $store_id , $baseurl);
                           if($productInfo!==false)
                           {
                               $productItems[]=$productInfo;
                           }
                        }
                        if(count($productItems)>0)
                        {
                           $cateName = $this->getCategoryName($rowid,$store_id);
                           $subCates =array();
                           $subCates['name'] =$cateName;
                            $subCates['url'] =$this->getCategoryUrl($cateId,$store_id,$baseurl);
                           $subCates['cate_id'] =$cateId;
                           $subCates['icon'] =$this->getCategoryIconUrl($rowid,$store_id,$baseMediaUrl);
                           $subCates['list'] =$productItems;
                           $relateCates[]=$subCates;
                        }

                    }else{
                        continue;
                    }
                }
            }
            if(count($relateCates)>0)
            {
                $retData['relate_product'] =$relateCates;
                return $retData;
            }else{
                return false;
            }

        }else{
            return false;
        }

    }
    public function getConfigSimpleId($id){
        $helper = $this->getObject('App\Component\Helper\Data');
        $status_code_id = $helper->getAttributeIdByCode('status');
        $sql ="SELECT distinct product_id FROM catalog_product_super_link sl  LEFT JOIN catalog_product_entity ee on sl.product_id =ee.entity_id LEFT JOIN catalog_product_entity_int ce ON (ee.row_id =ce.row_id AND ce.attribute_id =?) WHERE sl.parent_id =? limit 0,1";
        $params=array($status_code_id,$id);
        $results=$this->query($sql,$params);
        $productId =0;
        foreach ($results as $row)
        {
            $productId =$row['product_id'];
        }

        return $productId;
    }
    protected $websiteId;
    private function getWebsiteIdByStoreId($storeId){
        if(!$this->websiteId)
        {
            $this->websiteId =array();
        }
        $key ='key'.$storeId;
        if(array_key_exists($key,$this->websiteId))
            return $this->websiteId[$key];
        $sql ="SELECT website_id FROM `store` where store_id =:store_id";
        $params=array('store_id'=>$storeId);
        $results=$this->query($sql,$params);
        $websiteId =0;
        foreach ($results as $row)
        {
            $websiteId =$row['website_id'];
        }
        $this->websiteId[$key] =$websiteId;
        return $this->websiteId[$key];

    }
    public function getProductsInfo($id , $store_id , $baseurl)
    {
        $data = array();
        $data['id'] = $id;
        $data['url_link'] = $this->getProductUrl($id , $store_id , $baseurl);
        $data['name'] = $this->getProductsValue($id , $store_id , 'name');


        $imageFile = $this->getProductsValue($id , $store_id , 'image');
        $imageObj = $this->createObject("Magento\Catalog\Model\Product\Image");
        $imageObj->setDestinationSubdir("image");
        $imageObj->setSize("320x320");
        $imageObj->setBaseFile($imageFile);

          if ( !$imageObj->isCached() ) {
             $imageObj->resize();
             $imageObj->saveFile();
          }
        $websiteId = $this->getWebsiteIdByStoreId($store_id);
        $prices = $this->getMiniPrice($id,$websiteId);
        if ( count($prices) == 2 ) {
            $data['final_price'] = $prices['final_price'];
            $data['max_price'] = $prices['price'];
        } else {
            $type_id =$this->getProductTypeById($id);
            $productId =$id;
            if($type_id=="configurable")
            {
                $row_id =$this->getRowId($id);
                $productId =$this->getConfigSimpleId($id);

            }
            $price =$this->getProductsValue($productId , $store_id , 'price');
            $sp_price =$this->getProductsValue($productId , $store_id , 'special_price');
            $final_price=$price;
            if($sp_price!="")
            {
                if($sp_price<$price)
                {
                    $final_price =$sp_price;
                }
            }

            $data['final_price'] =$final_price;
            $data['max_price'] = $price;
        }

        $helper = $this->getObject('App\Component\Helper\Data');
        $website_id = $this->getCurrentStore()->getWebsite()->getId();
        $product_type = $helper->getProductType($id);

        $convert = $this->getObject("Magento\Checkout\Helper\Data");
        $data['final_price_label'] = $convert->convertPrice($data['final_price']);
        $data['max_price_label'] = $convert->convertPrice($data['max_price']);
        $data['new_icon'] =$this->getProductsValue($id , $store_id , 'new_icon')? 1 : 0;
        $data['sale_icon'] =$this->getProductsValue($id , $store_id , 'new_icon')? 1 : 0;
        $data['image'] = $imageObj->getUrl();

        return $data;
    }
}