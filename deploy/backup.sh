#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# PostgreSQL 자동 백업 (진로나침반 운영 — AWS EC2 단일 호스트)
#
# 동작:
#   docker-compose.prod.yml 의 postgres 컨테이너에서 pg_dump 로 전체 DB를 덤프해
#   ~/jinro-backups/ 에 타임스탬프 파일(.sql.gz)로 저장하고, 14일 이상 된 백업은 삭제한다.
#
# 사용법(서버에서 직접 실행):
#   bash ~/jinro-backend-dlckdgh/deploy/backup.sh
#
# crontab 등록 예시 — 매일 새벽 3시 자동 실행 (`crontab -e` 후 아래 한 줄 추가):
#   0 3 * * * /bin/bash /home/ubuntu/jinro-backend-dlckdgh/deploy/backup.sh >> /home/ubuntu/jinro-backups/backup.log 2>&1
#
# 주의:
#   - 이 스크립트는 docker compose 프로젝트 디렉터리(레포 루트)를 기준으로 동작한다.
#   - 백업 파일에는 평문 데이터가 들어 있으니 ~/jinro-backups 권한을 700으로 둘 것.
#   - 복원:  gunzip -c <백업파일> | docker compose -f docker-compose.prod.yml exec -T postgres psql -U jinro -d jinro
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# 레포 루트(= docker compose 파일 위치)로 이동 — backup.sh 는 deploy/ 아래에 있다.
cd "$(dirname "$0")/.."

COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="${BACKUP_DIR:-$HOME/jinro-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DB_USER="${POSTGRES_USER:-jinro}"
DB_NAME="${POSTGRES_DB:-jinro}"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR" 2>/dev/null || true

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTFILE="$BACKUP_DIR/jinro_${TIMESTAMP}.sql.gz"

echo "[backup] $(date '+%F %T') dumping ${DB_NAME} -> ${OUTFILE}"

# -T: TTY 비할당(cron/비대화 환경 필수). pg_dump 출력 → gzip → 파일.
# 실패 시 set -e 로 즉시 중단되고, 부분 생성된 파일은 아래 trap 으로 정리.
trap 'rm -f "$OUTFILE"' ERR
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$DB_USER" -d "$DB_NAME" --no-owner --no-privileges \
  | gzip > "$OUTFILE"
trap - ERR

SIZE="$(du -h "$OUTFILE" | cut -f1)"
echo "[backup] $(date '+%F %T') done (${SIZE})"

# ── 로테이션: RETENTION_DAYS 보다 오래된 백업 삭제 ──
echo "[backup] pruning backups older than ${RETENTION_DAYS} days in ${BACKUP_DIR}"
find "$BACKUP_DIR" -type f -name 'jinro_*.sql.gz' -mtime +"$RETENTION_DAYS" -print -delete || true

echo "[backup] $(date '+%F %T') complete"
