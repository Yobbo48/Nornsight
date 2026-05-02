<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();
?>
<section class="edr-page-shell">
	<div class="edr-container">
		<?php if (have_posts()) : ?>
			<?php while (have_posts()) : the_post(); ?>
				<article class="edr-content-panel entry-content">
					<?php the_content(); ?>
				</article>
			<?php endwhile; ?>
		<?php endif; ?>
	</div>
</section>
<?php get_footer(); ?>
