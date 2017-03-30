<?php

namespace Phlu\Corporate\ViewHelpers\Uri;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Mvc\Routing\UriBuilder;
/**
 * Location view helper
 */
class NodeViewHelper extends \Neos\Neos\ViewHelpers\Uri\NodeViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;



    /**
     * Renders the URI.
     *
     * @param mixed $node A node object, a string node path (absolute or relative), a string node://-uri or NULL
     * @param string $format Format to use for the URL, for example "html" or "json"
     * @param boolean $absolute If set, an absolute URI is rendered
     * @param array $arguments Additional arguments to be passed to the UriBuilder (for example pagination parameters)
     * @param string $section
     * @param boolean $addQueryString If set, the current query parameters will be kept in the URI
     * @param array $argumentsToBeExcludedFromQueryString arguments to be removed from the URI. Only active if $addQueryString = TRUE
     * @param string $baseNodeName The name of the base node inside the TypoScript context to use for the ContentContext or resolving relative paths
     * @param boolean $resolveShortcuts INTERNAL Parameter - if FALSE, shortcuts are not redirected to their target. Only needed on rare backend occasions when we want to link to the shortcut itself.
     * @return string The rendered URI or NULL if no URI could be resolved for the given node
     * @throws ViewHelperException
     */
    public function render($node = null, $format = null, $absolute = false, array $arguments = array(), $section = '', $addQueryString = false, array $argumentsToBeExcludedFromQueryString = array(), $baseNodeName = 'documentNode', $resolveShortcuts = true)
    {


        $baseNode = null;
        if (!$node instanceof NodeInterface) {
            $baseNode = $this->getContextVariable($baseNodeName);
            if (is_string($node) && substr($node, 0, 7) === 'node://') {
                $node = $this->linkingService->convertUriToObject($node, $baseNode);
            }
        }


        switch ($node->getNodeType()->getName()) {


            case 'Phlu.Neos.NodeTypes:Project':


             return $this->controllerContext->getUriBuilder()->reset()->setCreateAbsoluteUri($absolute)->setFormat($format ? $format : 'html')->uriFor('load', array('project' => $node->getProperty('id'), 'title' => $this->createUriSegment($node->getProperty('title'))), 'project', 'Phlu.Corporate');



            break;

            default:

                try {
                    return $this->linkingService->createNodeUri(
                        $this->controllerContext,
                        $node,
                        $baseNode,
                        $format,
                        $absolute,
                        $arguments,
                        $section,
                        $addQueryString,
                        $argumentsToBeExcludedFromQueryString,
                        $resolveShortcuts
                    );
                } catch (NeosException $exception) {
                    $this->systemLogger->logException($exception);
                } catch (NoMatchingRouteException $exception) {
                    $this->systemLogger->logException($exception);
                }


                break;


        }


        return '';
    }


    /**
     * create uri segment from title string
     * @param string $title
     * @return string
     * @api
     */
    protected function createUriSegment($title)
    {

        return \Behat\Transliterator\Transliterator::urlize($title);

    }

}