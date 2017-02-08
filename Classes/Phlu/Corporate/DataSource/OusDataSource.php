<?php
namespace Phlu\Corporate\DataSource;

use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\Node;

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
        $ousfinal = array();

        $flowQuery = new FlowQuery(array(
            $node->getContext()->getNodeByIdentifier('3903eff9-838f-45ad-8140-f2a88cb97be1'),
            $node->getContext()->getNodeByIdentifier('3a338745-b7c7-4f91-99f5-1191a94f9395'),
            $node->getContext()->getNodeByIdentifier('7f434ec8-ad74-4032-a8fe-6842c4d3e4a1')
        ));

        if ($flowQuery->get(0) && $flowQuery->get(1) && $flowQuery->get(2)) {
            $nodes = $flowQuery->find("[instanceof Phlu.Neos.NodeTypes:Page]")->get();

            foreach ($nodes as $tag) {
                /** @var Node $tag */
                $group = '';
                if ($tag->getParent() && $tag->getParent()->getProperty('title')) $group = $tag->getParent()->getProperty('title');
                $ous[$group][$tag->getIdentifier()] = array('value' => $tag->getIdentifier(), 'label' => $tag->getProperty('title'), 'group' => $group, 'icon' => $tag->getNodeType()->getConfiguration('ui.icon'));
            }


            // TODO refactoring, see https://jira.neos.io/browse/NEOS-1476

            foreach ($ous as $key => $val) {
                foreach ($val as $id => $v) {
                    $ousfinal[(string)$id] = $v;
                }
            }


        }

        return $ousfinal;
    }




}