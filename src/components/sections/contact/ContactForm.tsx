import { AnimatePresence, m } from 'framer-motion';
import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { profile } from '../../../content/profile';
import { sendContactForm } from '../../../lib/contact';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { cn } from '../../../lib/utils';
import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';

type FieldName = 'name' | 'email' | 'title' | 'message';
type Values = Record<FieldName, string>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: Values = { name: '', email: '', title: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!v.name.trim()) errors.name = 'Please tell me your name.';
  if (!v.email.trim()) errors.email = 'An email address lets me reply.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'That email address doesn’t look right.';
  if (!v.title.trim()) errors.title = 'A short subject helps.';
  if (v.message.trim().length < 10) errors.message = 'A few more words, please (10+ characters).';
  return errors;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [sentTo, setSentTo] = useState('');
  const errors = validate(values);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onBlur = (name: FieldName) => setTouched((t) => ({ ...t, [name]: true }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, title: true, message: true });
    const form = formRef.current;
    if (!form || Object.keys(errors).length) {
      const first = (Object.keys(errors) as FieldName[])[0];
      if (first) form?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Honeypot: bots fill hidden fields, people don't.
    if ((form.elements.namedItem('website') as HTMLInputElement | null)?.value) {
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      await sendContactForm(form);
      setSentTo(values.email.trim());
      setValues(EMPTY);
      setTouched({});
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const fieldError = (name: FieldName) => (touched[name] ? errors[name] : undefined);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-bg-raised p-5 shadow-lg sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <m.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex min-h-[28rem] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-signal-soft text-signal">
              <Icon name="check" size={26} strokeWidth={2} />
            </span>
            <h3 className="text-heading mt-8">Message sent.</h3>
            <p className="text-lead mt-3 max-w-md text-muted">
              Thank you — I’ll reply to {sentTo || 'you'} shortly, usually within 24 hours.
            </p>
            <Button variant="secondary" className="mt-10" onClick={() => setStatus('idle')}>
              Send another
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            aria-labelledby="contact-form-title"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 id="contact-form-title" className="text-subheading">
                Send a message
              </h3>
              <span className="text-meta text-faint">All fields required</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Your name" autoComplete="name" value={values.name} error={fieldError('name')} onChange={onChange} onBlur={onBlur} />
              <Field name="email" label="Email" type="email" autoComplete="email" value={values.email} error={fieldError('email')} onChange={onChange} onBlur={onBlur} />
              <Field name="title" label="Subject" className="sm:col-span-2" value={values.title} error={fieldError('title')} onChange={onChange} onBlur={onBlur} />
              <Field name="message" label="Message" multiline className="sm:col-span-2" value={values.message} error={fieldError('message')} onChange={onChange} onBlur={onBlur} />
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {status === 'error' && (
              <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-danger/40 bg-danger/8 p-4 text-sm">
                <Icon name="close" size={18} className="mt-0.5 shrink-0 text-danger" />
                <p className="text-ink">
                  The message didn’t go through — an ad blocker can stop the mail service. Please try again, or email me
                  directly at{' '}
                  <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-label text-faint">Delivered via EmailJS · replies within 24h</p>
              <Button type="submit" size="lg" icon={status === 'sending' ? undefined : 'arrow-right'} disabled={status === 'sending'} magnetic>
                {status === 'sending' ? (
                  <>
                    <span className="size-4 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-current border-t-transparent" />
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps {
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (name: FieldName) => void;
}

function Field({ name, label, value, error, type = 'text', autoComplete, multiline, className, onChange, onBlur }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    onChange,
    onBlur: () => onBlur(name),
    placeholder: ' ',
    required: true,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: cn(
      'peer block w-full rounded-xl border bg-surface px-4 pt-6 pb-2.5 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)]',
      error ? 'border-danger/60' : 'border-line hover:border-line-strong',
      multiline && 'min-h-40 resize-y',
    ),
  };
  return (
    <div className={cn('relative', className)}>
      {multiline ? <textarea rows={6} {...shared} /> : <input type={type} autoComplete={autoComplete} {...shared} />}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-[1.05rem] left-4 origin-left text-[0.9375rem] text-muted transition-[translate,scale,color] duration-300 ease-out-expo peer-focus:-translate-y-2.5 peer-focus:scale-[0.78] peer-focus:text-accent peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.78]"
      >
        {label}
      </label>
      {error && (
        <p id={errorId} className="text-label mt-1.5 text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
