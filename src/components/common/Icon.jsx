import { Icon as IconifyIcon } from '@iconify/react'
import { asset } from '../../utils/assets'

export function Icon({ name, alt = '', size = 'md' }) {
  const useFallback = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = asset('99_672.svg')
  }

  const sizeClass = size === 'sm' ? 'size-[14px]' : 'size-5'

  return <img className={`icon block object-contain opacity-[.92] ${sizeClass}`} src={asset(name)} alt={alt} onError={useFallback} />
}

export function ThreeDIcon({ icon, label = '' }) {
  return <IconifyIcon className="icon-3d block size-full drop-shadow-[0_3px_4px_rgba(30,60,61,.14)] dark:drop-shadow-[0_3px_5px_rgba(0,0,0,.35)]" icon={icon} aria-label={label || undefined} aria-hidden={!label} />
}
