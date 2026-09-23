const STYLES = {
  Pending: 'bg-amber-light text-amber',
  Approved: 'bg-brand-light text-brand',
  Rejected: 'bg-danger-light text-danger',
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-surface2 text-ink-soft'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${style}`}>
      {status}
    </span>
  )
}
