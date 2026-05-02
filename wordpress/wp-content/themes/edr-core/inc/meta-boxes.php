<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_register_meta_boxes() {
	add_meta_box('edr_service_meta', __('Informations service', 'edr-core'), 'edr_core_render_service_meta_box', 'edr_service', 'side');
	add_meta_box('edr_training_meta', __('Informations formation', 'edr-core'), 'edr_core_render_training_meta_box', 'edr_training', 'side');
	add_meta_box('edr_testimonial_meta', __('Informations témoignage', 'edr-core'), 'edr_core_render_testimonial_meta_box', 'edr_testimonial', 'side');
}
add_action('add_meta_boxes', 'edr_core_register_meta_boxes');

function edr_core_meta_input($name, $label, $value, $placeholder = '') {
	printf(
		'<p><label for="%1$s"><strong>%2$s</strong></label><input type="text" id="%1$s" name="%1$s" value="%3$s" class="widefat" placeholder="%4$s"></p>',
		esc_attr($name),
		esc_html($label),
		esc_attr($value),
		esc_attr($placeholder)
	);
}

function edr_core_render_service_meta_box($post) {
	wp_nonce_field('edr_core_meta', 'edr_core_meta_nonce');

	$fields = array(
		'_edr_service_price'      => __('Prix', 'edr-core'),
		'_edr_service_duration'   => __('Durée', 'edr-core'),
		'_edr_service_modality'   => __('Modalité', 'edr-core'),
		'_edr_service_rune'       => __('Rune', 'edr-core'),
		'_edr_service_cta_label'  => __('Label CTA', 'edr-core'),
		'_edr_service_cta_url'    => __('URL CTA', 'edr-core'),
	);

	$placeholders = array(
		'_edr_service_price'     => 'À partir de 30 EUR',
		'_edr_service_duration'  => '30 min ou 1h15',
		'_edr_service_modality'  => 'Téléphone, visioconférence ou email',
		'_edr_service_rune'      => 'ᚱ',
		'_edr_service_cta_label' => 'Réserver une séance',
		'_edr_service_cta_url'   => 'https://calendly.com/...',
	);

	foreach ($fields as $meta_key => $label) {
		edr_core_meta_input($meta_key, $label, get_post_meta($post->ID, $meta_key, true), $placeholders[$meta_key]);
	}
}

function edr_core_render_training_meta_box($post) {
	wp_nonce_field('edr_core_meta', 'edr_core_meta_nonce');

	$fields = array(
		'_edr_training_price'      => __('Prix', 'edr-core'),
		'_edr_training_duration'   => __('Durée', 'edr-core'),
		'_edr_training_level'      => __('Niveau', 'edr-core'),
		'_edr_training_rune'       => __('Rune', 'edr-core'),
		'_edr_training_format'     => __('Format', 'edr-core'),
		'_edr_training_cta_label'  => __('Label CTA', 'edr-core'),
		'_edr_training_cta_url'    => __('URL CTA', 'edr-core'),
	);

	$placeholders = array(
		'_edr_training_price'     => 'À partir de 89 EUR',
		'_edr_training_duration'  => '4h ou 3h',
		'_edr_training_level'     => 'Débutant ou avancé',
		'_edr_training_rune'      => 'ᚠ',
		'_edr_training_format'    => 'Atelier de groupe en ligne',
		'_edr_training_cta_label' => 'Voir la formation',
		'_edr_training_cta_url'   => 'https://calendly.com/...',
	);

	foreach ($fields as $meta_key => $label) {
		edr_core_meta_input($meta_key, $label, get_post_meta($post->ID, $meta_key, true), $placeholders[$meta_key]);
	}
}

function edr_core_render_testimonial_meta_box($post) {
	wp_nonce_field('edr_core_meta', 'edr_core_meta_nonce');

	$fields = array(
		'_edr_testimonial_name'     => __('Nom affiché', 'edr-core'),
		'_edr_testimonial_service'  => __('Service associé', 'edr-core'),
		'_edr_testimonial_rating'   => __('Note', 'edr-core'),
		'_edr_testimonial_source'   => __('Source', 'edr-core'),
		'_edr_testimonial_featured' => __('Mise en avant', 'edr-core'),
	);

	$placeholders = array(
		'_edr_testimonial_name'     => 'Florie L.',
		'_edr_testimonial_service'  => 'Tirage de runes, guidance & voyance',
		'_edr_testimonial_rating'   => '5',
		'_edr_testimonial_source'   => 'Google',
		'_edr_testimonial_featured' => 'yes',
	);

	foreach ($fields as $meta_key => $label) {
		edr_core_meta_input($meta_key, $label, get_post_meta($post->ID, $meta_key, true), $placeholders[$meta_key]);
	}
}

function edr_core_save_meta_boxes($post_id) {
	if (! isset($_POST['edr_core_meta_nonce']) || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['edr_core_meta_nonce'])), 'edr_core_meta')) {
		return;
	}

	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return;
	}

	if (! current_user_can('edit_post', $post_id)) {
		return;
	}

	$fields = array(
		'_edr_service_price',
		'_edr_service_duration',
		'_edr_service_modality',
		'_edr_service_rune',
		'_edr_service_cta_label',
		'_edr_service_cta_url',
		'_edr_training_price',
		'_edr_training_duration',
		'_edr_training_level',
		'_edr_training_rune',
		'_edr_training_format',
		'_edr_training_cta_label',
		'_edr_training_cta_url',
		'_edr_testimonial_name',
		'_edr_testimonial_service',
		'_edr_testimonial_rating',
		'_edr_testimonial_source',
		'_edr_testimonial_featured',
	);

	foreach ($fields as $field) {
		if (! isset($_POST[$field])) {
			continue;
		}

		$value = wp_unslash($_POST[$field]);
		$sanitized = str_contains($field, '_url') ? esc_url_raw($value) : sanitize_text_field($value);
		update_post_meta($post_id, $field, $sanitized);
	}
}
add_action('save_post', 'edr_core_save_meta_boxes');
