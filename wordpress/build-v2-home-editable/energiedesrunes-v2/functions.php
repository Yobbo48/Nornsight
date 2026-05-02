<?php
/**
 * L'Énergie des Runes v2 — Functions
 */
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'EDR_VER', '2.0.0' );
define( 'EDR_DIR', get_template_directory() );
define( 'EDR_URI', get_template_directory_uri() );

/* ============================================================
   SETUP
   ============================================================ */
function edr_setup() {
    load_theme_textdomain( 'energiedesrunes', EDR_DIR . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'html5', ['search-form','comment-form','comment-list','gallery','caption','style','script'] );

    // Taille d'image personnalisée pour les cards
    add_image_size( 'card-thumb', 560, 315, true );
    add_image_size( 'portrait',   480, 600, true );

    register_nav_menus([
        'primary' => 'Menu Principal',
        'mobile'  => 'Menu Mobile',
        'footer'  => 'Pied de page',
    ]);
}
add_action( 'after_setup_theme', 'edr_setup' );

/* ============================================================
   ASSETS
   ============================================================ */
function edr_assets() {
    wp_enqueue_style(
        'edr-fonts',
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap',
        [], null
    );
    wp_enqueue_style( 'edr-style', get_stylesheet_uri(), ['edr-fonts'], EDR_VER );
    wp_enqueue_script( 'edr-js', EDR_URI . '/js/main.js', [], EDR_VER, true );
    wp_localize_script( 'edr-js', 'edr', [
        'ajax'  => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'edr_nonce' ),
    ]);
}
add_action( 'wp_enqueue_scripts', 'edr_assets' );

/* Editor styles */
function edr_editor_assets() {
    wp_enqueue_style(
        'edr-editor-fonts',
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap',
        [], null
    );
}
add_action( 'enqueue_block_editor_assets', 'edr_editor_assets' );

/* ============================================================
   WIDGETS
   ============================================================ */
function edr_widgets() {
    register_sidebar([
        'name'          => 'Sidebar Blog',
        'id'            => 'blog-sidebar',
        'before_widget' => '<div class="widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget__title">',
        'after_title'   => '</h4>',
    ]);
    register_sidebar([
        'name'          => 'Footer Widget',
        'id'            => 'footer-widget',
        'before_widget' => '<div class="widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget__title">',
        'after_title'   => '</h4>',
    ]);
}
add_action( 'widgets_init', 'edr_widgets' );

/* ============================================================
   CUSTOM POST TYPES
   ============================================================ */
