<?php
namespace Pengo\Addressmx\Controller\Address;

use \Magento\Customer\Controller\Address;
use Magento\Customer\Api\Data\RegionInterface;
use Magento\Framework\Exception\InputException;

class FormPost extends Address\FormPost
{
    /**
     * Update region data
     *
     * @param array $attributeValues
     * @return void
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    protected function updateRegionData(&$attributeValues)
    {

        $regionData = [
            RegionInterface::REGION_ID => !empty($attributeValues['region_id']) ? $attributeValues['region_id'] : null,
            RegionInterface::REGION => !empty($attributeValues['region']) ? $attributeValues['region'] : null,
            RegionInterface::REGION_CODE => !empty($attributeValues['region_code'])
                ? $attributeValues['region_code']
                : null,
        ];

        $region = $this->regionDataFactory->create();
        $this->dataObjectHelper->populateWithArray(
            $region,
            $regionData,
            '\Magento\Customer\Api\Data\RegionInterface'
        );
        $attributeValues['region'] = $region;
    }

    public function execute()
    {
        $redirectUrl = null;
        if (!$this->_formKeyValidator->validate($this->getRequest())) {
            return $this->resultRedirectFactory->create()->setPath('customer/address/');
        }
        if (!$this->getRequest()->isPost()) {
            $this->_getSession()->setAddressFormData($this->getRequest()->getPostValue());
            return $this->resultRedirectFactory->create()->setUrl(
                $this->_redirect->error($this->_buildUrl('customer/address/edit'))
            );
        }

        try {
            $address = $this->_extractAddress();
            $this->_addressRepository->save($address);
            $this->messageManager->addSuccessMessage(__('You saved the address.'));
            $url = $this->_buildUrl('customer/address/index', ['_secure' => true]);
            return $this->resultRedirectFactory->create()->setUrl($this->_redirect->success($url));
        } catch (InputException $e) {
            $this->messageManager->addErrorMessage($e->getMessage());
            foreach ($e->getErrors() as $error) {
                $this->messageManager->addErrorMessage($error->getMessage());
            }
        } catch (\Exception $e) {
            $redirectUrl = $this->_buildUrl('customer/address/index');
            $this->messageManager->addExceptionMessage($e, __('We can\'t save the address.'));
        }

        $url = $redirectUrl;
        if (!$redirectUrl) {
            $this->_getSession()->setAddressFormData($this->getRequest()->getPostValue());
            $url = $this->_buildUrl('customer/address/edit', ['id' => $this->getRequest()->getParam('id')]);
        }

        return $this->resultRedirectFactory->create()->setUrl($this->_redirect->error($url));
    }

}
