import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../utils/test-app';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // Create test app with authentication disabled
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/health', () => {
    it('should return health status', () => {
      // When
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toHaveProperty('status', 'ok');
          expect(res.body.data).toHaveProperty('timestamp');
          // Verify timestamp is a valid date string
          expect(new Date(res.body.data.timestamp).toString()).not.toBe('Invalid Date');
        });
    });
  });

  describe('GET /api/health/admin/test', () => {
    it('should return a test message', () => {
      // When
      return request(app.getHttpServer())
        .get('/api/health/admin/test')
        .expect(200)
        // Then
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toHaveProperty('message', 'Health API is working!');
        });
    });
  });
});
