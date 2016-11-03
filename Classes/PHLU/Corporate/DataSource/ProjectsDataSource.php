<?php
namespace PHLU\Corporate\DataSource;

use PHLU\Neos\Models\Domain\Model\Project;
use PHLU\Neos\Models\Domain\Repository\ProjectRepository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Service\DataSource\AbstractDataSource;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;


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
                            if ($participant['EventoID'] && isset($projects[$participant['EventoID']]) === false) {
                                $projects[$participant['EventoID']] = array('value' => $participant['EventoID'], 'group' => $participantGroupKey, 'icon' => 'icon-male', 'label' => $participant['Vorname'] . " " . $participant['Nachname'] . " (" . $participant['EventoID'] . ")");
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


                case 'researchfocustype':

                    /** @var Project $project */
                    foreach ($project->getResearchMainFocus() as $researchMainFocus) {
                        if (isset($projects[$researchMainFocus]) === false) {
                            $projects[$researchMainFocus] = array('value' => $researchMainFocus, 'label' => $researchMainFocus);
                        }

                    }


                    break;


            }


        }

        return $projects;


    }


}