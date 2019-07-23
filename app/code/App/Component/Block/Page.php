<?php
namespace App\Component\Block;

class Page extends \Magento\Framework\View\Element\Template
{
    private $jsonHelper;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Json\Helper\Data $JsonHelper
    ) {
        parent::__construct($context);
        $this->jsonHelper = $JsonHelper;
    }

    public function getObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function getPageJson($version = 'pc')
    {
        $data = array();
        $pagerHelper = $this->getObject('Magento\Cms\Block\Page');
        $identities = $pagerHelper->getIdentities();
        $page = $pagerHelper->getPage();
        $heading = $page->getContentHeading();
        $title = $page->getTitle();
        
        $data['identities'] = $identities;
        $data['title'] = $title;
        $data['heading'] = $heading;

        return $this->jsonHelper->jsonEncode($data);
    }
}