import { json } from '@sveltejs/kit';
import { unstuckCharacter } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user?.access_token) {
        return json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { character } = await request.json();
    if (!character?.trim()) {
        return json({ ok: false, error: 'Character name required' }, { status: 400 });
    }

    const result = await unstuckCharacter(locals.user.access_token, character.trim());

    if (!result.ok) {
        return json({ ok: false, error: result.error }, { status: 400 });
    }

    return json({ ok: true, message: result.message });
};