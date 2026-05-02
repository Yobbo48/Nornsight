<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();
?>

<section class="page-hero">
	<div class="container">
		<p class="eyebrow"><?php esc_html_e('Blog', 'lenergiedesrunes'); ?></p>
		<h1><?php bloginfo('name'); ?></h1>
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
			<?php else : ?>
				<article class="article-card">
					<h2><?php esc_html_e('Aucun contenu pour le moment', 'lenergiedesrunes'); ?></h2>
				</article>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php get_footer(); ?>
