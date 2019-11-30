<?php
namespace App\Login\Plugin;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\Cookie\PhpCookieManager;

class CustomerTokenService
{
    /**
     * @var \Magento\Customer\Model\Session
     */
    protected $customerSession;
    /**
     * @var \Magento\Framework\App\Response\RedirectInterface
     */
    protected $redirect;
    protected $cookieMetadataManager;
    protected $cookieMetadataFactory;

    public function __construct(\Magento\Customer\Model\Session $customerSession,
                                \Magento\Framework\App\Response\RedirectInterface $redirect
    )
    {
        $this->customerSession = $customerSession;
        $this->redirect = $redirect;
    }

    public function aroundRevokeCustomerAccessToken($subject,\Closure $proceed,$customerId){
        try {
            $flag = $proceed($customerId);
            if ($flag) {
                $lastCustomerId = $this->customerSession->getId();
                $this->customerSession->logout()->setBeforeAuthUrl($this->redirect->getRefererUrl())
                    ->setLastCustomerId($lastCustomerId);;
                if ($this->getCookieManager()->getCookie('mage-cache-sessid')) {
                    $metadata = $this->getCookieMetadataFactory()->createCookieMetadata();
                    $metadata->setPath('/');
                    $this->getCookieManager()->deleteCookie('mage-cache-sessid', $metadata);
                }
            }
        }catch(\Exception $e){
            throw new \Exception(__('Unable to log out. Contact your administrator.'));
        }
        return true;
    }

    private function getCookieManager()
    {
        if (!$this->cookieMetadataManager) {
            $this->cookieMetadataManager = ObjectManager::getInstance()->get(PhpCookieManager::class);
        }
        return $this->cookieMetadataManager;
    }

    private function getCookieMetadataFactory()
    {
        if (!$this->cookieMetadataFactory) {
            $this->cookieMetadataFactory = ObjectManager::getInstance()->get(CookieMetadataFactory::class);
        }
        return $this->cookieMetadataFactory;
    }
}