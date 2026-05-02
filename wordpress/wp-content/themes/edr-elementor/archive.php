<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();
?>
<section class="edr-page-hero">
	<div class="edr-container">
		<p class="edr-eyebrow"><?php esc_html_e('Archives', 'edr-elementor'); ?></p>
		<h1><?php the_archive_title(); ?></h1>
		<?php the_archive_description('<div class="entry-content">', '</div>'); ?>
	</div>
</section>

<section class="edr-page-shell">
	<div class="edr-container">
		<?php if (have_posts()) : ?>
			<?php while (have_posts()) : the_post(); ?>
				<article class="edr-content-panel" style="margin-bottom:1.25rem;">
					<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					<p><?php echo esc_html(get_the_excerpt()); ?></p>
				</article>
			<?php endwhile; ?>
		<?php endif; ?>
	</div>
</section>
<?php get_footer(); ?>
