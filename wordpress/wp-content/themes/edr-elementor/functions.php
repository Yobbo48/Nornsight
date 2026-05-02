<?php

if (! defined('ABSPATH')) {
	exit;
}

define('EDR_ELEMENTOR_VERSION', '0.1.0');

function edr_elementor_setup() {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('custom-logo');
	add_theme_support('align-wide');
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
	add_theme_support('editor-styles');
	add_editor_style('style.css');

	register_nav_menus(
		array(
			'primary' => __('Navigation principale', 'edr-elementor'),
			'footer'  => __('Navigation footer', 'edr-elementor'),
		)
	);
}
add_action('after_setup_theme', 'edr_elementor_setup');

function edr_elementor_enqueue_assets() {
	wp_enqueue_style(
		'edr-elementor-fonts',
		'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'edr-elementor-style',
		get_stylesheet_uri(),
		array('edr-elementor-fonts'),
		EDR_ELEMENTOR_VERSION
	);

	wp_enqueue_script(
		'edr-elementor-header',
		get_template_directory_uri() . '/assets/js/header.js',
		array(),
		EDR_ELEMENTOR_VERSION,
		true
	);
}
add_action('wp_enqueue_scripts', 'edr_elementor_enqueue_assets');

function edr_elementor_customize_register($wp_customize) {
	$wp_customize->add_section(
		'edr_elementor_identity',
		array(
			'title'    => __('EDR Elementor - Identité', 'edr-elementor'),
			'priority' => 30,
		)
	);

	$wp_customize->add_section(
		'edr_elementor_header_layout',
		array(
			'title'    => __('EDR Elementor - Header', 'edr-elementor'),
			'priority' => 31,
		)
	);

	$controls = array(
		'edr_header_meta_top'    => array('label' => __('Ligne meta haute', 'edr-elementor'), 'type' => 'text', 'default' => 'Accessible partout en France'),
		'edr_header_meta_bottom' => array('label' => __('Ligne meta basse', 'edr-elementor'), 'type' => 'text', 'default' => 'Téléphone · Visioconférence · Email'),
		'edr_booking_url'        => array('label' => __('URL Calendly / réservation', 'edr-elementor'), 'type' => 'url', 'default' => ''),
		'edr_booking_label'      => array('label' => __('Label bouton réservation', 'edr-elementor'), 'type' => 'text', 'default' => 'Réserver une séance'),
		'edr_footer_text'        => array('label' => __('Texte footer', 'edr-elementor'), 'type' => 'textarea', 'default' => 'Guidances runiques, soins énergétiques et transmission à distance, accessibles partout en France, sans déplacement.'),
		'edr_contact_email'      => array('label' => __('Email', 'edr-elementor'), 'type' => 'email', 'default' => ''),
		'edr_contact_phone'      => array('label' => __('Téléphone', 'edr-elementor'), 'type' => 'text', 'default' => ''),
	);

	foreach ($controls as $id => $control) {
		$sanitize = 'sanitize_text_field';
		if ('url' === $control['type']) {
			$sanitize = 'esc_url_raw';
		} elseif ('email' === $control['type']) {
			$sanitize = 'sanitize_email';
		}

		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $control['default'],
				'sanitize_callback' => $sanitize,
			)
		);

		$wp_customize->add_control(
			$id,
			array(
				'label'   => $control['label'],
				'section' => 'edr_elementor_identity',
				'type'    => $control['type'],
			)
		);
	}

	$layout_controls = array(
		'edr_header_logo_size'       => array('label' => __('Taille du logo (px)', 'edr-elementor'), 'default' => 62, 'min' => 40, 'max' => 120),
		'edr_header_brand_offset_x'  => array('label' => __('Décalage bloc marque X (px)', 'edr-elementor'), 'default' => 0, 'min' => -120, 'max' => 120),
		'edr_header_brand_offset_y'  => array('label' => __('Décalage bloc marque Y (px)', 'edr-elementor'), 'default' => 0, 'min' => -120, 'max' => 120),
		'edr_header_nav_offset_x'    => array('label' => __('Décalage menu X (px)', 'edr-elementor'), 'default' => 0, 'min' => -180, 'max' => 180),
		'edr_header_nav_offset_y'    => array('label' => __('Décalage menu Y (px)', 'edr-elementor'), 'default' => 0, 'min' => -120, 'max' => 120),
		'edr_header_meta_offset_x'   => array('label' => __('Décalage bloc infos X (px)', 'edr-elementor'), 'default' => 0, 'min' => -180, 'max' => 180),
		'edr_header_meta_offset_y'   => array('label' => __('Décalage bloc infos Y (px)', 'edr-elementor'), 'default' => 0, 'min' => -120, 'max' => 120),
		'edr_header_button_offset_x' => array('label' => __('Décalage bouton X (px)', 'edr-elementor'), 'default' => 0, 'min' => -180, 'max' => 180),
		'edr_header_button_offset_y' => array('label' => __('Décalage bouton Y (px)', 'edr-elementor'), 'default' => 0, 'min' => -120, 'max' => 120),
	);

	foreach ($layout_controls as $id => $control) {
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $control['default'],
				'sanitize_callback' => 'edr_elementor_sanitize_int',
			)
		);

		$wp_customize->add_control(
			$id,
			array(
				'label'       => $control['label'],
				'section'     => 'edr_elementor_header_layout',
				'type'        => 'number',
				'input_attrs' => array(
					'min'  => $control['min'],
					'max'  => $control['max'],
					'step' => 1,
				),
			)
		);
	}
}
add_action('customize_register', 'edr_elementor_customize_register');

