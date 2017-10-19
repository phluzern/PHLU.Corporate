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
     *
     * @param string $path The location of the resource, can be either a path relative to the Public resource directory of the package or a resource://... URI
     * @param string $package Target package key. If not set, the current package key will be used
     * @param PersistentResource $resource If specified, this resource object is used instead of the path and package information
     * @param boolean $localize Whether resource localization should be attempted or not
     * @return string The absolute URI to the resource
     * @throws InvalidVariableException
     * @api
     */
    public function render($path = null, $package = null, PersistentResource $resource = null, $localize = true)
    {


        if ($resource !== null) {
            $uri = $this->resourceManager->getPublicPersistentResourceUri($resource);
            if ($uri === false) {
                $uri = '404-Resource-Not-Found';
            }
        } else {

            // redirect shortcuts
            if ($resource && 'application/x-ms-shortcut' == $resource->getMediaType()) {
                return file_get_contents("resource://".$resource->getSha1());
            }


            if ($path === null) {
                throw new InvalidVariableException('The ResourceViewHelper did neither contain a valuable "resource" nor "path" argument.', 1353512742);
            }
            if ($package === null) {
                $package = $this->controllerContext->getRequest()->getControllerPackageKey();
            }
            if (strpos($path, 'resource://') === 0) {
                try {
                    list($package, $path) = $this->resourceManager->getPackageAndPathByPublicPath($path);
                } catch (Exception $exception) {
                    throw new InvalidVariableException(sprintf('The specified path "%s" does not point to a public resource.', $path), 1386458851);
                }
            }
            if ($localize === true) {
                $resourcePath = 'resource://' . $package . '/Public/' . $path;
                $localizedResourcePathData = $this->i18nService->getLocalizedFilename($resourcePath);
                $matches = array();
                if (preg_match('#resource://([^/]+)/Public/(.*)#', current($localizedResourcePathData), $matches) === 1) {
                    $package = $matches[1];
                    $path = $matches[2];
                }
            }
            $uri = $this->resourceManager->getPublicPackageResourceUri($package, $path);
        }


            $cdn = $this->configurationManager->getConfiguration('Settings', 'Phlu.Corporate.cdn');
            if ($cdn) {
                $url = parse_url($uri);
                if (isset($url['host']) && $url['host'] == 'www.phlu.ch' && substr($url['path'],0,11) == '/_Resources') {
                    return $cdn . $url['path'];
                }
            }


        return $uri;
    }
}
