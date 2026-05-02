<?php
if (! defined('ABSPATH')) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div class="edr-site-shell">
<?php if (! function_exists('elementor_theme_do_location') || ! elementor_theme_do_location('header')) : ?>
	<header class="edr-site-header">
		<div class="edr-container">
			<div class="edr-site-header__frame">
				<a class="edr-brand" href="<?php echo esc_url(home_url('/')); ?>">
					<span class="edr-brand__logo">
						<?php if (has_custom_logo()) : ?>
							<?php the_custom_logo(); ?>
						<?php else : ?>
							<span class="edr-brand__seal" aria-hidden="true">ᚱ</span>
						<?php endif; ?>
					</span>
					<span class="edr-brand__text">
						<span class="edr-brand__name"><?php bloginfo('name'); ?></span>
						<span class="edr-brand__tagline"><?php bloginfo('description'); ?></span>
					</span>
				</a>

				<button class="edr-site-header__toggle" type="button" aria-expanded="false" aria-controls="edr-primary-nav">
					<span class="edr-site-header__toggle-line"></span>
					<span class="edr-site-header__toggle-line"></span>
					<span class="edr-site-header__toggle-line"></span>
					<span class="screen-reader-text"><?php esc_html_e('Ouvrir le menu', 'edr-elementor'); ?></span>
				</button>

				<nav id="edr-primary-nav" class="edr-site-nav" aria-label="<?php esc_attr_e('Navigation principale', 'edr-elementor'); ?>">
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'primary',
							'container'      => false,
							'fallback_cb'    => 'wp_page_menu',
							'menu_class'     => 'edr-site-nav__list',
						)
					);
					?>
				</nav>

				<div class="edr-site-header__meta">
					<div class="edr-site-header__meta-copy">
						<div class="edr-site-header__meta-top"><?php echo esc_html(edr_elementor_theme_value('edr_header_meta_top', 'Accessible partout en France')); ?></div>
						<div class="edr-site-header__meta-bottom"><?php echo esc_html(edr_elementor_theme_value('edr_header_meta_bottom', 'Téléphone · Visioconférence · Email')); ?></div>
					</div>
					<?php $booking_url = edr_elementor_theme_value('edr_booking_url'); ?>
					<?php if ($booking_url) : ?>
						<a class="edr-button" href="<?php echo esc_url($booking_url); ?>"><?php echo esc_html(edr_elementor_theme_value('edr_booking_label', 'Réserver une séance')); ?></a>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</header>
<?php endif; ?>
<main class="edr-main">
