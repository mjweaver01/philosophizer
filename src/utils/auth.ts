import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getPool } from '../db/connection';
import { v4 as uuid } from 'uuid';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  // Support both "Bearer <token>" and just "<token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  return token || null;
}

/**
 * Get user from request by validating token
 */
export async function getUserFromRequest(
  request: Request
): Promise<User | null> {
  const token = extractToken(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return getUserById(payload.userId);
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  password: string
): Promise<User> {
  const pool = getPool();
  const id = uuid();
  const passwordHash = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING id, email, created_at, updated_at`,
    [id, email, passwordHash]
  );

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    createdAt: result.rows[0].created_at,
    updatedAt: result.rows[0].updated_at,
  };
}

/**
 * Get user by email
 */
export async function getUserByEmail(
  email: string
): Promise<(User & { passwordHash: string }) | null> {
  const pool = getPool();

  const result = await pool.query(
    'SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) return null;

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    passwordHash: result.rows[0].password_hash,
    createdAt: result.rows[0].created_at,
    updatedAt: result.rows[0].updated_at,
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const pool = getPool();

  const result = await pool.query(
    'SELECT id, email, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) return null;

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    createdAt: result.rows[0].created_at,
    updatedAt: result.rows[0].updated_at,
  };
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  const userWithPassword = await getUserByEmail(email);
  if (!userWithPassword) return null;

  const isValid = await verifyPassword(password, userWithPassword.passwordHash);
  if (!isValid) return null;

  const { passwordHash, ...user } = userWithPassword;
  const token = generateToken(user);

  return { user, token };
}
