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
 * Portrait view helper
 */
class PortraitViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;




    /**
     * @param Node $node
     * @return array
     */
    public function render($node)
    {

        $contact = $this->controllerContext->getRequest()->getArgument('contact');
//\TYPO3\Flow\var_dump($this->t);


        $this->templateVariableContainer->add('contact',$contact);


        return $this->renderChildren();



    }

}