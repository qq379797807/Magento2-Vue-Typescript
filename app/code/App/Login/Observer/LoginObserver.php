<?php
namespace App\Login\Observer;

use Magento\Framework\Event\Observer;

class LoginObserver implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @var \Magento\Customer\Model\Session
     */
    private $customerSession;

    /**
     * LoginObserver constructor.
     * @param \Magento\Customer\Model\Session $customerSession
     */
    public function __construct(\Magento\Customer\Model\Session $customerSession)
    {
        $this->customerSession = $customerSession;
    }

    /**
     * @param Observer $observer
     * @return void
     */
    public function execute(Observer $observer)
    {
        try {
            $customer = $observer->getEvent()->getCustomer();
            if (!$this->customerSession->getCustomerId()) {
                $this->customerSession->setCustomerDataAsLoggedIn($customer);
            }
        } catch(\Exception $e) {
            throw new \Exception(__('Can`t generate session.'));
        }
    }
}