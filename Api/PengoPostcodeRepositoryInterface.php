<?php
namespace Pengo\Addressmx\Api;

use Pengo\Addressmx\Model\PengoPostcodeInterface;
use Magento\Framework\Api\SearchCriteriaInterface;

interface PengoPostcodeRepositoryInterface 
{
    public function save(PengoPostcodeInterface $page);

    public function getById($id);

    public function getList(SearchCriteriaInterface $criteria);

    public function delete(PengoPostcodeInterface $page);

    public function deleteById($id);
}
