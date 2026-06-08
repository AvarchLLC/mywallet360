import { useState } from 'react'
import { navItems } from '../../config/dashboard'
import { Icon } from '../common/Icon'

export function BottomNav() {
  const [active, setActive] = useState('Overview')

  const navigateTo = (item) => {
    document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(item.label)
  }

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <button
          className={active === item.label ? 'active' : ''}
          type="button"
          onClick={() => navigateTo(item)}
          aria-current={active === item.label ? 'location' : undefined}
          title={item.label}
          key={item.label}
        >
          <span><Icon name={item.icon} alt="" /></span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
