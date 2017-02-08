<?php
namespace Phlu\Corporate\ViewHelpers\Portrait;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Phlu\Neos\Models\Domain\Model\Contact;
use Neos\Flow\Annotations as Flow;
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\Eel\FlowQuery\FlowQuery;
use Phlu\Corporate\Factory\ContextFactory;

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



        if (!$contact) {
            return null;
        }

        $nodes = array();
        $references = array();

        $flowQuery = new FlowQuery(array($this->contextFactory->getRootNode()));


        foreach ($flowQuery->find("[instanceof Phlu.Corporate:Contact][contact=" . $contact->getEventoid() . "]") as $reference) {

            /** @var Node $reference */

            $flowQuery = new FlowQuery(array(
                $reference
            ));

            $referenceNode = $flowQuery->closest("[instanceof Phlu.Neos.NodeTypes:Page]")->get(0);

            if (isset($references[$referenceNode->getIdentifier()]) === false && $referenceNode->getParent()) {
                if (isset($nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')]) === false) {
                    $nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')] = array();
                }
                array_push($nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')], $referenceNode);
                $references[$referenceNode->getIdentifier()] = true;
            }


        }



        return $nodes;


    }

}