<?php
namespace Pengo\Addressmx\Block\Adminhtml;

class Main extends \Magento\Backend\Block\Template
{
	protected $messageManager;
	protected $objectManager;
	protected $postCodes; 
	
	public function __construct(
		\Magento\Backend\Block\Template\Context $context,
		\Magento\Framework\Message\ManagerInterface $messageManager,
		\Pengo\Addressmx\Model\PengoPostcodeFactory $postCodes
	)
	{
		$this->messageManager = $messageManager;
		$this->objectManager = \Magento\Framework\App\ObjectManager::getInstance();
		$this->postCodes = $postCodes;
		parent::__construct($context);
	}

	public function _prepareLayout() {
		foreach ($_FILES as $file) {
			$data = $this->readExcell($file['tmp_name'], 1);
			#var_dump($data);die();
			foreach ($data as $_data) {
				$model = $this->postCodes->create();
				$model->setPostcode($_data['d_codigo'])
					->setClaveColonia($_data['id_asenta_cpcons'])
					->setColonia($_data['d_asenta'])
					->setClaveMunicipio($_data['c_mnpio'])
					->setMunicipio($_data['D_mnpio'])
					->setClaveCiudad(isset($_data['c_cve_ciudad']) ? $_data['c_cve_ciudad'] : '0')
					->setCiudad(isset($_data['d_ciudad']) ? $_data['d_ciudad'] : '')
					->setClaveEstado($_data['c_estado'])
					->setEstado($_data['d_estado'])
					->save();
			}
			#$this->messageManager->addSuccess($file['tmp_name']);
		}
	}

	public function getFormKey() {
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance(); 
		$FormKey = $objectManager->get('Magento\Framework\Data\Form\FormKey');
		return $FormKey->getFormKey();
	}

	private function readExcell($file, $sheet=0) {
		$file = \Sincco\Excell\IOFactory::load($file);
		$sheet = $file->getSheet($sheet);
		$columns = count($sheet->getColumnDimensions());
		$tableData = [];
		$headerData = [];
		foreach ($sheet->getRowIterator() as $row=>$data) {
			foreach ($sheet->getColumnIterator() as $column=>$data) {
				if ($row==1) {
					if (trim($sheet->getCell($column.$row)->getValue()) != '') {
						$headerData[$column] = $sheet->getCell($column.$row)->getValue();
					}
				} else {
					if (trim($sheet->getCell($column.$row)->getValue()) != '') {
						$tableData[$row][$headerData[$column]] = $sheet->getCell($column.$row)->getValue();
					}
				}
			}
		}
		return $tableData;
	}
}