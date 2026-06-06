import { useState } from 'react'
import { highlightIcons } from '../../config/dashboard'
import { Icon } from '../common/Icon'

function Transaction({ item }) {
  return (
    <article className={`transaction transaction--${item.tone}`} tabIndex="0">
      <div className="transaction__visual">
        <span className={`icon-box ${item.tone}`}><Icon name={item.icon} alt="" /></span>
        <span className={`protocol-logo protocol-logo--${item.tone}`} title={item.protocol}>
          {item.protocolMark}
        </span>
      </div>
      <div className="transaction__main">
        <strong>{item.displayTitle}</strong>
        <div className="transaction__context">
          <span className="transaction__protocol">{item.protocol}</span>
          <span aria-hidden="true">•</span>
          <span className="chain-badge">{item.chain}</span>
        </div>
      </div>
      <div className="transaction__amount">
        <strong className={item.positive ? 'positive' : ''}>{item.amount}</strong>
        <span>{item.crypto}</span>
      </div>
      <span className="transaction__time">{item.meta}</span>
    </article>
  )
}

function Highlight({ highlight }) {
  const HighlightIcon = highlightIcons[highlight.icon]

  return (
    <article className={`highlight-item highlight-item--${highlight.tone}`}>
      <span className="highlight-item__icon"><HighlightIcon aria-hidden="true" /></span>
      <div>
        <span>{highlight.label}</span>
        <strong>{highlight.value} <small>• {highlight.detail}</small></strong>
      </div>
    </article>
  )
}

export function Activity({ transactions, highlights }) {
  const [showAll, setShowAll] = useState(false)
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 3)

  return (
    <section className="activity">
      <div className="activity-layout">
        <div className="card activity-feed">
          <div className="activity-card__heading">
            <div><span>Wallet timeline</span><h2>Recent Activity</h2></div>
            <button type="button" onClick={() => setShowAll((value) => !value)}>
              {showAll ? 'Show Less' : 'See All'}
            </button>
          </div>
          <div className="transaction-list">
            {visibleTransactions.map((item) => <Transaction item={item} key={item.title} />)}
          </div>
        </div>

        <aside className="card highlights-card">
          <div className="activity-card__heading">
            <div><span>Wallet intelligence</span><h2>Key Highlights</h2></div>
          </div>
          <div className="highlights-list">
            {highlights.map((highlight) => <Highlight highlight={highlight} key={highlight.label} />)}
          </div>
        </aside>
      </div>
    </section>
  )
}
