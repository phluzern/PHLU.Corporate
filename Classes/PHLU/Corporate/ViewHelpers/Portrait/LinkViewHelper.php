<?php
namespace PHLU\Corporate\ViewHelpers\Portrait;

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
use TYPO3\Eel\FlowQuery\FlowQuery;
use TYPO3\Flow\Mvc\Routing\UriBuilder;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;

/**
 * Portrait view helper
 */
class LinkViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;

    /**
     * @Flow\Inject
     * @var UriBuilder
     */
    protected $uriBuilder;

    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;


     /**
     * @param Node $node
     * @return array
     */
    public function render($node)
    {

       $flowQuery = new FlowQuery(array($node));
       $pageNode = $flowQuery->closest("[instanceof PHLU.Corporate:Page]")->get(0);

        $contact = $this->contactRepository->getOneByEventoId($node->getProperty('contact'));

        if ($contact && $contact->getEmailPart() != '') {
         return '<a class="content-link-portrait" href="'.$this->controllerContext->getUriBuilder()->reset()->setFormat('html')->uriFor('view',array('node'=>$pageNode,'contact'=>$contact->getEmailPart()),'Portrait','PHLU.Corporate').'">'.$this->renderChildren().'</a>';
        }


       return '';


    }

}