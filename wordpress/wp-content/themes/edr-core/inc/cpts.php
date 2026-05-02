<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_register_cpts() {
	register_post_type(
		'edr_service',
		array(
			'labels'       => array(
				'name'          => __('Services', 'edr-core'),
				'singular_name' => __('Service', 'edr-core'),
			),
			'public'       => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-star-filled',
			'supports'     => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
			'rewrite'      => array('slug' => 'services'),
		)
	);

	register_post_type(
		'edr_training',
		array(
			'labels'       => array(
				'name'          => __('Formations', 'edr-core'),
				'singular_name' => __('Formation', 'edr-core'),
			),
			'public'       => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-welcome-learn-more',
			'supports'     => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
			'rewrite'      => array('slug' => 'formations'),
		)
	);

	register_post_type(
		'edr_testimonial',
		array(
			'labels'       => array(
				'name'          => __('Témoignages', 'edr-core'),
				'singular_name' => __('Témoignage', 'edr-core'),
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-format-quote',
			'supports'     => array('title', 'editor', 'custom-fields'),
		)
	);
}
add_action('init', 'edr_core_register_cpts');
