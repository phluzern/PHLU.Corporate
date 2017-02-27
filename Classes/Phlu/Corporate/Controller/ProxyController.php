<?php
namespace Phlu\Corporate\Controller;

/*
 * This file is part of the Phlu.Corporate package.
 */

use Phlu\Corporate\Factory\ContextFactory;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Repository\SiteRepository;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Phlu\Neos\Models\Domain\Model\Contact;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;
use Neos\ContentRepository\Exception\PageNotFoundException;
use Phlu\Corporate\ViewHelpers\Portrait\ReferencesViewHelper;

class ProxyController extends \Neos\Neos\Controller\Frontend\NodeController
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
     * Get proxy result
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function getAction()
    {



        // import asset from url
        $headers = array(
            "Cache-Control: max-age=36000",
        );

        $this->browserRequestEngine->setOption(CURLOPT_HTTPHEADER, $headers);
        $this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYPEER, FALSE);
        $this->browserRequestEngine->setOption(CURLOPT_CONNECTTIMEOUT, 60);
        $this->browserRequestEngine->setOption(CURLOPT_TIMEOUT, 60);
        $this->browserRequestEngine->setOption(CURLOPT_TIMEOUT, 60);
        $this->browserRequestEngine->setOption(CURLOPT_FRESH_CONNECT, TRUE);
        $this->browserRequestEngine->setOption(CURLOPT_FRESH_CONNECT, TRUE);
        $this->browser->setRequestEngine($this->browserRequestEngine);


        $data = $this->browser->request($_GET['url'], 'GET');


        return $data;

    }


}
