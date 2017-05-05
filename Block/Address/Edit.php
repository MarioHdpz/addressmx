<?php

/**
 */
namespace Pengo\Addressmx\Block\Address;

use \Magento\Framework\View\Element\Template\Context;
use \Magento\Directory\Helper\Data;
use \Magento\Framework\Json\EncoderInterface;
use \Magento\Framework\App\Cache\Type\Config;
use \Magento\Directory\Model\ResourceModel\Region\CollectionFactory as RegionCollectionFactory;
use \Magento\Directory\Model\ResourceModel\Country\CollectionFactory as CountryCollectionFactory;
use \Magento\Customer\Model\Session;
use \Magento\Customer\Api\AddressRepositoryInterface;
use \Magento\Customer\Api\Data\AddressInterfaceFactory;
use \Magento\Customer\Helper\Session\CurrentCustomer;
use \Magento\Framework\Api\DataObjectHelper;
use Pengo\Addressmx\Model\ResourceModel\PengoPostcode\Collection as PengoPostcodeCollection;

class Edit extends \Magento\Customer\Block\Address\Edit
{

    public function __construct(
        PengoPostcodeCollection $postcode_collection,
        Context $context,
        Data $directoryHelper,
        EncoderInterface $jsonEncoder,
        Config $configCacheType,
        RegionCollectionFactory $regionCollectionFactory,
        CountryCollectionFactory $countryCollectionFactory,
        Session $customerSession,
        AddressRepositoryInterface $addressRepository,
        AddressInterfaceFactory $addressDataFactory,
        CurrentCustomer $currentCustomer,
        DataObjectHelper $dataObjectHelper,
        array $data = []
    )
    {
        parent::__construct($context, $directoryHelper, $jsonEncoder, $configCacheType, $regionCollectionFactory, $countryCollectionFactory, $customerSession, $addressRepository, $addressDataFactory, $currentCustomer, $dataObjectHelper, $data);
    }

    /**
     * Return the Url for saving.
     *
     * @return string
     */
    public function getSaveUrl()
    {
        return $this->_urlBuilder->getUrl(
            'addressmx/address/formPost',
            ['_secure' => true, 'id' => $this->getAddress()->getId()]
        );
    }
}