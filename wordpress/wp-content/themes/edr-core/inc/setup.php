<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_setup() {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 256,
			'width'       => 256,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_theme_support('responsive-embeds');
	add_theme_support('editor-styles');
	add_theme_support('wp-block-styles');
	add_theme_support('align-wide');
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));

	register_nav_menus(
		array(
			'primary'   => __('Navigation principale', 'edr-core'),
			'secondary' => __('Navigation secondaire', 'edr-core'),
			'footer'    => __('Navigation footer', 'edr-core'),
		)
	);
}
add_action('after_setup_theme', 'edr_core_setup');
