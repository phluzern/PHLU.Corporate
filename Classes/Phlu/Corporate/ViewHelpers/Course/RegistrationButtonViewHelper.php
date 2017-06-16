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
     * @param string $identifier avoid cache behaviour
     * @return array
     */
    public function render($url, $identifier)
    {

        $url = str_replace("//phlu.ch","//www.iframe.phlu.ch",$url);
        $url = str_replace("www.phlu.ch","www.iframe.phlu.ch",$url);

        if (substr_count($url,"iframe.phlu.ch")) {

            $hash = sha1($url).rand(5, 15).$identifier;
            $html = ' <iframe id="iframe'.$hash.'" src="'.$url.'" frameborder="0" scrolling="no" width="100%" style="display:none;width:100%"></iframe>';
            $html .= '<script>jQuery(\'#iframe'.$hash.'\').iFrameResize({checkOrigin:false, heightCalculationMethod: \'documentElementOffset\'}); function iframe'.$hash.'(self) {jQuery(self).parentsUntil(\'col-md-5\').removeClass(\'col-md-5\');jQuery(self).hide();jQuery(\'#iframe'.$hash.'\').slideDown().show();jQuery(\'#iframe'.$hash.'\').get(0).iFrameResizer.resize();}</script>';
            $html .= '<a class="btn btn-primary " href="javascript:void(0)" onclick="iframe'.$hash.'(this);">Anmelden</a>';


        } else {
            $html = '<a class="btn btn-primary " href="'.$url.'">Anmelden</a>';
        }



        return $html;


    }

}