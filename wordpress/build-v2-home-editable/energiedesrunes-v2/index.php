<?php get_header(); ?>

<main id="main-content">

<!-- ============================================================
     HERO
     ============================================================ -->
<section class="hero" aria-label="Présentation">

  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__watermark" aria-hidden="true">ᚱ</div>

  <div class="wrap">
    <div class="hero__inner">

      <!-- Contenu texte -->
      <div class="hero__content">

        <span class="eyebrow">Tirages de runes · Soins énergétiques · Formations</span>

        <h1 class="hero__title">
          <?php echo wp_kses_post(
            edr_opt('edr_hero_title',
              'Guidance runique &amp; soins énergétiques<br><span>pour avancer avec clarté</span>'
            )
          ); ?>
        </h1>

        <p class="hero__lead">
          <?php echo esc_html(
            edr_opt('edr_hero_subtitle',
              'Tirages de runes personnalisés, soins énergétiques et accompagnement spirituel — en ligne depuis toute la France. Depuis 2015, j\'aide ceux qui se sentent bloqués à retrouver clarté, direction et alignement.'
            )
          ); ?>
        </p>

        <div class="hero__actions">
          <a href="<?php echo esc_url(home_url('/reservation')); ?>" class="btn btn--primary btn--lg">
            Réserver une séance
          </a>
          <a href="<?php echo esc_url(home_url('/services')); ?>" class="btn btn--outline btn--lg">
            Découvrir les services
          </a>
        </div>

        <div class="hero__trust" aria-label="Preuves sociales">
          <div class="hero__trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>21 avis 5&nbsp;étoiles Google</span>
          </div>
          <div class="hero__trust-sep" aria-hidden="true"></div>
          <div class="hero__trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>8&nbsp;ans de pratique</span>
          </div>
          <div class="hero__trust-sep" aria-hidden="true"></div>
          <div class="hero__trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>Séances en ligne &amp; à distance</span>
          </div>
        </div>

      </div><!-- /.hero__content -->

      <!-- Card hero (visible desktop) -->
      <div class="hero__visual" aria-hidden="true">
        <div class="hero__card">
          <div class="hero__card-label">Le Futhark ancien — 24 runes</div>
          <div class="hero__card-runes">
            <?php
            $runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ'];
            foreach ($runes as $r) echo '<div class="hero__card-rune">' . $r . '</div>';
            ?>
          </div>
          <p class="hero__card-desc">
            Chaque rune porte une énergie millénaire. En tirage ou en soin, elles mettent en lumière ce qui se joue dans votre vie pour vous aider à avancer.
          </p>
          <a href="<?php echo esc_url(home_url('/reservation')); ?>" class="btn btn--primary hero__card-cta">
            Essayer un tirage
          </a>
          <div class="hero__stats">
            <div>
              <div class="hero__stat-val">8+</div>
              <div class="hero__stat-lbl">ans de pratique</div>
            </div>
            <div>
              <div class="hero__stat-val">21</div>
              <div class="hero__stat-lbl">avis 5★ Google</div>
            </div>
            <div>
              <div class="hero__stat-val">100%</div>
              <div class="hero__stat-lbl">en ligne</div>
            </div>
          </div>
        </div>
      </div><!-- /.hero__visual -->

    </div>
  </div>
</section>

<!-- ============================================================
     BANNIÈRE LIVRE
     ============================================================ -->
<div class="book-strip" role="complementary" aria-label="Le Petit Guide des Runes">
  <div class="wrap">
    <div class="book-strip__inner">
      <?php
      $book_img = get_theme_mod('edr_book_image');
      if ($book_img) : ?>
        <img src="<?php echo esc_url($book_img); ?>" alt="Couverture du Petit Guide des Runes de Kévin Legros" class="book-strip__cover" loading="lazy" width="90" height="130">
      <?php endif; ?>
      <div class="book-strip__content">
        <span class="eyebrow" style="color:var(--c-gold-light);">Disponible maintenant</span>
        <h2 style="font-size:1.25rem;color:#fff;margin-bottom:0.4rem;">Le Petit Guide des Runes</h2>
        <p>Symboles, énergies et tirages — fruit de plus de 10&nbsp;ans de pratique des runes nordiques. Un livre accessible pour débutants et passionnés.</p>
        <div class="book-strip__shops">
          <span class="book-strip__shop">Fnac</span>
          <span class="book-strip__shop">Cultura</span>
          <span class="book-strip__shop">Amazon</span>
          <span class="book-strip__shop">Furet du Nord</span>
          <span class="book-strip__shop">Librairies indépendantes</span>
        </div>
        <a href="<?php echo esc_url(edr_opt('edr_book_url','https://linktr.ee/lenergiedesrunes')); ?>" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm">
          Commander le livre →
        </a>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================
     SERVICES
     ============================================================ -->
