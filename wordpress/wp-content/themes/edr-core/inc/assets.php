<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_enqueue_assets() {
	wp_enqueue_style('edr-core-fonts', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap', array(), null);
	wp_enqueue_style('edr-core-frontend', EDR_CORE_URI . '/assets/css/frontend.css', array('edr-core-fonts'), EDR_CORE_VERSION);
	wp_enqueue_style('edr-core-utilities', EDR_CORE_URI . '/assets/css/utilities.css', array('edr-core-frontend'), EDR_CORE_VERSION);

	wp_enqueue_script('edr-core-theme', EDR_CORE_URI . '/assets/js/theme.js', array(), EDR_CORE_VERSION, true);
	wp_enqueue_script('edr-core-newsletter', EDR_CORE_URI . '/assets/js/newsletter.js', array('edr-core-theme'), EDR_CORE_VERSION, true);
	wp_localize_script(
		'edr-core-newsletter',
		'edrCore',
		array(
			'ajaxUrl' => admin_url('admin-ajax.php'),
			'nonce'   => wp_create_nonce('edr_newsletter_nonce'),
		)
	);
}
add_action('wp_enqueue_scripts', 'edr_core_enqueue_assets');

function edr_core_enqueue_editor_assets() {
	wp_enqueue_style('edr-core-fonts-editor', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap', array(), null);
	wp_enqueue_style('edr-core-editor', EDR_CORE_URI . '/assets/css/editor.css', array('wp-edit-blocks'), EDR_CORE_VERSION);
}
add_action('enqueue_block_editor_assets', 'edr_core_enqueue_editor_assets');
