import nodemailer from 'nodemailer';
import { getMailConfig } from './config/env.js';

let transporterPromise = null;

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function getTransporter() {
  if (transporterPromise) {
    return transporterPromise;
  }

  const config = getMailConfig();
  if (!config.enabled) {
    return null;
  }

  transporterPromise = Promise.resolve(
    nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password
      }
    })
  );

  return transporterPromise;
}

export function isMailEnabled() {
  return getMailConfig().enabled;
}

export function buildTransactionalMail({ locale = 'fr', type, question, reading = '', manageUrl = '' }) {
  const safeQuestion = question || (locale === 'en' ? 'your question' : 'ta question');
  const safeReading = String(reading || '').trim();

  const variants = {
    payment_received: {
      subject:
        locale === 'en'
          ? 'Your Nornsight payment has been received'
          : 'Ton paiement Nornsight a bien été reçu',
      text:
        locale === 'en'
          ? `We received your payment for the reading about: "${safeQuestion}".\n\nYour full reading is now being prepared. You will receive it by email as soon as it is ready.\n\n${manageUrl ? `Follow-up link: ${manageUrl}\n\n` : ''}Nornsight`
          : `Nous avons bien reçu ton paiement pour la lecture liée à : "${safeQuestion}".\n\nTa lecture approfondie est en préparation. Elle te sera envoyée par email dès qu’elle sera prête.\n\n${manageUrl ? `Lien de suivi : ${manageUrl}\n\n` : ''}Nornsight`,
      html:
        locale === 'en'
          ? `<p>We received your payment for the reading about:</p><p><strong>${escapeHtml(safeQuestion)}</strong></p><p>Your full reading is now being prepared. You will receive it by email as soon as it is ready.</p>${manageUrl ? `<p><a href="${escapeHtml(manageUrl)}">Follow the delivery status</a></p>` : ''}<p>Nornsight</p>`
          : `<p>Nous avons bien reçu ton paiement pour la lecture liée à :</p><p><strong>${escapeHtml(safeQuestion)}</strong></p><p>Ta lecture approfondie est en préparation. Elle te sera envoyée par email dès qu’elle sera prête.</p>${manageUrl ? `<p><a href="${escapeHtml(manageUrl)}">Suivre l’avancement</a></p>` : ''}<p>Nornsight</p>`
    },
    reading_delivered: {
      subject:
        locale === 'en'
          ? 'Your Nornsight reading is ready'
          : 'Ta lecture Nornsight est prête',
      text:
        locale === 'en'
          ? `Your full reading for "${safeQuestion}" is ready.\n\n${safeReading}\n\n${manageUrl ? `You can also read it here: ${manageUrl}\n\n` : ''}Nornsight`
          : `Ta lecture approfondie pour "${safeQuestion}" est prête.\n\n${safeReading}\n\n${manageUrl ? `Tu peux aussi la relire ici : ${manageUrl}\n\n` : ''}Nornsight`,
      html:
        locale === 'en'
          ? `<p>Your full reading for <strong>${escapeHtml(safeQuestion)}</strong> is ready.</p><div style="white-space:pre-line;line-height:1.7;">${escapeHtml(safeReading)}</div>${manageUrl ? `<p><a href="${escapeHtml(manageUrl)}">Read it again online</a></p>` : ''}<p>Nornsight</p>`
          : `<p>Ta lecture approfondie pour <strong>${escapeHtml(safeQuestion)}</strong> est prête.</p><div style="white-space:pre-line;line-height:1.7;">${escapeHtml(safeReading)}</div>${manageUrl ? `<p><a href="${escapeHtml(manageUrl)}">La relire en ligne</a></p>` : ''}<p>Nornsight</p>`
    },
    delivery_delayed: {
      subject:
        locale === 'en'
          ? 'Your Nornsight reading is delayed'
          : 'Ta lecture Nornsight prend un peu plus de temps',
      text:
        locale === 'en'
          ? `Your payment was confirmed, but the full reading could not be delivered immediately for "${safeQuestion}".\n\nIt has not been lost. We will retry the delivery and keep the order traceable.\n\n${manageUrl ? `Follow-up link: ${manageUrl}\n\n` : ''}Nornsight`
          : `Ton paiement a bien été confirmé, mais la lecture approfondie n’a pas pu être livrée immédiatement pour "${safeQuestion}".\n\nElle n’est pas perdue. La demande reste tracée et la livraison pourra être relancée proprement.\n\n${manageUrl ? `Lien de suivi : ${manageUrl}\n\n` : ''}Nornsight`,
      html:
        locale === 'en'
          ? `<p>Your payment was confirmed, but the full reading could not be delivered immediately for <strong>${escapeHtml(safeQuestion)}</strong>.</p><p>It has not been lost. We will retry the delivery and keep the order traceable.</p>${manageUrl ? `<p><a href="${escapeHtml(manageUrl)}">Follow the delivery status</a></p>` : ''}<p>Nornsight</p>`
          : `<p>Ton paiement a bien été confirmé, mais la lecture approfondie n’a pas pu être livrée immédiatement pour <strong>${escapeHtml(safeQuestion)}</strong>.</p><p>Elle n’est pas perdue. La demande reste tracée et la livraison pourra être relancée proprement.</p>${manageUrl ? `<p><a href="${escapeHtml(manageUrl)}">Suivre l’avancement</a></p>` : ''}<p>Nornsight</p>`
    }
  };

  return variants[type] || variants.delivery_delayed;
}

export async function sendTransactionalMail({ to, locale = 'fr', type, question, reading = '', manageUrl = '', tirageId = '' }) {
  const config = getMailConfig();

  if (!config.enabled) {
    const disabledResult = {
      status: 'disabled',
      to,
      type,
      tirageId,
      at: new Date().toISOString()
    };
    console.warn('[mail] disabled transport', disabledResult);
    return disabledResult;
  }

  const transporter = await getTransporter();
  const template = buildTransactionalMail({ locale, type, question, reading, manageUrl });
  const result = await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to,
    replyTo: config.replyTo || undefined,
    subject: template.subject,
    text: template.text,
    html: template.html
  });

  const sentResult = {
    status: 'sent',
    to,
    type,
    tirageId,
    messageId: result?.messageId || '',
    at: new Date().toISOString()
  };
  console.info('[mail] sent', sentResult);
  return sentResult;
}