<section aria-labelledby="services-title">
  <div class="wrap">

    <header class="section-head reveal">
      <span class="eyebrow">Ce que je propose</span>
      <h2 id="services-title">Services de guidance et soins énergétiques</h2>
      <p class="lead">Que vous traversiez une séparation, une transition professionnelle ou simplement un sentiment de blocage — les runes et les soins énergétiques peuvent vous aider à y voir plus clair. Toutes les séances se font en ligne ou à distance.</p>
    </header>

    <div class="grid-auto">

      <?php
      // Essaie d'afficher les services depuis le CPT si renseignés
      $services_cpt = new WP_Query(['post_type'=>'service','posts_per_page'=>6,'orderby'=>'menu_order','order'=>'ASC']);
      if ($services_cpt->have_posts()) :
        while ($services_cpt->have_posts()) : $services_cpt->the_post();
          $rune     = get_post_meta(get_the_ID(),'_service_rune',true) ?: 'ᚱ';
          $prix     = get_post_meta(get_the_ID(),'_service_prix',true);
          $duree    = get_post_meta(get_the_ID(),'_service_duree',true);
          $modalite = get_post_meta(get_the_ID(),'_service_modalite',true);
      ?>
        <article class="service-card reveal" data-delay="1">
          <div class="service-card__icon" aria-hidden="true"><?php echo esc_html($rune); ?></div>
          <h3 class="service-card__title"><?php the_title(); ?></h3>
          <p class="service-card__desc"><?php echo wp_trim_words(get_the_excerpt(), 22); ?></p>
          <?php if ($prix || $duree || $modalite) : ?>
          <div class="service-card__tags">
            <?php if ($prix)     echo '<span class="service-card__tag">' . esc_html($prix) . '</span>'; ?>
            <?php if ($duree)    echo '<span class="service-card__tag">' . esc_html($duree) . '</span>'; ?>
            <?php if ($modalite) echo '<span class="service-card__tag">' . esc_html($modalite) . '</span>'; ?>
          </div>
          <?php endif; ?>
          <a href="<?php the_permalink(); ?>" class="service-card__link">En savoir plus →</a>
        </article>
      <?php
        endwhile;
        wp_reset_postdata();
      else :
        // Fallback statique — contenu réel du site
        $services_static = [
          [
            'rune'  => 'ᚱ',
            'titre' => 'Tirage de runes',
            'desc'  => 'Une guidance personnalisée par les runes nordiques pour éclairer vos décisions, comprendre vos blocages et retrouver votre direction. Idéal lors d\'une transition amoureuse, professionnelle ou personnelle.',
            'tags'  => ['30 min · 1h', 'Par email ou visio', 'À partir de 35€'],
            'url'   => home_url('/services/tirages-de-runes'),
          ],
          [
            'rune'  => 'ᛁ',
            'titre' => 'Soin énergétique runique',
            'desc'  => 'Une approche holistique unique combinant Soin Runique, Lithomonde, Reiki et Lithothérapie. Le soin travaille les corps physique, émotionnel et énergétique pour libérer les blocages et retrouver l\'équilibre.',
            'tags'  => ['~1h15', 'En ligne · Visio', 'Distanciel'],
            'url'   => home_url('/services/soins-energetiques'),
          ],
          [
            'rune'  => 'ᛊ',
            'titre' => 'Médiumnité & Voyance',
            'desc'  => 'Une connexion intuitive pour apporter des réponses claires sur votre chemin de vie, vos relations et vos transitions. Séance individuelle en toute confidentialité.',
            'tags'  => ['Séance individuelle', 'En ligne'],
            'url'   => home_url('/services/mediumnite'),
          ],
          [
            'rune'  => 'ᛈ',
            'titre' => 'Lecture de vies antérieures',
            'desc'  => 'Lecture et nettoyage des mémoires karmiques pour lever les blocages profonds qui persistent malgré vos efforts. Prestation en duo combinant runes et médiumnité.',
            'tags'  => ['Séance duo', 'Runes + Médiumnité'],
            'url'   => home_url('/services/vies-anterieures'),
          ],
          [
            'rune'  => 'ᚷ',
            'titre' => 'Ateliers & Formations',
            'desc'  => 'Initiations aux runes en groupe ou formations en ligne pour apprendre à pratiquer par vous-même. Découvrez le Futhark ancien et intégrez les runes dans votre quotidien.',
            'tags'  => ['En ligne', 'À votre rythme'],
            'url'   => home_url('/formations'),
          ],
          [
            'rune'  => 'ᚨ',
            'titre' => 'Purification des lieux',
            'desc'  => 'Nettoyage énergétique de votre espace de vie ou de travail pour dissoudre les énergies stagnantes, rétablir l\'harmonie et créer une atmosphère propice au bien-être.',
            'tags'  => ['Sur devis', 'À distance'],
            'url'   => home_url('/services/purification'),
          ],
        ];
        $delay = 0;
        foreach ($services_static as $s) :
          $delay = ($delay % 4) + 1;
      ?>
        <article class="service-card reveal" data-delay="<?php echo $delay; ?>">
          <div class="service-card__icon" aria-hidden="true"><?php echo $s['rune']; ?></div>
          <h3 class="service-card__title"><?php echo esc_html($s['titre']); ?></h3>
          <p class="service-card__desc"><?php echo esc_html($s['desc']); ?></p>
          <div class="service-card__tags">
            <?php foreach ($s['tags'] as $t) echo '<span class="service-card__tag">' . esc_html($t) . '</span>'; ?>
          </div>
          <a href="<?php echo esc_url($s['url']); ?>" class="service-card__link">En savoir plus →</a>
        </article>
      <?php endforeach; endif; ?>

    </div><!-- /.grid-auto -->

    <div style="text-align:center;margin-top:3rem;" class="reveal">
      <a href="<?php echo esc_url(home_url('/reservation')); ?>" class="btn btn--primary btn--lg">Réserver ma séance</a>
      <a href="<?php echo esc_url(home_url('/services')); ?>" class="btn btn--outline btn--lg" style="margin-left:0.85rem;">Voir tous les services</a>
    </div>

  </div>
