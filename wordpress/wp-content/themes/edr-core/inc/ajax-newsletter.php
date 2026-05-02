<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_newsletter_subscribe() {
	check_ajax_referer('edr_newsletter_nonce', 'nonce');

	$email = sanitize_email($_POST['email'] ?? '');
	if (! is_email($email)) {
		wp_send_json_error(array('message' => __('Adresse email invalide.', 'edr-core')), 400);
	}

	wp_send_json_success(array('message' => __('Abonnement enregistre. Le branchement Brevo sera ajoute dans l’implementation suivante.', 'edr-core')));
}
add_action('wp_ajax_edr_core_newsletter_subscribe', 'edr_core_newsletter_subscribe');
add_action('wp_ajax_nopriv_edr_core_newsletter_subscribe', 'edr_core_newsletter_subscribe');
