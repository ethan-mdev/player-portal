import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
    const token = url.searchParams.get('token');
    
    if (!token) {
        throw redirect(303, '/login');
    }
    
    // If not logged in, redirect to login with token
    if (!locals.user) {
        throw redirect(303, `/login?verify_token=${token}`);
    }
    
    // User is logged in, pass token to page
    return {
        token
    };
};