</section>

<!-- ============================================================
     À PROPOS
     ============================================================ -->
<section class="section--soft" aria-labelledby="about-title">
  <div class="wrap">
    <div class="grid-2">

      <div class="about__img-wrap reveal">
        <?php
        $about_img = get_theme_mod('edr_about_image');
        if ($about_img) : ?>
          <img src="<?php echo esc_url($about_img); ?>"
               alt="Kévin Legros, praticien en runes et soins énergétiques depuis 2015"
               class="about__img"
               loading="lazy"
               width="480" height="600">
        <?php else : ?>
          <div class="about__img-placeholder">
            <span aria-hidden="true">ᚲ</span>
          </div>
        <?php endif; ?>
        <div class="about__img-badge">
          <strong>8+</strong>
          <small>ans de pratique</small>
        </div>
      </div>

      <div class="about__content reveal" data-delay="2">
        <span class="eyebrow">À propos</span>
        <h2 id="about-title">Kévin Legros — Praticien en runes et soins énergétiques</h2>

        <p>Issu du monde du commerce et de l'informatique, j'ai longtemps cherché ma voie avant de découvrir les runes nordiques en 2015. Ce qui devait être une curiosité est devenu une vocation.</p>

        <p>Aujourd'hui, mon approche est directe, bienveillante et sans jugement. Je n'attends pas de vous que vous croyiez en quoi que ce soit — seulement que vous soyez prêt(e) à regarder honnêtement votre situation. Les runes font le reste.</p>

        <p>Que vous traversiez une rupture, une transition professionnelle ou un sentiment de blocage inexpliqué, une séance peut suffire à y voir plus clair.</p>

        <div class="about__parcours" aria-label="Parcours de formation">
          <div class="about__step">
            <span class="about__step-year">2015</span>
            <p class="about__step-text">Apprentissage approfondi des runes du Futhark ancien</p>
          </div>
          <div class="about__step">
            <span class="about__step-year">2016</span>
            <p class="about__step-text">Certification Reiki Usui niveau I</p>
          </div>
          <div class="about__step">
            <span class="about__step-year">2019</span>
            <p class="about__step-text">Certification Reiki Usui niveau II</p>
          </div>
          <div class="about__step">
            <span class="about__step-year">2022</span>
            <p class="about__step-text">Lithomonde® niveaux I et II · Aromathérapie · Lithothérapie</p>
          </div>
          <div class="about__step">
            <span class="about__step-year">2023</span>
            <p class="about__step-text">Lithomonde® niveau III · Tarot de Marseille</p>
          </div>
          <div class="about__step">
            <span class="about__step-year">2024</span>
            <p class="about__step-text">Publication du Petit Guide des Runes (éditions MLL)</p>
          </div>
        </div>

        <a href="<?php echo esc_url(home_url('/a-propos')); ?>" class="btn btn--outline">En savoir plus sur mon parcours</a>
      </div>

    </div>
  </div>
