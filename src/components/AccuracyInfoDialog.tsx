import { useEffect, useRef, useState } from 'react'
import { Info, X } from 'lucide-react'

export function AccuracyInfoDialog() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const repoUrl = 'https://github.com/xai-org/x-algorithm'

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-1.5 text-amber-300/90 hover:text-amber-200 hover:bg-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
        aria-label="More info about prediction accuracy"
        title="More info"
      >
        <Info size={16} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accuracy-title"
          aria-describedby="accuracy-desc"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700/60 bg-zinc-950/90 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 id="accuracy-title" className="text-base font-semibold text-white">
                  About accuracy (what’s missing from the open repo)
                </h3>
                <p id="accuracy-desc" className="mt-1 text-sm text-zinc-400">
                  This app is an educational simulator of the scoring flow, not a production-grade
                  virality predictor.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="space-y-4 text-sm text-zinc-300">
                <div>
                  <div className="font-semibold text-zinc-200">What the open-sourced code contains</div>
                  <ul className="mt-2 list-disc pl-5 text-zinc-400 space-y-1.5">
                    <li>
                      The <span className="text-zinc-200">shape</span> of scoring: predicted engagement
                      signals are combined into a final score (see{' '}
                      <a
                        className="text-violet-300 underline underline-offset-2 hover:text-violet-200"
                        href={`${repoUrl}/blob/main/home-mixer/scorers/phoenix_scorer.rs`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        phoenix_scorer.rs
                      </a>{' '}
                      and{' '}
                      <a
                        className="text-violet-300 underline underline-offset-2 hover:text-violet-200"
                        href={`${repoUrl}/blob/main/home-mixer/scorers/weighted_scorer.rs`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        weighted_scorer.rs
                      </a>
                      ).
                    </li>
                    <li>
                      A reference transformer model implementation (see{' '}
                      <a
                        className="text-violet-300 underline underline-offset-2 hover:text-violet-200"
                        href={`${repoUrl}/blob/main/phoenix/recsys_model.py`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        phoenix/recsys_model.py
                      </a>
                      ), but without
                      production-trained parameters.
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="font-semibold text-zinc-200">What’s missing (why predictions aren’t fully accurate)</div>
                  <ul className="mt-2 list-disc pl-5 text-zinc-400 space-y-1.5">
                    <li>
                      <span className="text-zinc-200">Production weights/params</span> used by the weighted scorer
                      are not included in the open repo.
                    </li>
                    <li>
                      <span className="text-zinc-200">Embedding tables & user history context</span> (the real model
                      depends on user action sequences + learned embeddings).
                    </li>
                    <li>
                      <span className="text-zinc-200">Retrieval & candidate generation</span> (what content even gets
                      considered) is a major driver of reach and isn’t reproduced here.
                    </li>
                    <li>
                      <span className="text-zinc-200">Calibration to views/likes</span>: the algorithm ranks candidates;
                      converting that into absolute counts requires platform-level distribution and competition modeling.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="font-semibold text-amber-200">How to use this app</div>
                  <ul className="mt-2 list-disc pl-5 text-amber-100/80 space-y-1.5">
                    <li>Compare drafts to see which one the scoring heuristics favor.</li>
                    <li>Treat counts (views/likes/etc.) as illustrative ranges, not forecasts.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-5 py-4">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-auto text-sm font-medium text-zinc-300 hover:text-white underline underline-offset-4"
              >
                Open `xai-org/x-algorithm`
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}


