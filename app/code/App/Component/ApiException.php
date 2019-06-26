<?php
namespace App\Component;

class ApiException extends \Magento\Framework\Webapi\Exception
{
    const EXCEPTION_PAGE_OVERTIME = '100001';
    const EXCEPTION_NOT_LOGIN = 100002;
    const EXCEPTION_PRODUCT_NOT_FOUND = '101001';
    const EXCEPTION_CATALOG_FLASH_SALES_NOT_AVAILABLE = '201001';
    const EXCEPTION_CATALOG_GROUP_PURCHASE_NOT_AVAILABLE = '202001';
    const EXCEPTION_CATALOG_PRE_ORDER_NOT_AVAILABLE = '203001';

    private static $errors = [
        self::EXCEPTION_PAGE_OVERTIME => 'Your page is overtime, please refresh it and submit it again.',
        self::EXCEPTION_NOT_LOGIN => 'Please login first.',
        self::EXCEPTION_PRODUCT_NOT_FOUND => 'Product Not Found.',
        self::EXCEPTION_CATALOG_FLASH_SALES_NOT_AVAILABLE => 'Flash Sales is not available now.',
        self::EXCEPTION_CATALOG_GROUP_PURCHASE_NOT_AVAILABLE => 'Group Purchase is not available now.',
        self::EXCEPTION_CATALOG_PRE_ORDER_NOT_AVAILABLE => 'Pre Order is not available now.',
    ];

    public function __construct($code, $message = "")
    {
        if (!$message) {
            $message = isset(self::$errors[$code]) ? self::$errors[$code] : 'Internal Error.';
        }

        parent::__construct(__($message), $code);
    }
}