<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Pengo\Addressmx\Setup;

use Magento\Framework\Module\Setup\Migration;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * @codeCoverageIgnore
 */
class InstallData implements InstallDataInterface
{
	private $customerSetupFactory;

	public function __construct(\Magento\Customer\Setup\CustomerSetupFactory $customerSetupFactory, \Psr\Log\LoggerInterface $loggerInterface)
	{
		$this->customerSetupFactory = $customerSetupFactory;
	}

	public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
	{
		$eavSetup = $this->customerSetupFactory->create(['setup' => $setup]);
        $setup->startSetup();

		$eavSetup->addAttribute(
			'customer_address', 'neighborhood',
			[
				'label' => 'Neighborhood',
				'input' => 'text',
				'required' => true,
				'default' => '',
				'sort_order' => 100,
				'system' => false,
				'position' => 100,
				'user_defined' => true
			]
		);
		$attribute = $eavSetup->getEavConfig()->getAttribute('customer_address', 'neighborhood');
		$attribute->setData(
			'used_in_forms',
            ['adminhtml_customer_address', 'customer_address_edit', 'customer_register_address','customer_address']
		);
		$attribute->save();

        $eavSetup->addAttribute(
            'customer_address', 'number',
            [
                'label' => 'Ext. Number',
                'input' => 'text',
                'required' => false,
                'default' => '',
                'sort_order' => 100,
                'system' => false,
                'position' => 100,
                'user_defined' => true
            ]
        );
        $attribute = $eavSetup->getEavConfig()->getAttribute('customer_address', 'number');
        $attribute->setData(
            'used_in_forms',
            ['adminhtml_customer_address', 'customer_address_edit', 'customer_register_address','customer_address']
        );
        $attribute->save();

        $eavSetup->addAttribute(
            'customer_address', 'number_int',
            [
                'label' => 'Int. Number',
                'input' => 'text',
                'required' => false,
                'default' => '',
                'sort_order' => 100,
                'system' => false,
                'position' => 100,
                'user_defined' => true
            ]
        );
        $attribute = $eavSetup->getEavConfig()->getAttribute('customer_address', 'number_int');
        $attribute->setData(
            'used_in_forms',
            ['adminhtml_customer_address', 'customer_address_edit', 'customer_register_address','customer_address']
        );
        $attribute->save();

		$eavSetup->addAttribute(
			'customer_address', 'rfc',
			[
				'label' => 'RFC',
				'input' => 'text',
				'required' => false,
				'default' => '',
				'sort_order' => 110,
				'system' => false,
				'position' => 110,
				'user_defined' => true
			]
		);
		$attribute = $eavSetup->getEavConfig()->getAttribute('customer_address', 'rfc');
		$attribute->setData(
			'used_in_forms',
            ['adminhtml_customer_address', 'customer_address_edit', 'customer_register_address','customer_address']
		);
		$attribute->save();

		$eavSetup->addAttribute(
			'customer_address', 'business_name',
			[
				'label' => 'Business Name',
				'input' => 'text',
				'required' => false,
				'default' => '',
				'sort_order' => 120,
				'system' => false,
				'position' => 120,
				'user_defined' => true
			]
		);
		$attribute = $eavSetup->getEavConfig()->getAttribute('customer_address', 'business_name');
		$attribute->setData(
			'used_in_forms',
			['adminhtml_customer_address', 'customer_address_edit', 'customer_register_address','customer_address']
		);
		$attribute->save();

		$setup->endSetup();
	}
}
