<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_load_textdomain() {
	load_plugin_textdomain('edr-core', false, dirname(plugin_basename(EDR_CORE_PATH . 'edr-core.php')) . '/languages');
}

add_action('init', 'edr_core_load_textdomain');
