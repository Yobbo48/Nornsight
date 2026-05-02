<?php get_header(); ?>

<main id="main-content" style="padding-top:68px;min-height:60vh;">
  <div class="wrap--narrow" style="padding-block:clamp(3rem,6vw,5rem);">
    <?php while (have_posts()) : the_post(); ?>
      <article>
        <header style="margin-bottom:2.5rem;padding-bottom:2rem;border-bottom:1px solid var(--c-border);">
          <?php
          $cats = get_the_category();
          if ($cats) echo '<span class="eyebrow">' . esc_html($cats[0]->name) . '</span>';
          ?>
          <h1 style="margin-bottom:0.75rem;"><?php the_title(); ?></h1>
          <p style="color:var(--c-text-light);font-size:0.85rem;"><?php echo get_the_date(); ?></p>
        </header>
        <div class="entry-content" style="font-size:1.05rem;line-height:1.85;color:var(--c-text-mid);">
          <?php the_content(); ?>
        </div>
      </article>
    <?php endwhile; ?>
  </div>
</main>

<?php get_footer(); ?>
