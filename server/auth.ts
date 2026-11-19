/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Express, Request, Response } from 'express';

interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
}

interface SessionPayload {
  sub: string;
  email: string;
  displayName: string;
  role: string;
  iat: number;
  exp: number;
}

const DATA_DIR = path.resolve(process.cwd(), '.aunara-data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SECRET_FILE = path.join(DATA_DIR, 'session.secret');
const COOKIE_NAME = 'aunara_session';
const SESSION_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

// Simple in-memory rate limiter for auth routes
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 20;
const rateBucket = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || now > entry.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX_ATTEMPTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  }
}

let cachedSecret: string | null = null;
function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 32) {
    return process.env.SESSION_SECRET.trim();
  }
  if (cachedSecret) return cachedSecret;

  ensureDataDir();
  if (fs.existsSync(SECRET_FILE)) {
    const existing = fs.readFileSync(SECRET_FILE, 'utf8').trim();
    if (existing.length >= 32) {
      cachedSecret = existing;
      return existing;
    }
  }

  const generated = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
  cachedSecret = generated;
  return generated;
}

function readUsers(): StoredUser[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  ensureDataDir();
  const tmpFile = `${USERS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(users, null, 2), { mode: 0o600 });
  fs.renameSync(tmpFile, USERS_FILE);
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashPassword(password, salt), 'hex');
  const expected = Buffer.from(storedHash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

function signSessionToken(payload: SessionPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.sub || !payload.email || typeof payload.exp !== 'number') {
      return null;
    }
    if (Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(header?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      result[key] = decodeURIComponent(val);
    }
  }
  return result;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies[COOKIE_NAME] || null;
}

function setSessionCookie(req: Request, res: Response, token: string): void {
  const isHttps =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production';

  const cookieParts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${SESSION_TTL_SEC}`,
    isHttps ? 'SameSite=None' : 'SameSite=Lax'
  ];
  if (isHttps) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function clearSessionCookie(req: Request, res: Response): void {
  const isHttps =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production';

  const cookieParts = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'Max-Age=0',
    isHttps ? 'SameSite=None' : 'SameSite=Lax'
  ];
  if (isHttps) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function toPublicAuthUser(user: {
  id: string;
  email: string;
  displayName: string;
  role: string;
}) {
  return {
    uid: user.id,
    username: user.email.split('@')[0],
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    authProvider: 'server-email' as const,
    loggedInAt: new Date().toISOString()
  };
}

export function registerAuthRoutes(app: Express): void {
  // Register new account with email & scrypt-hashed password
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        error: 'Terlalu banyak percobaan pendaftaran. Silakan tunggu beberapa menit lalu coba lagi.'
      });
      return;
    }

    const { fullName, email, password } = req.body as {
      fullName?: string;
      email?: string;
      password?: string;
    };

    const cleanName = typeof fullName === 'string' ? fullName.trim().slice(0, 80) : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase().slice(0, 120) : '';
    const rawPassword = typeof password === 'string' ? password : '';

    if (!cleanName || cleanName.length < 2) {
      res.status(400).json({ error: 'Nama lengkap minimal 2 karakter.' });
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Format alamat email tidak valid.' });
      return;
    }
    if (rawPassword.length < 6 || rawPassword.length > 128) {
      res.status(400).json({ error: 'Kata sandi harus terdiri dari 6 hingga 128 karakter.' });
      return;
    }

    const users = readUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      res.status(409).json({
        error: 'Email tersebut sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda.'
      });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const newUser: StoredUser = {
      id: `usr_${crypto.randomBytes(12).toString('hex')}`,
      email: cleanEmail,
      displayName: cleanName,
      role: 'Kreator Edukasi',
      passwordSalt: salt,
      passwordHash: hashPassword(rawPassword, salt),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    const nowSec = Math.floor(Date.now() / 1000);
    const token = signSessionToken({
      sub: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      iat: nowSec,
      exp: nowSec + SESSION_TTL_SEC
    });

    setSessionCookie(req, res, token);
    res.status(201).json({
      user: toPublicAuthUser(newUser),
      token
    });
  });

  // Login with email & password
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        error: 'Terlalu banyak percobaan masuk. Silakan tunggu beberapa menit lalu coba lagi.'
      });
      return;
    }

    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const rawPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail || !rawPassword) {
      res.status(400).json({ error: 'Mohon masukkan alamat email dan kata sandi.' });
      return;
    }

    const users = readUsers();
    const matched = users.find((u) => u.email === cleanEmail);
    if (!matched || !verifyPassword(rawPassword, matched.passwordSalt, matched.passwordHash)) {
      res.status(401).json({
        error: 'Email atau kata sandi tidak valid. Silakan periksa kembali.'
      });
      return;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const token = signSessionToken({
      sub: matched.id,
      email: matched.email,
      displayName: matched.displayName,
      role: matched.role,
      iat: nowSec,
      exp: nowSec + SESSION_TTL_SEC
    });

    setSessionCookie(req, res, token);
    res.json({
      user: toPublicAuthUser(matched),
      token
    });
  });

  // Validate current session
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ user: null });
      return;
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      clearSessionCookie(req, res);
      res.status(401).json({ user: null });
      return;
    }

    res.json({
      user: toPublicAuthUser({
        id: payload.sub,
        email: payload.email,
        displayName: payload.displayName,
        role: payload.role
      })
    });
  });

  // Logout & clear session cookie
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });
}
