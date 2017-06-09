<?php
namespace Phlu\Corporate\ViewHelpers\Course;

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

/**
 * view helper
 */
class RegistrationButtonViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @param string $url
     * @return array
     */
    public function render($url)
    {

        $url = str_replace("//phlu.ch","//www.iframe.phlu.ch",$url);
        $url = str_replace("www.phlu.ch","www.iframe.phlu.ch",$url);

        if (substr_count($url,"iframe.phlu.ch")) {

            $hash = sha1($url).rand(5, 15);

            $html = ' <iframe id="iframe'.$hash.'" src="'.$url.'" frameborder="0" seamless allowTransparency="true" scrolling="no" width="100%" height="500" style="display:none;padding-top:15px"></iframe>';
            $html .= '<a class="btn btn-primary " href="javascript:void(0)" onclick="jQuery(this).hide();jQuery(\'#iframe'.$hash.'\').slideDown().show()">Anmelden</a>';
            $html .= '<script>iFrameResize({checkOrigin:false}, \'#iframe'.$hash.'\')</script>';

        } else {
            $html = '<a class="btn btn-primary " href="'.$url.'">Anmelden</a>';
        }



        return $html;


    }

}