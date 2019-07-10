<?php
namespace App\Component\Block;

class Page extends \Magento\Framework\View\Element\Template
{
    private $jsonHelper;
    private $_filterProvider;

    public function __construct(
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Cms\Model\Template\FilterProvider $filterProvider,
        \Magento\Framework\View\Element\Template\Context $context
    ) {
        parent::__construct($context);
        $this->jsonHelper = $JsonHelper;
        $this->_filterProvider = $filterProvider;
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
        $content = $page->getContent();
        $wrapper = $this->_filterProvider->getPageFilter()->filter($content);
        $cmsTitle = $page->getContentHeading();
        
        $data['identities'] = $identities;
        $data['title'] = $cmsTitle;
        $data['pager'] = $wrapper;

        return $this->jsonHelper->jsonEncode($data);
    }
}