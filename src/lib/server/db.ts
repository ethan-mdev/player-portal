import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';

const { Pool } = pg;

// PostgreSQL (auth/forum)
const pgPool = new Pool({
    connectionString: DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres'
});

pgPool.on('connect', (client) => {
    client.query('SET search_path TO forum, public');
});

export type DbStoreItem = {
	id: number;
	name: string;
	description: string | null;
	type: string;
	price: number;
	image: string;
};

export type DbCreditPurchase = {
    id: number;
    credits: number;
    amount_paid: string;
    status: string;
    purchased_at: string;
};

// --- User-related functions ---
export async function getUserBalance(userId: string): Promise<number> {
    const result = await pgPool.query(`SELECT balance FROM public.users WHERE id = $1`, [userId]);
    return result.rows[0]?.balance ?? 0;
}

// --- Credit purchase functions ---
export async function getCreditPurchasesByUserId(userId: string): Promise<Array<DbCreditPurchase>> {
    const result = await pgPool.query(
        `SELECT id, credits, amount_paid, status, purchased_at 
         FROM dashboard.credit_purchases 
         WHERE user_id = $1 
         ORDER BY purchased_at DESC`,
        [userId]
    );
    return result.rows as Array<DbCreditPurchase>;
}

// --- Store-related functions ---
export async function getAllStoreItems(): Promise<Array<DbStoreItem>> {
    const result = await pgPool.query(`SELECT * FROM dashboard.items`);
    return result.rows as Array<DbStoreItem>;
}