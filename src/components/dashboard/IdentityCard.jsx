import identificationCard3d from '@iconify-icons/fluent-emoji/identification-card'
import { identityIcons } from '../../config/dashboard'
import { ThreeDIcon } from '../common/Icon'

export function IdentityCard({ stats }) {
  return (
    <section className="card identity-card">
      <div className="card-heading">
        <div className="title-with-icon">
          <span className="icon-box icon-box--3d"><ThreeDIcon icon={identificationCard3d} /></span>
          <h2>Financial Identity Profile</h2>
        </div>
        <span className="pill pill--verified">Verified</span>
      </div>
      <div className="identity-grid">
        {stats.map((stat) => (
          <article className={`stat stat--${stat.tone}`} key={stat.label}>
            <span className="stat__icon stat__icon--3d"><ThreeDIcon icon={identityIcons[stat.icon]} /></span>
            <div className="stat__content">
              <span className="stat__name">{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.description}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
