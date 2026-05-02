<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_get_option($key, $fallback = '') {
	$value = get_theme_mod($key, $fallback);
	return $value ?: $fallback;
}

function edr_core_get_meta($post_id, $key, $fallback = '') {
	$value = get_post_meta($post_id, $key, true);
	return $value ?: $fallback;
}

function edr_core_service_card_data($post_id) {
	return array(
		'title'    => get_the_title($post_id),
		'excerpt'  => get_the_excerpt($post_id),
		'price'    => edr_core_get_meta($post_id, '_edr_service_price'),
		'duration' => edr_core_get_meta($post_id, '_edr_service_duration'),
		'modality' => edr_core_get_meta($post_id, '_edr_service_modality'),
		'rune'     => edr_core_get_meta($post_id, '_edr_service_rune', 'ᚱ'),
		'url'      => get_permalink($post_id),
	);
}

function edr_core_training_card_data($post_id) {
	return array(
		'title'    => get_the_title($post_id),
		'excerpt'  => get_the_excerpt($post_id),
		'price'    => edr_core_get_meta($post_id, '_edr_training_price'),
		'duration' => edr_core_get_meta($post_id, '_edr_training_duration'),
		'level'    => edr_core_get_meta($post_id, '_edr_training_level'),
		'rune'     => edr_core_get_meta($post_id, '_edr_training_rune', 'ᚠ'),
		'url'      => get_permalink($post_id),
	);
}
