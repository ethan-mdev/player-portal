import { json } from '@sveltejs/kit';
import { changePassword } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.access_token) {
		return json({ ok: false, error: 'Not authenticated' }, { status: 401 });
	}

	const { old_password, new_password } = await request.json();

	if (!old_password?.trim() || !new_password?.trim()) {
		return json({ ok: false, error: 'Old and new passwords are required' }, { status: 400 });
	}

	if (new_password.length < 6) {
		return json({ ok: false, error: 'New password must be at least 6 characters' }, { status: 400 });
	}

	const result = await changePassword(locals.user.access_token, old_password.trim(), new_password.trim());

	if (!result.ok) {
		return json({ ok: false, error: result.error }, { status: 400 });
	}

	return json({ ok: true, message: result.message });
};