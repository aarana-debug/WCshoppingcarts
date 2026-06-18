export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const id = Date.now().toString();
    const key = `contact:${id}`;
    const submission = {
      id,
      key,
      type: 'contact',
      timestamp: new Date().toISOString(),
      firstName:    data.firstName    || '',
      lastName:     data.lastName     || '',
      email:        data.email        || '',
      phone:        data.phone        || '',
      businessName: data.businessName || '',
      service:      data.service      || '',
      message:      data.message      || '',
    };
    await env.FORM_SUBMISSIONS.put(key, JSON.stringify(submission));
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
