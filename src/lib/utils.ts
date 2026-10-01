export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseMonth(value: string) {
  const [y, m] = value.split('-').map(Number);
  return { y, m };
}

export function formatMonth(value?: string) {
  if (!value) return 'Present';
  const { y, m } = parseMonth(value);
  return `${MONTHS[m - 1]} ${y}`;
}

/** Inclusive month span, e.g. "1 yr 2 mos". Open-ended ranges run to the current month. */
export function formatSpan(start: string, end?: string) {
  const a = parseMonth(start);
  const now = new Date();
  const b = end ? parseMonth(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  const months = Math.max(1, (b.y - a.y) * 12 + (b.m - a.m) + 1);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`);
  return parts.join(' ');
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

/** Stop compound words like "E-Learning" from breaking at the hyphen. */
export const keepHyphens = (s: string) => s.replace(/-/g, '-\u2060');

export const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
