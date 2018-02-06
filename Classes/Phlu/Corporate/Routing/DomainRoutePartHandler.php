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

use Neos\ContentRepository\Exception\PageNotFoundException;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Request;
use Neos\Neos\Routing\FrontendNodeRoutePartHandler;
use Neos\Neos\Routing\Exception;
use Neos\Neos\Service\LinkingService;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Http\Response;
use Neos\Flow\Mvc\Controller\Arguments;
use Neos\Flow\Mvc\Routing\UriBuilder;


/**
 * A route part handler for finding nodes specifically in the website's frontend.
 */
class DomainRoutePartHandler extends FrontendNodeRoutePartHandler
{

    /**
     * @var ActionRequest
     * @Flow\Transient
     */
    protected $request;

    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;


    /**
     * @var array
     */
    protected $settings;

    /**
     * Inject the settings
     *
     * @param array $settings
     *
     * @return void
     */
    public function injectSettings(array $settings)
    {
        $this->settings = $settings;
    }


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
     *
     * @return boolean true if the $requestPath could be matched, otherwise false
     * @throws \Exception
     * @throws Exception\NoHomepageException if no node could be found on the homepage (empty $requestPath)
     */
    protected function matchValue($requestPath)
    {

        if (isset($this->settings['domainRedirection']) && isset($this->settings['domainRedirection'][$_SERVER['SERVER_NAME']]) && isset($this->settings['domainRedirection'][$_SERVER['SERVER_NAME']]['target'])) {

            try {
                /** @var NodeInterface $node */
                $node = null;
                // Build context explicitly without authorization checks because the security context isn't available yet
                // anyway and any Entity Privilege targeted on Workspace would fail at this point:
                $this->securityContext->withoutAuthorizationChecks(function () use (&$node, $requestPath) {
                    $node = $this->convertRequestPathToNode($requestPath);

                    $this->request = new ActionRequest(new Request(array(), array(), array(), array()));
                    $this->securityContext->setRequest($this->request);
                    $context = current($this->contextFactory->getInstances());
                    $controllerContext = new ControllerContext($this->request, new Response(), new Arguments(array()), new UriBuilder());
                    $target = $this->settings['domainRedirection'][$_SERVER['SERVER_NAME']]['target'];

                    if (substr($target, 0, 7) == 'node://') {
                        /** @var \Neos\Neos\Domain\Service\ContentContext $context */
                        $redirectUrl = $this->linkingService->resolveNodeUri($target, $context->getCurrentSiteNode(), $controllerContext);
                        if ($redirectUrl) {
                            header("Location: " . $redirectUrl);
                            exit;
                        } else {
                            throw new PageNotFoundException('Redirection target for page ' . $_SERVER['SERVER_NAME'] . ' was not found.', 1346950755);
                            return false;
                        }
                    }


                });
            } catch (Exception $exception) {
                throw new PageNotFoundException('Page ' . $requestPath . ' was not found.', 1346950755);
                exit;
            }


        }


        return false;

    }


}
