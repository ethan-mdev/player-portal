import { getUserProfile, getCharacters } from '$lib/server/auth';
import { getAllStoreItems, getUserBalance, getCreditPurchasesByUserId } from '$lib/server/db';


export const load = async ({ locals }) => {
    if (!locals.user) {
        return { user: null, store_items: [], balance: 0, purchase_history: [] };
    }
    
    const profile = await getUserProfile(locals.user.id);
    const characters = await getCharacters(locals.user.access_token);
    const store_items = await getAllStoreItems();
    const balance = await getUserBalance(locals.user.id);
    const purchase_history = await getCreditPurchasesByUserId(locals.user.id);
    
    return {
        user: {
            ...locals.user,
            profile_image: profile?.profile_image || null,
            characters
        },
        store_items,
        balance,
        purchase_history
    };
};