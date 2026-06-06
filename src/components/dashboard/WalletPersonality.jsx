import { Icon } from '../common/Icon'

export function WalletPersonality({ personality }) {
  const primaryTrait = personality.traits[0]
  const secondaryEnd = primaryTrait.value + personality.traits[1].value
  const orbitStyle = {
    background: `conic-gradient(var(--primary) 0 ${primaryTrait.value}%, var(--secondary) ${primaryTrait.value}% ${secondaryEnd}%, var(--accent) ${secondaryEnd}% 100%)`,
  }

  return (
    <section className="card personality-card">
      <div className="personality-card__intro">
        <span className="personality-card__eyebrow">Wallet Personality</span>
        <div className="personality-card__title">
          <div>
            <h2>{personality.title}</h2>
            <p>{personality.description}</p>
          </div>
          <div
            className="personality-orbit"
            style={orbitStyle}
            aria-label={`${primaryTrait.label} ${primaryTrait.value}%`}
          >
            <div><strong>{primaryTrait.value}%</strong><span>Primary trait</span></div>
          </div>
        </div>
      </div>
      <div className="personality-list">
        {personality.traits.map((trait) => (
          <article className={`personality-item personality-item--${trait.tone}`} key={trait.label}>
            <span className="personality-item__icon"><Icon name={trait.icon} alt="" /></span>
            <div className="personality-item__body">
              <div className="personality-item__heading">
                <strong>{trait.label}</strong>
                <span>{trait.value}%</span>
              </div>
              <div className="personality-meter" aria-hidden="true">
                <i style={{ width: `${trait.value}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
