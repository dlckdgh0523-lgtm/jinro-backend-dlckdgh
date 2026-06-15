import http from 'k6/http';

export const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export function signupAndLogin() {
  const email = `k6-${__VU}-${Date.now()}@load.kr`;
  const res = http.post(
    `${BASE}/v1/auth/signup/student`,
    JSON.stringify({
      email,
      password: 'loadtest123!',
      name: `부하${__VU}`,
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  if (res.status !== 201) throw new Error(`signup failed: ${res.status} ${res.body}`);
  return res.json();
}

export function authHeaders(token) {
  return { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
}
