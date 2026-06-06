import { Icon as IconifyIcon } from '@iconify/react'
import { asset } from '../../utils/assets'

export function Icon({ name, alt = '', size = 'md' }) {
  const useFallback = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = asset('99_672.svg')
  }

  return <img className={`icon icon--${size}`} src={asset(name)} alt={alt} onError={useFallback} />
}

export function ThreeDIcon({ icon, label = '' }) {
  return <IconifyIcon className="icon-3d" icon={icon} aria-label={label || undefined} aria-hidden={!label} />
}
