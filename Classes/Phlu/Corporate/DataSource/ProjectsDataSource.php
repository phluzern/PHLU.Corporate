<?php
namespace Phlu\Corporate\DataSource;

use Phlu\Neos\Models\Domain\Model\Project;
use Phlu\Neos\Models\Domain\Repository\ProjectRepository;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;


class ProjectsDataSource extends AbstractDataSource
{


    /**
     * @var string
     */
    static protected $identifier = 'phlu-corporate-projects';


    /**
     * @Flow\Inject
     * @var ProjectRepository
     */
    protected $projectRepository;


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

        $projects = array();

        foreach ($this->projectRepository->findAll() as $project) {
            /** @var Project $project */
            switch ($arguments['property']) {


                case 'ppdbstatuslifetime':
                    if (isset($projects[$project->getPPDBStatusLifetime()]) === false) {
                        $projects[$project->getPPDBStatusLifetime()] = array('value' => $project->getPPDBStatusLifetime(), 'label' => $project->getPPDBStatusLifetime());
                    }
                    break;

                case 'projectparticipantnames':


                    foreach ($project->getParticipants() as $participantGroupKey => $participantGroup) {

                        foreach ($participantGroup as $participant) {
                            $participant['EventoID'] = (string)$participant['EventoID'];
                            if ($participant['EventoID'] && isset($projects[$participant['EventoID']]) === false) {
                                $projects[$participant['EventoID']] = array('value' => $participant['EventoID'], 'icon' => 'icon-male', 'label' => $participant['Vorname'] . " " . $participant['Nachname'] . " (" . $participant['EventoID'] . ")");
                            }
                        }


                    }


                    break;

                case 'financingtype':

                    /** @var Project $project */
                    foreach ($project->getFinancingTypes() as $financingType) {
                        if (isset($projects[$financingType]) === false) {
                            $projects[$financingType] = array('value' => $financingType, 'label' => $financingType);
                        }

                    }

                    break;


                case 'organisations':

                    /** @var Project $project */
                    foreach ($project->getOrganisationUnits() as $organisation) {
                        if (isset($projects[$organisation['id']]) === false) {
                            $projects[$organisation['id']] = array('value' => (string)$organisation['id'], 'label' => $organisation['name']);
                        }

                    }

                    break;


                case 'researchfocustype':

                    /** @var Project $project */
                    foreach ($project->getResearchMainFocus() as $researchMainFocus) {

                        $researchMainFocus['ID'] = (string)$researchMainFocus['ID'];
                        if (isset($projects[$researchMainFocus['ID']]) === false) {
                            $projects[$researchMainFocus['ID']] = array('value' => $researchMainFocus['ID'], 'label' => $researchMainFocus['name'], 'group' => (string)$researchMainFocus['ResearchUnitName'] == '' ? (string)$researchMainFocus['name'] : (string)$researchMainFocus['ResearchUnitName']);
                        }

                    }


                    break;


                case 'researchunittype':

                    /** @var Project $project */
                    foreach ($project->getResearchUnit() as $researchUnit) {

                        if (isset($projects[$researchUnit['ID']]) === false) {
                            $projects[$researchUnit['ID']] = array('value' => $researchUnit['ID'], 'label' => $researchUnit['name']);
                        }

                    }


                    break;


            }


        }



        return $projects;





    }



}