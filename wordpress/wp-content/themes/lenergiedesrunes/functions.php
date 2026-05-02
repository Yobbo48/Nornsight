<?php

if (! defined('ABSPATH')) {
	exit;
}

function lenergiedesrunes_setup() {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
	add_theme_support('custom-logo');
	add_theme_support('editor-styles');
	add_editor_style('style.css');

	register_nav_menus(
		array(
			'primary' => __('Menu principal', 'lenergiedesrunes'),
			'footer'  => __('Menu footer', 'lenergiedesrunes'),
		)
	);
}
add_action('after_setup_theme', 'lenergiedesrunes_setup');

function lenergiedesrunes_enqueue_assets() {
	wp_enqueue_style(
		'lenergiedesrunes-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style('lenergiedesrunes-style', get_stylesheet_uri(), array('lenergiedesrunes-fonts'), wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'lenergiedesrunes_enqueue_assets');

function lenergiedesrunes_customize_register($wp_customize) {
	$wp_customize->add_section(
		'lenergiedesrunes_contact',
		array(
			'title'    => __('Coordonnees et liens', 'lenergiedesrunes'),
			'priority' => 30,
		)
	);

	$settings = array(
		'booking_url'   => '',
		'book_url'      => '',
		'contact_email' => '',
		'contact_phone' => '',
		'instagram_url' => '',
		'youtube_url'   => '',
		'tagline_text'  => 'Guidances et soins energetiques en ligne',
		'hero_title'    => 'Guidances et soins energetiques en ligne par les runes',
		'hero_text'     => "Des seances a distance pour retrouver clarte, apaisement et elan dans les passages de doute, de transition ou de blocage.",
	);

	foreach ($settings as $key => $default) {
		$wp_customize->add_setting(
			$key,
			array(
				'default'           => $default,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
	}

	$wp_customize->get_setting('booking_url')->sanitize_callback = 'esc_url_raw';
	$wp_customize->get_setting('book_url')->sanitize_callback = 'esc_url_raw';
	$wp_customize->get_setting('instagram_url')->sanitize_callback = 'esc_url_raw';
	$wp_customize->get_setting('youtube_url')->sanitize_callback = 'esc_url_raw';
	$wp_customize->get_setting('contact_email')->sanitize_callback = 'sanitize_email';

	$wp_customize->add_control('tagline_text', array('label' => __('Tagline', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'text'));
	$wp_customize->add_control('hero_title', array('label' => __('Titre hero', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'text'));
	$wp_customize->add_control('hero_text', array('label' => __('Texte hero', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'textarea'));
	$wp_customize->add_control('booking_url', array('label' => __('URL de reservation', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'url'));
	$wp_customize->add_control('book_url', array('label' => __('URL du livre', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'url'));
	$wp_customize->add_control('contact_email', array('label' => __('Email', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'email'));
	$wp_customize->add_control('contact_phone', array('label' => __('Telephone', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'text'));
	$wp_customize->add_control('instagram_url', array('label' => __('Instagram', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'url'));
	$wp_customize->add_control('youtube_url', array('label' => __('YouTube', 'lenergiedesrunes'), 'section' => 'lenergiedesrunes_contact', 'type' => 'url'));
}
add_action('customize_register', 'lenergiedesrunes_customize_register');

function lenergiedesrunes_theme_value($key, $fallback = '') {
	$value = get_theme_mod($key, $fallback);
	return $value ?: $fallback;
}

function lenergiedesrunes_get_page_by_path($path) {
	$page = get_page_by_path($path);
	return $page instanceof WP_Post ? $page : null;
}
