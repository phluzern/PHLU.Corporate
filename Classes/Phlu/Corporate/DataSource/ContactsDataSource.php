<?php
namespace Phlu\Corporate\DataSource;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Phlu\Neos\Models\Domain\Repository\ContactRepository;


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

        $this->controllerContext->getResponse()->getHeaders()->setCacheControlDirective('max-age','3600');

        if (isset($arguments['property']) === false) {
            $arguments['property'] = 'default';
        }

        switch ($arguments['property']) {


            case 'organisations':

                $contacts = array();

                foreach ($this->contactRepository->findAll() as $contact) {
                    /* @var \Phlu\Neos\Models\Domain\Model\Contact $contact */
                    if (is_array($contact->getOrganisations())) {
                        foreach ($contact->getOrganisations() as $organisation) {

                            if ($organisation['OrganisationId']) {



                                $organisationPath = '';
                                $groupname = null;
                                foreach ($organisation['OrganisationPath'] as $path) {

                                        $groupname = $path['name'];

                                    if ($organisationPath != '') {
                                        $organisationPath .= " / ";
                                    }
                                    $organisationPath .= $path['name'];
                                }
                                if ($organisationPath !== '') {
                                    $organisationPath = " ($organisationPath)";
                                }

                                $contacts[(string)$organisation['OrganisationId']] = array('value' => (string)$organisation['OrganisationId'], 'group' => (string)$groupname, 'label' => (string)$organisation['OrganisationName'] . $organisationPath);

                                $lastgroup = current($organisation['OrganisationPath']);
                                reset($organisation['OrganisationPath']);
                                foreach ($organisation['OrganisationPath'] as $ogroup) {
                                    if (isset($ogroup['id'])) {
                                        $contacts[(string)$ogroup['id']] = array('value' => (string)$ogroup['id'], 'group' => (string)$lastgroup['name'], 'label' => (string)$ogroup['name']);
                                        $lastgroup = $ogroup;
                                    }
                                }


                            }
                        }
                    }


                }

                // TODO refactoring, see https://jira.neos.io/browse/NEOS-1476
                $contactsGrouped = array();
                foreach ($contacts as $key => $val) {
                    $contactsGrouped[$val['group']][$key] = $val;
                }

                $contactsGroupedFinal = array();
                foreach ($contactsGrouped as $key => $group) {
                  foreach ($group as $id => $item) {
                      $contactsGroupedFinal[$id] = $item;
                  }
                }

                return ($contactsGroupedFinal);

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