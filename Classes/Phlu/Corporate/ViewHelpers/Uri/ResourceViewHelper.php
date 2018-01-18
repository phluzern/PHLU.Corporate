<?php

namespace Phlu\Corporate\ViewHelpers\Uri;

/*
 * This file is part of the Neos.FluidAdaptor package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Service;
use Neos\Flow\ResourceManagement\Exception;
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Flow\ResourceManagement\PersistentResource;
use Neos\FluidAdaptor\Core\ViewHelper\Exception\InvalidVariableException;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;

/**
 * A view helper for creating URIs to resources.
 *
 * @api
 */
class ResourceViewHelper extends \Neos\FluidAdaptor\ViewHelpers\Uri\ResourceViewHelper
{


    /**
     * @Flow\Inject
     * @var \Neos\Flow\Configuration\ConfigurationManager
     */
    protected $configurationManager;

    /**
     * Render the URI to the resource. The filename is used from child content.
     * @return string The absolute URI to the resource
     * @throws InvalidVariableException
     * @api
     */
    public function render()
    {


        if ($this->renderingContext) {
            return self::renderNow($this->arguments, $this->buildRenderChildrenClosure(), $this->renderingContext);
        } else {
            return '';
        }
    }

    /**
     * @param $resource
     *
     * @return bool|string
     * @throws \Neos\Flow\Configuration\Exception\InvalidConfigurationTypeException
     * @throws \Neos\FluidAdaptor\Core\ViewHelper\Exception\InvalidVariableException
     */
    public function renderResource($resource)
    {

        $this->arguments['resource'] = $resource;
        return self::renderNow($this->arguments, $this->buildRenderChildrenClosure());

    }


    /**
     * @param array    $arguments
     * @param \Closure $renderChildrenClosure
     *
     * @return bool|string
     * @throws \Neos\Flow\Configuration\Exception\InvalidConfigurationTypeException
     * @throws \Neos\FluidAdaptor\Core\ViewHelper\Exception\InvalidVariableException
     */
    public function renderNow(array $arguments, \Closure $renderChildrenClosure)
    {


        if ($arguments['resource'] !== null) {
            $uri = $this->resourceManager->getPublicPersistentResourceUri($arguments['resource']);
            if ($uri === false) {
                $uri = '404-Resource-Not-Found';
            }
        } else {

            // redirect shortcuts
            if ($arguments['resource'] && 'application/x-ms-shortcut' == $arguments['resource']->getMediaType()) {
                return file_get_contents("resource://" . $arguments['resource']->getSha1());
            }


            if ($arguments['path'] === null) {
                throw new InvalidVariableException('The ResourceViewHelper did neither contain a valuable "resource" nor "path" argument.', 1353512742);
            }
            if ($arguments['package'] === null) {
                $arguments['package'] = $this->controllerContext->getRequest()->getControllerPackageKey();
            }
            if (strpos($arguments['path'], 'resource://') === 0) {
                try {
                    list($arguments['package'], $arguments['path']) = $this->resourceManager->getPackageAndPathByPublicPath($arguments['path']);
                } catch (Exception $exception) {
                    throw new InvalidVariableException(sprintf('The specified path "%s" does not point to a public resource.', $arguments['path']), 1386458851);
                }
            }
            if ($arguments['localize'] === true) {
                $resourcePath = 'resource://' . $arguments['package'] . '/Public/' . $arguments['path'];
                $localizedResourcePathData = $this->i18nService->getLocalizedFilename($resourcePath);
                $matches = array();
                if (preg_match('#resource://([^/]+)/Public/(.*)#', current($localizedResourcePathData), $matches) === 1) {
                    $arguments['package'] = $matches[1];
                    $arguments['path'] = $matches[2];
                }
            }
            $uri = $this->resourceManager->getPublicPackageResourceUri($arguments['package'], $arguments['path']);
        }


        $cdn = $this->configurationManager->getConfiguration('Settings', 'Phlu.Corporate.cdn');
        if ($cdn) {
            $url = parse_url($uri);
            if (isset($url['host']) && $url['host'] == 'www.phlu.ch' && substr($url['path'], 0, 11) == '/_Resources') {
                return $cdn . $url['path'];
            }
        }


        return $uri;


    }


}
