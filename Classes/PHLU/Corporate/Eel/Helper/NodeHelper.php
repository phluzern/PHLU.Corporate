<?php

namespace PHLU\Corporate\Eel\Helper;

use PHLU\Neos\Models\Domain\Repository\ProjectRepository;
use TYPO3\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Request;
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
     * @var ProjectRepository
     */
    protected $projectRepository;


    /**
     * @Flow\Inject
     * @var \Neos\Flow\Mvc\Routing\RouterInterface
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
     * Get project based on http request
     *
     * @param Node $node
     * @return boolean
     */
    public function getProject(Node $node)
    {

        $route = $this->router->route($this->httpRequest);
        return isset($route['project']['__identity']) ? $this->projectRepository->findByIdentifier($route['project']['__identity']) : null;

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