<?php
if (! defined('ABSPATH')) {
	exit;
}

get_header();

$guidances  = lenergiedesrunes_get_page_by_path('guidances-runiques');
$soins      = lenergiedesrunes_get_page_by_path('soins-energetiques-en-ligne');
$ateliers   = lenergiedesrunes_get_page_by_path('ateliers-runes-en-ligne');
$apropos    = lenergiedesrunes_get_page_by_path('a-propos');
$booking    = lenergiedesrunes_theme_value('booking_url');
$book_url   = lenergiedesrunes_theme_value('book_url');
$hero_title = lenergiedesrunes_theme_value('hero_title', 'Guidances et soins energetiques en ligne par les runes');
$hero_text  = lenergiedesrunes_theme_value('hero_text', "Des seances a distance pour retrouver clarte, apaisement et elan dans les passages de doute, de transition ou de blocage.");
?>

<section class="hero">
	<div class="hero__veil" aria-hidden="true"></div>
	<div class="container hero__grid">
		<div>
			<p class="eyebrow"><?php esc_html_e('Activite 100% en ligne', 'lenergiedesrunes'); ?></p>
			<h1><?php echo esc_html($hero_title); ?></h1>
			<p><?php echo esc_html($hero_text); ?></p>
			<div class="hero__actions">
				<?php if ($booking) : ?>
					<a class="button" href="<?php echo esc_url($booking); ?>"><?php esc_html_e('Reserver une seance', 'lenergiedesrunes'); ?></a>
				<?php endif; ?>
				<?php if ($guidances) : ?>
					<a class="button button--secondary" href="<?php echo esc_url(get_permalink($guidances)); ?>"><?php esc_html_e('Decouvrir les guidances', 'lenergiedesrunes'); ?></a>
				<?php endif; ?>
			</div>
			<div class="hero__trust">
				<div class="trust-pill"><?php esc_html_e('Seances en ligne partout en France', 'lenergiedesrunes'); ?></div>
				<div class="trust-pill"><?php esc_html_e('Approche runique et energetique', 'lenergiedesrunes'); ?></div>
				<div class="trust-pill"><?php esc_html_e('Parcours clair, humain et rassurant', 'lenergiedesrunes'); ?></div>
			</div>
		</div>
		<aside class="hero__card">
			<div class="hero__rune-mark" aria-hidden="true">ᚱ</div>
			<p class="eyebrow"><?php esc_html_e('Pour qui', 'lenergiedesrunes'); ?></p>
			<ul class="list-clean list-clean--soft">
				<li><?php esc_html_e('Pour les personnes en recherche de clarte et de recentrage', 'lenergiedesrunes'); ?></li>
				<li><?php esc_html_e("Pour traverser un moment de doute, d'epuisement ou de transition", 'lenergiedesrunes'); ?></li>
				<li><?php esc_html_e('Pour recevoir un accompagnement sensible, structure et accessible a distance', 'lenergiedesrunes'); ?></li>
			</ul>
			<?php if ($booking) : ?>
				<a class="button hero__card-action" href="<?php echo esc_url($booking); ?>"><?php esc_html_e('Commencer ici', 'lenergiedesrunes'); ?></a>
			<?php endif; ?>
		</aside>
	</div>
</section>

<?php if ($book_url) : ?>
<section class="book-strip">
	<div class="container book-strip__inner">
		<div>
			<p class="eyebrow"><?php esc_html_e('Le livre', 'lenergiedesrunes'); ?></p>
			<h2 class="book-strip__title"><?php esc_html_e('Le Petit Guide des Runes', 'lenergiedesrunes'); ?></h2>
			<p><?php esc_html_e("Une porte d'entree claire et accessible pour decouvrir les symboles, les energies et les tirages runiques.", 'lenergiedesrunes'); ?></p>
		</div>
		<a class="button button--secondary" href="<?php echo esc_url($book_url); ?>"><?php esc_html_e('Voir le livre', 'lenergiedesrunes'); ?></a>
	</div>
</section>
<?php endif; ?>

