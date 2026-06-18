export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const id = Date.now().toString();
    const key = `report:${id}`;
    const submission = {
      id,
      key,
      type: 'report',
      timestamp: new Date().toISOString(),
      name:       data.name       || '',
      contact:    data.contact    || '',
      store_name: data.store_name || '',
      location:   data.location   || '',
      cart_count: data.cart_count || '',
      notes:      data.notes      || '',
    };
    await env.KV.put(key, JSON.stringify(submission));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
