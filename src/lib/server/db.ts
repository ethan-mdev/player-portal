import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres'
});

pool.on('connect', (client) => {
    client.query('SET search_path TO forum, public');
});

export type DbCharacter = {
    id: string;
    name: string;
    level: number;
    class: string;
    gold: number;
    created_at: string;
};

export type DbStoreItem = {
    id: string;
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
    const result = await pool.query(`SELECT balance FROM public.users WHERE id = $1`, [userId]);
    return result.rows[0]?.balance ?? 0;
}

// --- Credit purchase functions ---
export async function getCreditPurchasesByUserId(userId: string): Promise<Array<DbCreditPurchase>> {
    const result = await pool.query(
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
    const result = await pool.query(`SELECT * FROM dashboard.items`);
    return result.rows as Array<DbStoreItem>;
}


// --- Character-related functions ---
export async function getCharactersByUserId(userId: string): Promise<Array<DbCharacter>> {
    const result = await pool.query(`SELECT * FROM dashboard.characters WHERE user_id = $1`, [userId]);
    return result.rows as Array<DbCharacter>;
}