import { useEffect, useRef } from 'react'
import { Bell, ChevronDown, Moon, Search, Sun } from 'lucide-react'
import { asset } from '../../utils/assets'

export function Header({
  wallet,
  selectedWalletId,
  searchValue,
  onSearchChange,
  onSelectWallet,
  isLoading,
  demoWallets,
  theme,
  onToggleTheme,
}) {
  const searchInputRef = useRef(null)

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }

      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        onSearchChange('')
        searchInputRef.current.blur()
      }
    }

    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [onSearchChange])

  return (
    <header className="header">
      <div className="profile header__profile">
        <div className="profile__image-wrap">
          <img
            className="profile__image"
            src={asset(wallet.profile.avatar)}
            alt={`${wallet.profile.name} profile`}
          />
          <span className="profile__status" aria-label="Online" />
        </div>
        <div>
          <span className="eyebrow">Welcome back,</span>
          <h1>{wallet.profile.name}</h1>
        </div>
      </div>

      <div className="wallet-search-area">
        <label className="global-search">
          <Search aria-hidden="true" />
          <input
            ref={searchInputRef}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            type="search"
            placeholder="Search wallet, token, ENS, transaction..."
            aria-label="Global search"
          />
          <kbd><span>Ctrl</span><span>K</span></kbd>
        </label>
        <div className="demo-wallets">
          <span>Try Demo Wallets</span>
          <div>
            {demoWallets.map((demoWallet) => (
              <button
                className={selectedWalletId === demoWallet.id ? 'active' : ''}
                disabled={isLoading}
                type="button"
                onClick={() => onSelectWallet(demoWallet.id)}
                key={demoWallet.id}
              >
                {demoWallet.chipLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="header__actions">
        <button className="icon-button" type="button" aria-label="View notifications">
          <Bell aria-hidden="true" />
          <span className="notification-dot" />
        </button>
        <button
          className="icon-button theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'dark'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
        <button className="wallet-pill" type="button" aria-label={`Connected wallet ${wallet.profile.wallet}`}>
          <span className="wallet-pill__dot" />
          <span className="wallet-pill__copy">
            <strong>Connected</strong>
            <small>{wallet.profile.wallet}</small>
          </span>
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
