<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_customize_register($wp_customize) {
	$sections = array(
		'edr_core_identity' => __('EDR - Identité & contact', 'edr-core'),
		'edr_core_booking'  => __('EDR - Réservation', 'edr-core'),
		'edr_core_book'     => __('EDR - Livre', 'edr-core'),
		'edr_core_social'   => __('EDR - Réseaux', 'edr-core'),
		'edr_core_proof'    => __('EDR - Preuves', 'edr-core'),
		'edr_core_home'     => __('EDR - Accueil', 'edr-core'),
	);

	$priority = 30;
	foreach ($sections as $id => $title) {
		$wp_customize->add_section(
			$id,
			array(
				'title'    => $title,
				'priority' => $priority,
			)
		);
		$priority += 1;
	}

	$controls = array(
		'edr_phone' => array('section' => 'edr_core_identity', 'label' => __('Téléphone', 'edr-core'), 'type' => 'text', 'default' => ''),
		'edr_email' => array('section' => 'edr_core_identity', 'label' => __('Email', 'edr-core'), 'type' => 'email', 'default' => ''),
		'edr_positioning' => array('section' => 'edr_core_identity', 'label' => __('Texte de positionnement court', 'edr-core'), 'type' => 'textarea', 'default' => "Guidances runiques, soins énergétiques et transmission autour des runes nordiques, accessibles à distance depuis toute la France, sans déplacement."),
		'edr_calendly_url' => array('section' => 'edr_core_booking', 'label' => __('URL Calendly', 'edr-core'), 'type' => 'url', 'default' => ''),
		'edr_booking_label' => array('section' => 'edr_core_booking', 'label' => __('Label CTA réservation', 'edr-core'), 'type' => 'text', 'default' => 'Réserver une séance'),
		'edr_book_url' => array('section' => 'edr_core_book', 'label' => __('URL du livre', 'edr-core'), 'type' => 'url', 'default' => 'https://linktr.ee/lenergiedesrunes'),
		'edr_book_cta_label' => array('section' => 'edr_core_book', 'label' => __('Label CTA livre', 'edr-core'), 'type' => 'text', 'default' => 'Commander le livre'),
		'edr_instagram' => array('section' => 'edr_core_social', 'label' => __('Instagram', 'edr-core'), 'type' => 'url', 'default' => ''),
		'edr_youtube' => array('section' => 'edr_core_social', 'label' => __('YouTube', 'edr-core'), 'type' => 'url', 'default' => ''),
		'edr_facebook' => array('section' => 'edr_core_social', 'label' => __('Facebook', 'edr-core'), 'type' => 'url', 'default' => ''),
		'edr_tiktok' => array('section' => 'edr_core_social', 'label' => __('TikTok', 'edr-core'), 'type' => 'url', 'default' => ''),
		'edr_google_reviews' => array('section' => 'edr_core_proof', 'label' => __('Lien avis Google', 'edr-core'), 'type' => 'url', 'default' => ''),
		'edr_proof_reviews' => array('section' => 'edr_core_proof', 'label' => __('Texte avis', 'edr-core'), 'type' => 'text', 'default' => '21 avis 5 étoiles Google'),
		'edr_proof_practice' => array('section' => 'edr_core_proof', 'label' => __('Texte experience', 'edr-core'), 'type' => 'text', 'default' => '8+ ans de pratique'),
		'edr_proof_book' => array('section' => 'edr_core_proof', 'label' => __('Texte livre', 'edr-core'), 'type' => 'text', 'default' => 'Livre publié en librairie nationale'),
		'edr_home_title' => array('section' => 'edr_core_home', 'label' => __('Titre hero accueil', 'edr-core'), 'type' => 'text', 'default' => 'Guidance runique & soins énergétiques pour avancer avec clarté'),
		'edr_home_intro' => array('section' => 'edr_core_home', 'label' => __('Texte hero accueil', 'edr-core'), 'type' => 'textarea', 'default' => 'Séparation, transition professionnelle, blocages inexpliqués, perte de direction : des séances à distance pour vous aider à faire le point, sans déplacement, depuis toute la France.'),
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
				'section' => $control['section'],
				'type'    => $control['type'],
			)
		);
	}
}
add_action('customize_register', 'edr_core_customize_register');
