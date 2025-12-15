import { getUserProfile } from '$lib/server/auth';
import { getAllStoreItems, getCharactersByUserId } from '$lib/server/db';

export const load = async ({ locals }) => {
    if (!locals.user) {
        return { user: null, store_items: [] };
    }
    
    const profile = await getUserProfile(locals.user.id);
    const characters = await getCharactersByUserId(locals.user.id);
    const store_items = await getAllStoreItems();
    
    return {
        user: {
            ...locals.user,
            profile_image: profile?.profile_image || null,
            characters
        },
        store_items
    };
};