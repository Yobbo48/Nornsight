<?php

if (! defined('ABSPATH')) {
	exit;
}

define('EDR_CORE_VERSION', '0.2.0');
define('EDR_CORE_DIR', get_template_directory());
define('EDR_CORE_URI', get_template_directory_uri());

$edr_core_includes = array(
	'/inc/setup.php',
	'/inc/assets.php',
	'/inc/helpers.php',
	'/inc/cpts.php',
	'/inc/meta-boxes.php',
	'/inc/customizer.php',
	'/inc/ajax-newsletter.php',
	'/inc/block-styles.php',
	'/inc/admin-guidelines.php',
	'/inc/page-importer.php',
);

foreach ($edr_core_includes as $edr_core_file) {
	$edr_core_path = EDR_CORE_DIR . $edr_core_file;
	if (file_exists($edr_core_path)) {
		require_once $edr_core_path;
	}
}
