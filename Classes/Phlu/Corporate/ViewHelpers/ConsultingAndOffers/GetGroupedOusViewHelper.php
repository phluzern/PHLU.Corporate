<?php
namespace Phlu\Corporate\ViewHelpers\ConsultingAndOffers;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Exception;
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;


/**
 * view helper
 */
class GetGroupedOusViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;


    /**
     * @param array $nodes
     * @param string $pageIdentifier
     * @return array
     */
    public function render($nodes, $pageIdentifier)
    {


        $groups = array();
        $groupsOrdered = array();
        foreach ($nodes as $node) {
            /* @var \Neos\ContentRepository\Domain\Model\Node $node */
            foreach ($node->getProperty('ou') as $nodeIdentifier) {
                if ($nodeIdentifier == $pageIdentifier) {

                    $parent = $node->getParent();
                    while ($parent && $parent->getDepth() > 4) {
                        $parent = $parent->getParent();
                    }

                    if ($parent) {
                        $groups[$parent->getIndex()."-".$parent->getIdentifier()][$parent->getIdentifier()]['items'][] = $node;
                        $groups[$parent->getIndex()."-".$parent->getIdentifier()][$parent->getIdentifier()]['name'] = $parent->getProperty('title');
                    }



                }
            }
        }


        ksort($groups);
        foreach ($groups as $unordered) {
            foreach ($unordered as $item) {
                array_push($groupsOrdered,$item);
            }

        }


        return $groupsOrdered;


    }

}