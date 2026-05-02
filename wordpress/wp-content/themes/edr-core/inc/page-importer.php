<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_seed_pages_dir() {
	return trailingslashit(EDR_CORE_DIR) . 'seed-pages/';
}

function edr_core_get_seed_pages() {
	$files = glob(edr_core_seed_pages_dir() . '*.json');
	if (! $files) {
		return array();
	}

	$pages = array();

	foreach ($files as $file) {
		$contents = file_get_contents($file);
		if (! $contents) {
			continue;
		}

		$data = json_decode($contents, true);
		if (! is_array($data) || empty($data['slug']) || empty($data['title'])) {
			continue;
		}

		$data['file'] = basename($file);
		$pages[$data['slug']] = $data;
	}

	ksort($pages);

	return $pages;
}

function edr_core_import_seed_page($slug) {
	$pages = edr_core_get_seed_pages();

	if (! isset($pages[$slug])) {
		return new WP_Error('missing_seed_page', __('Page preset introuvable.', 'edr-core'));
	}

	$page = $pages[$slug];
	$existing = get_page_by_path($page['slug'], OBJECT, 'page');

	$postarr = array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => wp_slash($page['title']),
		'post_name'    => sanitize_title($page['slug']),
		'post_content' => wp_slash($page['content']),
	);

	if ($existing instanceof WP_Post) {
		$postarr['ID'] = $existing->ID;
		$post_id = wp_update_post($postarr, true);
	} else {
		$post_id = wp_insert_post($postarr, true);
	}

	if (is_wp_error($post_id)) {
		return $post_id;
	}

	if (! empty($page['template']) && 'page' !== $page['template']) {
		update_post_meta($post_id, '_wp_page_template', sanitize_text_field($page['template']));
	}

	if ('front-page' === ($page['template'] ?? '') || 'accueil' === $page['slug']) {
		update_option('show_on_front', 'page');
		update_option('page_on_front', (int) $post_id);
	}

	return $post_id;
}

function edr_core_add_importer_page() {
	add_theme_page(
		__('EDR Import', 'edr-core'),
		__('EDR Import', 'edr-core'),
		'edit_theme_options',
		'edr-core-import',
		'edr_core_render_importer_page'
	);
}
add_action('admin_menu', 'edr_core_add_importer_page');

function edr_core_render_importer_page() {
	if (! current_user_can('edit_theme_options')) {
		return;
	}

	$pages = edr_core_get_seed_pages();
	$status = isset($_GET['edr_import_status']) ? sanitize_text_field(wp_unslash($_GET['edr_import_status'])) : '';
	$count  = isset($_GET['edr_import_count']) ? (int) $_GET['edr_import_count'] : 0;
	?>
	<div class="wrap">
		<h1><?php esc_html_e('EDR Import', 'edr-core'); ?></h1>
		<p><?php esc_html_e('Importez ou mettez à jour les pages de base du site directement depuis les presets du thème.', 'edr-core'); ?></p>

		<?php if ('success' === $status) : ?>
			<div class="notice notice-success"><p><?php echo esc_html(sprintf(_n('%d page importée ou mise à jour.', '%d pages importées ou mises à jour.', $count, 'edr-core'), $count)); ?></p></div>
		<?php elseif ('error' === $status) : ?>
			<div class="notice notice-error"><p><?php esc_html_e('L’import n’a pas pu être terminé.', 'edr-core'); ?></p></div>
		<?php endif; ?>

		<?php if (empty($pages)) : ?>
			<div class="notice notice-warning"><p><?php esc_html_e('Aucun preset JSON trouvé dans le thème.', 'edr-core'); ?></p></div>
		<?php else : ?>
			<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="margin: 1rem 0 1.5rem;">
				<input type="hidden" name="action" value="edr_core_import_seed_pages">
				<input type="hidden" name="edr_import_target" value="all">
				<?php wp_nonce_field('edr_core_import_seed_pages', 'edr_core_import_nonce'); ?>
				<?php submit_button(__('Importer toutes les pages de base', 'edr-core'), 'primary', 'submit', false); ?>
			</form>

			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e('Page', 'edr-core'); ?></th>
						<th><?php esc_html_e('Slug', 'edr-core'); ?></th>
						<th><?php esc_html_e('Preset', 'edr-core'); ?></th>
						<th><?php esc_html_e('Action', 'edr-core'); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($pages as $page) : ?>
						<tr>
							<td><strong><?php echo esc_html($page['title']); ?></strong></td>
							<td><code><?php echo esc_html($page['slug']); ?></code></td>
							<td><code><?php echo esc_html($page['file']); ?></code></td>
							<td>
								<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
									<input type="hidden" name="action" value="edr_core_import_seed_pages">
									<input type="hidden" name="edr_import_target" value="<?php echo esc_attr($page['slug']); ?>">
									<?php wp_nonce_field('edr_core_import_seed_pages', 'edr_core_import_nonce'); ?>
									<?php submit_button(__('Importer / mettre à jour', 'edr-core'), 'secondary', 'submit', false); ?>
								</form>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
	</div>
	<?php
}

function edr_core_handle_seed_pages_import() {
	if (! current_user_can('edit_theme_options')) {
		wp_die(esc_html__('Vous n’avez pas les permissions nécessaires.', 'edr-core'));
	}

	check_admin_referer('edr_core_import_seed_pages', 'edr_core_import_nonce');

	$target = isset($_POST['edr_import_target']) ? sanitize_text_field(wp_unslash($_POST['edr_import_target'])) : '';
	$pages  = edr_core_get_seed_pages();
	$count  = 0;

	if ('all' === $target) {
		foreach (array_keys($pages) as $slug) {
			$result = edr_core_import_seed_page($slug);
			if (is_wp_error($result)) {
				wp_safe_redirect(
					add_query_arg(
						array(
							'page'              => 'edr-core-import',
							'edr_import_status' => 'error',
						),
						admin_url('themes.php')
					)
				);
				exit;
			}
			$count++;
		}
	} elseif ($target) {
		$result = edr_core_import_seed_page($target);
		if (is_wp_error($result)) {
			wp_safe_redirect(
				add_query_arg(
					array(
						'page'              => 'edr-core-import',
						'edr_import_status' => 'error',
					),
					admin_url('themes.php')
				)
			);
			exit;
		}
		$count = 1;
	}

	wp_safe_redirect(
		add_query_arg(
			array(
				'page'              => 'edr-core-import',
				'edr_import_status' => 'success',
				'edr_import_count'  => $count,
			),
			admin_url('themes.php')
		)
	);
	exit;
}
add_action('admin_post_edr_core_import_seed_pages', 'edr_core_handle_seed_pages_import');
