<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();
?>

<section class="page-hero">
	<div class="container">
		<p class="eyebrow"><?php esc_html_e('Page', 'lenergiedesrunes'); ?></p>
		<h1><?php the_title(); ?></h1>
	</div>
</section>

<section class="content-wrap">
	<div class="container">
		<div class="page-panel entry-content">
			<?php
			while (have_posts()) :
				the_post();
				the_content();
			endwhile;
			?>
		</div>
	</div>
</section>

<?php get_footer(); ?>
