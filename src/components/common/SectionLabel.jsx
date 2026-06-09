export function SectionLabel({ children, action }) {
  return (
    <div className="section-label mb-[18px] flex justify-between text-sm font-[750] tracking-[-.02em] text-[var(--ink)]">
      <strong>{children}</strong>
      {action}
    </div>
  )
}
