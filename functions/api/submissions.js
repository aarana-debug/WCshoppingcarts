function authorized(request, env) {
  const auth = request.headers.get('Authorization') || '';
  return auth === `Bearer ${env.ADMIN_KEY}`;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  if (!authorized(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // GET — list all submissions
  if (request.method === 'GET') {
    const list = await env.FORM_SUBMISSIONS.list();
    const items = await Promise.all(
      list.keys.map(async ({ name }) => {
        const val = await env.FORM_SUBMISSIONS.get(name);
        return val ? JSON.parse(val) : null;
      })
    );
    const sorted = items
      .filter(Boolean)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return new Response(JSON.stringify(sorted), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // DELETE — remove one or all
  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (key === '__all__') {
      const list = await env.FORM_SUBMISSIONS.list();
      await Promise.all(list.keys.map(({ name }) => env.FORM_SUBMISSIONS.delete(name)));
    } else if (key) {
      await env.FORM_SUBMISSIONS.delete(key);
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405, headers: CORS });
}
