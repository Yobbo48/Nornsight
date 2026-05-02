<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();
?>
<section class="edr-page-hero">
	<div class="edr-container">
		<p class="edr-eyebrow"><?php esc_html_e('Article', 'edr-elementor'); ?></p>
		<h1><?php the_title(); ?></h1>
	</div>
</section>

<section class="edr-page-shell">
	<div class="edr-container">
		<?php while (have_posts()) : the_post(); ?>
			<article class="edr-content-panel entry-content">
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	</div>
</section>
<?php get_footer(); ?>
