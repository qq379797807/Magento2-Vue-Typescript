<?php
namespace App\Component\Block;

class Page extends \Magento\Framework\View\Element\Template
{
    private $helper;
    private $_jsonHelper;
    private $_filterProvider;

    public function __construct(
        \App\Component\Helper\Data $helper,
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Cms\Model\Template\FilterProvider $filterProvider,
        \Magento\Framework\View\Element\Template\Context $context
    ) {
        parent::__construct($context);
        $this->_isScopePrivate = true;
        $this->helper = $helper;
        $this->_jsonHelper = $JsonHelper;
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

        return $this->_jsonHelper->jsonEncode($data);
    }
}