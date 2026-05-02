<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_add_offre_meta_box() {
	add_meta_box(
		'edr-core-offre-details',
		__('Détails de l’offre', 'edr-core'),
		'edr_core_render_offre_meta_box',
		'offre',
		'normal',
		'default'
	);
}

function edr_core_render_offre_meta_box($post) {
	wp_nonce_field('edr_core_save_offre_meta', 'edr_core_offre_meta_nonce');

	$values = edr_core_get_offre_meta_values($post->ID);
	?>
	<p>
		<label for="edr_core_prix"><strong><?php esc_html_e('Prix', 'edr-core'); ?></strong></label>
		<input type="text" id="edr_core_prix" name="edr_core_prix" class="widefat" value="<?php echo esc_attr($values['prix']); ?>" placeholder="<?php esc_attr_e('Ex. : À partir de 65€', 'edr-core'); ?>">
	</p>
	<p>
		<label for="edr_core_duree"><strong><?php esc_html_e('Durée', 'edr-core'); ?></strong></label>
		<input type="text" id="edr_core_duree" name="edr_core_duree" class="widefat" value="<?php echo esc_attr($values['duree']); ?>" placeholder="<?php esc_attr_e('Ex. : 1h15', 'edr-core'); ?>">
	</p>
	<p>
		<label for="edr_core_modalite"><strong><?php esc_html_e('Modalité', 'edr-core'); ?></strong></label>
		<input type="text" id="edr_core_modalite" name="edr_core_modalite" class="widefat" value="<?php echo esc_attr($values['modalite']); ?>" placeholder="<?php esc_attr_e('Ex. : Visioconférence', 'edr-core'); ?>">
	</p>
	<p>
		<label for="edr_core_texte_cta"><strong><?php esc_html_e('Texte du CTA', 'edr-core'); ?></strong></label>
		<input type="text" id="edr_core_texte_cta" name="edr_core_texte_cta" class="widefat" value="<?php echo esc_attr($values['texte_cta']); ?>" placeholder="<?php esc_attr_e('Ex. : Réserver cette séance', 'edr-core'); ?>">
	</p>
	<p>
		<label for="edr_core_url_cta"><strong><?php esc_html_e('URL du CTA', 'edr-core'); ?></strong></label>
		<input type="url" id="edr_core_url_cta" name="edr_core_url_cta" class="widefat" value="<?php echo esc_url($values['url_cta']); ?>" placeholder="https://">
	</p>
	<p>
		<label for="edr_core_rune_ou_symbole"><strong><?php esc_html_e('Rune ou symbole', 'edr-core'); ?></strong></label>
		<input type="text" id="edr_core_rune_ou_symbole" name="edr_core_rune_ou_symbole" class="widefat" value="<?php echo esc_attr($values['rune_ou_symbole']); ?>" placeholder="<?php esc_attr_e('Ex. : ᚱ', 'edr-core'); ?>">
	</p>
	<p>
		<label>
			<input type="checkbox" name="edr_core_mise_en_avant" value="1" <?php checked($values['mise_en_avant'], '1'); ?>>
			<?php esc_html_e('Mettre cette offre en avant', 'edr-core'); ?>
		</label>
	</p>
	<?php
}

function edr_core_save_offre_meta_fields($post_id) {
	if (! isset($_POST['edr_core_offre_meta_nonce']) || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['edr_core_offre_meta_nonce'])), 'edr_core_save_offre_meta')) {
		return;
	}

	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return;
	}

	if (! current_user_can('edit_post', $post_id)) {
		return;
	}

	$fields = array(
		'prix'            => array('key' => '_edr_offre_prix', 'type' => 'text'),
		'duree'           => array('key' => '_edr_offre_duree', 'type' => 'text'),
		'modalite'        => array('key' => '_edr_offre_modalite', 'type' => 'text'),
		'texte_cta'       => array('key' => '_edr_offre_texte_cta', 'type' => 'text'),
		'url_cta'         => array('key' => '_edr_offre_url_cta', 'type' => 'url'),
		'rune_ou_symbole' => array('key' => '_edr_offre_rune_ou_symbole', 'type' => 'text'),
	);

	foreach ($fields as $field_name => $config) {
		$post_key = 'edr_core_' . $field_name;
		$value    = isset($_POST[$post_key]) ? wp_unslash($_POST[$post_key]) : '';

		if ('url' === $config['type']) {
			$value = esc_url_raw($value);
			if (! empty($value) && ! filter_var($value, FILTER_VALIDATE_URL)) {
				continue;
			}
		} else {
			$value = sanitize_text_field($value);
		}

		if ('' === $value) {
			delete_post_meta($post_id, $config['key']);
		} else {
			update_post_meta($post_id, $config['key'], $value);
		}
	}

	$mise_en_avant = isset($_POST['edr_core_mise_en_avant']) ? '1' : '0';
	update_post_meta($post_id, '_edr_offre_mise_en_avant', $mise_en_avant);
}

function edr_core_get_offre_meta_values($post_id) {
	return array(
		'prix'            => get_post_meta($post_id, '_edr_offre_prix', true),
		'duree'           => get_post_meta($post_id, '_edr_offre_duree', true),
		'modalite'        => get_post_meta($post_id, '_edr_offre_modalite', true),
		'texte_cta'       => get_post_meta($post_id, '_edr_offre_texte_cta', true),
		'url_cta'         => get_post_meta($post_id, '_edr_offre_url_cta', true),
		'mise_en_avant'   => get_post_meta($post_id, '_edr_offre_mise_en_avant', true) ?: '0',
		'rune_ou_symbole' => get_post_meta($post_id, '_edr_offre_rune_ou_symbole', true),
	);
}

function edr_core_set_default_offre_meta($post_id, $post, $update) {
	if ($update || 'offre' !== $post->post_type) {
		return;
	}

	if ('' === get_post_meta($post_id, '_edr_offre_mise_en_avant', true)) {
		update_post_meta($post_id, '_edr_offre_mise_en_avant', '0');
	}
}

add_action('add_meta_boxes', 'edr_core_add_offre_meta_box');
add_action('save_post_offre', 'edr_core_save_offre_meta_fields');
add_action('wp_after_insert_post', 'edr_core_set_default_offre_meta', 10, 3);
