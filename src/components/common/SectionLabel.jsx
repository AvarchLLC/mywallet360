export function SectionLabel({ children, action }) {
  return (
    <div className="section-label">
      <strong>{children}</strong>
      {action}
    </div>
  )
}
