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

class EmbeddedController extends \Neos\Neos\Controller\Frontend\NodeController
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
     * @param string $identifier of url to be embedded
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function viewAction($node, $identifier)
    {

        $flowQuery = new FlowQuery(array($node));
        $qmpilotNode = $flowQuery->find('#'.$identifier)->first()->get(0);

        if (!$qmpilotNode) {
            throw new PageNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }


        $this->view->assignMultiple(array('value' => $node));
        $this->view->setFusionPath('embedded');


    }



}
