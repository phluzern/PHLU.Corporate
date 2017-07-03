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
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Routing\FrontendNodeRoutePartHandler;
use Neos\Neos\Routing\Exception;
use org\bovigo\vfs\vfsStreamWrapperAlreadyRegisteredTestCase;
use Phlu\Corporate\ViewHelpers\Uri\ResourceViewHelper;
use Phlu\Evento\Service\Course\ImportService;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;

/**
 * A route part handler for finding nodes specifically in the website's frontend.
 */
class ShortUrlRoutePartHandler extends FrontendNodeRoutePartHandler
{


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;



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
                        $redirectUri = $this->resourceViewHelper->render(null,null,$asset->getResource());
                        header("Location: ".$redirectUri);
                        exit;
                    }


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
