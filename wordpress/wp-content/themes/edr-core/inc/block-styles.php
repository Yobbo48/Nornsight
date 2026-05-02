<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_register_block_styles() {
	register_block_style('core/group', array('name' => 'edr-soft-section', 'label' => __('EDR Soft Section', 'edr-core')));
	register_block_style('core/group', array('name' => 'edr-dark-section', 'label' => __('EDR Dark Section', 'edr-core')));
	register_block_style('core/buttons', array('name' => 'edr-dual-cta', 'label' => __('EDR Dual CTA', 'edr-core')));
}
add_action('init', 'edr_core_register_block_styles');
