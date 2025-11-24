import type { Handle } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = getAuthenticatedUser(event);
    
    // Define unprotected routes
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(event.url.pathname);
    
    // Everything else requires auth
    if (!isPublicRoute && !event.locals.user) {
        throw redirect(302, '/login');
    }
    
    return resolve(event);
};