</section>

<!-- ============================================================
     NORNSIGHT
     ============================================================ -->
<section>
  <div class="wrap">
    <div class="nornsight reveal" role="complementary" aria-label="Nornsight — tirage de runes par IA">
      <div>
        <span class="eyebrow" style="color:var(--c-gold-light);">Nouveau · Intelligence Artificielle</span>
        <h2 class="nornsight__title">Découvrez Nornsight — tirage de runes gratuit</h2>
        <p class="nornsight__text">
          J'ai conçu et développé Nornsight, une application de tirage de runes assistée par l'IA. Explorez les runes gratuitement, obtenez une lecture approfondie, puis venez approfondir avec moi en séance live si vous le souhaitez.
        </p>
      </div>
      <div class="nornsight__actions">
        <a href="<?php echo esc_url(edr_opt('edr_nornsight_url','https://nornsight.com')); ?>"
           target="_blank" rel="noopener noreferrer"
           class="btn btn--ghost">
          Essayer gratuitement
        </a>
        <a href="<?php echo esc_url(home_url('/reservation')); ?>" class="btn btn--primary">
          Séance avec Kévin
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     TÉMOIGNAGES
     ============================================================ -->
<section class="section--soft" aria-labelledby="temoignages-title">
  <div class="wrap">

    <header class="section-head section-head--center reveal">
      <span class="eyebrow">Témoignages</span>
      <h2 id="temoignages-title">Ce qu'ils disent après leur séance</h2>
      <p class="lead">21 avis 5 étoiles sur Google. Chaque accompagnement est unique — voici quelques retours.</p>
    </header>

    <div class="grid-3">
      <?php
      $temos = new WP_Query(['post_type'=>'temoignage','posts_per_page'=>3,'orderby'=>'rand']);
      if ($temos->have_posts()) :
        while ($temos->have_posts()) : $temos->the_post();
          $service = get_post_meta(get_the_ID(),'_temo_service',true);
      ?>
        <article class="testimonial reveal" data-delay="1">
          <div class="testimonial__stars" aria-label="5 étoiles">★★★★★</div>
          <p class="testimonial__text"><?php echo wp_kses_post(get_the_content()); ?></p>
          <div class="testimonial__author"><?php the_title(); ?></div>
          <?php if ($service) echo '<div class="testimonial__service">' . esc_html($service) . '</div>'; ?>
        </article>
      <?php
        endwhile;
        wp_reset_postdata();
      else :
        $temos_static = [
          ['auteur'=>'Marie L.','service'=>'Tirage de runes','texte'=>'Une séance qui m\'a vraiment permis de voir clair dans une situation que je traînais depuis des mois. Kévin est précis, à l\'écoute et totalement sans jugement. Je recommande les yeux fermés.'],
          ['auteur'=>'Sophie R.','service'=>'Soin énergétique','texte'=>'Je suis venue pour une transition professionnelle difficile. Le tirage a mis le doigt exactement sur ce qui me bloquait. Bluffant de justesse. J\'ai ressorti la séance avec un vrai sentiment de légèreté.'],
          ['auteur'=>'Thomas M.','service'=>'Tirage de runes','texte'=>'Après une séparation douloureuse, cette séance m\'a aidé à retrouver confiance en moi et à comprendre ce dont j\'avais besoin. Kévin sait créer un espace de confiance rare.'],
        ];
        foreach ($temos_static as $i => $t) : ?>
          <article class="testimonial reveal" data-delay="<?php echo $i+1; ?>">
            <div class="testimonial__stars" aria-label="5 étoiles">★★★★★</div>
            <p class="testimonial__text"><?php echo esc_html($t['texte']); ?></p>
            <div class="testimonial__author"><?php echo esc_html($t['auteur']); ?></div>
            <div class="testimonial__service"><?php echo esc_html($t['service']); ?></div>
          </article>
      <?php endforeach; endif; ?>
    </div>

    <div style="text-align:center;margin-top:2.5rem;" class="reveal">
      <a href="<?php echo esc_url(edr_opt('edr_google_reviews','#')); ?>"
         target="_blank" rel="noopener noreferrer"
         class="btn btn--dark">
        Voir les 21 avis Google
      </a>
    </div>

  </div>
