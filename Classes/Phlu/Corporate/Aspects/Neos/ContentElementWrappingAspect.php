<?php

namespace Phlu\Corporate\Aspects\Neos;


use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Neos\Service\HtmlAugmenter;

/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class ContentElementWrappingAspect
{

    /**
     * @Flow\Inject
     * @var HtmlAugmenter
     */
    protected $htmlAugmenter;

    /**
     * @Flow\Around("method(Neos\Neos\Fusion\ContentElementWrappingImplementation->evaluate())")
     * @return void
     */
    public function evaluate(JoinPointInterface $joinPoint)
    {

        /* @var \Neos\ContentRepository\Domain\Model\Node $node */
        $node = $joinPoint->getProxy()->getRuntime()->getCurrentContext()['node'];

         if ($_SERVER['REQUEST_URI'] == "/".$node->getIdentifier() || $_SERVER['QUERY_STRING'] == $node->getIdentifier()) {
            $value = $joinPoint->getProxy()->getRuntime()->getCurrentContext()['value'];
            return $this->htmlAugmenter->addAttributes($value,array('class' => 'targetnode', 'data-targetnode' => $node->getIdentifier()));
        } else {
            $result = $joinPoint->getAdviceChain()->proceed($joinPoint);
            return $result;
        }


    }


}
