// soak — 중간 부하 12분 지속 (메모리 누수·좀비 프로세스 확인용)
// 실행 후 docker stats / worker 로그에서 RSS 추세를 함께 확인한다.
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE, authHeaders, signupAndLogin } from './helpers.js';

export const options = {
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: 40,
      duration: '12m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate<0.01'],
  },
};

export function setup() {
  const auth = signupAndLogin();
  return { token: auth.accessToken };
}

export default function (data) {
  const h = authHeaders(data.token);
  const dice = Math.random();
  if (dice < 0.5) {
    check(http.get(`${BASE}/v1/career/jobs?limit=20`, h), { 'jobs 200': (r) => r.status === 200 });
  } else if (dice < 0.8) {
    check(http.get(`${BASE}/v1/admissions/universities?limit=10`, h), { 'univ 200': (r) => r.status === 200 });
  } else {
    check(http.get(`${BASE}/v1/notifications?limit=10`, h), { 'noti 200': (r) => r.status === 200 });
  }
  sleep(0.2 + Math.random() * 0.4);
}
