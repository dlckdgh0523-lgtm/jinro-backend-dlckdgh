// REST 시나리오 — 직업/학과/학교 조회 RPS ramp-up (캐시 히트율·스탬피드 확인)
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE, authHeaders, signupAndLogin } from './helpers.js';

export const options = {
  scenarios: {
    rest: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 50 },
        { duration: '40s', target: 150 },
        { duration: '30s', target: 150 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<300'], // 목표 p95 < 300ms
    http_req_failed: ['rate<0.01'], // 에러율 < 1%
    checks: ['rate>0.99'],
  },
};

export function setup() {
  const auth = signupAndLogin();
  return { token: auth.accessToken };
}

const PATHS = [
  '/v1/career/jobs?limit=20',
  '/v1/career/jobs?q=%EB%94%94%EC%9E%90%EC%9D%B4%EB%84%88&limit=20', // 디자이너
  '/v1/career/jobs/1',
  '/v1/career/majors?limit=20',
  '/v1/career/schools?limit=20',
  '/v1/admissions/universities?limit=20',
  '/v1/career/counseling-cases?limit=10',
];

export default function (data) {
  const path = PATHS[Math.floor(Math.random() * PATHS.length)];
  const res = http.get(`${BASE}${path}`, authHeaders(data.token));
  check(res, {
    'status 200': (r) => r.status === 200,
    'has data': (r) => {
      try {
        return r.json('data') !== undefined;
      } catch (e) {
        return false;
      }
    },
  });
  sleep(0.1 + Math.random() * 0.3);
}
