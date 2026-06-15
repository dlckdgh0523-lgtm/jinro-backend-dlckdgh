import { createHmac, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, normalize, resolve, sep } from 'node:path';
import { env } from './env';
import { logger } from './logger';

// 스토리지 — S3 키가 없으면 로컬 디스크 + HMAC 서명 URL(presigned 유사).
// S3 키 투입 시 이 클래스의 put/getSignedUrl만 S3 SDK 호출로 바꾸면 된다 (DECISIONS #13).
export class StorageService {
  private get root(): string {
    return resolve(process.cwd(), env().LOCAL_STORAGE_DIR);
  }

  get mode(): 's3' | 'local' {
    return env().S3_BUCKET && env().AWS_ACCESS_KEY_ID ? 's3' : 'local';
  }

  private safePath(key: string): string {
    const p = normalize(join(this.root, key));
    if (!p.startsWith(this.root + sep) && p !== this.root) {
      throw new Error('invalid storage key');
    }
    return p;
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    if (this.mode === 's3') {
      // S3 자격증명이 실제로 들어오면 여기서 S3 PutObject 호출 (현 빌드: 키 부재 → 도달 불가)
      logger.warn('S3 credentials present but S3 SDK not bundled — falling back to local storage');
    }
    const p = this.safePath(key);
    await mkdir(dirname(p), { recursive: true });
    await writeFile(p, body);
    await writeFile(p + '.meta.json', JSON.stringify({ contentType, size: body.length, createdAt: new Date().toISOString() }));
  }

  async get(key: string): Promise<{ body: Buffer; contentType: string }> {
    const p = this.safePath(key);
    const body = await readFile(p);
    let contentType = 'application/octet-stream';
    try {
      const meta = JSON.parse(await readFile(p + '.meta.json', 'utf8')) as { contentType?: string };
      if (meta.contentType) contentType = meta.contentType;
    } catch {
      logger.debug({ key }, 'storage meta missing, using default content type');
    }
    return { body, contentType };
  }

  /** presigned-유사 URL: /v1/files/{key}?expires=&sig= (HMAC-SHA256) */
  getSignedUrl(key: string, ttlSec = 3600): string {
    const expires = Math.floor(Date.now() / 1000) + ttlSec;
    const sig = this.sign(key, expires);
    return `${env().PUBLIC_BASE_URL}/v1/files/${encodeURIComponent(key)}?expires=${expires}&sig=${sig}`;
  }

  verifySignature(key: string, expires: number, sig: string): boolean {
    if (!Number.isFinite(expires) || expires < Date.now() / 1000) return false;
    const expected = this.sign(key, expires);
    const a = Buffer.from(expected);
    const b = Buffer.from(sig);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  private sign(key: string, expires: number): string {
    return createHmac('sha256', env().FILE_URL_SECRET).update(`${key}:${expires}`).digest('hex');
  }
}

export const storage = new StorageService();
