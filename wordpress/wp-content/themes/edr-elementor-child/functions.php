<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_elementor_child_enqueue_styles() {
	wp_enqueue_style(
		'edr-elementor-child-style',
		get_stylesheet_uri(),
		array('edr-elementor-style'),
		wp_get_theme()->get('Version')
	);
}
add_action('wp_enqueue_scripts', 'edr_elementor_child_enqueue_styles');
