<?php if (! defined('ABSPATH')) { exit; } ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div class="site-shell">
	<header class="site-header">
		<div class="container site-header__inner">
			<a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
				<span class="brand__name"><?php bloginfo('name'); ?></span>
				<span class="brand__tagline"><?php echo esc_html(lenergiedesrunes_theme_value('tagline_text', get_bloginfo('description'))); ?></span>
			</a>
			<nav class="site-nav" aria-label="<?php esc_attr_e('Menu principal', 'lenergiedesrunes'); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'fallback_cb'    => false,
					)
				);
				?>
			</nav>
			<?php $booking_url = lenergiedesrunes_theme_value('booking_url'); ?>
			<?php if ($booking_url) : ?>
				<a class="button" href="<?php echo esc_url($booking_url); ?>"><?php esc_html_e('Reserver', 'lenergiedesrunes'); ?></a>
			<?php endif; ?>
		</div>
	</header>
	<main id="content">
