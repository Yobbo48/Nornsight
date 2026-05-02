<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();
?>

<section class="page-hero">
	<div class="container">
		<p class="eyebrow"><?php esc_html_e('Ressources', 'lenergiedesrunes'); ?></p>
		<h1><?php the_archive_title(); ?></h1>
		<?php the_archive_description('<p class="section__intro">', '</p>'); ?>
	</div>
</section>

<section class="content-wrap">
	<div class="container">
		<div class="posts-grid">
			<?php if (have_posts()) : ?>
				<?php while (have_posts()) : the_post(); ?>
					<article class="article-card">
						<p class="eyebrow"><?php echo esc_html(get_the_date()); ?></p>
						<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
						<p><?php echo esc_html(get_the_excerpt()); ?></p>
					</article>
				<?php endwhile; ?>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php get_footer(); ?>
