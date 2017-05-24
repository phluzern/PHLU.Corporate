<?php

namespace Phlu\Corporate\ViewHelpers\Asset;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Media\Domain\Repository\AssetRepository;
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;
use Neos\Flow\Annotations as Flow;

/**
 * Resource view helper
 */
class GetOneBySha1ViewHelper extends AbstractViewHelper
{

    /**
     * @Flow\Inject
     * @var AssetRepository
     */
    protected $assetRepository;

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;

    /**
     * @Flow\Inject
     * @var ResourceManager
     */
    protected $resourceManager;


    /**
     * Get one asset by sha1
     *
     * @param string $sha1 hash of resource
     * @param string $variable
     * @return string The rendered URI or NULL if no URI could be resolved for the given node
     * @throws ViewHelperException
     */
    public function render($sha1, $variable)
    {

        $asset = $this->assetRepository->findOneByResourceSha1($sha1);;
        if ($variable) {
            $this->templateVariableContainer->add($variable, $asset);
        }

        return $this->renderChildren();




    }


}