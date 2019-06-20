<?php
namespace App\Component\Block;

class Page extends \Magento\Framework\View\Element\Template
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

    public function getPageJson($version = 'pc')
    {
        $data = array();
        $objectManger = \Magento\Framework\App\ObjectManager::getInstance();

        // Page Title
        $pageTitle = $objectManger->create('Magento\Theme\Block\Html\Title');
        $title = $pageTitle->getPageHeading();
        $data['title'] = $title;

        return $this->_jsonHelper->jsonEncode($data);
    }
}