</section>

<!-- ============================================================
     FORMATIONS — aperçu
     ============================================================ -->
<section aria-labelledby="formations-title">
  <div class="wrap">

    <header class="section-head reveal">
      <span class="eyebrow">Formations en ligne</span>
      <h2 id="formations-title">Apprenez à lire les runes par vous-même</h2>
      <p class="lead">Des formations accessibles pour découvrir les runes nordiques, réaliser vos propres tirages et intégrer leur sagesse dans votre quotidien — à votre rythme, depuis chez vous.</p>
    </header>

    <div class="grid-3">
      <?php
      $formations = new WP_Query(['post_type'=>'formation','posts_per_page'=>3,'orderby'=>'menu_order','order'=>'ASC']);
      if ($formations->have_posts()) :
        while ($formations->have_posts()) : $formations->the_post();
          $prix   = get_post_meta(get_the_ID(),'_formation_prix',true);
          $niveau = get_post_meta(get_the_ID(),'_formation_niveau',true);
          $rune   = get_post_meta(get_the_ID(),'_formation_rune',true) ?: 'ᚠ';
      ?>
        <article class="formation-card reveal" data-delay="1">
          <div class="formation-card__header" data-rune="<?php echo esc_attr($rune); ?>">
            <?php if ($niveau) echo '<span class="badge badge--dark formation-card__badge">' . esc_html($niveau) . '</span>'; ?>
            <h3 class="formation-card__title"><?php the_title(); ?></h3>
          </div>
          <div class="formation-card__body">
            <p class="formation-card__desc"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
            <?php if ($prix) echo '<div class="formation-card__price">' . esc_html($prix) . '<span>accès à vie</span></div>'; ?>
            <a href="<?php the_permalink(); ?>" class="btn btn--primary" style="width:100%;justify-content:center;">
              En savoir plus
            </a>
          </div>
        </article>
      <?php
        endwhile;
        wp_reset_postdata();
      else :
        $formations_static = [
          ['rune'=>'ᚠ','niveau'=>'Débutant','titre'=>'Initiation aux Runes','desc'=>'Découvrez le Futhark ancien, les 24 runes et leurs significations. Apprenez à réaliser vos premiers tirages en toute autonomie.','prix'=>'À venir'],
          ['rune'=>'ᚱ','niveau'=>'Intermédiaire','titre'=>'Tirages approfondis','desc'=>'Maîtrisez les tirages complexes, l\'interprétation fine des combinaisons de runes et leur application aux situations de vie concrètes.','prix'=>'À venir'],
          ['rune'=>'ᛟ','niveau'=>'Avancé','titre'=>'Runes et énergie','desc'=>'Travaillez avec l\'énergie des runes au quotidien — soins, intentions, protection et accompagnement de vos proches.','prix'=>'À venir'],
        ];
        foreach ($formations_static as $i => $f) : ?>
          <article class="formation-card reveal" data-delay="<?php echo $i+1; ?>">
            <div class="formation-card__header" data-rune="<?php echo esc_attr($f['rune']); ?>">
              <span class="badge badge--dark formation-card__badge"><?php echo esc_html($f['niveau']); ?></span>
              <h3 class="formation-card__title"><?php echo esc_html($f['titre']); ?></h3>
            </div>
            <div class="formation-card__body">
              <p class="formation-card__desc"><?php echo esc_html($f['desc']); ?></p>
              <div class="formation-card__price"><?php echo esc_html($f['prix']); ?> <span>accès à vie</span></div>
              <a href="<?php echo esc_url(home_url('/formations')); ?>" class="btn btn--primary" style="width:100%;justify-content:center;">
                En savoir plus
              </a>
            </div>
          </article>
      <?php endforeach; endif; ?>
    </div>

  </div>
