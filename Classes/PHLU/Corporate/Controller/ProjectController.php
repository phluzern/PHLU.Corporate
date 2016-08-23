<?php
namespace PHLU\Corporate\Controller;

/*
 * This file is part of the PHLU.Corporate package.
 */

use PHLU\Neos\Models\Domain\Model\Project;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Domain\Repository\SiteRepository;
use TYPO3\Neos\Domain\Service\ContentContextFactory;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PHLU\Neos\Models\Domain\Model\Contact;
use TYPO3\Eel\FlowQuery\FlowQuery;
use TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository;
use TYPO3\TYPO3CR\Exception\PageNotFoundException;
use TYPO3\Neos\Domain\Model\Site;


class ProjectController extends \TYPO3\Neos\Controller\Frontend\NodeController
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


    /**
     * Shows the specified node and view project details
     *
     * @param integer $project project
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function loadAction($project)
    {


    }

    /**
     * Shows the specified node and view project details
     *
     * @param Project $project project
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function viewAction($project)
    {


        $currentSite = $this->siteRepository->findOneByNodeName('corporate');

        if ($currentSite === null) {
            $this->outputLine('Error: No site for exporting found');
            $this->quit(1);
        }

        /** @var ContentContext $contentContext */
        $contentContext = $this->createContext($currentSite, 'live', array());
        $node = new Node(
            $this->nodeDataRepository->findOneByIdentifier('fc3e89af-ca93-4f2d-ab77-a2bd698f291f', $this->workspaceRepository->findByName('live')->getFirst()),
            $contentContext);




        $this->view->assignMultiple(array('value' => $node, 'project' => $project));
        $this->view->setTypoScriptPath('project');


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
