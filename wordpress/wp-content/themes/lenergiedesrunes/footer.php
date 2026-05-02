<?php if (! defined('ABSPATH')) { exit; } ?>
	</main>
	<footer class="site-footer">
		<div class="container">
			<div class="footer-grid">
				<div>
					<h3><?php bloginfo('name'); ?></h3>
					<p><?php echo esc_html(lenergiedesrunes_theme_value('tagline_text', get_bloginfo('description'))); ?></p>
				</div>
				<div>
					<h3><?php esc_html_e('Contact', 'lenergiedesrunes'); ?></h3>
					<ul class="list-clean">
						<?php if (lenergiedesrunes_theme_value('contact_email')) : ?>
							<li><a href="mailto:<?php echo esc_attr(lenergiedesrunes_theme_value('contact_email')); ?>"><?php echo esc_html(lenergiedesrunes_theme_value('contact_email')); ?></a></li>
						<?php endif; ?>
						<?php if (lenergiedesrunes_theme_value('contact_phone')) : ?>
							<li><a href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', lenergiedesrunes_theme_value('contact_phone'))); ?>"><?php echo esc_html(lenergiedesrunes_theme_value('contact_phone')); ?></a></li>
						<?php endif; ?>
						<?php if (lenergiedesrunes_theme_value('booking_url')) : ?>
							<li><a href="<?php echo esc_url(lenergiedesrunes_theme_value('booking_url')); ?>"><?php esc_html_e('Prendre rendez-vous', 'lenergiedesrunes'); ?></a></li>
						<?php endif; ?>
					</ul>
				</div>
				<div>
					<h3><?php esc_html_e('Navigation', 'lenergiedesrunes'); ?></h3>
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'footer',
							'container'      => false,
							'fallback_cb'    => false,
						)
					);
					?>
				</div>
			</div>
			<div class="copyright">
				<?php echo esc_html(date_i18n('Y')); ?> - <?php bloginfo('name'); ?>
			</div>
		</div>
	</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
