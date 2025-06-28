import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/pricing.css';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Parfait pour débuter',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '3 plateformes connectées',
        '10 publications par mois',
        'Analytics de base',
        'Support par email',
        'Stockage 1GB',
      ],
      limitations: ['Watermark sur les vidéos', 'Pas de planification'],
      popular: false,
      cta: 'Commencer Gratuitement',
    },
    {
      name: 'Pro',
      description: 'Pour les créateurs sérieux',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        '8 plateformes connectées',
        'Publications illimitées',
        'Analytics avancées',
        'Planification intelligente',
        'Éditeur vidéo intégré',
        'Support prioritaire',
        'Stockage 50GB',
        'Collaboration équipe (5 membres)',
      ],
      limitations: [],
      popular: true,
      cta: 'Essai Gratuit 14 jours',
    },
    {
      name: 'Business',
      description: 'Pour les entreprises',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Toutes les plateformes',
        'Publications illimitées',
        'Analytics enterprise',
        'White-label disponible',
        'API accès complet',
        'Support 24/7',
        'Stockage 500GB',
        'Équipes illimitées',
        "Workflow d'approbation",
        'Intégrations custom',
      ],
      limitations: [],
      popular: false,
      cta: "Contacter l'équipe",
    },
  ];

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <div className="pricing-hero-content">
            <h1 className="pricing-title">
              Tarifs <span className="highlight">Transparents</span>
            </h1>
            <p className="pricing-subtitle">
              Choisissez le plan qui correspond à vos besoins. Commencez gratuitement, évoluez à
              votre rythme.
            </p>

            {/* Toggle Annual/Monthly */}
            <div className="pricing-toggle">
              <span className={`toggle-label ${!isAnnual ? 'active' : ''}`}>Mensuel</span>
              <button className="toggle-switch" onClick={() => setIsAnnual(!isAnnual)}>
                <span className={`toggle-slider ${isAnnual ? 'annual' : ''}`}></span>
              </button>
              <span className={`toggle-label ${isAnnual ? 'active' : ''}`}>
                Annuel <span className="save-badge">-17%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map(plan => (
              <div key={plan.name} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Le plus populaire</div>}

                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>

                  <div className="plan-price">
                    <span className="price-amount">
                      {plan.monthlyPrice === 0
                        ? 'Gratuit'
                        : `${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}€`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="price-period">
                        /mois
                        {isAnnual && <span className="annual-note">facturé annuellement</span>}
                      </span>
                    )}
                  </div>
                </div>

                <div className="plan-features">
                  <ul>
                    {plan.features.map(feature => (
                      <li key={feature} className="feature-included">
                        {feature}
                      </li>
                    ))}
                    {plan.limitations.map(limitation => (
                      <li key={limitation} className="feature-limited">
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="plan-cta">
                  {plan.name === 'Business' ? (
                    <button className="btn btn-outline btn-full">{plan.cta}</button>
                  ) : (
                    <Link
                      to="/auth/signup"
                      className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-full`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="features-comparison">
        <div className="container">
          <h2 className="section-title">Comparaison Détaillée</h2>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Fonctionnalités</th>
                  <th>Starter</th>
                  <th>Pro</th>
                  <th>Business</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Plateformes connectées</td>
                  <td>3</td>
                  <td>8</td>
                  <td>Illimitées</td>
                </tr>
                <tr>
                  <td>Publications par mois</td>
                  <td>10</td>
                  <td>Illimitées</td>
                  <td>Illimitées</td>
                </tr>
                <tr>
                  <td>Analytics</td>
                  <td>Basiques</td>
                  <td>Avancées</td>
                  <td>Enterprise</td>
                </tr>
                <tr>
                  <td>Planification</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Éditeur vidéo</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Collaboration équipe</td>
                  <td>❌</td>
                  <td>5 membres</td>
                  <td>Illimitée</td>
                </tr>
                <tr>
                  <td>Support</td>
                  <td>Email</td>
                  <td>Prioritaire</td>
                  <td>24/7</td>
                </tr>
                <tr>
                  <td>API Access</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <div className="container">
          <h2 className="section-title">Questions Fréquentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Puis-je changer de plan à tout moment ?</h4>
              <p>
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements
                prennent effet immédiatement.
              </p>
            </div>
            <div className="faq-item">
              <h4>Y a-t-il des frais cachés ?</h4>
              <p>
                Non, nos tarifs sont transparents. Pas de frais de setup, pas de frais cachés. Vous
                payez seulement ce qui est affiché.
              </p>
            </div>
            <div className="faq-item">
              <h4>Comment fonctionne l'essai gratuit ?</h4>
              <p>
                L'essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités Pro.
                Aucune carte bancaire requise.
              </p>
            </div>
            <div className="faq-item">
              <h4>Que se passe-t-il si je dépasse mes limites ?</h4>
              <p>
                Nous vous préviendrons avant d'atteindre vos limites et vous proposerons un upgrade
                vers un plan supérieur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à Commencer ?</h2>
            <p>
              Rejoignez des milliers de créateurs qui font déjà confiance à GotoDrop pour développer
              leur présence sur les réseaux sociaux.
            </p>
            <div className="cta-buttons">
              <Link to="/auth/signup" className="btn btn-primary btn-large">
                Essai Gratuit 14 jours
              </Link>
              <Link to="/features" className="btn btn-outline btn-large">
                Voir les Fonctionnalités
              </Link>
            </div>
            <p className="cta-note">✨ Aucune carte bancaire requise • Annulation à tout moment</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
