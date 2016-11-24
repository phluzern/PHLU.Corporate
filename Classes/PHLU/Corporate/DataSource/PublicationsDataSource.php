<?php
namespace PHLU\Corporate\DataSource;

use PHLU\Neos\Models\Domain\Model\Publication;
use PHLU\Neos\Models\Domain\Repository\PublicationRepository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Service\DataSource\AbstractDataSource;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;


class PublicationsDataSource extends AbstractDataSource
{


    /**
     * @var string
     */
    static protected $identifier = 'phlu-corporate-publications';


    /**
     * @Flow\Inject
     * @var PublicationRepository
     */
    protected $publicationRepository;


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
            return array();
        }

        $publications = array();

        foreach ($this->publicationRepository->findAll() as $publication) {
            /** @var Publication $publication */
            switch ($arguments['property']) {

                case 'participantnames':
                    foreach ($publication->getPersons() as $participantGroupKey => $participant) {

                        $participant['EventoID'] = (string)($participant['EventoID']);

                        if ($participant['EventoID'] && isset($publications[$participant['EventoID']]) === false) {
                            $publications[$participant['EventoID']] = array('value' => $participant['EventoID'], 'icon' => 'icon-male', 'label' => $participant['Vorname'] . " " . $participant['Nachname'] . " (" . $participant['EventoID'] . ")");
                        }
                    }

                    break;

                case 'organisations':

                    foreach ($publication->getOrganisations() as $organisation) {

                        if ($organisation['OrganisationId'] && isset($publications[$organisation['OrganisationId']]) === false) {

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

                            $publications[$organisation['OrganisationId']] = array('value' => $organisation['OrganisationId'], 'group' => $group, 'label' => $organisation['OrganisationName'] . $organisationPath);
                        }
                    }


                    break;


            }


        }


        if ($arguments['property'] === 'organisations') {
            return $this->aasort($publications, 'group');
        }

        return $publications;


    }

    private function aasort(&$array, $key)
    {
        $sorter = array();
        $ret = array();

        reset($array);

        foreach ($array as $ii => $va) {
            $sorter[$ii] = $va[$key];
        }

        asort($sorter);

        foreach ($sorter as $ii => $va) {
            $ret[$ii] = $array[$ii];
        }

        $array = $ret;
        return $array;
    }

}