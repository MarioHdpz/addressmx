<?php
namespace Pengo\Addressmx\Controller\Ajax;

use \Magento\Framework\App\Action\Context;
use \Magento\Framework\App\Cache\TypeListInterface;
use \Magento\Framework\App\Cache\StateInterface;
use \Magento\Framework\App\Cache\Frontend\Pool;
use \Magento\Framework\View\Result\PageFactory;
use \Pengo\Addressmx\Model\PengoPostcodeFactory;
use \Magento\Framework\Controller\Result\JsonFactory;

class Data extends \Magento\Framework\App\Action\Action
{

    protected $_cacheTypeList;
    protected $_cacheState;
    protected $_cacheFrontendPool;
    protected $resultPageFactory;
    protected $postCodes;
    protected $resultJsonFactory;

    /**
     * Data constructor.
     * @param Context $context
     * @param TypeListInterface $cacheTypeList
     * @param StateInterface $cacheState
     * @param Pool $cacheFrontendPool
     * @param PageFactory $resultPageFactory
     * @param PengoPostcodeFactory $postCodes
     * @param JsonFactory $resultJsonFactory
     */
    public function __construct(
        Context $context,
        TypeListInterface $cacheTypeList,
        StateInterface $cacheState,
        Pool $cacheFrontendPool,
        PageFactory $resultPageFactory,
        PengoPostcodeFactory $postCodes,
        JsonFactory $resultJsonFactory
    ) {
        parent::__construct($context);
        $this->_cacheTypeList = $cacheTypeList;
        $this->_cacheState = $cacheState;
        $this->_cacheFrontendPool = $cacheFrontendPool;
        $this->resultPageFactory = $resultPageFactory;
        $this->postCodes = $postCodes;
        $this->resultJsonFactory = $resultJsonFactory;
    }
	
    public function execute()
    {
        $postCodes = $this->postCodes->create()->getCollection();
        $_filter = $this->getRequest()->getParam('filter');
        $postCodes->addFieldToFilter($_filter['field'], $_filter['value']);
        $json = $this->resultJsonFactory->create()->setData($postCodes->getData());
        return $json;
    }
}
