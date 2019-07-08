<?php
namespace App\Component\Block;

class Common extends \Magento\Framework\View\Element\Template
{   
    private $stores;
    private $checkoutsesion;
    private $helper;
    private $directoryHelper;
    private $current_store;
    private $_jsonHelper;
    protected $urlBuilder;
    protected $_storeManager;
    protected $formKey;
    protected $urlEncoder;
    protected $customerSession;
    protected $_categoryCollectionFactory;
    protected $_terms;
    protected $_minPopularity;
    protected $_maxPopularity;
    protected $_queryCollectionFactory;

    public function __construct(
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Checkout\Model\Session $checkoutsesion,
        \App\Component\Helper\Data $helper,
        \Magento\Directory\Helper\Data $directoryHelper,
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\Url\EncoderInterface $urlEncoder,
        \Magento\Search\Model\ResourceModel\Query\CollectionFactory $queryCollectionFactory,
        \Magento\Framework\View\Element\Template\Context $context
    )
    {
        parent::__construct($context);
        $this->_isScopePrivate = true;
        $this->urlBuilder = $context->getUrlBuilder();
        $this->helper = $helper;
        $this->directoryHelper = $directoryHelper;
        $this->urlEncoder = $urlEncoder;
        $this->formKey = $formKey;
        $this->_jsonHelper = $JsonHelper;
        $this->customerSession = $customerSession;
        $this->checkoutsesion = $checkoutsesion;
        $this->_queryCollectionFactory = $queryCollectionFactory;
        $this->_storeManager = $context->getStoreManager();
    }

