const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1084209182391-sample.apps.googleusercontent.com';
const JWT_SECRET = process.env.JWT_SECRET || 'apaar_setu_national_sec_key_2026_jwt_token_sha256';
const COOKIE_NAME = process.env.COOKIE_NAME || 'apaar_auth_token';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Strict CORS: Allow frontend Vite origin with credentials
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// ============================================================================
// Google OAuth 2.0 Verification & Secure HTTP-Only JWT Session Issuer
// ============================================================================
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'ERR_MISSING_CREDENTIAL',
        message: 'Missing Google OAuth credential token.',
      });
    }

    let payload;
    try {
      // Verify Google ID Token against Google Public Key Infrastructure
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      // In development fallback for local testing
      if (process.env.NODE_ENV !== 'production' && (credential.startsWith('mock_') || verifyErr.message.includes('audience'))) {
        console.warn('[DEV NOTICE] Google ID Token validation bypassed for testing:', verifyErr.message);
        payload = {
          sub: 'google-sub-784190234412',
          email: 'pritam.raj@student.gov.in',
          name: 'Pritam Raj Chaurasiya',
          picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pritam',
        };
      } else {
        return res.status(401).json({
          success: false,
          error: 'ERR_GOOGLE_SIGNATURE_INVALID',
          message: `Google signature verification failed: ${verifyErr.message}`,
        });
      }
    }

    if (!payload || !payload.email) {
      return res.status(401).json({
        success: false,
        error: 'ERR_INVALID_TOKEN_PAYLOAD',
        message: 'Could not extract verified profile from Google token.',
      });
    }

    // Canonical Session Payload
    const sessionUser = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || 'Verified Student',
      picture: payload.picture,
      role: 'ROLE_STUDENT',
      apaarId: '7841-9023-4412',
      instituteId: 'COL-LNCTE-001',
      authMethod: 'GOOGLE_OAUTH_2.0',
    };

    // Sign Gateway JWT
    const token = jwt.sign(sessionUser, JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'apaar-setu.gov.in',
      audience: 'apaar-setu-client',
    });

    // Set secure HTTP-only cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Secure session cookie established.',
      user: sessionUser,
      token,
    });
  } catch (err) {
    console.error('[AUTH ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'ERR_INTERNAL_AUTH',
      message: err.message,
    });
  }
});

// Session Validation Endpoint
app.get('/api/auth/me', (req, res) => {
  const token = req.cookies[COOKIE_NAME] || 
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
      ? req.headers.authorization.split(' ')[1] 
      : null);

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'No active session token found.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ authenticated: false, message: 'Session expired or invalid.' });
  }
});

// Logout Endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  return res.status(200).json({ success: true, message: 'Session invalidated.' });
});

app.listen(PORT, () => {
  console.log(`[APAAR-Setu API Gateway] Running on http://localhost:${PORT}`);
  console.log(`[CORS Configured For] ${FRONTEND_URL}`);
});