function edr_elementor_sanitize_int($value) {
	return is_numeric($value) ? (int) $value : 0;
}

function edr_elementor_theme_value($key, $fallback = '') {
	$value = get_theme_mod($key, $fallback);
	return $value ?: $fallback;
}

function edr_elementor_elementor_support() {
	if (! did_action('elementor/loaded')) {
		return;
	}

	add_theme_support('elementor');
	add_theme_support('elementor-pro');
	add_theme_support('elementor-page-templates');
}
add_action('after_setup_theme', 'edr_elementor_elementor_support', 20);

function edr_elementor_register_locations($manager) {
	$manager->register_all_core_location();
}
add_action('elementor/theme/register_locations', 'edr_elementor_register_locations');

function edr_elementor_page_uses_builder($post_id = 0) {
	$post_id = $post_id ?: get_the_ID();

	if (! $post_id) {
		return false;
	}

	$edit_mode = get_post_meta($post_id, '_elementor_edit_mode', true);
	$data      = get_post_meta($post_id, '_elementor_data', true);

	return ! empty($edit_mode) || ! empty($data);
}

function edr_elementor_header_custom_css() {
	$vars = array(
		'--edr-header-logo-size'    => edr_elementor_theme_value('edr_header_logo_size', 62) . 'px',
		'--edr-header-brand-x'      => edr_elementor_theme_value('edr_header_brand_offset_x', 0) . 'px',
		'--edr-header-brand-y'      => edr_elementor_theme_value('edr_header_brand_offset_y', 0) . 'px',
		'--edr-header-nav-x'        => edr_elementor_theme_value('edr_header_nav_offset_x', 0) . 'px',
		'--edr-header-nav-y'        => edr_elementor_theme_value('edr_header_nav_offset_y', 0) . 'px',
		'--edr-header-meta-x'       => edr_elementor_theme_value('edr_header_meta_offset_x', 0) . 'px',
		'--edr-header-meta-y'       => edr_elementor_theme_value('edr_header_meta_offset_y', 0) . 'px',
		'--edr-header-button-x'     => edr_elementor_theme_value('edr_header_button_offset_x', 0) . 'px',
		'--edr-header-button-y'     => edr_elementor_theme_value('edr_header_button_offset_y', 0) . 'px',
	);

	echo '<style id="edr-header-customizer-vars">:root{';
	foreach ($vars as $key => $value) {
		echo esc_html($key . ':' . $value . ';');
	}
	echo '}</style>';
}
add_action('wp_head', 'edr_elementor_header_custom_css', 99);
