<?php
namespace PHLU\Corporate\DataSource;

use Neos\Flow\Annotations as Flow;
use TYPO3\Neos\Service\DataSource\AbstractDataSource;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PHLU\Neos\Models\Domain\Repository\ContactRepository;


class ContactsDataSource extends AbstractDataSource
{


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

        if (isset($arguments['property']) === false) {
            $arguments['property'] = 'default';
        }

        switch ($arguments['property']) {


            case 'organisations':

                $contacts = array();

                foreach ($this->contactRepository->findAll() as $contact) {
                    /* @var \PHLU\Neos\Models\Domain\Model\Contact $contact */
                    if (is_array($contact->getOrganisations())) {
                        foreach ($contact->getOrganisations() as $organisation) {

                            if ($organisation['OrganisationId'] && isset($contacts[$organisation['OrganisationId']]) === false) {

                                $group = current(array_splice($organisation['OrganisationPath'], -1, 1))['name'];

                                $organisationPath = '';
                                foreach ($organisation['OrganisationPath'] as $path) {
                                    if ($organisationPath != '') {
                                        $organisationPath .= " / ";
                                    }
                                    $organisationPath .= $path['name'];
                                }
                                if ($organisationPath !== '') {
                                    $organisationPath = " ($organisationPath)";
                                }

                                $contacts[$organisation['OrganisationId']] = array('value' => $organisation['OrganisationId'], 'group' => $group, 'label' => $organisation['OrganisationName'] . $organisationPath);
                            }
                        }
                    }


                }

                return $contacts;

                break;

            default:

                $contacts = array();

                foreach ($this->contactRepository->findAllOrderedByName() as $contact) {
                    $contacts[$contact->getEventoid()] = array('value' => $contact->getEventoid(), 'label' => $contact->getName()->getLastName() . " " . $contact->getName()->getFirstName());
                }

                return $contacts;
                break;


        }


    }


}