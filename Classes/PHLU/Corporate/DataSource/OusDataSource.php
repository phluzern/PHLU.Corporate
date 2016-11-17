<?php
namespace PHLU\Corporate\DataSource;

use TYPO3\Neos\Service\DataSource\AbstractDataSource;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Eel\FlowQuery\FlowQuery;
use TYPO3\TYPO3CR\Domain\Model\Node;

class OusDataSource extends AbstractDataSource {




    /**
     * @var string
     */
    static protected $identifier = 'phlu-neos-nodetypes-ous';



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
            $node->getContext()->getNodeByIdentifier('3903eff9-838f-45ad-8140-f2a88cb97be1'),
            $node->getContext()->getNodeByIdentifier('3a338745-b7c7-4f91-99f5-1191a94f9395')
        ));

        $nodes = $flowQuery->find("[instanceof PHLU.Neos.NodeTypes:Page]")->get();

        foreach ($nodes as $tag) {
            /** @var Node $tag*/
            $group = '';
            if ($tag->getParent() && $tag->getParent()->getProperty('title')) $group = $tag->getParent()->getProperty('title');
            $ous[$group][$tag->getIdentifier()] = array('value' => $tag->getIdentifier(), 'label' => $tag->getProperty('title'), 'group' => $group, 'icon' => $tag->getNodeType()->getConfiguration('ui.icon'));
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