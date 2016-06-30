<?php

namespace PHLU\Corporate\Eel\Helper;

use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Request;
use TYPO3\TYPO3CR\Domain\Factory\NodeFactory;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;



class NodeHelper implements ProtectedContextAwareInterface
{


    /**
     * @Flow\Inject
     * @var NodeFactory
     */
    protected $nodeFactory;


    /**
     * @var Request
     */
    protected $httpRequest;


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;


    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;


    /**
     * @Flow\Inject
     * @var \TYPO3\Flow\Mvc\Routing\RouterInterface
     */
    protected $router;


    /**
     * constructor.
     */
    public function __construct()
    {


        $this->httpRequest = Request::createFromEnvironment();
    }


    /**
     * Get contact based on http request
     *
     * @param Node $node
     * @return boolean
     */
    public function getContact(Node $node)
    {

        $route = $this->router->route($this->httpRequest);
        return isset($route['contact']['__identity']) ? $this->contactRepository->findByIdentifier($route['contact']['__identity']) : null;

    }



    /**
     * All methods are considered safe, i.e. can be executed from within Eel
     *
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return TRUE;
    }


}