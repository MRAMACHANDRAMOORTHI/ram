import { Frame } from './Frame';

const NAV = ['Dashboard', 'Programs', 'Batches', 'Courses', 'Course packs', 'Learners', 'CIA', 'Assignments', 'Question banks', 'Forums', 'Roles', 'Settings'];
const STEPS = ['Scan', 'Plan', 'Review', 'Import'];
const FILES: Array<[string, string, 'done' | 'running' | 'queued', number]> = [
  ['Unit 1 / 01 Introduction.mp4', 'Video lesson', 'done', 100],
  ['Unit 1 / 02 Reading.pdf', 'Document', 'done', 100],
  ['Unit 2 / 01 Lecture.mp4', 'Video lesson', 'running', 64],
  ['Unit 2 / 02 Notes.docx', 'Document', 'queued', 0],
];
const ROSE = '#1f3463';

/** Illustration of the ekVana admin portal's Google Drive import, built from the project's docs. */
export function LmsVisual() {
  return (
    <Frame label="Illustration of the ekVana LMS admin portal importing a course from Google Drive">
      {/* Sidebar */}
      <div className="flex w-[10.5em] shrink-0 flex-col border-r border-[#e5e7eb] bg-white px-[0.9em] py-[1em]">
        <div className="flex items-center gap-[0.4em] text-[1.05em] font-semibold tracking-[-0.02em]">
          <span className="size-[0.7em] rounded-[0.2em]" style={{ background: ROSE }} />
          ekVana
        </div>
        <div className="mt-[0.5em] inline-flex w-fit items-center gap-[0.3em] rounded-full bg-[#eef2ff] px-[0.55em] py-[0.15em] text-[0.62em] font-medium" style={{ color: ROSE }}>
          tenant · sastra
        </div>
        <div className="mt-[1em] flex flex-col gap-[0.15em]">
          {NAV.map((n) => (
            <div
              key={n}
              className="rounded-[0.35em] px-[0.5em] py-[0.28em] text-[0.68em]"
              style={n === 'Courses' ? { background: '#eef2ff', color: ROSE, fontWeight: 600 } : { color: '#475569' }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col px-[1.4em] py-[1.1em]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.62em] text-[#64748b]">Courses</div>
            <div className="text-[1.05em] font-semibold tracking-[-0.02em]">Import from Google Drive</div>
          </div>
          <div className="rounded-full border border-[#e2e8f0] bg-white px-[0.6em] py-[0.2em] font-mono text-[0.58em] text-[#475569]">
            oban · drive_import
          </div>
        </div>

        <div className="mt-[0.9em] flex items-center gap-[0.5em]">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-[0.5em]">
              <div className="flex items-center gap-[0.35em]">
                <span
                  className="grid size-[1.25em] place-items-center rounded-full text-[0.6em] font-semibold text-white"
                  style={{ background: i < 3 ? '#0f7b62' : ROSE }}
                >
                  {i < 3 ? '✓' : '4'}
                </span>
                <span className="text-[0.66em] font-medium" style={{ color: i === 3 ? ROSE : '#334155' }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && <span className="h-px w-[1.6em] bg-[#cbd5e1]" />}
            </div>
          ))}
        </div>

        <div className="mt-[0.9em] flex-1 overflow-hidden rounded-[0.6em] border border-[#e5e7eb] bg-white">
          <div className="grid grid-cols-[1fr_6em_7em] border-b border-[#eef0f4] px-[0.9em] py-[0.45em] text-[0.56em] font-semibold tracking-[0.04em] text-[#94a3b8] uppercase">
            <span>Drive file</span>
            <span>Becomes</span>
            <span>Status</span>
          </div>
          {FILES.map(([file, kind, status, pct]) => (
            <div key={file} className="grid grid-cols-[1fr_6em_7em] items-center border-b border-[#f1f3f6] px-[0.9em] py-[0.5em] text-[0.64em] last:border-0">
              <span className="truncate pr-[0.6em] text-[#0f172a]">{file}</span>
              <span className="text-[#64748b]">{kind}</span>
              <span className="flex items-center gap-[0.45em]">
                <span className="h-[0.4em] flex-1 overflow-hidden rounded-full bg-[#eef0f4]">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${pct}%`, background: status === 'done' ? '#0f7b62' : ROSE }}
                  />
                </span>
                <span className="w-[2.8em] text-right font-mono text-[0.9em]" style={{ color: status === 'queued' ? '#94a3b8' : '#334155' }}>
                  {status === 'queued' ? 'queued' : `${pct}%`}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[0.7em] flex items-center justify-between text-[0.58em] text-[#64748b]">
          <span>Drive → server → object storage · one file at a time · resumable</span>
          <span className="font-mono">sastra/…</span>
        </div>
      </div>
    </Frame>
  );
}