    public function createObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->create($className);
    }

    public function getCurrentStore()
    {
        if ($this->current_store) {
            return $this->current_store;
        }

        $this->current_store = $this->_storeManager->getStore();
        return $this->current_store;
    }

    public function getCustomerSession()
    {
        return $this->customerSession;
    }

    public function getCheckoutSession()
    {
        return $this->checkoutsesion;
    }

    public function getStores()
    {
        if ($this->stores) {
            return $this->stores;
        }
        $this->stores = $this->_storeManager->getStores();
        return $this->stores;
    }

    public function getStoresSubCategories()
    {
        $categoryHelper = $this->createObject('Magento\Catalog\Helper\Category');
        $categories = $categoryHelper ->getStoreCategories($sorted = false, $asCollection = false, $toLoad = true);
        $arr = array();
        foreach ($categories as $category) {
            $loadCategory = $this->createObject('Magento\Catalog\Model\Category')->load($category->getId());
            $subCategories = $loadCategory->getChildrenCategories();
            $subArr = array();

            foreach ($subCategories as $subCategory) {
                if (!$subCategory->getIsActive()) { 
                    continue;
                }
                
                $sub_category_code = [
                    'id' => $subCategory->getId(),
                    'name' => $subCategory->getName(),
                    'url' => $categoryHelper->getCategoryUrl($subCategory)
                ];

                $subArr[] = $sub_category_code;
            }
            
            $category_code = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'url' => $categoryHelper->getCategoryUrl($category),
                'sub_category' => $subArr
            ];
            
            $arr[] = $category_code;
        }

        return $arr;
    }

    public function getConfigData($path)
    {
        return $this->getCurrentStore()->getConfig($path);
    }

    public function getCommonJson($version = 'pc')
    {
        $data = array();
        $stores = $this->getStores();
        $current_store = $this->getCurrentStore();
        $objectManger = \Magento\Framework\App\ObjectManager::getInstance();
        $storeArr = array();
        $refer = $this->urlEncoder->encode($this->urlBuilder->getCurrentUrl());
        $form_key = $this->formKey->getFormKey();
        $data['form_key'] = $form_key;

        $cookieHelper = $this->createObject('Magento\Framework\View\Element\Js\Cookie');
        $data['cookie'] = [
            'expires' => null,
            'path' => $cookieHelper->getPath(),
            'domain' =>  $cookieHelper->getDomain(),
            'secure' =>  false,
            'lifetime' =>  $cookieHelper->getLifetime() 
        ];
        
        $pageCacheHelper = $this->createObject('Magento\PageCache\Block\Javascript');
        $pageCache = $pageCacheHelper->getScriptOptions();
        $data['pageCache'] = $this->_jsonHelper->jsonDecode($pageCache);

        $storeCode = $current_store->getCode();;
        $data['store_code'] = $storeCode;
        $data['country_id'] = $this->directoryHelper->getDefaultCountry($storeCode);

        foreach ($stores as $store) {
            $ret = $store->getData();
            $ret['value'] = $ret['code'];
            $ret['url'] = $this->urlBuilder->getUrl("stores/store/switch", array('___store' => $ret['code'], 'form_key' => $form_key, 'uenc' => $refer));
            $storeArr[] = $ret;
        }

        $uenc = $this->getRequest()->getParam('uenc', '');
        $data['uenc'] = $uenc;
        $data['stores'] = $storeArr;
        $data['base_url'] = $this->urlBuilder->getUrl('/');
        $data['media_path'] = $current_store->getBaseUrl('media');
        $data['img_path'] = $this->getViewFileUrl('images');
        $welcomeMsg = __("welcome to our online website")->render();
        $data['login_url'] = $this->urlBuilder->getUrl("customer/account/login", array('uenc' => $refer));
        $data['is_login'] = false;
        if ($this->getCustomerSession()->isLoggedIn()) {
            $data['is_login'] = true;
            $customer = $this->getCustomerSession()->getCustomer();
            $name = $customer->getName();
            $data['email'] = $customer->getEmail();
            $welcomeMsg = __("welcome %1,enjoy your shopping", $name)->render();
        }
        $data['welcome'] = $welcomeMsg;

        $logoObject = $objectManger->create('Magento\Theme\Block\Html\Header\Logo');
        $logo = $logoObject ->getLogoSrc();
        $data['logo']['url'] = $logo;
        $data['logo']['link'] = $this->urlBuilder->getUrl('/');
        $data['logo']['width'] = $logoObject->getLogoWidth();
        $data['logo']['height'] = $logoObject->getLogoHeight();
        $data['logo']['alt'] = $logoObject->getLogoAlt();

        $pageTitle = $objectManger->create('Magento\Theme\Block\Html\Title');
        $title = $pageTitle->getPageHeading();
        $data['title'] = $title;

        $minicartHelper = $objectManger->create('Magento\Checkout\Block\Cart\Sidebar');
        $minicart = $minicartHelper->getConfig();
        $data['minicart'] = $minicart;

        $categories = $this->getStoresSubCategories();
        $data['categories'] = $categories;

        $searchTerm = $objectManger->create('Magento\Search\Block\Term');
        if (empty($this->_terms)) {
            $this->_terms = [];
            $terms = $this->_queryCollectionFactory->create()->setPopularQueryFilter(
                $this->_storeManager->getStore()->getId()
            )->setPageSize(
                6
            )->load()->getItems();
            if (count($terms) > 0) {
                $this->_maxPopularity = reset($terms)->getPopularity();
                $this->_minPopularity = end($terms)->getPopularity();
                $range = $this->_maxPopularity - $this->_minPopularity;
                foreach ($terms as $term) {
                    if (!$term->getPopularity()) {
                        continue;
                    }

                    $term->setRatio(($term->getPopularity() - $this->_minPopularity) / $range);
                    $this->_terms['query_text'] = $term->getData('query_text');
                    $this->_terms['url'] = $searchTerm -> getSearchUrl($term);
                    $data['search_terms'][]= $this->_terms;
                }
            }

        }
        
        $recentSearch = [];
        $recent_searches = $this->_queryCollectionFactory->create()->setRecentQueryFilter(
            $this->_storeManager->getStore()->getId()
        )->setPageSize(
            6
        )->load()->getItems();
        if (count($recent_searches) > 0) {
            foreach ($recent_searches as $recent_search) {
                $recentSearch['query_text'] = $recent_search->getData('query_text');
                $recentSearch['url'] = $searchTerm -> getSearchUrl($recent_search);
                $data['recent_searches'][]= $recentSearch;
            }
        }

        $footer = $objectManger->create('Magento\Theme\Block\Html\Footer');
        $copyright = $footer ->getCopyright();
        $data['copyright'] = $copyright;
        $data['cart_qty'] = $this->getCheckoutSession()->getQuote()->getItemsSummaryQty();

        $currencyHelper = $objectManger->create('Magento\Directory\Model\PriceCurrency');
        $currentStore = $this->getCurrentStore();
        $current_currency = $currentStore->getCurrentCurrencyCode();
        $available_currency = $currentStore->getAvailableCurrencyCodes();
        $data['current_code'] = $current_currency;
        foreach ($available_currency as $item) {
            $currency = [
                'name' => $currencyHelper->getCurrencySymbol(null, $item) . ' - ' . $item,
                'value' => $item,
                'url' => $this->urlBuilder->getUrl('currency', array('currency' => $item, 'uenc' => $refer))
            ];

            $data['currency'][] = $currency;
        }

        return $this->_jsonHelper->jsonEncode($data);
    }
}