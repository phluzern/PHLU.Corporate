<?php

namespace PHLU\Corporate\Aspects;


use PHLU\Neos\Models\Domain\Model\Contact;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Aop\JoinPointInterface;
use TYPO3\Flow\Persistence\Doctrine\PersistenceManager;
use TYPO3\Neos\Domain\Service\SiteService;
use TYPO3\TYPO3CR\Domain\Model\NodeData;
use TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository;

/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class ContactAspect
{


    /**
     * @Flow\Inject
     * @var \TYPO3\TYPO3CR\Domain\Repository\WorkspaceRepository
     */
    protected $workspaceRepository;


    /**
     * @Flow\Inject
     * @var PersistenceManager
     */
    protected $persistenceManager;

    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;

    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $siteService;


    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;


    /**
     * @param Contact $contact
     * @throws \TYPO3\Flow\Persistence\Exception\IllegalObjectTypeException
     */
    protected function findContactNodesAndUpdate(Contact $contact)
    {



        foreach ($this->workspaceRepository->findAll() as $workspace) {
            foreach ($this->nodeDataRepository->findByParentAndNodeTypeRecursively(SiteService::SITES_ROOT_PATH, 'PHLU.Corporate:Contact', $this->workspaceRepository->findByName($workspace)->getFirst()) as $node) {
                if ($node->getProperty('contact') == $contact->getEventoid()) {
                    $this->nodeDataRepository->update($this->updateContactNode($node, $contact));
                }
            }
        }

        $contact->setHasChanges(false);
        $this->contactRepository->update($contact);


    }


    /**
     * @param NodeData $node
     * @param Contact $contact
     * @return NodeData
     */
    public function updateContactNode(NodeData $node, Contact $contact)
    {




        $node->setProperty('firstname', $contact->getName()->getFirstName());
        $node->setProperty('lastname', $contact->getName()->getLastName());
        $node->setProperty('titlename', $contact->getName()->getTitle());
        $node->setProperty('street', $contact->getStreet());
        $node->setProperty('street2', $contact->getStreetnote());
        $node->setProperty('zip', $contact->getZip());
        $node->setProperty('city', $contact->getCity());
        $node->setProperty('email', $contact->getEmail());
        $node->setProperty('phone', $contact->getPhone());
        $node->setProperty('text', $contact->getName()->getFirstName() . " " . $contact->getName()->getLastName());

        if ($node->getProperty('functionCustom') == '') {
            $node->setProperty('function', $contact->getFunction());
        } else {
            $node->setProperty('function', $node->getProperty('functionCustom'));
        }
        $node->setProperty('image', $contact->getImage());




        return $node;



    }


    /**
     * @Flow\After("method(PHLU\Neos\Models\Domain\Repository\ContactRepository->add|update())")
     * @return void
     */
    public function update(JoinPointInterface $joinPoint)
    {


        $this->findContactNodesAndUpdate($joinPoint->getMethodArgument('object'));

    }


    /**
     * @Flow\Before("method(TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository->update(object.nodeType.name == 'PHLU.Corporate:Contact'))")
     * @return void
     */
    public function updateContactNodeData(JoinPointInterface $joinPoint)
    {


        $object = $joinPoint->getMethodArgument('object');

        if ($object->getProperty('contact') != 0) {

            $contact = $this->contactRepository->getOneByEventoId($object->getProperty('contact'));

            if ($contact) {
                $this->updateContactNode($object,$contact);
            }


        }


    }


}
