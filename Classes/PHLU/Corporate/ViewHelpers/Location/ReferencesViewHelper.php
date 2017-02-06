<?php
namespace PHLU\Corporate\ViewHelpers\Location;

/*
 * This file is part of the TYPO3.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\Eel\FlowQuery\FlowQuery;

/**
 * Location view helper
 */
class ReferencesViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @param Node $node
     * @param array $references
     * @return array
     */
    public function render($node, $references)
    {

        $nodes = array();


        foreach ($references as $reference) {
            /** @var Node $reference */
            if ($reference->getProperty('locationReference') && $node->getIdentifier() === $reference->getProperty('locationReference')->getIdentifier()) {

                $flowQuery = new FlowQuery(array(
                    $reference
                ));

                $referenceNode = $flowQuery->closest("[instanceof PHLU.Neos.NodeTypes:Page]")->get(0);

                if ($referenceNode->getParent()) {
                    if (isset($nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')]) === false) {
                        $nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')] = array();
                    }
                    array_push($nodes[$referenceNode->getParent()->getNodeData()->getProperty('title')],$referenceNode);
                }



            }
        }

        return $nodes;


    }

}