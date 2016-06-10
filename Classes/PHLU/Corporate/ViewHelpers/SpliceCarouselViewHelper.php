<?php
namespace PHLU\Corporate\ViewHelpers;

/*
 * This file is part of the TYPO3.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;


/**
 * ViewHelper to find the closest document node to a given node
 */
class SpliceCarouselViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;

    /**
     * @param array items
     * @param integer spliceNum
     * @return string
     */
    public function render($items,$spliceNum)
    {

        $data = array();
        $counter = 0;

        foreach ($items as $key => $val) {

            if ($key % $spliceNum == 0) $counter++;
            $data[$counter][] = $val;

        }

        return $data;





    }

}