<section class="section">
	<div class="container">
		<h2 class="section__title"><?php esc_html_e('Trois portes d entree', 'lenergiedesrunes'); ?></h2>
		<p class="section__intro"><?php esc_html_e("Le site doit conduire rapidement vers l'offre adaptee, sans noyer la visite dans trop de pages ou trop de promesses en meme temps.", 'lenergiedesrunes'); ?></p>
		<div class="services-grid">
			<?php foreach (array($guidances, $soins, $ateliers) as $page) : ?>
				<?php if (! $page) { continue; } ?>
				<article class="service-card">
					<div class="service-card__icon" aria-hidden="true">ᚠ</div>
					<h3><?php echo esc_html(get_the_title($page)); ?></h3>
					<p><?php echo esc_html(wp_trim_words(wp_strip_all_tags($page->post_content), 28)); ?></p>
					<a href="<?php echo esc_url(get_permalink($page)); ?>"><?php esc_html_e('Voir la page', 'lenergiedesrunes'); ?></a>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="section">
	<div class="container split">
		<div class="page-panel">
			<p class="eyebrow"><?php esc_html_e('Seances a distance', 'lenergiedesrunes'); ?></p>
			<h2 class="section__title"><?php esc_html_e('Comment se passe une seance en ligne ?', 'lenergiedesrunes'); ?></h2>
			<ul class="list-clean list-clean--steps">
				<li><?php esc_html_e('Prise de contact et cadrage du besoin', 'lenergiedesrunes'); ?></li>
				<li><?php esc_html_e('Seance a distance via visio, telephone ou format defini ensemble', 'lenergiedesrunes'); ?></li>
				<li><?php esc_html_e("Restitution claire, simple et ancree", 'lenergiedesrunes'); ?></li>
				<li><?php esc_html_e("Orientation vers l'offre la plus adaptee", 'lenergiedesrunes'); ?></li>
			</ul>
		</div>
		<div class="page-panel">
			<p class="eyebrow"><?php esc_html_e('A propos', 'lenergiedesrunes'); ?></p>
			<h2 class="section__title"><?php echo $apropos ? esc_html(get_the_title($apropos)) : esc_html__('Une approche claire et sensible', 'lenergiedesrunes'); ?></h2>
			<p><?php echo $apropos ? esc_html(wp_trim_words(wp_strip_all_tags($apropos->post_content), 48)) : esc_html__("Une pratique qui relie runes, intuition et accompagnement energetique, avec une volonte constante de rendre l'experience lisible, profonde et utile.", 'lenergiedesrunes'); ?></p>
			<?php if ($apropos) : ?>
				<a href="<?php echo esc_url(get_permalink($apropos)); ?>"><?php esc_html_e("Lire l'histoire", 'lenergiedesrunes'); ?></a>
			<?php endif; ?>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<h2 class="section__title"><?php esc_html_e('Articles recents', 'lenergiedesrunes'); ?></h2>
		<div class="posts-grid">
			<?php
			$recent_posts = new WP_Query(
				array(
					'post_type'      => 'post',
					'posts_per_page' => 4,
				)
			);

			if ($recent_posts->have_posts()) :
				while ($recent_posts->have_posts()) :
					$recent_posts->the_post();
					?>
					<article class="article-card">
						<div class="article-card__meta"><?php echo esc_html(get_the_date()); ?></div>
						<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p><?php echo esc_html(get_the_excerpt()); ?></p>
					</article>
					<?php
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<article class="article-card">
					<div class="article-card__meta"><?php esc_html_e('SEO', 'lenergiedesrunes'); ?></div>
					<h3><?php esc_html_e('Le blog alimentera ton SEO', 'lenergiedesrunes'); ?></h3>
					<p><?php esc_html_e('Ajoute ici des articles evergreen sur les runes, les guidances et les soins energetiques en ligne.', 'lenergiedesrunes'); ?></p>
				</article>
				<?php
			endif;
			?>
		</div>
	</div>
</section>

<?php get_footer(); ?>
