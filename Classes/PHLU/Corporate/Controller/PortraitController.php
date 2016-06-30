<?php
namespace PHLU\Corporate\Controller;

/*
 * This file is part of the PHLU.Corporate package.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PHLU\Neos\Models\Domain\Model\Contact;
use TYPO3\Eel\FlowQuery\FlowQuery;
use TYPO3\TYPO3CR\Exception\PageNotFoundException;

class PortraitController extends \TYPO3\Neos\Controller\Frontend\NodeController
{


    /**
     * Shows the specified node and takes visibility and access restrictions into
     * account.
     *
     * @param NodeInterface $node
     * @param Contact $contact person identifier
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function viewAction($node,$contact)
    {


        if ($node === null) {
            throw new NodeNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }
        if (!$node->getContext()->isLive() && !$this->privilegeManager->isPrivilegeTargetGranted('TYPO3.Neos:Backend.GeneralAccess')) {
            $this->redirect('index', 'Login', null, array('unauthorized' => true));
        }

        $flowQuery = new FlowQuery(array($node));

         // show only pages with containing contact nodes inside
         $flowQuery = new FlowQuery(array($node));
         if ($flowQuery->find("[instanceof PHLU.Corporate:Contact][contact=".$contact->getEventoid()."]")->count() == 0) {
           throw new PageNotFoundException('The requested node does not exist or isn\'t accessible to the current user', 1430218623);
        }

      //  \TYPO3\Flow\var_dump($this->controllerContext->getRequest()->getMainRequest());

        $this->view->assignMultiple(array('value'=>$node,'contact'=>$contact));

        $this->view->setTypoScriptPath('portrait');


    }



}
