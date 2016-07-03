<?php

namespace PHLU\Corporate\Aspects;


use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Aop\JoinPointInterface;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;
use TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository;
use TYPO3\Neos\Domain\Service\SiteService;

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
     * @Flow\Before("method(PHLU\Neos\Models\Domain\Repository\ContactRepository->update())")
     * @return void
     */
    public function findContactNodesAndUpdate(JoinPointInterface $joinPoint)
    {

        $object = $joinPoint->getMethodArgument('object');
        $object->setHasChanges(false);
        $this->contactRepository->update($object);

        $workspace = 'live';
        foreach ($this->nodeDataRepository->findByParentAndNodeTypeRecursively(SiteService::SITES_ROOT_PATH,'PHLU.Corporate:Contact',$this->workspaceRepository->findByName($workspace)->getFirst()) as $node) {
            if ($node->getProperty('contact') == $object->getEventoid()) $this->nodeDataRepository->update($node);
        }


    }

    /**
     * @Flow\Before("method(TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository->update(object.nodeType.name == 'PHLU.Corporate:Contact'))")
     * @return void
     */
    public function updateContactNodeData(JoinPointInterface $joinPoint)
    {


        $object = $joinPoint->getMethodArgument('object');

            if ($object->getProperty('contact')) {

                $contact = $this->contactRepository->getOneByEventoId($object->getProperty('contact'));

                if ($contact) {

                    $object->setProperty('firstname', $contact->getName()->getFirstName());
                    $object->setProperty('lastname', $contact->getName()->getLastName());
                    $object->setProperty('titlename', $contact->getName()->getTitle());
                    $object->setProperty('street', $contact->getStreet());
                    $object->setProperty('street2', $contact->getStreetnote());
                    $object->setProperty('zip', $contact->getZip());
                    $object->setProperty('city', $contact->getCity());
                    $object->setProperty('email', $contact->getEmail());
                    $object->setProperty('phone', $contact->getPhone());
                    $object->setProperty('text', $contact->getName()->getFirstName() . " " . $contact->getName()->getLastName());

                    if ($object->getProperty('functionUserModified') == false) $object->setProperty('function', $contact->getFunction());
                    if ($contact->getImage()) $object->setProperty('image', $contact->getImage());

                }


        }


    }





}
