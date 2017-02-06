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

use PHLU\Neos\Models\Domain\Model\Contact;
use Neos\Flow\Annotations as Flow;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\Eel\FlowQuery\FlowQuery;
use PHLU\Corporate\Factory\ContextFactory;

/**
 * Portrait view helper
 */
class ReferencesViewHelper extends AbstractViewHelper
{

    /**
     * @Flow\Inject
     * @var ContextFactory
     */
    protected $contextFactory;

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @param Contact $contact
     * @return array
     */
    public function render($contact)
    {

        $nodes = array();
        $flowQuery = new FlowQuery(array($this->contextFactory->getRootNode()));

        foreach ($flowQuery->find("[instanceof PHLU.Corporate:Contact][contact=" . $contact->getEventoid() . "]") as $reference) {

            /** @var Node $reference */


            $flowQuery = new FlowQuery(array(
                $reference
            ));

            $referenceNode = $flowQuery->closest("[instanceof PHLU.Neos.NodeTypes:Page]")->get(0);

            if ($referenceNode->getParent()) {
                if (isset($nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')]) === false) {
                    $nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')] = array();
                }
                array_push($nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')], $referenceNode);
            }


        }


        return $nodes;


    }

}