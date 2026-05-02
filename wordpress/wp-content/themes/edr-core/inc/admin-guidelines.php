<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_admin_notice() {
	$screen = get_current_screen();
	if (! $screen || 'page' !== $screen->base) {
		return;
	}

	echo '<div class="notice notice-info"><p><strong>EDR Core:</strong> privilegier les patterns existants, ne jamais mentionner de lieu physique, et formuler la distance comme un avantage.</p></div>';
}
add_action('current_screen', 'edr_core_admin_notice');
