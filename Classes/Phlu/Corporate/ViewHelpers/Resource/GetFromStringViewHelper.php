<?php
namespace Phlu\Corporate\ViewHelpers\Resource;

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
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Flow\ResourceManagement\PersistentResource;
use Neos\Flow\ResourceManagement\ResourceRepository;
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;
use Phlu\Neos\Models\Domain\Repository\ContactRepository;
use Neos\Media\Domain\Repository\AssetRepository;

/**
 * Portrait view helper
 */
class GetFromStringViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;

    /**
     * @Flow\Inject
     * @var UriBuilder
     */
    protected $uriBuilder;

    /**
     * @Flow\Inject
     * @var ResourceRepository
     */
    protected $resourceRepository;

    /**
     * @Flow\Inject
     * @var AssetRepository
     */
    protected $assetRepository;


    /**
     * @param string $resource
     * @return Resource
     */
    public function render($resource,$asset=false)
    {

        $sha1 = str_replace("resource://","",$resource);

        if ($asset === false) {
            return $this->resourceRepository->findOneBySha1($sha1);
        } else {
            return $this->assetRepository->findOneByResourceSha1($sha1);
        }




    }

}