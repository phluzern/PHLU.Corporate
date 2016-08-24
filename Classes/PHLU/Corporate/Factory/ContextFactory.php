<?php
namespace PHLU\Corporate\Factory;

/*
 * This file is part of the PHLU.Corporate package.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Domain\Repository\SiteRepository;
use TYPO3\Neos\Domain\Service\ContentContextFactory;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository;
use TYPO3\Neos\Domain\Model\Site;


class ContextFactory
{

    /**
     * @Flow\Inject
     * @var \TYPO3\TYPO3CR\Domain\Repository\WorkspaceRepository
     */
    protected $workspaceRepository;



    /**
     * @Flow\Inject
     * @var SiteRepository
     */
    protected $siteRepository;



    /**
     * @Flow\Inject
     * @var ContentContextFactory
     */
    protected $contextFactory;


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;



    public function getContentContext()
    {

        $currentSite = $this->siteRepository->findOneByNodeName('corporate');
        /** @var ContentContext $contentContext */
        return $this->createContext($currentSite, 'live', array());


    }


    public function getRootNode()
    {

        $node = new Node(
            $this->nodeDataRepository->findOneByPath('/sites/corporate', $this->workspaceRepository->findByName('live')->getFirst()),
            $this->getContentContext());


        return $node;

    }


    /**
     * @param Site $currentSite
     * @param string $workspace
     * @param array dimensions
     * @return ContextInterface
     */
    protected function createContext(Site $currentSite, $workspace = 'live', $dimensions)
    {


        return $this->contextFactory->create(array(
                'workspaceName' => $workspace,
                'currentSite' => $currentSite,
                'invisibleContentShown' => true,
                'inaccessibleContentShown' => true,
                'dimensions' => $dimensions
            )

        );
    }

}
