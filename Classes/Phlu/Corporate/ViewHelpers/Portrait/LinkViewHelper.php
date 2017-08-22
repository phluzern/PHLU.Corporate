<?php
namespace Phlu\Corporate\ViewHelpers\Portrait;

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
use Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper;
use Phlu\Neos\Models\Domain\Repository\ContactRepository;
use Neos\ContentRepository\Domain\Model\Node;

/**
 * Portrait view helper
 */
class LinkViewHelper extends AbstractViewHelper
{

    /**
     * Disable escaping of tag based ViewHelpers so that the rendered tag is not htmlspecialchar'd
     *
     * @var boolean
     */
    protected $escapeOutput = FALSE;

    /**
     * @Flow\Inject
     * @var UriBuilder
     */
    protected $uriBuilder;

    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;


    /**
     * @param Node $node
     * @return array
     */
    public function render($node, $eventoId = null, $target = "self")
    {


        if ($eventoId) {
            $contact = $this->contactRepository->getOneByEventoId($eventoId);
        } else {
            $contact = $this->contactRepository->getOneByEventoId($node->getProperty('contact'));
        }




        if ($contact) {
            if ($contact->isShowPortrait() === false) {
                return '';
            }
        }



        if ($contact && $contact->getEmailPart() != '') {

            $contactShortId = substr_count($contact->getEmail(), "@phlu.ch") ? $contact->getEmailPart() : str_replace("@", "-at-", $contact->getEmail());

            $flowQuery = new FlowQuery(array($node));
            $pageNode = $flowQuery->closest("[instanceof Phlu.Corporate:Page]")->get(0);

            if ($target === 'self' && $pageNode) {

                if ($this->renderChildren() == '') {
                    return $this->controllerContext->getUriBuilder()->reset()->setCreateAbsoluteUri(true)->setFormat('html')->uriFor('view', array('node' => $pageNode, 'contact' => $contactShortId), 'Portrait', 'Phlu.Corporate');

                } else {
                    return '<a class="content-link-portrait" href="' . $this->controllerContext->getUriBuilder()->reset()->setCreateAbsoluteUri(true)->setFormat('html')->uriFor('view', array('node' => $pageNode, 'contact' => $contactShortId), 'Portrait', 'Phlu.Corporate') . '">' . $this->renderChildren() . '</a>';
                }


            } else {
                if ($this->renderChildren() == '') {
                    return $this->controllerContext->getUriBuilder()->reset()->setCreateAbsoluteUri(true)->setFormat('html')->uriFor('viewPortrait', array('contact' => $contactShortId), 'Portrait', 'Phlu.Corporate');
                } else {
                    return '<a class="content-link-portrait" href="/' . $this->controllerContext->getUriBuilder()->reset()->setCreateAbsoluteUri(false)->setFormat('html')->uriFor('viewPortrait', array('contact' => $contactShortId), 'Portrait', 'Phlu.Corporate') . '">' . $this->renderChildren() . '</a>';
                }
            }


        }


        return '';


    }

}