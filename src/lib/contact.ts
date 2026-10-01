/**
 * EmailJS delivery for the contact form. The public key is designed to ship
 * in client code; values can be overridden with VITE_EMAILJS_* env vars.
 * The template expects the fields: name, email, title, message.
 */
const config = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_4j965nq',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_8f3h7ch',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '69J4SLg5mBEJY2U0d',
};

export async function sendContactForm(form: HTMLFormElement) {
  const { default: emailjs } = await import('@emailjs/browser');
  return emailjs.sendForm(config.serviceId, config.templateId, form, { publicKey: config.publicKey });
}
