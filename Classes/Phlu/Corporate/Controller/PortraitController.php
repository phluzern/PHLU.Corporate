<?php
namespace Phlu\Corporate\Controller;

/*
 * This file is part of the Phlu.Corporate package.
 */

use Phlu\Corporate\Factory\ContextFactory;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Repository\SiteRepository;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Phlu\Neos\Models\Domain\Model\Contact;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\ContentRepository\Exception\PageNotFoundException;
use Phlu\Corporate\ViewHelpers\Portrait\ReferencesViewHelper;

class PortraitController extends \Neos\Neos\Controller\Frontend\NodeController
{

    /**
     * @Flow\Inject
     * @var \Neos\ContentRepository\Domain\Repository\WorkspaceRepository
     */
    protected $workspaceRepository;


    /**
     * @Flow\Inject
     * @var ReferencesViewHelper
     */
    protected $referencesViewHelper;

    /**
     * @Flow\Inject
     * @var SiteRepository
     */
    protected $siteRepository;



    /**
     * @Flow\Inject
     * @var ContextFactory
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


        if ($contact->isShowPortrait() === false) {
            throw new PageNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }

        if ($node === null) {
            throw new NodeNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }
        if (!$node->getContext()->isLive() && !$this->privilegeManager->isPrivilegeTargetGranted('Neos.Neos:Backend.GeneralAccess')) {
            $this->redirect('index', 'Login', null, array('unauthorized' => true));
        }


        // show only pages with containing contact nodes inside
        $flowQuery = new FlowQuery(array($node));
        if ($flowQuery->find("[instanceof Phlu.Corporate:Contact][contact=" . $contact->getEventoid() . "]")->count() == 0) {
            throw new PageNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }


        $this->view->assignMultiple(array('value' => $node));

        $this->view->setFusionPath('portrait');


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

        if ($contact->isShowPortrait() === false) {
            throw new PageNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }

        // redirect non .html uri
        if (substr($this->controllerContext->getRequest()->getParentRequest()->getUri()->getPath(),-5,5) !== '.html') {
           $this->controllerContext->getResponse()->setHeader('Location', $this->controllerContext->getRequest()->getParentRequest()->getUri()->getPath().".html");
        }


        $node = new Node(
            $this->nodeDataRepository->findOneByIdentifier('c8192de7-7700-4c43-aff3-6fb5214efa54', $this->workspaceRepository->findByName('live')->getFirst()),
            $this->contextFactory->getContentContext());

        $this->view->assignMultiple(array('value' => $node));
        $this->view->setFusionPath('portrait');


    }


}
