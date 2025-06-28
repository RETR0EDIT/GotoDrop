import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/home.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="brand">GotoDrop</span>
              <br />
              <span className="hero-subtitle">Publication Multi-Plateformes</span>
            </h1>
            <p className="hero-description">
              Publiez vos vidéos simultanément sur TikTok, Instagram Reels, YouTube Shorts et bien
              plus encore. Une seule upload, toutes les plateformes.
            </p>
            <div className="hero-actions">
              <Link to="/auth/signup" className="btn btn-primary btn-large">
                Commencer gratuitement
              </Link>
              <Link to="/auth/login" className="btn btn-secondary btn-large">
                Se connecter
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Plateformes</span>
              </div>
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Vidéos publiées</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="video-preview">
              <div className="video-placeholder">
                <span className="video-icon">🎬</span>
                <p>Votre vidéo</p>
              </div>
              <div className="platforms-grid">
                <div className="platform-icon tiktok">📱</div>
                <div className="platform-icon instagram">📷</div>
                <div className="platform-icon youtube">📺</div>
                <div className="platform-icon twitter">🐦</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="platforms-section">
        <div className="container">
          <h2 className="section-title">Plateformes supportées</h2>
          <div className="platforms-list">
            <div className="platform-card">
              <div className="platform-logo tiktok-bg">
                <span>📱</span>
              </div>
              <h3>TikTok</h3>
              <p>Format vertical optimisé pour l'engagement maximum</p>
            </div>
            <div className="platform-card">
              <div className="platform-logo instagram-bg">
                <span>�</span>
              </div>
              <h3>Instagram Reels</h3>
              <p>Atteignez votre audience Instagram avec des Reels percutants</p>
            </div>
            <div className="platform-card">
              <div className="platform-logo youtube-bg">
                <span>📺</span>
              </div>
              <h3>YouTube Shorts</h3>
              <p>Maximisez votre visibilité sur la plus grande plateforme vidéo</p>
            </div>
            <div className="platform-card">
              <div className="platform-logo twitter-bg">
                <span>🐦</span>
              </div>
              <h3>Twitter</h3>
              <p>Partagez vos vidéos courtes sur le réseau social de l'actualité</p>
            </div>
            <div className="platform-card">
              <div className="platform-logo facebook-bg">
                <span>�</span>
              </div>
              <h3>Facebook Reels</h3>
              <p>Touchez l'audience Facebook avec du contenu vidéo engageant</p>
            </div>
            <div className="platform-card coming-soon">
              <div className="platform-logo">
                <span>⚡</span>
              </div>
              <h3>Plus à venir</h3>
              <p>Nouvelles plateformes ajoutées régulièrement</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Comment ça marche</h2>
          <div className="workflow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Uploadez votre vidéo</h3>
                <p>Importez votre contenu depuis votre appareil ou cloud</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Personnalisez pour chaque plateforme</h3>
                <p>Adaptez automatiquement le format, titre et description</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Planifiez et publiez</h3>
                <p>Publiez immédiatement ou programmez pour plus tard</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Suivez les performances</h3>
                <p>Analysez l'engagement sur toutes vos plateformes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-grid-section">
        <div className="container">
          <h2 className="section-title">Fonctionnalités avancées</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>IA Intégrée</h3>
              <p>
                Génération automatique de titres et descriptions optimisés pour chaque plateforme
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Unifiés</h3>
              <p>Suivez les performances de toutes vos vidéos depuis un seul dashboard</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Planification</h3>
              <p>Programmez vos publications aux heures optimales pour chaque audience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Formats Adaptatifs</h3>
              <p>Conversion automatique aux spécifications de chaque plateforme</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Cross-Posting</h3>
              <p>Publiez sur plusieurs plateformes en un seul clic</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Gérez vos publications depuis n'importe quel appareil</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à maximiser votre reach ?</h2>
            <p>
              Rejoignez des milliers de créateurs qui utilisent GotoDrop pour amplifier leur
              présence
            </p>
            <div className="cta-buttons">
              <Link to="/auth/signup" className="btn btn-primary btn-large">
                Commencer gratuitement
              </Link>
              <Link to="/demo" className="btn btn-outline btn-large">
                Voir la démo
              </Link>
            </div>
            <p className="cta-note">Gratuit pour commencer • Sans engagement • Support 24/7</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
