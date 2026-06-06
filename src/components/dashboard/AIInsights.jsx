import crystalBall3d from '@iconify-icons/fluent-emoji/crystal-ball'
import { aiIcons } from '../../config/dashboard'
import { ThreeDIcon } from '../common/Icon'

export function AIInsights({ ai }) {
  return (
    <section className="card ai-card">
      <div className="ai-card__lead">
        <div className="ai-card__heading">
          <span className="ai-card__mark"><ThreeDIcon icon={crystalBall3d} /></span>
          <div>
            <span>AI Insights</span>
            <h2>Wallet intelligence, explained simply.</h2>
          </div>
        </div>
        <p>{ai.summary}</p>
        <span className="ai-card__confidence">{ai.confidence}</span>
      </div>
      <div className="ai-card__insights">
        {ai.insights.map((insight, index) => (
          <article
            className={`ai-insight ai-insight--${insight.tone}${index === 0 ? ' ai-insight--highlighted' : ''}`}
            key={insight.text}
          >
            <span className="ai-insight__icon ai-insight__icon--3d">
              <ThreeDIcon icon={aiIcons[insight.icon]} />
            </span>
            <div><strong>{insight.text}</strong><span>{insight.detail}</span></div>
          </article>
        ))}
      </div>
    </section>
  )
}
