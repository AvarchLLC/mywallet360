import { createElement, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'

export function MetricExplainer({
  as = 'article',
  className = '',
  explanation,
  children,
  ...props
}) {
  const tooltipId = useId()
  const [position, setPosition] = useState(null)

  if (!explanation) return createElement(as, { className, ...props }, children)

  const show = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = Math.min(300, window.innerWidth - 24)
    const left = Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12)
    const fitsBelow = rect.bottom + 190 < window.innerHeight

    setPosition({
      left,
      top: fitsBelow ? rect.bottom + 10 : Math.max(12, rect.top - 10),
      width,
      placement: fitsBelow ? 'below' : 'above',
    })
  }

  const trigger = createElement(as, {
    className: `${className} metric-explainer`,
    tabIndex: '0',
    'aria-describedby': tooltipId,
    onMouseEnter: show,
    onMouseLeave: () => setPosition(null),
    onFocus: show,
    onBlur: () => setPosition(null),
    ...props,
  }, children, <Info className="metric-explainer__hint" aria-hidden="true" />)

  return (
    <>
      {trigger}
      {position && createPortal(
        <aside
          className={`metric-explanation metric-explanation--${position.placement}`}
          id={tooltipId}
          role="tooltip"
          style={{ left: position.left, top: position.top, width: position.width }}
        >
          <strong>{explanation.title}</strong>
          <p>{explanation.summary}</p>
          {explanation.formula && <code>{explanation.formula}</code>}
          {explanation.details?.length > 0 && (
            <ul>
              {explanation.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          )}
        </aside>,
        document.body,
      )}
    </>
  )
}
