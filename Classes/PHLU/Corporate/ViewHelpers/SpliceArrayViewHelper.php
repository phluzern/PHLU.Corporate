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
class SpliceArrayViewHelper extends AbstractViewHelper
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
     * @param string spliceType (column,grouped)
     * @return string
     */
    public function render($items,$spliceNum,$spliceType='grouped')
    {

        $data = array();
        $counter = 0;

        switch ($spliceType) {

            case 'grouped':

                foreach ($items as $key => $val) {

                    if ($key % $spliceNum == 0) $counter++;
                    $data[$counter][] = $val;

                }

                $a = $spliceNum-1;
                for ($i=0; $i<$spliceNum;$i++) {
                    if (isset($data[$counter][$i]) == false) {
                        $data[$counter][$i] = $data[1][$a];
                        $a--;
                    }
                }

            break;


            case 'column':

                $perrow = ceil(count($items) / $spliceNum);

                $a = 0;
                foreach ($items as $key => $val) {
                    $data[$a][] = $val;
                    $counter++;
                    if ($counter >= $perrow) {
                        $a++;
                        $counter = 0;
                    }
                }


            break;


        }





        return $data;





    }

}