<?php
namespace Pengo\Addressmx\Model\ResourceModel;

class PengoPostcode extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{ 
    protected function _construct()
    {
        $this->_init('pengo_postcode', 'postcode_id');
    }
}
 