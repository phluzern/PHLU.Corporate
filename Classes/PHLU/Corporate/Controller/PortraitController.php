<?php
namespace PHLU\Corporate\Controller;

/*
 * This file is part of the PHLU.Corporate package.
 */

use TYPO3\Flow\Annotations as Flow;

class PortraitController extends \TYPO3\Flow\Mvc\Controller\ActionController
{

    /**
     * @return void
     */
    public function viewAction()
    {
        $this->view->assign('foos', array(
            'bar', 'baz'
        ));
    }

}
