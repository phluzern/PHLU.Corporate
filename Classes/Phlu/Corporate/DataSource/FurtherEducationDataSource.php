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
                        $data[$genre] = array('value' => $genre, 'label' => $genre);
                    }
                }
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                if (is_array($study->getGenre())) {
                    foreach ($study->getGenre() as $genre) {
                        $data[$genre] = array('value' => $genre, 'label' => $genre);
                    }
                }
            }

            break;


            case 'targetgroups':

            foreach ($this->moduleCourseRepository->findAll() as $course) {
                /* @var Module $course */
                if (is_array($course->getTargetgroups())) {
                    foreach ($course->getTargetgroups() as $targetgroup) {
                        $data[$targetgroup->Bezeichnung] = array('value' => $targetgroup->Bezeichnung, 'label' => $targetgroup->Bezeichnung);
                    }
                }
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                if (is_array($study->getTargetgroups())) {
                    foreach ($study->getTargetgroups() as $targetgroup) {
                        $data[$targetgroup->Bezeichnung] = array('value' => $targetgroup->Bezeichnung, 'label' => $targetgroup->Bezeichnung);
                    }
                }
            }

            break;


            case 'nrs':

            foreach ($this->moduleCourseRepository->findAll() as $course) {
                /* @var Module $course */
                $data[$course->getNr()] = array('value' => $course->getNr(), 'label' => $course->getNr() . " ".$course->getTitle());
            }

            foreach ($this->studyCourseRepository->findAll() as $study) {
                /* @var Study $study */
                $data[$course->getNr()] = array('value' => $course->getNr(), 'label' => $course->getNr() . " ".$course->getTitle());
            }

            break;


        }


        return $data;





    }




}