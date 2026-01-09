import { json } from '@sveltejs/kit';
import { purchaseItem } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.access_token) {
		return json({ ok: false, error: 'Not authenticated' }, { status: 401 });
	}

	const { item_id, amount } = await request.json();
	
	if (!item_id || !amount) {
		return json({ ok: false, error: 'Item ID and amount required' }, { status: 400 });
	}

	const result = await purchaseItem(locals.user.access_token, item_id, amount);

	if (!result.ok) {
		return json({ ok: false, error: result.error }, { status: 400 });
	}

	return json({ 
		ok: true, 
		message: result.message,
		new_balance: result.new_balance 
	});
};
