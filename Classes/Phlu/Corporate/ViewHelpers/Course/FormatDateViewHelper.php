<?php
namespace Phlu\Corporate\ViewHelpers\Course;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;
use Neos\ContentRepository\Domain\Model\Node;

/**
 * view helper
 */
class FormatDateViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @param string $datestring
     * @return string
     */
    public function render($datestring)
    {


        $tage = array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");

        $date = new \DateTime($datestring);

        return "<span class='day'>".$tage[$date->format("w")]."</span> <span class='date'>".$date->format("d.m.Y")."</span> <span class='hour'>".$date->format("H:i")." Uhr</span>";

    }

}