</section>

<!-- ============================================================
     BLOG — derniers articles
     ============================================================ -->
<?php
$posts = new WP_Query(['post_type'=>'post','posts_per_page'=>3,'ignore_sticky_posts'=>true]);
if ($posts->have_posts()) : ?>
<section class="section--soft" aria-labelledby="blog-title">
  <div class="wrap">

    <header class="section-head reveal">
      <span class="eyebrow">Blog</span>
      <h2 id="blog-title">Runes, énergies et développement personnel</h2>
      <p class="lead">Articles, tirages thématiques et conseils pour mieux comprendre les runes et les soins énergétiques.</p>
    </header>

    <div class="grid-3">
      <?php while ($posts->have_posts()) : $posts->the_post(); ?>
        <article class="post-card reveal" data-delay="1">
          <?php if (has_post_thumbnail()) : ?>
            <a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
              <?php the_post_thumbnail('card-thumb', ['class'=>'post-card__img','loading'=>'lazy','alt'=>'']); ?>
            </a>
          <?php endif; ?>
          <div class="post-card__body">
            <?php
            $cats = get_the_category();
            if ($cats) echo '<div class="post-card__cat">' . esc_html($cats[0]->name) . '</div>';
            ?>
            <h3 class="post-card__title">
              <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h3>
            <p class="post-card__excerpt"><?php the_excerpt(); ?></p>
            <div class="post-card__meta"><?php echo get_the_date(); ?></div>
          </div>
        </article>
      <?php endwhile; wp_reset_postdata(); ?>
    </div>

    <div style="text-align:center;margin-top:2.5rem;" class="reveal">
      <a href="<?php echo esc_url(home_url('/blog')); ?>" class="btn btn--outline">Tous les articles</a>
    </div>

  </div>
</section>
<?php endif; ?>

<!-- ============================================================
     NEWSLETTER
     ============================================================ -->
<section class="newsletter" aria-labelledby="newsletter-title">
  <div class="wrap">
    <div class="newsletter__inner reveal">
      <div class="divider"><span class="divider__rune">ᛟ</span></div>
      <span class="eyebrow">Newsletter</span>
      <h2 id="newsletter-title">Tirages, conseils et guidances dans votre boîte mail</h2>
      <p>Rejoignez la liste et recevez régulièrement des tirages thématiques, des éclairages sur les runes et les actualités de L'Énergie des Runes. Sans spam.</p>
      <form class="newsletter__form" id="newsletter-form" novalidate>
        <label for="newsletter-email" class="sr-only">Votre adresse email</label>
        <input
          type="email"
          id="newsletter-email"
          class="newsletter__input"
          placeholder="votre@email.fr"
          required
          autocomplete="email"
        >
        <button type="submit" class="btn btn--primary">S'inscrire</button>
      </form>
      <p class="newsletter__msg" id="newsletter-msg" role="status" aria-live="polite"></p>
      <p class="newsletter__rgpd">Vos données ne sont jamais partagées. Désabonnement en un clic.</p>
    </div>
  </div>
</section>

</main><!-- /#main-content -->

<?php get_footer(); ?>
