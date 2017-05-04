<?php
namespace Phlu\Corporate\Routing;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Exception\PageNotFoundException;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Routing\FrontendNodeRoutePartHandler;
use Neos\Neos\Routing\Exception;
use Phlu\Evento\Service\Course\ImportService;
use Phlu\Neos\Models\Domain\Repository\Course\Study\FurtherEducation\CourseRepository as StudyRepository;
use Phlu\Neos\Models\Domain\Repository\Course\Module\FurtherEducation\CourseRepository as ModuleRepository;
use Phlu\Neos\Models\Domain\Repository\Course\Event\FurtherEducation\CourseRepository as EventRepository;
use Neos\ContentRepository\Domain\Repository\NodeDataRepository;

/**
 * A route part handler for finding nodes specifically in the website's frontend.
 */
class CourseNodeRoutePartHandler extends FrontendNodeRoutePartHandler
{


    /**
     * @Flow\Inject
     * @var StudyRepository
     */
    protected $studyRepository;

    /**
     * @Flow\Inject
     * @var ModuleRepository
     */
    protected $moduleRepository;

    /**
     * @Flow\Inject
     * @var EventRepository
     */
    protected $eventRepository;

    /**
     * @Flow\Inject
     * @var NodeDataRepository
     */
    protected $nodeDataRepository;


    /**
     * @Flow\Inject
     * @var ImportService
     */
    protected $importService;

    /**
     * Matches a frontend URI pointing to a node (for example a page).
     *
     * This function tries to find a matching node by the given request path. If one was found, its
     * absolute context node path is set in $this->value and true is returned.
     *
     * Note that this matcher does not check if access to the resolved workspace or node is allowed because at the point
     * in time the route part handler is invoked, the security framework is not yet fully initialized.
     *
     * @param string $requestPath The request path (without leading "/", relative to the current Site Node)
     * @return boolean true if the $requestPath could be matched, otherwise false
     * @throws \Exception
     * @throws Exception\NoHomepageException if no node could be found on the homepage (empty $requestPath)
     */
    protected function matchValue($requestPath)
    {


        $course = $this->studyRepository->getOneById($requestPath);

        if (!$course) {
            $course = $this->moduleRepository->getOneById($requestPath);
        }

        if (!$course) {
            $course = $this->eventRepository->getOneById($requestPath);
        }

        $settings = $this->importService->getSettingsFromObject($course);
        $context = current($this->contextFactory->getInstances());
        if ($course) {
            $result = $this->nodeDataRepository->findByProperties(array('internalid'=>$course->getId()),$settings['detailNodeType'],$context->getWorkspace(),$context->getDimensions());
            $node = new Node(
                current($result),
                $context
            );
        } else {
            throw new PageNotFoundException('Page with course id '.$requestPath.' was not found.', 1346950755);
            return false;
        }



        if ($this->onlyMatchSiteNodes() && $node !== $node->getContext()->getCurrentSiteNode()) {
            return false;
        }

        $this->value = $node->getContextPath();

        return true;
    }


}
