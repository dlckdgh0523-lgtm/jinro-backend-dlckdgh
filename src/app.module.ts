import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Injectable, type ExecutionContext } from '@nestjs/common';
import { env } from './common/env';

// 부하 테스트 프로파일에서만 rate limit 해제 (DISABLE_RATE_LIMIT=true)
@Injectable()
class MaybeThrottlerGuard extends ThrottlerGuard {
  override async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (env().DISABLE_RATE_LIMIT) return true;
    return super.canActivate(ctx);
  }
}
import { HttpErrorFilter } from './common/http-error.filter';
import { HealthController } from './common/health.controller';
import { PrismaService } from './db/prisma.service';
import { AuthController } from './auth/auth.controller';
import { OAuthController } from './auth/oauth.controller';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { CareerController } from './career/career.controller';
import { CareerService } from './career/career.service';
import { CareernetClient } from './career/careernet.client';
import { CacheService } from './career/cache';
import { createRedis } from './common/redis';
import { CounselingController } from './ai/counseling.controller';
import { CounselingService } from './ai/counseling.service';
import { Retriever } from './ai/retriever';
import { ReportController, FilesController } from './report/report.controller';
import { AdmissionsController } from './admissions/admissions.controller';
import { ForeignUniversitiesController } from './admissions/foreign.controller';
import { ScholarshipsController } from './admissions/scholarships.controller';
import { CalendarController } from './calendar/calendar.controller';
import { GradesController } from './grades/grades.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { StudyController } from './study/study.controller';
import { MessagesController } from './messages/messages.controller';
import { TeacherController } from './teacher/teacher.controller';
import { AdminController } from './admin/admin.controller';
import { CounselingRequestsController } from './counseling-requests/counseling-requests.controller';
import { VolunteersController } from './volunteers/volunteers.controller';
import { MaterialsController } from './career/materials.controller';
import { NotificationsController } from './realtime/notifications.controller';
import { NotificationsService } from './realtime/notifications.service';
import { PubSubService } from './realtime/pubsub.service';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    // 전역 rate limit 100/min (backend-integration.md §13) — 세부는 라우트별 @Throttle
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
  ],
  controllers: [
    HealthController,
    AuthController,
    OAuthController,
    CareerController,
    CounselingController,
    ReportController,
    FilesController,
    AdmissionsController,
    ForeignUniversitiesController,
    ScholarshipsController,
    CalendarController,
    GradesController,
    DashboardController,
    StudyController,
    MessagesController,
    TeacherController,
    AdminController,
    CounselingRequestsController,
    VolunteersController,
    MaterialsController,
    NotificationsController,
  ],
  providers: [
    PrismaService,
    AuthService,
    JwtAuthGuard,
    CareernetClient,
    { provide: CacheService, useFactory: () => new CacheService(createRedis('cache')) },
    CareerService,
    Retriever,
    CounselingService,
    NotificationsService,
    PubSubService,
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_GUARD, useClass: MaybeThrottlerGuard },
  ],
})
export class AppModule {}
