<?php

namespace Phlu\Corporate\Aspects;


use Neos\ContentRepository\Domain\Factory\NodeFactory;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Utility\NodeUriPathSegmentGenerator;
use org\bovigo\vfs\vfsStreamWrapperAlreadyRegisteredTestCase;
use Phlu\Evento\Service\Contact\ImportService;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;

/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class NewsAspect
{


    /**
     * @Flow\Inject
     * @var NodeFactory
     */
    protected $nodeFactory;

    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;


    /**
     * @Flow\Inject
     * @var NodeUriPathSegmentGenerator
     */
    protected $nodeUriPathSegmentGenerator;


    /**
     * @Flow\After("within(Neos\ContentRepository\Domain\Repository\NodeDataRepository) && method(public .+->(add|update)(object.nodeType.name == 'Phlu.Corporate:NewsItem'))")
     * @return void
     */
    public function update(JoinPointInterface $joinPoint)
    {


        $object = $joinPoint->getMethodArgument('object');
        /* @var \Neos\ContentRepository\Domain\Model\NodeData $object */


        if (!$object->getProperty('reference')) {
            $context = $this->nodeFactory->createContextMatchingNodeData($object);
            $detailNode = $this->nodeDataRepository->findByNodeIdentifier('4dd85a03-8c05-426f-b422-9b9f67c94072')->getFirst();
            if (!$detailNode) {
                return null;
            }
            $basenode = $this->nodeFactory->createFromNodeData($detailNode, $context);



            $detailNode = $basenode->createNode('news' . $object->getIdentifier(), $this->nodeTypeManager->getNodeType('Phlu.Corporate:Page.News'));
            $this->persistenceManager->persistAll();
            $object->setProperty('reference', $detailNode->getIdentifier());
        }

        // update detailpage
        $context = $this->nodeFactory->createContextMatchingNodeData($object);
        $detailNode = $this->nodeFactory->createFromNodeData($this->nodeDataRepository->findByNodeIdentifier($object->getProperty('reference'))->getFirst(), $context);

        if (!$detailNode) {
            return null;
        }




        $flowQuery = new FlowQuery(array($detailNode));
        $headline = $flowQuery->children('header')->find('[instanceof Phlu.Corporate:Headline]')->get(0);

        if ($headline) {
            /* @var \Neos\ContentRepository\Domain\Model\Node $headline */
            if (strlen($headline->getProperty('text'))) {
                $headline->setProperty('text', $object->getProperty('teaserHeadline'));
                $this->nodeDataRepository->update($headline->getNodeData());
            }
        }

        $text = $flowQuery->children('header')->find('[instanceof Phlu.Corporate:TextPlain]')->get(0);

        if ($text) {
            if (strlen($text->getProperty('text'))) {
                /* @var \Neos\ContentRepository\Domain\Model\Node $text */
                $text->setProperty('text', $object->getProperty('teaserText'));
                $this->nodeDataRepository->update($text->getNodeData());
            }
        }

        if ($detailNode) {

            if (strlen($object->getProperty('teaserHeadline'))) {
                $detailNode->setProperty('uriPathSegment', $this->nodeUriPathSegmentGenerator->generateUriPathSegment(null, $object->getProperty('teaserHeadline')));
            }

            $detailNode->setProperty('teaserHeadline',$object->getProperty('teaserHeadline'));
            $detailNode->setProperty('teaserText',$object->getProperty('teaserText'));
            $detailNode->setProperty('date',$object->getProperty('date'));
            $detailNode->setProperty('title',$object->getProperty('teaserHeadline'));

            $context = $this->nodeFactory->createContextMatchingNodeData($object);
            $basenode = $this->nodeFactory->createFromNodeData($object, $context);
            $flowQuery = new FlowQuery(array($basenode));
            $parentPageNode = $flowQuery->closest('[instanceof Neos.NodeTypes:Page]')->get(0);
            if ($parentPageNode) {
                $detailNode->setProperty('reference',$parentPageNode->getIdentifier());
            }


        }


    }


}
