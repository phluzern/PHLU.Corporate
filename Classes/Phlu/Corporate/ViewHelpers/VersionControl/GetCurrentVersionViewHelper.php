<?php

namespace Phlu\Corporate\ViewHelpers\VersionControl;

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
/**
 * Location view helper
 */
class GetCurrentVersionViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;



    /**
     * Get version hash of current git commit
     *
     * @return string The current version/commit hast of git
     * @throws ViewHelperException
     */
    public function render()
    {
        return trim(file_get_contents('resource://Phlu.Corporate/Private/version.txt'));
    }



}