<?php
namespace Pengo\Addressmx\Model;
class PengoPostcode extends \Magento\Framework\Model\AbstractModel implements PengoPostcodeInterface, \Magento\Framework\DataObject\IdentityInterface
{
    const CACHE_TAG = 'pengo_postcode';

    protected function _construct()
    {
        $this->_init('Pengo\Addressmx\Model\ResourceModel\PengoPostcode');
    }

    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }
}
