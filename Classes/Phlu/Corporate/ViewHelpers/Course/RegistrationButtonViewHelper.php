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
use Phlu\Corporate\Routing\ShortUrlRoutePartHandler;

/**
 * view helper
 */
class RegistrationButtonViewHelper extends AbstractViewHelper
{

    /**
     * @Flow\Inject
     * @var \Neos\Flow\Http\Client\CurlEngine
     */
    protected $browserRequestEngine;

    /**
     * @Flow\Inject
     * @var \Neos\Flow\Http\Client\Browser
     */
    protected $browser;

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;


    /**
     * @param string $url
     * @param string $label
     * @param string $identifier avoid cache behaviour
     * @param mixed
     * @return array
     */
    public function render($url, $identifier, $node = null, $label = 'Anmelden')
    {


        $url = str_replace("//phlu.ch","//iframe.phlu.ch",$url);
        $url = str_replace("www.phlu.ch","iframe.phlu.ch",$url);

        if (substr_count("phlu.ch",$url)) {
            $url = str_replace("http:", "https:", $url);
        }

        if (substr_count($url,"iframe.phlu.ch")) {

            $this->browser->setRequestEngine($this->browserRequestEngine);
            $response = $this->browser->request($url);

            if ($response->getStatusCode() == 200) {


                $hash = sha1($url) . rand(5, 15) . $identifier;
                $html = ' <iframe id="iframe' . $hash . '" src="' . $url . '" frameborder="0" scrolling="no" width="100%" style="display:none;width:100%"></iframe>';
                $html .= '<script>jQuery(\'#iframe' . $hash . '\').iFrameResize({checkOrigin:false, heightCalculationMethod: \'bodyScroll\'}); function iframe' . $hash . '(self) {jQuery(\'<div class="close-iframe"><a class="btn btn-primary" title="schliessen" href="#"><span class="oi oi-x"></span></a></div>\').insertBefore(self);jQuery(self).parentsUntil(\'col-md-5\').removeClass(\'col-md-5\');jQuery(self).hide();jQuery(\'#iframe' . $hash . '\').show();jQuery(\'#iframe' . $hash . '\').get(0).iFrameResizer.resize();jQuery(\'.close-iframe a\').on(\'click\',function(){$(this).parent().parent().find(\'iframe\').css({height: \'1px\',display:\'none\'});$(this).closest(\'.col-sm-12\').addClass(\'col-md-5\');$(this).parent().parent().find(\'.btn-primary\').css(\'display\',\'block\');$(this).parent().hide();$(\'html, body\').animate({scrollTop: $(self).offset().top-150}, 1000);});}</script>';
                $html .= '<a class="btn btn-primary anmeldenlink" href="javascript:void(0)" onclick="iframe' . $hash . '(this);">Anmelden</a>';
            } else {
                $url = str_replace("iframe.phlu.ch","www.phlu.ch",$url);
                $html = '<a class="btn btn-primary " href="'.$url.'">'. $label .'</a>';
            }


        } else {
            $html = '<a class="btn btn-primary " href="'.$url.'">'. $label .'</a>';
        }



        return $html;


    }

}