<?php
namespace PHLU\Corporate\Controller;

/*
 * This file is part of the PHLU.Corporate package.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Request;
use TYPO3\Neos\Domain\Repository\SiteRepository;
use TYPO3\Neos\Domain\Service\ContentContextFactory;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PHLU\Neos\Models\Domain\Model\Contact;
use TYPO3\Eel\FlowQuery\FlowQuery;
use TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository;
use TYPO3\TYPO3CR\Exception\PageNotFoundException;
use TYPO3\Neos\Domain\Model\Site;


class PortraitController extends \TYPO3\Neos\Controller\Frontend\NodeController
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
     * Shows the specified node and takes visibility and access restrictions into
     * account.
     *
     * @param NodeInterface $node
     * @param Contact $contact person identifier
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function viewAction($node, $contact)
    {


        if ($node === null) {
            throw new NodeNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }
        if (!$node->getContext()->isLive() && !$this->privilegeManager->isPrivilegeTargetGranted('TYPO3.Neos:Backend.GeneralAccess')) {
            $this->redirect('index', 'Login', null, array('unauthorized' => true));
        }



        // show only pages with containing contact nodes inside
        //        $flowQuery = new FlowQuery(array($node));
        //        if ($flowQuery->find("[instanceof PHLU.Corporate:Contact][contact=" . $contact->getEventoid() . "]")->count() == 0) {
        //            throw new PageNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        //        }



        $this->view->assignMultiple(array('value' => $node, 'contact' => $contact));

        $this->view->setTypoScriptPath('portrait');


    }

    /**
     * Shows the specified node and takes visibility and access restrictions into
     * account.
     *
     * @param Contact $contact person identifier
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function viewPortraitAction($contact)
    {


        // redirect non .html uri
        if (substr($this->controllerContext->getRequest()->getParentRequest()->getUri()->getPath(),-5,5) !== '.html') {
           $this->controllerContext->getResponse()->setHeader('Location', $this->controllerContext->getRequest()->getParentRequest()->getUri()->getPath().".html");
        }

        $currentSite = $this->siteRepository->findOneByNodeName('corporate');

        if ($currentSite === null) {
            $this->outputLine('Error: No site for exporting found');
            $this->quit(1);
        }

        /** @var ContentContext $contentContext */
        $contentContext = $this->createContext($currentSite, 'live', array());
        $node = new Node(
            $this->nodeDataRepository->findOneByIdentifier('c8192de7-7700-4c43-aff3-6fb5214efa54', $this->workspaceRepository->findByName('live')->getFirst()),
            $contentContext);

        $this->view->assignMultiple(array('value' => $node, 'contact' => $contact));
        $this->view->setTypoScriptPath('portrait');


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
