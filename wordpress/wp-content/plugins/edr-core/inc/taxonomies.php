<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_register_type_offre_taxonomy() {
	$labels = array(
		'name'              => __('Types d’offre', 'edr-core'),
		'singular_name'     => __('Type d’offre', 'edr-core'),
		'search_items'      => __('Rechercher un type d’offre', 'edr-core'),
		'all_items'         => __('Tous les types d’offre', 'edr-core'),
		'parent_item'       => __('Type parent', 'edr-core'),
		'parent_item_colon' => __('Type parent :', 'edr-core'),
		'edit_item'         => __('Modifier le type d’offre', 'edr-core'),
		'update_item'       => __('Mettre à jour le type d’offre', 'edr-core'),
		'add_new_item'      => __('Ajouter un type d’offre', 'edr-core'),
		'new_item_name'     => __('Nom du type d’offre', 'edr-core'),
		'menu_name'         => __('Types d’offre', 'edr-core'),
	);

	$args = array(
		'labels'            => $labels,
		'public'            => true,
		'hierarchical'      => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => array('slug' => 'type-offre'),
	);

	register_taxonomy('type_offre', array('offre'), $args);
}

add_action('init', 'edr_core_register_type_offre_taxonomy');
