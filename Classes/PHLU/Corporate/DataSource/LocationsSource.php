<?php
namespace PHLU\Corporate\DataSource;

use TYPO3\Neos\Service\DataSource\AbstractDataSource;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Eel\FlowQuery\FlowQuery;
use TYPO3\TYPO3CR\Domain\Model\Node;

class LocationsSource extends AbstractDataSource
{


    /**
     * @var string
     */
    static protected $identifier = 'phlu-neos-nodetypes-locations';


    /**
     * Get data
     *
     * @param NodeInterface $node The node that is currently edited (optional)
     * @param array $arguments Additional arguments (key / value)
     * @return array JSON serializable data
     */
    public function getData(NodeInterface $node = NULL, array $arguments)
    {


        $ous = array();

        $flowQuery = new FlowQuery(array(
            $node->getContext()->getNodeByIdentifier('58c164e4-6f08-4f22-a07e-d0cd38bd0c6f')
        ));

        $nodes = $flowQuery->find("[instanceof PHLU.Neos.NodeTypes:Page]")->get();

        foreach ($nodes as $tag) {
            /** @var Node $tag */


            $flowQueryLocation = new FlowQuery(array(
                $tag
            ));

            $locationNodes = $flowQueryLocation->find("[instanceof PHLU.Corporate:Location]")->get();

            if ($locationNodes) {

                foreach ($locationNodes as $locationNode) {
                    $group = '';
                    if ($tag->getParent() && $tag->getParent()->getProperty('title')) {
                        $group = $tag->getParent()->getProperty('title');
                    }
                    $ous[$group][$locationNode->getIdentifier()] = array('value' => $locationNode->getIdentifier(), 'label' => $tag->getProperty('title'), 'group' => $group, 'icon' => $tag->getNodeType()->getConfiguration('ui.icon'));
                }
            }
        }


        // TODO refactoring, see https://jira.neos.io/browse/NEOS-1476
        $ousfinal = array();
        foreach ($ous as $key => $val) {
            foreach ($val as $id => $v) {
                $ousfinal[(string)$id] = $v;
            }
        }


        return $ousfinal;
    }


}