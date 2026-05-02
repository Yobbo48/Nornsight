<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();

if (function_exists('edr_elementor_page_uses_builder') && edr_elementor_page_uses_builder()) {
	while (have_posts()) :
		the_post();
		the_content();
	endwhile;

	get_footer();
	return;
}
?>
<section class="edr-page-hero">
	<div class="edr-container">
		<p class="edr-eyebrow"><?php esc_html_e('Page', 'edr-elementor'); ?></p>
		<h1><?php the_title(); ?></h1>
	</div>
</section>

<section class="edr-page-shell">
	<div class="edr-container">
		<?php while (have_posts()) : the_post(); ?>
			<div class="edr-content-panel entry-content">
				<?php the_content(); ?>
			</div>
		<?php endwhile; ?>
	</div>
</section>
<?php get_footer(); ?>
