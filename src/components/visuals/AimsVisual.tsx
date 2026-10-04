import { Frame } from './Frame';

const NAV = ['Dashboard', 'Universities', 'Institutes', 'Administrators', 'Framework'];
const TEAL = '#0b7285';
// Demo institutions from the AIMS README.
const INSTITUTES = [
  { code: 'C-41207', name: 'ABC Institute of Technology', type: 'Engineering', autonomy: 'Autonomous', schema: 'tenant_c_41207' },
  { code: 'C-55891', name: 'St Xavier College of Arts and Science', type: 'Arts & Science', autonomy: 'Affiliated', schema: 'tenant_c_55891' },
];
const LIFECYCLE = ['PROVISIONING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED'];

/** Illustration of the AIMS platform console, built from the project's README. */
export function AimsVisual() {
  return (
    <Frame label="Illustration of the AIMS platform console listing provisioned institutions and the API health check">
      <div className="flex size-full flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-white px-[1.3em] py-[0.7em]">
          <div className="flex items-center gap-[1.4em]">
            <div className="flex items-center gap-[0.4em] text-[1em] font-semibold tracking-[-0.02em]">
              <span className="size-[0.7em] rotate-45 rounded-[0.15em]" style={{ background: TEAL }} />
              AIMS
            </div>
            <div className="flex gap-[0.2em]">
              {NAV.map((n) => (
                <span
                  key={n}
                  className="rounded-[0.35em] px-[0.55em] py-[0.25em] text-[0.64em]"
                  style={n === 'Institutes' ? { background: '#e7f5f7', color: TEAL, fontWeight: 600 } : { color: '#64748b' }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <span className="grid size-[1.6em] place-items-center rounded-full bg-[#0f172a] text-[0.6em] font-semibold text-white">PA</span>
        </div>

        <div className="flex min-h-0 flex-1 gap-[1em] p-[1.2em]">
          {/* Institutes */}
          <div className="flex min-w-0 flex-[1.55] flex-col">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[1.02em] font-semibold tracking-[-0.02em]">Institutes</div>
                <div className="text-[0.6em] text-[#64748b]">Each one is provisioned with its own PostgreSQL schema</div>
              </div>
              <span className="rounded-[0.4em] px-[0.7em] py-[0.35em] text-[0.6em] font-semibold text-white" style={{ background: TEAL }}>
                + New institute
              </span>
            </div>
            <div className="mt-[0.7em] overflow-hidden rounded-[0.6em] border border-[#e5e7eb] bg-white">
              <div className="grid grid-cols-[4.6em_1fr_5.2em_4.6em] border-b border-[#eef0f4] px-[0.8em] py-[0.45em] text-[0.54em] font-semibold tracking-[0.04em] text-[#94a3b8] uppercase">
                <span>Code</span>
                <span>Institution</span>
                <span>Type</span>
                <span>Status</span>
              </div>
              {INSTITUTES.map((i) => (
                <div key={i.code} className="grid grid-cols-[4.6em_1fr_5.2em_4.6em] items-center border-b border-[#f1f3f6] px-[0.8em] py-[0.55em] text-[0.62em] last:border-0">
                  <span className="font-mono text-[#475569]">{i.code}</span>
                  <span className="min-w-0 pr-[0.5em]">
                    <span className="block truncate font-medium">{i.name}</span>
                    <span className="block font-mono text-[0.85em] text-[#94a3b8]">{i.schema}</span>
                  </span>
                  <span className="text-[#475569]">
                    {i.type}
                    <span className="block text-[0.85em] text-[#94a3b8]">{i.autonomy}</span>
                  </span>
                  <span>
                    <span className="rounded-full bg-[#e8f6f0] px-[0.5em] py-[0.15em] text-[0.82em] font-semibold text-[#0f7b62]">ACTIVE</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-[0.8em]">
              <div className="text-[0.54em] font-semibold tracking-[0.04em] text-[#94a3b8] uppercase">Tenant lifecycle</div>
              <div className="mt-[0.35em] flex flex-wrap items-center gap-[0.35em] font-mono text-[0.54em]">
                {LIFECYCLE.map((s, idx) => (
                  <span key={s} className="flex items-center gap-[0.35em]">
                    <span
                      className="rounded-[0.35em] border px-[0.45em] py-[0.15em]"
                      style={s === 'ACTIVE' ? { borderColor: TEAL, color: TEAL } : { borderColor: '#e2e8f0', color: '#475569' }}
                    >
                      {s}
                    </span>
                    {idx < LIFECYCLE.length - 1 && <span className="text-[#94a3b8]">→</span>}
                  </span>
                ))}
                <span className="ml-[0.4em] rounded-[0.35em] border border-[#f3c9c4] px-[0.45em] py-[0.15em] text-[#b42318]">PROVISION_FAILED ↺ retry</span>
              </div>
            </div>
          </div>

          {/* Health */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-[0.6em] bg-[#0f172a] p-[0.9em] font-mono text-[0.56em] leading-[1.6] text-[#cbd5e1]">
            <div className="flex items-center justify-between">
              <span>
                <span className="text-[#5eead4]">GET</span> /api/v1/health
              </span>
              <span className="rounded bg-[#134e4a] px-[0.4em] text-[#5eead4]">200</span>
            </div>
            <div className="mt-[0.6em] whitespace-pre text-[#94a3b8]">
              {'{"data": {\n  '}
              <span className="text-[#7dd3fc]">"status"</span>
              {': '}
              <span className="text-[#5eead4]">"ok"</span>
              {',\n  '}
              <span className="text-[#7dd3fc]">"latest_tenant_migration"</span>
              {':\n    20250101000001,\n  '}
              <span className="text-[#7dd3fc]">"lagging_tenants"</span>
              {': [],\n  '}
              <span className="text-[#7dd3fc]">"default_time_zone"</span>
              {':\n    '}
              <span className="text-[#5eead4]">"Asia/Kolkata"</span>
              {'\n}}'}
            </div>
            <div className="mt-auto border-t border-[#1e293b] pt-[0.5em] text-[#64748b]">x-tenant: C-41207 → tenant_c_41207</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
