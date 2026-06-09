import { TrendingUp, Trophy } from 'lucide-react'
import { metricIcons } from '../../config/dashboard'

export function BalanceCard({ balance }) {
  return (
    <section className="balance-card relative isolate grid min-h-[418px] grid-rows-[1fr_auto] gap-[30px] overflow-hidden rounded-[28px] p-8 text-white max-[700px]:min-h-[390px] max-[700px]:p-6 max-[480px]:min-h-[430px] max-[480px]:gap-[18px] max-[480px]:p-[18px] max-[360px]:p-3.5">
      <span className="balance-card__glass" aria-hidden="true" />
      <span className="balance-rank-chip absolute! top-[26px] right-[26px] flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-[750] max-[480px]:top-[15px] max-[480px]:right-[15px] max-[480px]:px-2.5 max-[480px]:py-[7px]"><Trophy aria-hidden="true" /> {balance.rank}</span>
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
      <div className="balance-card__main flex min-h-[225px] flex-col items-center justify-center text-center max-[700px]:min-h-[205px]">
        <span className="eyebrow eyebrow--light">Total net worth</span>
        <h2>{balance.value}</h2>
        <span className="growth-pill"><TrendingUp aria-hidden="true" />{balance.growth}</span>
      </div>
      <div className="balance-stats grid grid-cols-4 gap-[9px] max-[700px]:gap-[7px] max-[480px]:grid-cols-2 max-[480px]:gap-2">
        {balance.stats.map((stat) => {
          const StatIcon = metricIcons[stat.icon]

          return (
            <div className="balance-stat grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-[3px] rounded-2xl p-[13px] max-[700px]:p-[9px] max-[480px]:p-[11px]" key={stat.label}>
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
