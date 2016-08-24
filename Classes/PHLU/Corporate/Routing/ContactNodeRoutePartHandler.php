<?php
namespace PHLU\Corporate\Routing;

/*
 * This file is part of the TYPO3.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use PHLU\Neos\Models\Domain\Repository\ContactRepository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Routing\IdentityRoutePart;

/**
 * A route part handler for finding nodes specifically in the website's frontend.
 */
class ContactNodeRoutePartHandler extends IdentityRoutePart
{


    /**
     * @Flow\Inject
     * @var ContactRepository
     */
    protected $contactRepository;


    /**
     * ContactNodeRoutePartHandler constructor.
     */
    public function __construct()
    {

        $this->objectType = 'PHLU\Neos\Models\Domain\Model\Contact';
    }


    /**
     * Retrieves the object identifier from the given $pathSegment.
     * If no UriPattern is set, the $pathSegment is expected to be the (URL-encoded) identifier otherwise a matching ObjectPathMapping fetched from persistence
     * If no matching ObjectPathMapping was found or the given $pathSegment is no valid identifier NULL is returned.
     *
     * @param string $pathSegment the query path segment to convert
     * @return string|integer the technical identifier of the object or NULL if it couldn't be found
     */
    protected function getObjectIdentifierFromPathSegment($pathSegment)
    {


            $contact = $this->contactRepository->getOneByEmailPart(str_replace("-at-","@",$pathSegment));

            if ($contact) {
                return $contact->getIdentifier();
            }

            return null;
    }


}
