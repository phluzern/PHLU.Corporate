<?php
namespace Phlu\Corporate\DataSource;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Phlu\Neos\Models\Domain\Repository\ContactRepository;


class TagsIconDataSource extends AbstractDataSource {


    /**
     * @var string
     */
    static protected $identifier = 'phlu-corporate-tags-icon';


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


        $icons = array();

        // custom icons
        $icons['faecherIco'] = array('value' => 'faecherIco', 'label' => 'Fächer', 'icon' => '');
        $icons['strategieIco'] = array('value' => 'strategieIco', 'label' => 'Strategische Schwerpunkte', 'icon' => '');
        $icons['forschungIco'] = array('value' => 'forschungIco', 'label' => 'Forschungschwerpunkte', 'icon' => '');
        $icons['themaIco'] = array('value' => 'themaIco', 'label' => 'Thematische Schwerpunkte', 'icon' => '');

        // iconic icons
        //$icons['ico-family-iconic oi-briefcase'] = array('value' => 'ico-family-iconic oi-briefcase', 'label' => 'Brieftasche', 'icon' => 'ico-family-iconic oi-briefcase');

        // fontawesome icons
        //$icons['ico-family-fa fa-tag'] = array('value' => 'ico-family-fa fa-tag', 'label' => 'Tag', 'icon' => 'ico-family-fa fa-tag');


        return $icons;


    }




}