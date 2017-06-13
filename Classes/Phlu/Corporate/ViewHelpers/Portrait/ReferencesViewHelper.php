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

use org\bovigo\vfs\vfsStreamResolveIncludePathTestCase;
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

            if ($referenceNode) {

                $orderingKey = $this->getOrdering($referenceNode);

                if (isset($references[$referenceNode->getIdentifier()]) === false && $referenceNode->getParent()) {


                    if (isset($nodes[$orderingKey]) === false) {
                        $nodes[$orderingKey] = array();
                    }

                    if (isset($nodes[$orderingKey][$referenceNode->getParent()->getNodeData()->getProperty('title')]) === false) {
                        $nodes[$orderingKey][$referenceNode->getParent()->getNodeData()->getProperty('title')] = array();
                    }

                    array_push($nodes[$orderingKey][$referenceNode->getParent()->getNodeData()->getProperty('title')], $referenceNode);
                    $references[$referenceNode->getIdentifier()] = true;
                }


            }

        }

        ksort($nodes);

        $ordered = array();

        foreach ($nodes as $orderingKey => $val) {

            if ($orderingKey < 999999) {
                foreach ($val as $k => $v) {
                    $ordered[$k] = $v;
                }
            }
        }

        return $ordered;


    }

    /*
     * @param Node $node
     * @return string
     */
    private function getOrdering($node) {

        $orderings = array();
        $orderings['Organisation und Kontakte'] = 1;
        $orderings['Institute und Forschungsgruppen'] = 2;
        $orderings['Dienstleistungszentren'] = 3;
        $orderings['Fächer und Schwerpunkte'] = 4;
        $orderings['Beratungen und Angebote'] = 5;

        $counter = 0;
        $parent = $node->getParent();
        $ordering = 999999;

        while ($counter < 50 && $parent) {



            if ($parent->hasProperty('title') && isset($orderings[$parent->getProperty('title')])) {
                $ordering = $orderings[$parent->getProperty('title')];
                break;
            }
            $parent = $parent->getParent();
            $counter++;

        }

        return $ordering;

    }

}