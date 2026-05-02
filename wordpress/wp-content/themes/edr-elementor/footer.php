<?php if (! defined('ABSPATH')) { exit; } ?>
</main>
<?php if (! function_exists('elementor_theme_do_location') || ! elementor_theme_do_location('footer')) : ?>
	<footer class="edr-site-footer">
		<div class="edr-container">
			<div class="edr-site-footer__grid">
				<div>
					<h3><?php bloginfo('name'); ?></h3>
					<p><?php echo esc_html(edr_elementor_theme_value('edr_footer_text', 'Guidances runiques, soins énergétiques et transmission à distance, accessibles partout en France, sans déplacement.')); ?></p>
				</div>
				<div>
					<h3><?php esc_html_e('Contact', 'edr-elementor'); ?></h3>
					<ul class="edr-list-clean">
						<?php if (edr_elementor_theme_value('edr_contact_email')) : ?>
							<li><a href="mailto:<?php echo esc_attr(edr_elementor_theme_value('edr_contact_email')); ?>"><?php echo esc_html(edr_elementor_theme_value('edr_contact_email')); ?></a></li>
						<?php endif; ?>
						<?php if (edr_elementor_theme_value('edr_contact_phone')) : ?>
							<li><a href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', edr_elementor_theme_value('edr_contact_phone'))); ?>"><?php echo esc_html(edr_elementor_theme_value('edr_contact_phone')); ?></a></li>
						<?php endif; ?>
						<?php if (edr_elementor_theme_value('edr_booking_url')) : ?>
							<li><a href="<?php echo esc_url(edr_elementor_theme_value('edr_booking_url')); ?>"><?php esc_html_e('Prendre rendez-vous', 'edr-elementor'); ?></a></li>
						<?php endif; ?>
					</ul>
				</div>
				<div>
					<h3><?php esc_html_e('Navigation', 'edr-elementor'); ?></h3>
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
			<div class="edr-copyright"><?php echo esc_html(date_i18n('Y')); ?> - <?php bloginfo('name'); ?></div>
		</div>
	</footer>
<?php endif; ?>
</div>
<?php wp_footer(); ?>
</body>
</html>
