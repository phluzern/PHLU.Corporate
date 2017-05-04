<?php
namespace Phlu\Corporate\DataSource;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\Node;
use Phlu\Neos\Models\Domain\Model\Course\Module\FurtherEducation\Course as Module;
use Phlu\Neos\Models\Domain\Model\Course\Study\FurtherEducation\Course as Study;


class FurtherEducationDataSource extends AbstractDataSource {



    /**
     * @var string
     */
    static protected $identifier = 'phlu-neos-furthereducation';


    /**
     * @Flow\Inject
     * @var \Phlu\Neos\Models\Domain\Repository\Course\Module\FurtherEducation\CourseRepository
     */
    protected $moduleCourseRepository;

    /**
     * @Flow\Inject
     * @var \Phlu\Neos\Models\Domain\Repository\Course\Study\FurtherEducation\CourseRepository
     */
    protected $studyCourseRepository;


    /**
     * @Flow\Inject
     * @var \Phlu\Neos\Models\Domain\Repository\Course\Event\FurtherEducation\CourseRepository
     */
    protected $eventCourseRepository;




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

        $data = array();


        switch ($arguments['property']) {


            case 'genre':

            foreach ($this->moduleCourseRepository->findAll() as $course) {
                /* @var Module $course */
                if (is_array($course->getGenre())) {
                    foreach ($course->getGenre() as $genre) {
                        if (is_string($genre)) {
                            $data[(string)$genre] = array('value' => (string)$genre, 'label' => $genre);
                        } else {
                            $data[(string)$genre->Id] = array('value' => (string)$genre->Id, 'label' => $genre->Name);
                        }
                    }
                }
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                if (is_array($study->getGenre())) {
                    foreach ($study->getGenre() as $genre) {
                        if (is_string($genre)) {
                            $data[(string)$genre] = array('value' => (string)$genre, 'label' => $genre);
                        } else {
                            $data[(string)$genre->Id] = array('value' => (string)$genre->Id, 'label' => $genre->Name);
                        }
                    }
                }
            }

            foreach ($this->eventCourseRepository->findAll() as $study) {
                /* @var Study $study */
                if (is_array($study->getGenre())) {
                    foreach ($study->getGenre() as $genre) {
                        if (is_string($genre)) {
                            $data[(string)$genre] = array('value' => (string)$genre, 'label' => $genre);
                        } else {
                            $data[(string)$genre->Id] = array('value' => (string)$genre->Id, 'label' => $genre->Name);
                        }
                    }
                }
            }

            break;


            case 'targetgroups':

            foreach ($this->moduleCourseRepository->findAll() as $course) {
                /* @var Module $course */
                if (is_array($course->getTargetgroups())) {
                    foreach ($course->getTargetgroups() as $targetgroup) {
                        $data[(string)$targetgroup->Bezeichnung] = array('value' => (string)$targetgroup->Bezeichnung, 'label' => $targetgroup->Bezeichnung);
                    }
                }
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                if (is_array($study->getTargetgroups())) {
                    foreach ($study->getTargetgroups() as $targetgroup) {
                        $data[(string)$targetgroup->Bezeichnung] = array('value' => (string)$targetgroup->Bezeichnung, 'label' => $targetgroup->Bezeichnung);
                    }
                }
            }
            foreach ($this->eventCourseRepository->findAll() as $study) {
                /* @var Study $study */
                if (is_array($study->getTargetgroups())) {
                    foreach ($study->getTargetgroups() as $targetgroup) {
                        $data[(string)$targetgroup->Bezeichnung] = array('value' => (string)$targetgroup->Bezeichnung, 'label' => $targetgroup->Bezeichnung);
                    }
                }
            }

            break;


            case 'nrs':

            foreach ($this->moduleCourseRepository->findAll() as $course) {
                /* @var Module $course */
                $data[(string)$course->getNr()] = array('value' => (string)$course->getNr(), 'label' => $course->getNr() . " ".$course->getTitle(),'group' => 'Kurs');
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                $data[(string)$study->getNr()] = array('value' => (string)$study->getNr(), 'label' => $study->getNr() . " ".$study->getTitle(), 'group' => 'Studiengang');
            }
            foreach ($this->eventCourseRepository->findAll() as $study) {
                /* @var Study $study */
                $data[(string)$study->getNr()] = array('value' => (string)$study->getNr(), 'label' => $study->getNr() . " ".$study->getTitle(), 'group' => 'Studiengang');
            }

            break;



            case 'ids':

            foreach ($this->moduleCourseRepository->findAll() as $course) {
                /* @var Module $course */
                $data[(string)$course->getId()] = array('value' => (string)$course->getId(), 'label' => $course->getNr() . " ".$course->getTitle(),'group' => 'Kurs');
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                $data[(string)$study->getId()] = array('value' => (string)$study->getId(), 'label' => $study->getNr() . " ".$study->getTitle(), 'group' => 'Studiengang');
            }
            foreach ($this->eventCourseRepository->findAll() as $study) {
                /* @var Study $study */
                $data[(string)$study->getId()] = array('value' => (string)$study->getId(), 'label' => $study->getNr() . " ".$study->getTitle(), 'group' => 'Studiengang');
            }


            break;




        }


        return $data;





    }




}