<?php
/**
 * Plugin Name: EDR Core
 * Description: Contenu métier de L'Énergie des Runes : CPT offre, taxonomie type_offre et champs associés.
 * Version: 1.0.1
 * Author: OpenAI Codex
 * Text Domain: edr-core
 */

if (! defined('ABSPATH')) {
	exit;
}

define('EDR_CORE_VERSION', '1.0.1');
define('EDR_CORE_PATH', plugin_dir_path(__FILE__));
define('EDR_CORE_URL', plugin_dir_url(__FILE__));

require_once EDR_CORE_PATH . 'inc/setup.php';
require_once EDR_CORE_PATH . 'inc/post-types.php';
require_once EDR_CORE_PATH . 'inc/taxonomies.php';
require_once EDR_CORE_PATH . 'inc/meta-fields.php';

function edr_core_activate() {
	edr_core_register_offre_post_type();
	edr_core_register_type_offre_taxonomy();

	if (! term_exists('service', 'type_offre')) {
		wp_insert_term('Service', 'type_offre', array('slug' => 'service'));
	}

	if (! term_exists('formation', 'type_offre')) {
		wp_insert_term('Formation', 'type_offre', array('slug' => 'formation'));
	}

	flush_rewrite_rules();
}

function edr_core_deactivate() {
	flush_rewrite_rules();
}

register_activation_hook(__FILE__, 'edr_core_activate');
register_deactivation_hook(__FILE__, 'edr_core_deactivate');
