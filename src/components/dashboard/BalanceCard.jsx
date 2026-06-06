import { TrendingUp, Trophy } from 'lucide-react'
import { metricIcons } from '../../config/dashboard'

export function BalanceCard({ balance }) {
  return (
    <section className="balance-card">
      <span className="balance-card__glass" aria-hidden="true" />
      <span className="balance-rank-chip"><Trophy aria-hidden="true" /> {balance.rank}</span>
      <svg className="balance-sparkline" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="sparklineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity=".55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity=".12" />
          </linearGradient>
          <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="balance-sparkline__fill"
          d="M0 190 C45 175 65 184 102 158 S160 143 196 150 S250 123 286 132 S338 104 374 112 S421 81 460 91 S522 53 600 38 L600 220 L0 220 Z"
        />
        <path
          className="balance-sparkline__line"
          d="M0 190 C45 175 65 184 102 158 S160 143 196 150 S250 123 286 132 S338 104 374 112 S421 81 460 91 S522 53 600 38"
        />
      </svg>
      <div className="balance-card__main">
        <span className="eyebrow eyebrow--light">Total net worth</span>
        <h2>{balance.value}</h2>
        <span className="growth-pill"><TrendingUp aria-hidden="true" />{balance.growth}</span>
      </div>
      <div className="balance-stats">
        {balance.stats.map((stat) => {
          const StatIcon = metricIcons[stat.icon]

          return (
            <div className="balance-stat" key={stat.label}>
              <span className="balance-stat__icon"><StatIcon aria-hidden="true" /></span>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
