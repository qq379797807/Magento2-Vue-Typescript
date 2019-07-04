<?php
namespace App\Component\Block;

use Magento\Checkout\Model\Cart as CustomerCart;
class Register extends \Magento\Framework\View\Element\Template
{
    protected $urlBuilder;
    protected $formKey;
    private $_jsonHelper;
    protected $urlEncoder;

    public function __construct(
        \Magento\Framework\Json\Helper\Data $JsonHelper,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Framework\Url\EncoderInterface $urlEncoder,
        \Magento\Framework\View\Element\Template\Context $context
    )
    {
        parent::__construct($context);
        $this->urlBuilder = $context->getUrlBuilder();
        $this->urlEncoder =$urlEncoder;
        $this->formKey =$formKey;
        $this->_jsonHelper =$JsonHelper;
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

    public function getRegisterJson($version = 'pc'){
        $data =[];
        $data['country'] = $this->getAddressRegion();
        $addressHelper = $this->getObject('Magento\Customer\Helper\Address');
        $data['address_count'] = $addressHelper->getStreetLines();

        return $this->_jsonHelper->jsonEncode($data);
    }
}