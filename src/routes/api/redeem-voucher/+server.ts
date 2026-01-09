import { json, type RequestHandler } from '@sveltejs/kit';
import { redeemVoucher } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	const { code } = await request.json();

	const result = await redeemVoucher(accessToken, code);
	
	if (!result.ok) {
		return json({ ok: false, error: result.error }, { status: 400 });
	}

	return json({ ok: true, message: result.message });
};
