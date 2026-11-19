/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { AuthUser } from './types/game';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export function mapFirebaseUserToAuthUser(user: User, fallbackName?: string): AuthUser {
  const providerIds = new Set(user.providerData.map((p) => p.providerId));
  const hasGoogle = providerIds.has('google.com');
  const hasPassword = providerIds.has('password');

  const authProvider: AuthUser['authProvider'] =
    hasGoogle && hasPassword
      ? 'firebase-both'
      : hasGoogle
      ? 'firebase-google'
      : 'firebase-email';

  const email = user.email || '';
  const username = email ? email.split('@')[0] : user.uid.slice(0, 12);
  const displayName = (user.displayName || fallbackName || username || 'Pengguna AUNARA').trim();

  return {
    uid: user.uid,
    username,
    displayName,
    email: email || undefined,
    photoUrl: user.photoURL || undefined,
    emailVerified: user.emailVerified,
    role: 'Kreator Edukasi',
    authProvider,
    loggedInAt: new Date().toISOString()
  };
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

function detectProviderLabel(user: User): 'google' | 'password' | 'google+password' {
  const ids = new Set(user.providerData.map((p) => p.providerId));
  const hasGoogle = ids.has('google.com');
  const hasPassword = ids.has('password');
  if (hasGoogle && hasPassword) return 'google+password';
  if (hasGoogle) return 'google';
  return 'password';
}

export async function syncUserProfileToFirestore(user: User): Promise<void> {
  // Firestore rules strictly require verified email for writes; skip until verified
  if (!user.email || !user.emailVerified) return;

  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);

  const safeDisplayName = (user.displayName || user.email.split('@')[0] || 'Pengguna AUNARA')
    .trim()
    .slice(0, 80);
  const safeEmail = user.email.trim().slice(0, 120);
  const safePhotoUrl = user.photoURL ? user.photoURL.trim().slice(0, 500) : undefined;
  const provider = detectProviderLabel(user);

  let exists = false;
  try {
    const snap = await getDoc(ref);
    exists = snap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!exists) {
    const createPayload: Record<string, unknown> = {
      uid: user.uid,
      displayName: safeDisplayName,
      email: safeEmail,
      provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    if (safePhotoUrl) {
      createPayload.photoUrl = safePhotoUrl;
    }

    try {
      await setDoc(ref, createPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  } else {
    const updatePayload: Record<string, unknown> = {
      displayName: safeDisplayName,
      provider,
      updatedAt: serverTimestamp()
    };
    if (safePhotoUrl) {
      updatePayload.photoUrl = safePhotoUrl;
    }

    try {
      await updateDoc(ref, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

export function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid. Contoh: nama@sekolah.sch.id.';
    case 'auth/email-already-in-use':
      return 'Email tersebut sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email/username atau kata sandi tidak valid. Silakan periksa kembali.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan masuk. Tunggu beberapa menit lalu coba lagi.';
    case 'auth/operation-not-allowed':
      return 'Pendaftaran Email/Password belum diaktifkan di Firebase Console proyek ini. Aktifkan provider Email/Password di Firebase Authentication Console terlebih dahulu.';
    case 'auth/network-request-failed':
      return 'Koneksi internet terputus. Periksa jaringan Anda lalu coba lagi.';
    default:
      return error instanceof Error ? error.message : 'Terjadi kendala saat otentikasi. Silakan coba lagi.';
  }
}
