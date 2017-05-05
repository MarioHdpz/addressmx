<?php
namespace Pengo\Addressmx\Model\ResourceModel\PengoPostcode;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    protected function _construct()
    {
        $this->_init('Pengo\Addressmx\Model\PengoPostcode','Pengo\Addressmx\Model\ResourceModel\PengoPostcode');
    }

    /*public function addFilterByPostcode($postcode){
        $postcode = (int)$postcode;

        $this->getSelect()
            ->from()
    }*/
}
