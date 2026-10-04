import { EXECUTIVES } from './simulation';

const C = 84;
const R = 56;

/** The assigner's pointer advances one seat per assignment — always clockwise. */
export function RoundRobinDial({ assignments, pointer, load }: { assignments: number; pointer: number; load: number[] }) {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 168 168" className="size-28 shrink-0" role="img" aria-label={`Round-robin assigner. Next ticket goes to ${EXECUTIVES[pointer]}.`}>
        <circle cx={C} cy={C} r={R} fill="none" className="stroke-line" strokeDasharray="2 5" />
        <g
          style={{
            transform: `rotate(${assignments * 90}deg)`,
            transformOrigin: `${C}px ${C}px`,
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <line x1={C} y1={C} x2={C} y2={C - R + 20} className="stroke-automation" strokeWidth={2} strokeLinecap="round" />
          <circle cx={C} cy={C - R + 20} r={3} className="fill-automation" />
        </g>
        <circle cx={C} cy={C} r={5} className="fill-ink" />
        {EXECUTIVES.map((name, i) => {
          const a = (i * Math.PI) / 2 - Math.PI / 2;
          const x = C + Math.cos(a) * R;
          const y = C + Math.sin(a) * R;
          const next = i === pointer;
          return (
            <g key={name}>
              <circle
                cx={x}
                cy={y}
                r={15}
                className={next ? 'fill-automation stroke-automation' : 'fill-surface stroke-line-strong'}
                style={{ transition: 'fill .4s, stroke .4s' }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className={`text-[11px] font-semibold ${next ? 'fill-bg' : 'fill-ink'}`}
              >
                {name.slice(-1)}
              </text>
            </g>
          );
        })}
      </svg>
      <dl className="text-label grid grid-cols-[auto_auto] gap-x-4 gap-y-1" aria-label="Open tickets per executive">
        <dt className="text-meta col-span-2 mb-1 text-[0.625rem] text-faint">Open load</dt>
        {EXECUTIVES.map((name, i) => (
          <div key={name} className="contents">
            <dt className={i === pointer ? 'flex items-center gap-1.5 whitespace-nowrap text-automation' : 'flex items-center gap-1.5 whitespace-nowrap text-muted'}>
              <span aria-hidden="true" className={i === pointer ? 'size-1.5 rounded-full bg-automation' : 'size-1.5 rounded-full bg-transparent'} />
              {name}
              {i === pointer && <span className="sr-only">(next)</span>}
            </dt>
            <dd className="text-right text-ink tabular-nums">{load[i]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
