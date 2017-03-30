<?php

namespace Phlu\Corporate\Aspects;


use Neos\ContentRepository\Domain\Factory\NodeFactory;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Media\Domain\Model\Adjustment\CropImageAdjustment;
use Neos\Media\Domain\Model\Image;
use Neos\Media\Domain\Model\ImageVariant;
use Neos\Neos\Utility\NodeUriPathSegmentGenerator;
use org\bovigo\vfs\vfsStreamWrapperAlreadyRegisteredTestCase;
use Phlu\Evento\Service\Contact\ImportService;
use Neos\Flow\Annotations as Flow;
use Neos\Media\TypeConverter\ImageInterfaceConverter;
use Neos\Flow\Aop\JoinPointInterface;


/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class TeaserAspect
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
    public function updateNews(JoinPointInterface $joinPoint)
    {


        $object = $joinPoint->getMethodArgument('object');
        /* @var \Neos\ContentRepository\Domain\Model\NodeData $object */

        $this->updateDetailNodePage($object, '4dd85a03-8c05-426f-b422-9b9f67c94072', 'Phlu.Corporate:Page.News');


    }

    /**
     * @Flow\After("within(Neos\ContentRepository\Domain\Repository\NodeDataRepository) && method(public .+->(add|update)(object.nodeType.name == 'Phlu.Corporate:Event'))")
     * @return void
     */
    public function updateEvent(JoinPointInterface $joinPoint)
    {


        $object = $joinPoint->getMethodArgument('object');
        /* @var \Neos\ContentRepository\Domain\Model\NodeData $object */

        $this->updateDetailNodePage($object, 'aabd211c-b235-4d5c-9413-ba1f4395cd55', 'Phlu.Corporate:Page.Event');


    }

    /**
     * @Flow\After("within(Neos\ContentRepository\Domain\Repository\NodeDataRepository) && method(public .+->(update)(object.nodeType.name == 'Phlu.Corporate:GenericTeaser'))")
     * @return void
     */
    public function updateGenericTeaser(JoinPointInterface $joinPoint)
    {


        $object = $joinPoint->getMethodArgument('object');
        /* @var \Neos\ContentRepository\Domain\Model\NodeData $object */

        $this->fetchContentFromReference($object);


    }


    /**
     * @param NodeData $nodeData
     * @return void
     */
    private function fetchContentFromReference($nodeData)
    {


        if ($nodeData->getProperty('reference')) {

            $context = $this->nodeFactory->createContextMatchingNodeData($nodeData);
            $referenceNode = $this->nodeFactory->createFromNodeData($this->nodeDataRepository->findByNodeIdentifier($nodeData->getProperty('reference'))->getFirst(), $context);

            if ($referenceNode) {

                $flowQuery = new FlowQuery(array($referenceNode));

                if ($nodeData->getNodeType()->getConfiguration('properties.teaserHeadline.defaultValue') == $nodeData->getProperty('teaserHeadline')) {
                    $headline = $flowQuery->children('header')->find('[instanceof Phlu.Corporate:Headline]')->get(0);
                    if ($headline) {
                        $nodeData->setProperty('teaserHeadline', $headline->getProperty('text'));
                    }
                }

                if ($nodeData->getNodeType()->getConfiguration('properties.teaserText.defaultValue') == $nodeData->getProperty('teaserText')) {
                    $text = $flowQuery->children('header')->find('[instanceof Phlu.Corporate:TextPlain]')->get(0);
                    if ($text) {
                        $nodeData->setProperty('teaserText', $text->getProperty('text'));
                    }
                }

                if ($nodeData->getNodeType()->getConfiguration('properties.teaserImage.defaultValue') == $nodeData->getProperty('teaserImage') && $nodeData->getProperty('wasfetchedonce') !== true) {
                    $image = $flowQuery->find('[instanceof Phlu.Corporate:Image]')->get(0);
                    if ($image) {
                        $image = $image->getProperty('image');

                        if ($image instanceof Image) {
                            /* @var Image $image */
                            $adjustment = new CropImageAdjustment();
                            $adjustment->setHeight(912);
                            $adjustment->setWidth(1372);
                            $adjustment->setX(0);
                            $adjustment->setY(0);
                            $imageVariant = new ImageVariant($image);
                            $imageVariant->addAdjustment($adjustment);
                            $nodeData->setProperty('teaserImage', $imageVariant);
                            $nodeData->setProperty('wasfetchedonce',true);
                        }

                    }
                }


            }


        }


    }


    /**
     * @param NodeData $nodeData
     * @param string $detailNodeIdentitifier DetailNodeIdentitifier
     * @param string $detailNodeTypeName DetailNodeTypeName
     * @return void
     */
    private function updateDetailNodePage($nodeData, $detailNodeIdentitifier, $detailNodeTypeName)
    {

        $object = $nodeData;


        if (!$object->getProperty('reference')) {
            $context = $this->nodeFactory->createContextMatchingNodeData($object);
            $detailNode = $this->nodeDataRepository->findByNodeIdentifier($detailNodeIdentitifier)->getFirst();
            if (!$detailNode) {
                return null;
            }
            $basenode = $this->nodeFactory->createFromNodeData($detailNode, $context);

            $detailNode = $basenode->createNode('news' . $object->getIdentifier(), $this->nodeTypeManager->getNodeType($detailNodeTypeName));
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


        if ($flowQuery->children('main')->find('[instanceof Neos.Neos:Node]')->count() < 1) {

            $headline = $flowQuery->children('header')->find('[instanceof Phlu.Corporate:Headline]')->get(0);
            if ($headline) {
                /* @var \Neos\ContentRepository\Domain\Model\Node $headline */
                $headline->setProperty('text', $object->getProperty('teaserHeadline'));
                $this->nodeDataRepository->update($headline->getNodeData());
            }
            $text = $flowQuery->children('header')->find('[instanceof Phlu.Corporate:TextPlain]')->get(0);
            if ($text) {
                /* @var \Neos\ContentRepository\Domain\Model\Node $text */
                $text->setProperty('text', $object->getProperty('teaserText'));
                $this->nodeDataRepository->update($text->getNodeData());
            }


        }

        if ($detailNode) {

            if (strlen($object->getProperty('teaserHeadline'))) {
                $detailNode->setProperty('uriPathSegment', $this->nodeUriPathSegmentGenerator->generateUriPathSegment(null, $object->getProperty('teaserHeadline')));
            }

            $detailNode->setProperty('teaserHeadline', $object->getProperty('teaserHeadline'));
            $detailNode->setProperty('teaserText', $object->getProperty('teaserText'));
            if ($object->getProperty('date')) $detailNode->setProperty('date', $object->getProperty('date'));
            if ($object->getProperty('time')) $detailNode->setProperty('time', $object->getProperty('time'));
            if ($object->getProperty('location')) $detailNode->setProperty('location', $object->getProperty('location'));
            $detailNode->setProperty('title', $object->getProperty('teaserHeadline'));


            $context = $this->nodeFactory->createContextMatchingNodeData($object);
            $basenode = $this->nodeFactory->createFromNodeData($object, $context);
            $flowQuery = new FlowQuery(array($basenode));
            $parentPageNode = $flowQuery->closest('[instanceof Neos.NodeTypes:Page]')->get(0);
            if ($parentPageNode) {
                $detailNode->setProperty('reference', $parentPageNode->getIdentifier());
            }
            $this->nodeDataRepository->update($detailNode->getNodeData());


        }


    }


}
