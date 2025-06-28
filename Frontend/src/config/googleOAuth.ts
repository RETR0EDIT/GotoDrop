// Configuration pour l'authentification Google OAuth
export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  REDIRECT_URI:
    import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
  SCOPES: ['openid', 'profile', 'email'].join(' '),
  RESPONSE_TYPE: 'code',
  ACCESS_TYPE: 'offline',
  PROMPT: 'consent',
} as const;

// URLs Google OAuth
export const GOOGLE_OAUTH_URLS = {
  AUTHORIZATION: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN: 'https://oauth2.googleapis.com/token',
  USERINFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
} as const;

// Fonction pour générer l'URL d'autorisation Google
export const generateGoogleAuthUrl = (state?: string): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
    redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
    scope: GOOGLE_OAUTH_CONFIG.SCOPES,
    response_type: GOOGLE_OAUTH_CONFIG.RESPONSE_TYPE,
    access_type: GOOGLE_OAUTH_CONFIG.ACCESS_TYPE,
    prompt: GOOGLE_OAUTH_CONFIG.PROMPT,
    ...(state && { state }),
  });

  return `${GOOGLE_OAUTH_URLS.AUTHORIZATION}?${params.toString()}`;
};
