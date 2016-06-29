<?php
namespace PHLU\Corporate\DataSource;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Service\DataSource\AbstractDataSource;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;


class ContactsDataSource extends AbstractDataSource {


    /**
     * @var string
     */
    static protected $identifier = 'phlu-corporate-contacts';


    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;

    

    /**
     * Get data
     *
     * @param NodeInterface $node The node that is currently edited (optional)
     * @param array $arguments Additional arguments (key / value)
     * @return array JSON serializable data
     */
    public function getData(NodeInterface $node = NULL, array $arguments)
    {



        $contacts = array();

        foreach ($this->contactRepository->findAllOrderedByName() as $contact) {
            $contacts[$contact->getEventoid()] = array('value' => $contact->getEventoid(), 'label' => $contact->getName()->getLastName(). " ".$contact->getName()->getFirstName());
        }

        return $contacts;


    }




}