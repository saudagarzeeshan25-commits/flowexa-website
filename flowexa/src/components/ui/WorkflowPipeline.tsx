type Step = { label: string }

export function WorkflowPipeline({
  steps,
  orientation = 'horizontal',
  active,
}: {
  steps: Step[]
  orientation?: 'horizontal' | 'vertical'
  active?: number
}) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={`flex ${isVertical ? 'flex-col' : 'flex-row flex-wrap md:flex-nowrap'} items-stretch gap-0`}
      data-reveal
    >
      {steps.map((step, i) => {
        const isActive = active !== undefined && i <= active
        return (
          <div key={step.label} className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center flex-1 min-w-0`}>
            <div
              className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 w-full transition-colors duration-300 ${
                isActive
                  ? 'border-cyan/50 bg-cyan/10 text-paper'
                  : 'border-white/10 bg-surface/60 text-paper/70'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isActive ? 'bg-cyan' : 'bg-white/25'
                }`}
              />
              <span className="font-mono-label text-[11px] uppercase truncate">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`shrink-0 ${
                  isVertical ? 'h-5 w-px my-0.5 ml-[calc(0.75rem+3px)]' : 'w-5 h-px mx-0.5'
                } ${isActive ? 'bg-cyan/50' : 'bg-white/10'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
