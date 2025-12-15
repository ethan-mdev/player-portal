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
};

// --- Store-related functions ---
export async function getAllStoreItems(): Promise<Array<DbStoreItem>> {
    const result = await pool.query(`SELECT * FROM dashboard.items`);
    return result.rows as Array<DbStoreItem>;
}

export async function getStoreItemsByType(type: string): Promise<Array<DbStoreItem>> {
    const result = await pool.query(`SELECT * FROM dashboard.items WHERE type = $1`, [type]);
    return result.rows as Array<DbStoreItem>;
}

// --- Character-related functions ---
export async function getCharactersByUserId(userId: string): Promise<Array<DbCharacter>> {
    const result = await pool.query(`SELECT * FROM dashboard.characters WHERE user_id = $1`, [userId]);
    return result.rows as Array<DbCharacter>;
}