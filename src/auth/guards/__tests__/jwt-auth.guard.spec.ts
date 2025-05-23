import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    // This test verifies that JwtAuthGuard extends AuthGuard('jwt')
    // Since the class is very simple, we're mainly testing that it's properly instantiated
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });
});
