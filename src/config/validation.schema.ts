import * as Joi from 'joi';

/**
 * Validation schema for environment variables
 * Ensures all required variables are present and have the correct format
 */
export const validationSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  // Server configuration
  PORT: Joi.number().default(3000),
  
  // Database configuration
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_DATABASE: Joi.string().default('jsonplaceholder'),
  
  // JWT configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  
  // Application configuration
  SEED_DATABASE: Joi.boolean().default(true),
});
