<?php

namespace Phlu\Corporate\Eel\Helper;

use Neos\ContentRepository\Domain\Service\NodeService;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Http\Response;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Neos\Domain\Model\Site;
use Neos\Neos\Service\LinkingService;
use Phlu\Neos\Models\Domain\Repository\ProjectRepository;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Request;
use Neos\ContentRepository\Domain\Factory\NodeFactory;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Phlu\Neos\Models\Domain\Repository\ContactRepository;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\Controller\Arguments;
use Neos\Flow\Core\Bootstrap;

class NodeHelper implements ProtectedContextAwareInterface
{

    /**
     * @var Bootstrap
     * @api
     */
    protected static $bootstrap;

    /**
     * @Flow\Inject
     * @var NodeFactory
     */
    protected $nodeFactory;


    /**
     * @var Request
     */
    protected $httpRequest;

    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;


    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;


    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;


    /**
     * @Flow\Inject
     * @var ProjectRepository
     */
    protected $projectRepository;


    /**
     * @Flow\Inject
     * @var \Neos\Flow\Mvc\Routing\RouterInterface
     */
    protected $router;


    /**
     * constructor.
     */
    public function __construct()
    {

        $this->httpRequest = Request::createFromEnvironment();
    }


    /**
     * Get contact based on http request
     *
     * @param Node $node
     * @return boolean
     */
    public function getContact(Node $node)
    {

        $route = $this->router->route($this->httpRequest);
        return isset($route['contact']['__identity']) ? $this->contactRepository->findByIdentifier($route['contact']['__identity']) : null;

    }

    /**
     * Get project based on http request
     *
     * @param Node $node
     * @return boolean
     */
    public function getProject(Node $node)
    {

        $route = $this->router->route($this->httpRequest);
        return isset($route['project']['__identity']) ? $this->projectRepository->findByIdentifier($route['project']['__identity']) : null;

    }

    /**
     * Get embeded url based on http request
     *
     * @param Node $node
     * @return boolean
     */
    public function getEmbedded(Node $node)
    {

        $route = $this->router->route($this->httpRequest);


        $flowQuery = new FlowQuery(array($node));
        $qmpilotNode = $flowQuery->find('#' . $route['identifier'])->first()->get(0);

        $link = $qmpilotNode->getProperty('asset')->getResource()->getLink();
        $link = str_replace("//phlu.ch","//www.iframe.phlu.ch",$link);
        $link = str_replace("www.phlu.ch","www.iframe.phlu.ch",$link);


        return array(
            'link' => $link,
            'node' => $qmpilotNode,
            'title' => $qmpilotNode->getProperty('title'),
            'teaser' => ''
        );

    }

    /**
     * Get embeded url based on http request
     *
     * @param Node $node
     * @param string $link
     * @param Request $request
     * @return boolean
     */
    public function getEmbeddedLink(Node $node, $link, $request)
    {

        $uri = parse_url($link);


        if (!$uri || isset($uri['host']) == false) {
            return $link;
        }

        if ($uri['host'] == 'www.phlu.ch' || $uri['host'] == 'phlu.ch') {

            $flowQuery = new FlowQuery(array($node));
            $documentNode = $flowQuery->closest('[instanceof Neos.NodeTypes:Page]')->get(0);


            if (!$documentNode) {
                return $link;
            }


            $controllerContext = new ControllerContext($request, new Response(), new Arguments(array()), new UriBuilder());


            /** @var ActionRequest $request */
            $request = $controllerContext->getRequest()->getMainRequest();

            $uriBuilder = clone $controllerContext->getUriBuilder();
            $uriBuilder->setRequest($request);
            $uri = $uriBuilder
                ->reset()
                ->setFormat('html')
                ->uriFor('view', array('node' => $documentNode, 'identifier' => $node->getIdentifier()), 'Embedded', 'Phlu.Corporate');

            return $uri;
        }

        return $link;

    }


    /**
     * All methods are considered safe, i.e. can be executed from within Eel
     *
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return TRUE;
    }


}