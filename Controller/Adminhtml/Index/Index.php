<?php
namespace Pengo\Addressmx\Controller\Adminhtml\Index;

class Index extends \Magento\Backend\App\Action
{
    protected $resultPageFactory;
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory)
    {
        $this->resultPageFactory = $resultPageFactory;        
        return parent::__construct($context);
    }
    
    public function execute()
    {
        $page = $this->resultPageFactory->create();
        $page->setActiveMenu('Pengo_Addressmx::pengo_menu_addressmx_postcodes');
        return $page;
    }    
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('ACL RULE HERE');
    }            
        
}