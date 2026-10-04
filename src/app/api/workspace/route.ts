import { NextRequest, NextResponse } from 'next/server';
import { getStore, StoreError } from '@/lib/store';
import { validTimezone } from '@/lib/model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const cookie = 'studypilot_session';
const reply = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
function failure(error: unknown) {
  if (error instanceof StoreError) return reply({ error: error.message }, error.status);
  return reply({ error: 'The workspace could not be saved or loaded. Your draft has been kept. Try again.' }, 500);
}
export async function GET(request: NextRequest) {
  try { return reply(getStore().read(request.cookies.get(cookie)?.value || '')); } catch (error) { return failure(error); }
}
export async function POST(request: NextRequest) {
  // Same-origin JSON requests only; cookie credentials are never accepted cross-origin.
  if (request.headers.get('origin') !== request.nextUrl.origin || !request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Request origin is not allowed.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 20000) return reply({ error: 'Request is too large.' }, 413);
  try {
    const raw = await request.text();
    if (raw.length > 20000) return reply({ error: 'Request is too large.' }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({ error: 'Invalid request.' }, 400); }
    if (!body || typeof body !== 'object') return reply({ error: 'Invalid request.' }, 400);
    const token = request.cookies.get(cookie)?.value || '';
    if (body.kind === 'guest') {
      if (typeof body.timezone !== 'string' || !validTimezone(body.timezone)) return reply({ error: 'Choose a valid timezone.' }, 400);
      if (token) { try { return reply(getStore().read(token)); } catch (error) { if (!(error instanceof StoreError && error.status === 401)) throw error; } }
      const result = getStore().create(body.timezone), response = reply(result.data);
      response.cookies.set(cookie, result.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 365 * 86400 });
      return response;
    }
    if (body.kind === 'signout' || body.kind === 'delete') {
      if (body.kind === 'delete') { if (body.confirmation !== 'DELETE') return reply({ error: 'Type DELETE to confirm.' }, 400); getStore().delete(token); }
      else getStore().signout(token);
      const response = reply({ ok: true }); response.cookies.delete(cookie); return response;
    }
    if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{8,64}$/.test(body.requestId) || !Number.isInteger(body.revision) || !body.payload || typeof body.payload !== 'object') return reply({ error: 'Invalid save request.' }, 400);
    return reply(getStore().mutate(token, body.requestId, body.revision, { kind: body.kind, payload: body.payload }));
  } catch (error) { return failure(error); }
}
