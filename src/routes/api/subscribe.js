/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	let data;
	try {
		data = await request.json();
	} catch (err) {
		return {
			status: 400,
			body: { ok: false, error: 'invalid_json' }
		};
	}

	const email = String((data && data.email) || '')
		.trim()
		.toLowerCase();
	const preference = data && data.preference;

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return {
			status: 400,
			body: { ok: false, error: 'invalid_email' }
		};
	}

	if (preference !== 'digest' && preference !== 'posts') {
		return {
			status: 400,
			body: { ok: false, error: 'invalid_preference' }
		};
	}

	const apiKey = process.env.RESEND_API_KEY;
	const notifyTo = process.env.SUBSCRIBE_NOTIFY_TO;
	const from = process.env.SUBSCRIBE_FROM_EMAIL || 'onboarding@resend.dev';
	const audienceId = process.env.RESEND_AUDIENCE_ID;

	if (!apiKey || !notifyTo) {
		return {
			status: 503,
			body: {
				ok: false,
				error: 'not_configured',
				message:
					'Email isn’t configured yet. Set RESEND_API_KEY and SUBSCRIBE_NOTIFY_TO on Vercel (optional: SUBSCRIBE_FROM_EMAIL, RESEND_AUDIENCE_ID).'
			}
		};
	}

	const preferenceLabel =
		preference === 'digest' ? 'Quarterly digest' : 'Every new post';

	if (audienceId) {
		try {
			const contactRes = await fetch('https://api.resend.com/contacts', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					audience_id: audienceId,
					unsubscribed: false,
					first_name: preferenceLabel
				})
			});

			if (!contactRes.ok && contactRes.status !== 409) {
				const detail = await contactRes.text();
				return {
					status: 502,
					body: { ok: false, error: 'provider_error', detail }
				};
			}
		} catch (err) {
			return {
				status: 502,
				body: { ok: false, error: 'provider_error', detail: String(err) }
			};
		}
	}

	try {
		const emailRes = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from,
				to: [notifyTo],
				subject: `Subscribe · ${preferenceLabel}`,
				text: [
					`New subscriber on elton-website`,
					``,
					`Email: ${email}`,
					`Preference: ${preferenceLabel} (${preference})`,
					``,
					audienceId
						? `Also added to Resend audience ${audienceId}.`
						: `No RESEND_AUDIENCE_ID set — notification only. Add an audience id to store contacts.`
				].join('\n')
			})
		});

		if (!emailRes.ok) {
			const detail = await emailRes.text();
			return {
				status: 502,
				body: { ok: false, error: 'provider_error', detail }
			};
		}
	} catch (err) {
		return {
			status: 502,
			body: { ok: false, error: 'provider_error', detail: String(err) }
		};
	}

	return {
		status: 200,
		body: { ok: true }
	};
}
