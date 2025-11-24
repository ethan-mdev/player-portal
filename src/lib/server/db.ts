import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const db = new Database("forum.db");

// --- Initialize database schema ---
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        profile_image TEXT,
        account_balance NUMERIC DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

// --- Types ---
export type DbUser = {
    id: string;
    email: string;
    username: string;
    password_hash: string;
    created_at: string;
    profile_image: string | null;
    account_balance: number;
};

export type DbSession = {
    id: string;
    user_id: string;
    created_at: string;
    expires_at: string;
};

// --- User-related functions ---
export function createUser(email: string, username: string, password_hash: string): DbUser {
    const id = randomUUID();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
        INSERT INTO users (id, email, username, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
    `).run(id, email, username, password_hash, now);

    return getUserById(id)!;
};

export function getUserById(id: string): DbUser | undefined {
    const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as DbUser | undefined;
    return row || undefined;
};

export function getUserByUsername(username: string): DbUser | undefined {
    const row = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username) as DbUser | undefined;
    return row || undefined;
}

export function getUserByEmail(email: string): DbUser | undefined {
    const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as DbUser | undefined;
    return row || undefined;
}

export function updateUserProfileImage(userId: string, profileImage: string): void {
    db.prepare(`
        UPDATE users 
        SET profile_image = ? 
        WHERE id = ?
    `).run(profileImage, userId);
}

// --- Session-related functions ---
export function createSession(userId: string): DbSession {
    const id = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    db.prepare(`
        INSERT INTO sessions (id, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    `).run(id, userId, now.toISOString(), expiresAt.toISOString());

    return {
        id,
        user_id: userId,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
    };
}

export function getUserWithSession(sessionId: string): { session: DbSession; user: DbUser } | undefined {
    const row = db.prepare(`
        SELECT s.*, u.*
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ? AND s.expires_at > CURRENT_TIMESTAMP
    `).get(sessionId) as (DbSession & DbUser) | undefined;

    if (!row) return undefined;

    const session: DbSession = {
        id: row.id,
        user_id: row.user_id,
        created_at: row.created_at,
        expires_at: row.expires_at
    };

    const user: DbUser = {
        id: row.id,
        email: row.email,
        username: row.username,
        password_hash: row.password_hash,
        created_at: row.created_at,
        profile_image: row.profile_image,
        account_balance: row.account_balance
    };

    return { session, user };
}

export function deleteSession(sessionId: string): void {
    db.prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
}

// Initialize seed data on first run
// import { seedDatabase } from './seed.js';
// seedDatabase();
