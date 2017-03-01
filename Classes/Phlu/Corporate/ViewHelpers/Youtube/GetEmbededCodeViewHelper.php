<?php
namespace Phlu\Corporate\ViewHelpers\Youtube;

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
class GetEmbededCodeViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;



    /**
     * @param string $url
     * @return string embeded youtube code
     */
    public function render($url)
    {


        $p = parse_url($url);

        if ($p['path'] == '/watch' && isset($p['query'])) {
            return explode("=",$p['query'])[1];
        } else {
            return substr($p['path'],1);
        }


    }

}