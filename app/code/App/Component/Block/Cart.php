<?php
namespace App\Component\Block;

class Cart extends \Magento\Framework\View\Element\Template
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

    public function getObject($className)
    {
        return \Magento\Framework\App\ObjectManager::getInstance()->get($className);
    }

    public function getAddressRegion() {
        $result = [];
        $countryHelper = $this->getObject("Magento\Directory\Api\CountryInformationAcquirerInterface");
        $countries = $countryHelper->getCountriesInfo();

        foreach ($countries as $country) {
            $regions = [];
            if ($availableRegions = $country->getAvailableRegions()) {
                foreach ($availableRegions as $region) {
                    $regionName = $region->getName();
                    if (preg_match('/Armed/',$regionName)) {
                        continue;
                    }
                    $regions[] = [
                        'code'   => $region->getId(),
                        'value' => $region->getCode(),
                        'name' => $region->getName()
                    ];
                }
            }

            $result[] = [
                'code' => strtolower($country->getId()), 
                'value'   => $country->getTwoLetterAbbreviation(),
                'name'   => (string)$country->getFullNameLocale(),
                'regions' => $regions
            ];
        }

        return $result;
    }

    public function getCartJson($version = 'pc')
    {
        $data = array();
        $shippingHelper = $this->getObject('Magento\Checkout\Block\Cart\Shipping');
        $cartConfig = $shippingHelper->getCheckoutConfig();
        $data = $cartConfig;
        $data['country'] = $this->getAddressRegion();

        return $this->_jsonHelper->jsonEncode($data);
    }
}