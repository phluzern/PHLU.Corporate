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
use Neos\Flow\Annotations as Flow;
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


        $groupes = array();
        foreach ($nodes as $node) {
            foreach ($node->getProperty('ou') as $nodeIdentifier) {
                if ($nodeIdentifier == $pageIdentifier) {
                    $groupes[$node->getParent()->getIdentifier()]['items'][] = $node;
                    $groupes[$node->getParent()->getIdentifier()]['name'] = $node->getParent()->getProperty('title');
                }
            }

        }


        return $groupes;


    }

}