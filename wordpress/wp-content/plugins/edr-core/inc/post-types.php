<?php

if (! defined('ABSPATH')) {
	exit;
}

function edr_core_register_offre_post_type() {
	$labels = array(
		'name'                  => __('Offres', 'edr-core'),
		'singular_name'         => __('Offre', 'edr-core'),
		'menu_name'             => __('Offres', 'edr-core'),
		'name_admin_bar'        => __('Offre', 'edr-core'),
		'add_new'               => __('Ajouter', 'edr-core'),
		'add_new_item'          => __('Ajouter une offre', 'edr-core'),
		'edit_item'             => __('Modifier l’offre', 'edr-core'),
		'new_item'              => __('Nouvelle offre', 'edr-core'),
		'view_item'             => __('Voir l’offre', 'edr-core'),
		'view_items'            => __('Voir les offres', 'edr-core'),
		'search_items'          => __('Rechercher une offre', 'edr-core'),
		'not_found'             => __('Aucune offre trouvée.', 'edr-core'),
		'not_found_in_trash'    => __('Aucune offre dans la corbeille.', 'edr-core'),
		'all_items'             => __('Toutes les offres', 'edr-core'),
		'archives'              => __('Archives des offres', 'edr-core'),
		'attributes'            => __('Attributs de l’offre', 'edr-core'),
		'insert_into_item'      => __('Insérer dans l’offre', 'edr-core'),
		'uploaded_to_this_item' => __('Téléversé pour cette offre', 'edr-core'),
		'featured_image'        => __('Image mise en avant', 'edr-core'),
		'set_featured_image'    => __('Définir l’image mise en avant', 'edr-core'),
		'remove_featured_image' => __('Retirer l’image mise en avant', 'edr-core'),
		'use_featured_image'    => __('Utiliser comme image mise en avant', 'edr-core'),
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'show_in_rest'       => true,
		'menu_icon'          => 'dashicons-star-filled',
		'has_archive'        => true,
		'rewrite'            => array('slug' => 'offres'),
		'supports'           => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions'),
		'menu_position'      => 20,
		'publicly_queryable' => true,
		'show_in_menu'       => true,
		'show_in_nav_menus'  => true,
		'delete_with_user'   => false,
	);

	register_post_type('offre', $args);
}

add_action('init', 'edr_core_register_offre_post_type');
