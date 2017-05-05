<?php
namespace Pengo\Addressmx\Block\Adminhtml;

class Grid extends \Magento\Backend\Block\Widget\Grid\Container
{
    /**
     * constructor
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_controller = 'adminhtml_index_grid';
        $this->_blockGroup = 'Pengo_Addressmx';
        $this->_headerText = __('Postcode');
        $this->_addButtonLabel = __('Create New Postcode');
        parent::_construct();
    }
}