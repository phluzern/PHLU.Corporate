<?php

namespace Phlu\Corporate\Routing;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Exception\PageNotFoundException;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Request;
use Neos\Neos\Routing\FrontendNodeRoutePartHandler;
use Neos\Neos\Routing\Exception;
use Neos\Neos\Service\LinkingService;
use Phlu\Corporate\Eel\Helper\NodeHelper;
use Phlu\Corporate\Factory\ContextFactory;
use Phlu\Corporate\ViewHelpers\Uri\ResourceViewHelper;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\Flow\Mvc\ActionRequest;
use Phlu\Neos\Models\AssetRepository;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Http\Response;
use Neos\Flow\Mvc\Controller\Arguments;
use Neos\Flow\Mvc\Routing\UriBuilder;

/**
 * A route part handler for finding nodes specifically in the website's frontend.
 */
class ShortUrlRoutePartHandler extends FrontendNodeRoutePartHandler
{


    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;


    /**
     * @Flow\Inject
     * @var NodeHelper
     */
    protected $nodeHelper;


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;


    /**
     * @Flow\Inject
     * @var AssetRepository
     */
    protected $assetRepository;


    /**
     * @Flow\Inject
     * @var ResourceViewHelper
     */
    protected $resourceViewHelper;


    /**
     * Matches a frontend URI pointing to a node (for example a page).
     *
     * This function tries to find a matching node by the given request path. If one was found, its
     * absolute context node path is set in $this->value and true is returned.
     *
     * Note that this matcher does not check if access to the resolved workspace or node is allowed because at the point
     * in time the route part handler is invoked, the security framework is not yet fully initialized.
     *
     * @param string $requestPath The request path (without leading "/", relative to the current Site Node)
     * @return boolean true if the $requestPath could be matched, otherwise false
     * @throws \Exception
     * @throws Exception\NoHomepageException if no node could be found on the homepage (empty $requestPath)
     */
    protected function matchValue($requestPath)
    {


        /* TODO refactoring */
        if (substr_count($requestPath, "media/")) {
            return false;
        }


        $context = current($this->contextFactory->getInstances());
        $node = null;

        $nodes = $this->nodeDataRepository->findByProperties($requestPath, 'Phlu.Neos.NodeTypes:Shorturl', $context->getWorkspace(), $context->getDimensions());

        foreach ($nodes as $n) {


            if ($node == null && $n->hasProperty('phluNeosNodeTypesShorturl') && $n->getProperty('phluNeosNodeTypesShorturl') == $requestPath) {

                /* @var \Neos\ContentRepository\Domain\Model\Node $node */
                if ($node == null && $n->getNodeType()->isOfType("Neos.NodeTypes:Page")) {
                    /** @var NodeInterface $node */
                    $node = new Node($n, $context);
                }

                if ($node == null && $n->getNodeType()->isOfType("Phlu.Qmpilot.NodeTypes:File")) {

                    $asset = $n->getProperty('asset');

                    if ($asset && $asset->getResource()) {


                        if (is_string($asset->getResource()->getLink()) && substr($asset->getResource()->getLink(), 0, 7) === 'node://') {
                            $node = new Node($n, $context);
                            $request = new ActionRequest(new Request(array(), array(), array(), array()));
                            $controllerContext = new ControllerContext($request, new Response(), new Arguments(array()), new UriBuilder());
                            header("Location: " . $this->linkingService->resolveNodeUri($asset->getResource()->getLink(), $node, $controllerContext));
                            exit;

                        }


                        $redirectUri = $this->resourceViewHelper->render(null, null, $asset->getResource());

                        $request = new ActionRequest(new Request(array(), array(), array(), array()));
                        /** @var NodeInterface $node */
                        $nNode = new Node($n, $context);
                        $redirectUriFinal = $this->nodeHelper->getEmbeddedLink($nNode, $redirectUri, $request);

                        header("Location: " . $redirectUriFinal);
                        exit;

                    }

                }

            }

        }


        if ($node == null) {

            $nodes = $this->nodeDataRepository->findByProperties("%", 'Phlu.Qmpilot.NodeTypes:File', $context->getWorkspace(), $context->getDimensions());


            foreach ($nodes as $n) {


                if ($node == null && $n->hasProperty('asset') && $n->getProperty('asset') && $n->getProperty('asset')->getResource()) {

                    $asset = $n->getProperty('asset');


                    $uri = $this->resourceViewHelper->render(null, null, $asset->getResource());
                    $redirectUriSegments = explode("://", $uri);

                    if (isset($redirectUriSegments[1]) && ($redirectUriSegments[1] == "www.phlu.ch/" . $requestPath || $redirectUriSegments[1] == "www.phlu.ch/" . $requestPath . "/")) {
                        /** @var NodeInterface $node */
                        $node = new Node($n, $context);

                        $flowquery = new FlowQuery(array($node));
                        $documentNode = $flowquery->closest("[instanceof Neos.NodeTypes:Page]")->get(0);

                        if ($documentNode) {
                            $request = new ActionRequest(new Request(array(), array(), array(), array()));
                            $redirectUri = $this->nodeHelper->getEmbeddedLink($node, $uri, $request);
                            if ($redirectUri) {
                                header("Location: " . $redirectUri);
                                exit;
                            }
                        }

                    }
                }
            }
        }


        if ($node == null) {
            /* @var ContentContext $context */
            $node = $context->getNodeByIdentifier($requestPath);
            if ($node) {
                $query = new FlowQuery(array($node));
                $documentNode = $query->closest("[instanceof Neos.NodeTypes:Page]")->get(0);
                if ($documentNode) {
                    $node = $documentNode;
                }
            }

        }


        if ($node == null) {


            /* @var ContentContext $context */
            $asset = $this->assetRepository->findByIdentifier($requestPath);
            if (!$asset) {
                $asset = $this->assetRepository->findByIdentifier('qmpilot-objectid-' . $requestPath);
            }

            if ($asset) {

                $uri = $this->resourceViewHelper->render(null, null, $asset->getResource());

                $redirectUriSegments = explode("://", $uri);

                if (isset($redirectUriSegments[1]) && ($redirectUriSegments[1] == "www.phlu.ch/" . $requestPath || $redirectUriSegments[1] == "www.phlu.ch/" . $requestPath . "/")) {
                    /** @var NodeInterface $node */
                    $node = new Node($n, $context);

                    $flowquery = new FlowQuery(array($node));
                    $documentNode = $flowquery->closest("[instanceof Neos.NodeTypes:Page]")->get(0);

                    if ($documentNode) {
                        $request = new ActionRequest(new Request(array(), array(), array(), array()));
                        $redirectUri = $this->nodeHelper->getEmbeddedLink($node, $uri, $request);
                        if ($redirectUri) {
                            header("Location: " . $redirectUri);
                            exit;
                        }
                    }

                } else {
                    header("Location: " . $uri);
                    exit;
                }


            }
        }


        if ($node == null) {
            throw new PageNotFoundException('Page ' . $requestPath . ' was not found.', 1346950755);
            return false;
        }

        $this->value = $node->getContextPath();

        return true;

    }


}
