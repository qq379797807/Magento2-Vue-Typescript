<?php
namespace App\Component\Block;

use Magento\Framework\View\Element\Template;

class Category extends \Magento\Framework\View\Element\Template
{
    protected $jsonHelper;
    // protected $categoryHelper;
    protected $request;
    protected $formKey;
    protected $repository;
    protected $_catalogData;

    public function __construct(
        Template\Context $context,
        \Magento\Framework\Json\Helper\Data $jsonHelper,
        \Magento\Framework\Data\Form\FormKey $formKey,
        // \App\Component\Helper\Category $categoryHelper,
        \Magento\Catalog\Api\CategoryRepositoryInterface $repository,
        \Magento\Catalog\Helper\Data $catalogData,
        array $data = []
    )
    {
        // $this->categoryHelper = $categoryHelper;
        $this->jsonHelper = $jsonHelper;
        $this->formKey = $formKey;
        $this->repository = $repository;
        $this->_catalogData = $catalogData;
        parent::__construct($context, $data);
    }

    public function getCategoryJson ($version='pc')
    {
        $data = [];
        $form_key = $this->formKey->getFormKey();
        $type = $this->_request->getParam('type', null);
        $id = $this->_request->getParam('id');
        $postData = $this->_request->getParams();
        $sort = [];

        $objectManger = \Magento\Framework\App\ObjectManager::getInstance();
        $viewHelper= $objectManger->create('Magento\Catalog\Block\Category\View');
        $_category = $viewHelper->getCurrentCategory();

        $data['category_image'] = $_category->getImageUrl();
        $data['category_name'] = $_category->getName();
        $data['category_description'] = $_category->getDescription();
        $data['category_contentMode'] = $viewHelper->isContentMode();
        $data['category_mixedMode'] = $viewHelper->isMixedMode();
        $data['category_cms'] = $viewHelper->getCmsBlockHtml();

        if($this->_request->getParam('product_list_order')){
            $sort['product_list_order'] = $this->_request->getParam('product_list_order');
            $sort['product_list_dir'] = $this->_request->getParam('product_list_dir')? $this->_request->getParam('product_list_dir') : 'desc';
            unset($postData['product_list_order']);
            unset($postData['product_list_dir']);
        }

        try {
            $pageType = $this->getPageType();
            $data['category_id'] = $id;
            // $data['category'] = $this->categoryHelper->getProductList($pageType, $postData, $page = 1, $pageSize = 12, $version, $sort, $keywords = '', $storeId = 0);
        } catch (\Exception $error) {
            $data['error_message'] = $error->getMessage();
        }

        $data['category_type'] = $type;
        $home = array(
            'home'=> [
                'label' => 'Home',
                'link' => $this->_storeManager->getStore()->getBaseUrl()
            ]
        );
        $path = $this->_catalogData->getBreadcrumbPath();
        $path = array_merge($home, $path);
        $data['breadcrumbs'] = $path;

        return $this->jsonHelper->jsonEncode($data);
    }
}