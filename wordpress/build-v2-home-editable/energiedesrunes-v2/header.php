<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#faf9f7">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header" role="banner">
  <div class="wrap">
    <nav class="nav" role="navigation" aria-label="Navigation principale">

      <!-- Logo -->
      <a href="<?php echo esc_url(home_url('/')); ?>" class="nav__logo" aria-label="Accueil — L'Énergie des Runes">
        <?php if ( has_custom_logo() ) :
            the_custom_logo();
        else : ?>
          <span class="nav__logo-text">
            L'Énergie des Runes
            <span class="nav__logo-sub">Guidances · Soins · Formations</span>
          </span>
        <?php endif; ?>
      </a>

      <!-- Menu principal -->
      <?php
      wp_nav_menu([
        'theme_location' => 'primary',
        'container'      => false,
        'menu_class'     => 'nav__menu',
        'menu_id'        => 'nav-menu',
        'fallback_cb'    => false,
      ]);
      ?>

      <!-- CTA -->
      <div class="nav__cta">
        <a href="<?php echo esc_url(home_url('/reservation')); ?>" class="btn btn--primary btn--sm">
          Réserver une séance
        </a>
      </div>

      <!-- Burger mobile -->
      <button class="nav__burger" id="nav-burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-drawer">
        <span></span><span></span><span></span>
      </button>

    </nav>
  </div>

  <!-- Mobile drawer -->
  <div class="nav__drawer" id="nav-drawer" role="dialog" aria-label="Menu mobile" aria-hidden="true">
    <?php
    $mobile_menu_location = has_nav_menu('mobile') ? 'mobile' : 'primary';
    wp_nav_menu([
      'theme_location' => $mobile_menu_location,
      'container'      => false,
      'menu_class'     => 'nav__drawer-menu',
      'fallback_cb'    => false,
    ]);
    ?>
    <a href="<?php echo esc_url(home_url('/reservation')); ?>" class="btn btn--primary" style="text-align:center;margin-top:0.5rem;">
      Réserver une séance
    </a>
  </div>
</header>
