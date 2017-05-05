<?php

/**
 * Pengo
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Pengo.com license that is
 * available through the world-wide-web at this URL:
 * http://www.pengostores.com/
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Pengo
 * @package     Pengo_Addressmx
 * @author      @deivanmiranda
 * @license     http://www.pengostores.com/
 */

namespace Pengo\Addressmx\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

use Magento\Eav\Model\Config;


class InstallSchema implements InstallSchemaInterface
{

    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;

        $installer->startSetup();

		$installer->getConnection()->dropTable($installer->getTable('pengo_postcode'));
		$table = $installer->getConnection()->newTable(
			$installer->getTable('pengo_postcode')
		)->addColumn(
			'postcode_id',
			\Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
			10,
			['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true],
			'Postcode ID'
		)->addColumn(
			'postcode',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			6,
			['nullable' => false, 'default' => ''],
			'Postcode'
		)->addColumn(
			'clave_colonia',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			6,
			['nullable' => false, 'default' => ''],
			'Clave Colonia'
		)->addColumn(
			'colonia',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			255,
			['nullable' => false, 'default' => ''],
			'Colonia'
		)->addColumn(
			'clave_municipio',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			6,
			['nullable' => false, 'default' => ''],
			'Clave Municipio'
		)->addColumn(
			'municipio',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			255,
			['nullable' => false, 'default' => ''],
			'Municipio'
		)->addColumn(
			'clave_ciudad',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			6,
			['nullable' => false, 'default' => ''],
			'Clave Ciudad'
		)->addColumn(
			'ciudad',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			255,
			['nullable' => false, 'default' => ''],
			'Ciudad'
		)->addColumn(
			'clave_estado',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			6,
			['nullable' => false, 'default' => ''],
			'Clave Estado'
		)->addColumn(
			'estado',
			\Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
			255,
			['nullable' => false, 'default' => ''],
			'Estado'
		);
		$installer->getConnection()->createTable($table);
		$installer->endSetup();
	}
}