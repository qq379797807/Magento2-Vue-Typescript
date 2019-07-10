<?php
namespace App\Component\Helper;

use Magento\Framework\App\ObjectManager;

class Data extends \Magento\Framework\App\Helper\AbstractHelper {
    protected $objManager;

    public function __construct(
        \Magento\Framework\App\Helper\Context $context
    ) {
        $this->objManager = ObjectManager::getInstance();
        parent::__construct($context);
    }

    public function getObject($className) {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function createObject($className) {
        return \Magento\Framework\App\ObjectManager::getInstance()->create($className);
    }

    public function getConnection() {
        if ($this->conn)
            return $this->conn;
        $this->conn = $this->objManager->get("Magento\Framework\App\ResourceConnection")->getConnection();

        return $this->conn;
    }

    public function query($sql, $params = null) {
        $stmt = $this->prequery($sql, $params);
        return $stmt->fetchAll();
    }

    public function prequery($sql, $params = null) {
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
}