<?php
namespace App\Component\Block;

class Checkout extends \Magento\Framework\View\Element\Template
{
    private $helper;
    private $_jsonHelper;

    public function __construct(
        \App\Component\Helper\Data $helper,
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Framework\View\Element\Template\Context $context
    )
    {
        parent::__construct($context);
        $this->_isScopePrivate = true;
        $this->helper = $helper;
        $this->_jsonHelper = $JsonHelper;
    }

    public function getCheckoutJson($version = 'pc')
    {
        $data = array();
        $objectManger = \Magento\Framework\App\ObjectManager::getInstance();
        $checkoutHelper = $objectManger->create('Magento\Checkout\Block\Onepage');
        $checkoutConfig = $checkoutHelper->getCheckoutConfig();
        
        $data = $checkoutConfig;

        return $this->_jsonHelper->jsonEncode($data);
    }
}