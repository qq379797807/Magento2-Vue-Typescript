<?php
namespace App\Framework\Block\Product;

class Review extends \Magento\Review\Block\Product\Review
{
    public function setTabTitle()
    {
        $title = __('Reviews');
        $this->setTitle($title);
    }
}