function edr_cpts() {

    // Témoignages
    register_post_type( 'temoignage', [
        'labels'        => [
            'name'          => 'Témoignages',
            'singular_name' => 'Témoignage',
            'add_new_item'  => 'Ajouter un témoignage',
            'edit_item'     => 'Modifier le témoignage',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => true,
        'supports'      => ['title', 'editor'],
        'menu_icon'     => 'dashicons-format-quote',
        'menu_position' => 5,
    ]);

    // Services
    register_post_type( 'service', [
        'labels'        => [
            'name'          => 'Services',
            'singular_name' => 'Service',
            'add_new_item'  => 'Ajouter un service',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'supports'      => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'     => 'dashicons-star-filled',
        'rewrite'       => ['slug' => 'services'],
        'menu_position' => 6,
    ]);

    // Formations
    register_post_type( 'formation', [
        'labels'        => [
            'name'          => 'Formations',
            'singular_name' => 'Formation',
            'add_new_item'  => 'Ajouter une formation',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'supports'      => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'     => 'dashicons-welcome-learn-more',
        'rewrite'       => ['slug' => 'formations'],
        'menu_position' => 7,
    ]);
}
add_action( 'init', 'edr_cpts' );

/* ============================================================
   META BOXES — Service & Formation
   Permet de modifier prix, durée, modalité directement dans WP
   ============================================================ */
function edr_meta_boxes() {
    add_meta_box( 'edr_service_meta', 'Informations du service', 'edr_service_meta_cb', 'service', 'side' );
    add_meta_box( 'edr_formation_meta', 'Informations de la formation', 'edr_formation_meta_cb', 'formation', 'side' );
    add_meta_box( 'edr_temoignage_meta', 'Détails', 'edr_temoignage_meta_cb', 'temoignage', 'side' );
}
add_action( 'add_meta_boxes', 'edr_meta_boxes' );

function edr_service_meta_cb( $post ) {
    wp_nonce_field( 'edr_meta', 'edr_meta_nonce' );
    $prix     = get_post_meta( $post->ID, '_service_prix', true );
    $duree    = get_post_meta( $post->ID, '_service_duree', true );
    $modalite = get_post_meta( $post->ID, '_service_modalite', true );
    $rune     = get_post_meta( $post->ID, '_service_rune', true );
    echo '<p><label><strong>Prix / Tarif</strong><br><input type="text" name="service_prix" value="' . esc_attr($prix) . '" class="widefat" placeholder="ex: À partir de 60€"></label></p>';
    echo '<p><label><strong>Durée</strong><br><input type="text" name="service_duree" value="' . esc_attr($duree) . '" class="widefat" placeholder="ex: 1h · 30 min"></label></p>';
    echo '<p><label><strong>Modalité</strong><br><input type="text" name="service_modalite" value="' . esc_attr($modalite) . '" class="widefat" placeholder="ex: En ligne · À distance"></label></p>';
    echo '<p><label><strong>Rune (symbole)</strong><br><input type="text" name="service_rune" value="' . esc_attr($rune) . '" class="widefat" placeholder="ex: ᚱ"></label></p>';
}

function edr_formation_meta_cb( $post ) {
    wp_nonce_field( 'edr_meta', 'edr_meta_nonce' );
    $prix    = get_post_meta( $post->ID, '_formation_prix', true );
    $niveau  = get_post_meta( $post->ID, '_formation_niveau', true );
    $duree   = get_post_meta( $post->ID, '_formation_duree', true );
    $rune    = get_post_meta( $post->ID, '_formation_rune', true );
    echo '<p><label><strong>Prix</strong><br><input type="text" name="formation_prix" value="' . esc_attr($prix) . '" class="widefat" placeholder="ex: 89€"></label></p>';
    echo '<p><label><strong>Niveau</strong><br><select name="formation_niveau" class="widefat"><option value="Débutant"' . selected($niveau,'Débutant',false) . '>Débutant</option><option value="Intermédiaire"' . selected($niveau,'Intermédiaire',false) . '>Intermédiaire</option><option value="Avancé"' . selected($niveau,'Avancé',false) . '>Avancé</option></select></label></p>';
    echo '<p><label><strong>Durée / Volume</strong><br><input type="text" name="formation_duree" value="' . esc_attr($duree) . '" class="widefat" placeholder="ex: 4 modules vidéo"></label></p>';
    echo '<p><label><strong>Rune (symbole)</strong><br><input type="text" name="formation_rune" value="' . esc_attr($rune) . '" class="widefat" placeholder="ex: ᚠ"></label></p>';
}

function edr_temoignage_meta_cb( $post ) {
    wp_nonce_field( 'edr_meta', 'edr_meta_nonce' );
    $service = get_post_meta( $post->ID, '_temo_service', true );
    $note    = get_post_meta( $post->ID, '_temo_note', true );
    echo '<p><label><strong>Service concerné</strong><br><input type="text" name="temo_service" value="' . esc_attr($service) . '" class="widefat" placeholder="ex: Tirage de runes"></label></p>';
    echo '<p><label><strong>Note (1-5)</strong><br><input type="number" name="temo_note" value="' . esc_attr($note ?: 5) . '" min="1" max="5" class="widefat"></label></p>';
}

function edr_save_meta( $post_id ) {
    if ( ! isset($_POST['edr_meta_nonce']) || ! wp_verify_nonce($_POST['edr_meta_nonce'], 'edr_meta') ) return;
    if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) return;
    if ( ! current_user_can('edit_post', $post_id) ) return;

    $fields = [
        'service_prix'     => '_service_prix',
        'service_duree'    => '_service_duree',
        'service_modalite' => '_service_modalite',
        'service_rune'     => '_service_rune',
        'formation_prix'   => '_formation_prix',
        'formation_niveau' => '_formation_niveau',
        'formation_duree'  => '_formation_duree',
        'formation_rune'   => '_formation_rune',
        'temo_service'     => '_temo_service',
        'temo_note'        => '_temo_note',
    ];
    foreach ( $fields as $post_key => $meta_key ) {
        if ( isset($_POST[$post_key]) ) {
            update_post_meta( $post_id, $meta_key, sanitize_text_field($_POST[$post_key]) );
        }
    }
}
add_action( 'save_post', 'edr_save_meta' );

/* ============================================================
   NEWSLETTER AJAX
   ============================================================ */
function edr_newsletter() {
    check_ajax_referer( 'edr_nonce', 'nonce' );
    $email = sanitize_email( $_POST['email'] ?? '' );
    if ( ! is_email($email) ) {
        wp_send_json_error(['message' => 'Adresse email invalide.']);
    }
    $list = get_option('edr_subscribers', []);
    if ( in_array($email, $list) ) {
        wp_send_json_success(['message' => 'Vous êtes déjà inscrit(e). Merci !']);
    }
    $list[] = $email;
    update_option('edr_subscribers', $list);
    // TODO : brancher ici l'API Brevo / Mailchimp
    wp_send_json_success(['message' => 'Merci ! Vous êtes bien inscrit(e).']);
}
add_action('wp_ajax_edr_newsletter',       'edr_newsletter');
add_action('wp_ajax_nopriv_edr_newsletter','edr_newsletter');

/* ============================================================
   CUSTOMIZER — options simples sans plugin
   ============================================================ */
function edr_customizer( $wp_customize ) {
    $wp_customize->add_section('edr_section', [
        'title'    => 'L\'Énergie des Runes',
        'priority' => 30,
    ]);

    $options = [
        'edr_phone'          => ['label' => 'Téléphone',          'default' => '07.78.54.89.77'],
        'edr_email'          => ['label' => 'Email',               'default' => 'contact@lenergiedesrunes.com'],
        'edr_calendly'       => ['label' => 'URL Calendly',        'default' => 'https://calendly.com/lenergiedesrunes'],
        'edr_nornsight_url'  => ['label' => 'URL Nornsight',       'default' => 'https://nornsight.com'],
        'edr_instagram'      => ['label' => 'Instagram URL',       'default' => 'https://www.instagram.com/lenergiedesrunes'],
        'edr_youtube'        => ['label' => 'YouTube URL',         'default' => 'https://www.youtube.com/@lenergiedesrunes'],
        'edr_facebook'       => ['label' => 'Facebook URL',        'default' => 'https://www.facebook.com/lenergiedesrunes'],
        'edr_tiktok'         => ['label' => 'TikTok URL',          'default' => ''],
        'edr_book_url'       => ['label' => 'Lien commande livre', 'default' => 'https://linktr.ee/lenergiedesrunes'],
        'edr_google_reviews' => ['label' => 'Lien avis Google',   'default' => '#'],
        'edr_hero_title'     => ['label' => 'Titre Hero',          'default' => 'Guidance runique & soins énergétiques'],
        'edr_hero_subtitle'  => ['label' => 'Sous-titre Hero',     'default' => 'Tirages de runes, soins énergétiques et accompagnement personnel — en ligne, partout en France.'],
    ];

    foreach ( $options as $id => $args ) {
        $wp_customize->add_setting( $id, ['default' => $args['default'], 'sanitize_callback' => 'sanitize_text_field'] );
        $wp_customize->add_control( $id, ['label' => $args['label'], 'section' => 'edr_section', 'type' => 'text'] );
    }
}
add_action( 'customize_register', 'edr_customizer' );

/* Helper : get customizer option with fallback */
function edr_opt( $key, $fallback = '' ) {
    return get_theme_mod( $key, $fallback );
}

/* ============================================================
   EXCERPT
   ============================================================ */
add_filter('excerpt_length', fn() => 22);
add_filter('excerpt_more',   fn() => '…');

/* ============================================================
   SÉCURITÉ
   ============================================================ */
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
