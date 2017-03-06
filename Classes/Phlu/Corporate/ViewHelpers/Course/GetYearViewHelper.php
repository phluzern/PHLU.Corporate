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
 * Location view helper
 */
class GetYearViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @param Node $node
     * @param string $variable
     * @return array
     */
    public function render($node, $variable)
    {
        $y = null;
        $currentYear = $this->controllerContext->getRequest()->getMainRequest()->hasArgument('year') ? $this->controllerContext->getRequest()->getMainRequest()->getArgument('year') : null;



        if (is_array($node->getProperty('years'))) {
            foreach ($node->getProperty('years') as $year) {
                if (isset($year['Id']) && ($year['Id'] == $currentYear || ($year['Bookable'] && !$currentYear))) {
                    $y = $year;
                    break;
                }
            }


            if (!$y && is_array($node->getProperty('years'))) {
                $y = current($node->getProperty('years'));
            }


            if ($y && is_a($y)) {


                $y['options'] = array();
                foreach ($node->getProperty('years') as $option) {

                    $y['options'][$option['Id']] = array();
                    if ($option['Id'] == $currentYear) {
                        $y['options'][$option['Id']]['selected'] = true;
                    } else {
                        $y['options'][$option['Id']]['selected'] = false;
                    }
                    $y['options'][$option['Id']]['value'] = $option;
                    $y['options'][$option['Id']]['url'] = str_replace("weiterbildung/studiengaenge/", "weiterbildung/studiengaenge/" . $node->getProperty('internalid') . "/" . $option['Id'] . "/", $this->controllerContext->getUriBuilder()->reset()->setCreateAbsoluteUri(true)->setFormat('html')->uriFor('show', array('node' => $node), 'Frontend\Node', 'Neos.Neos'));


                }


            }

        }

        if (is_array($y)) {
            $this->templateVariableContainer->add($variable, $y);
        } else {
            $this->templateVariableContainer->add($variable, null);
        }


        return $this->renderChildren();


    }

}