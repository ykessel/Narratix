type CalloutType = 'tip' | 'info' | 'warning' | 'danger'

const config: Record<CalloutType, { icon: string; classes: string; labelClasses: string }> = {
  tip: {
    icon: '💡',
    classes: 'bg-violet-50 border-violet-200 text-violet-900',
    labelClasses: 'text-violet-600',
  },
  info: {
    icon: 'ℹ️',
    classes: 'bg-blue-50 border-blue-200 text-blue-900',
    labelClasses: 'text-blue-600',
  },
  warning: {
    icon: '⚠️',
    classes: 'bg-amber-50 border-amber-200 text-amber-900',
    labelClasses: 'text-amber-600',
  },
  danger: {
    icon: '🚨',
    classes: 'bg-red-50 border-red-200 text-red-900',
    labelClasses: 'text-red-600',
  },
}

const labels: Record<CalloutType, string> = {
  tip: 'Tip',
  info: 'Info',
  warning: 'Atención',
  danger: 'Importante',
}

type Props = { type: CalloutType; text: string }

export function Callout({ type, text }: Props) {
  const c = config[type]
  return (
    <div className={`not-prose my-6 rounded-xl border p-4 ${c.classes}`}>
      <p className={`flex items-center gap-2 text-sm font-sans font-semibold mb-1 ${c.labelClasses}`}>
        <span aria-hidden="true">{c.icon}</span>
        {labels[type]}
      </p>
      <p className="text-sm font-sans leading-relaxed">{text}</p>
    </div>
  )
}
