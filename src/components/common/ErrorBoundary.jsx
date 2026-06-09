import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Application render failed', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="grid min-h-screen place-content-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--ink)]">
        <h1 className="text-3xl">MyWallet360 could not load</h1>
        <p className="text-[var(--muted)]">Refresh the page to try again.</p>
        <button
          className="mx-auto cursor-pointer rounded-xl border-0 bg-[var(--primary)] px-5 py-3 font-bold text-white"
          type="button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </main>
    )
  }
}
