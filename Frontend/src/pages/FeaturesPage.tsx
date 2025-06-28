import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/features.css';

const FeaturesPage: React.FC = () => {
  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="features-hero-content">
            <h1 className="features-title">
              Fonctionnalités <span className="highlight">Puissantes</span>
            </h1>
            <p className="features-subtitle">
              Découvrez toutes les fonctionnalités qui font de GotoDrop la plateforme de référence
              pour la publication multi-plateformes de vos vidéos.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎬</div>
              <h3>Publication Multi-Plateformes</h3>
              <p>
                Publiez simultanément sur TikTok, Instagram Reels, YouTube Shorts, Twitter, LinkedIn
                et plus encore en un seul clic.
              </p>
              <ul className="feature-list">
                <li>Support de 10+ plateformes</li>
                <li>Optimisation automatique des formats</li>
                <li>Publication instantanée ou programmée</li>
              </ul>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Optimisation Automatique</h3>
              <p>
                Nos algorithmes adaptent automatiquement vos vidéos aux spécifications de chaque
                plateforme pour une qualité optimale.
              </p>
              <ul className="feature-list">
                <li>Redimensionnement intelligent</li>
                <li>Compression optimisée</li>
                <li>Ajustement de la durée</li>
              </ul>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h3>Analytics Avancées</h3>
              <p>
                Suivez les performances de vos vidéos across toutes les plateformes avec des
                rapports détaillés et des insights actionnables.
              </p>
              <ul className="feature-list">
                <li>Métriques en temps réel</li>
                <li>Comparaison inter-plateformes</li>
                <li>Rapports personnalisables</li>
              </ul>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🗓️</div>
              <h3>Planification Intelligente</h3>
              <p>
                Planifiez vos publications aux moments optimaux pour maximiser l'engagement sur
                chaque plateforme.
              </p>
              <ul className="feature-list">
                <li>Suggestion d'horaires optimaux</li>
                <li>Calendrier de contenu</li>
                <li>Publication automatique</li>
              </ul>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h3>Éditeur Intégré</h3>
              <p>
                Éditez vos vidéos directement dans la plateforme avec des outils professionnels et
                des templates prêts à l'emploi.
              </p>
              <ul className="feature-list">
                <li>Montage vidéo simplifié</li>
                <li>Bibliothèque de templates</li>
                <li>Effets et transitions</li>
              </ul>
            </div>

            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <h3>Collaboration d'Équipe</h3>
              <p>
                Travaillez en équipe avec des rôles personnalisés, des workflows d'approbation et
                une gestion centralisée du contenu.
              </p>
              <ul className="feature-list">
                <li>Gestion des rôles et permissions</li>
                <li>Workflow d'approbation</li>
                <li>Commentaires et feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="technical-features">
        <div className="container">
          <h2 className="section-title">Fonctionnalités Techniques</h2>
          <div className="tech-features-grid">
            <div className="tech-feature">
              <h4>🔒 Sécurité Enterprise</h4>
              <p>Chiffrement de bout en bout, authentification SSO et conformité RGPD.</p>
            </div>
            <div className="tech-feature">
              <h4>🚀 API Puissante</h4>
              <p>Intégrez GotoDrop dans vos workflows existants avec notre API REST.</p>
            </div>
            <div className="tech-feature">
              <h4>☁️ Cloud Native</h4>
              <p>Infrastructure scalable avec 99.9% de disponibilité garantie.</p>
            </div>
            <div className="tech-feature">
              <h4>🔄 Webhooks</h4>
              <p>Recevez des notifications en temps réel sur les événements de publication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="integrations-section">
        <div className="container">
          <h2 className="section-title">Intégrations</h2>
          <p className="section-subtitle">Connectez-vous facilement à vos outils préférés</p>
          <div className="integrations-grid">
            <div className="integration-item">
              <div className="integration-icon">📹</div>
              <h4>Canva</h4>
              <p>Importez directement vos créations depuis Canva</p>
            </div>
            <div className="integration-item">
              <div className="integration-icon">☁️</div>
              <h4>Google Drive</h4>
              <p>Synchronisez avec votre stockage cloud</p>
            </div>
            <div className="integration-item">
              <div className="integration-icon">📊</div>
              <h4>Zapier</h4>
              <p>Automatisez vos workflows avec 3000+ apps</p>
            </div>
            <div className="integration-item">
              <div className="integration-icon">💬</div>
              <h4>Slack</h4>
              <p>Recevez des notifications dans votre équipe</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à Révolutionner Votre Contenu ?</h2>
            <p>
              Rejoignez des milliers de créateurs qui font confiance à GotoDrop pour amplifier leur
              présence sur les réseaux sociaux.
            </p>
            <div className="cta-buttons">
              <Link to="/auth/signup" className="btn btn-primary btn-large">
                Commencer Gratuitement
              </Link>
              <Link to="/pricing" className="btn btn-outline btn-large">
                Voir les Tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
