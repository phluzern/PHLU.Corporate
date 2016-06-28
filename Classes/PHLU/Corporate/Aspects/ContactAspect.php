<?php

namespace PHLU\Corporate\Aspects;


use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Aop\JoinPointInterface;
use TYPO3\TYPO3CR\Domain\Model\NodeData;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;


/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class ContactAspect
{


    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;


    /**
     * @Flow\Before("method(TYPO3\TYPO3CR\Domain\Repository\NodeDataRepository->update(object.nodeType.name == 'PHLU.Corporate:Contact'))")
     * @return void
     */
    public function updateContactNodeData(JoinPointInterface $joinPoint)
    {

        $object = $joinPoint->getMethodArgument('object');

            if ($object->getProperty('contact')) {

                $contact = $this->contactRepository->findByIdentifier($object->getProperty('contact'));
                $object->setProperty('firstname',$contact->getName()->getFirstName());
                $object->setProperty('lastname',$contact->getName()->getLastName());
                $object->setProperty('titlename',$contact->getName()->getTitle());
                $object->setProperty('street',$contact->getStreet());
                $object->setProperty('street2',$contact->getStreetnote());
                $object->setProperty('zip',$contact->getZip());
                $object->setProperty('city',$contact->getCity());
                $object->setProperty('email',$contact->getEmail());
                $object->setProperty('phone',$contact->getPhone());
                $object->setProperty('text',$contact->getName()->getFirstName()." ".$contact->getName()->getLastName());
                if ($object->getProperty('function') != $contact->getFunction()) $object->setProperty('functionUserModified',true);
                if ($object->getProperty('function') == '') $object->setProperty('functionUserModified',false);
                if ($object->getProperty('functionUserModified') == false) $object->setProperty('function',$contact->getFunction());
                if ($contact->getImage()) $object->setProperty('image',$contact->getImage());

        }


    }





}
