<?php
/**
 * Title: EDR / Bloc Newsletter
 * Slug: edr-core/newsletter-block
 * Categories: call-to-action
 * Inserter: true
 */
?>
<!-- wp:group {"className":"edr-newsletter-block edr-reveal","layout":{"type":"constrained"}} -->
<div class="wp-block-group edr-newsletter-block edr-reveal"><!-- wp:paragraph {"className":"edr-eyebrow"} -->
<p class="edr-eyebrow">Newsletter</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3} -->
<h3>Recevoir des contenus utiles autour des runes, des tirages et des temps de transition</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Sans spam. Désinscription en un clic. Une lettre simple, dense et utile.</p>
<!-- /wp:paragraph -->
<!-- wp:html -->
<div class="edr-newsletter-form">
  <form data-edr-newsletter-form>
    <input type="email" placeholder="Votre adresse email" required>
    <button type="submit" class="wp-element-button">S'inscrire</button>
    <p data-edr-newsletter-message></p>
  </form>
</div>
<!-- /wp:html --></div>
<!-- /wp:group -->
