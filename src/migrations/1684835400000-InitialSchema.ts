import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial database schema migration
 * Creates all necessary tables for the application
 */
export class InitialSchema1684835400000 implements MigrationInterface {
  name = 'InitialSchema1684835400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create geos table
    await queryRunner.query(`
      CREATE TABLE "geos" (
        "id" SERIAL NOT NULL,
        "lat" character varying(50) NOT NULL,
        "lng" character varying(50) NOT NULL,
        CONSTRAINT "PK_geos" PRIMARY KEY ("id")
      )
    `);

    // Create addresses table
    await queryRunner.query(`
      CREATE TABLE "addresses" (
        "id" SERIAL NOT NULL,
        "street" character varying(100) NOT NULL,
        "suite" character varying(100) NOT NULL,
        "city" character varying(100) NOT NULL,
        "zipcode" character varying(20) NOT NULL,
        "geoId" integer,
        CONSTRAINT "REL_addresses_geos" UNIQUE ("geoId"),
        CONSTRAINT "PK_addresses" PRIMARY KEY ("id")
      )
    `);

    // Create companies table
    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "catchPhrase" character varying(200) NOT NULL,
        "bs" character varying(200) NOT NULL,
        CONSTRAINT "PK_companies" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "username" character varying(50) NOT NULL,
        "email" character varying(100) NOT NULL,
        "phone" character varying(50) NOT NULL,
        "website" character varying(100) NOT NULL,
        "addressId" integer,
        "companyId" integer,
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "REL_users_addresses" UNIQUE ("addressId"),
        CONSTRAINT "REL_users_companies" UNIQUE ("companyId"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create auth table
    await queryRunner.query(`
      CREATE TABLE "auth" (
        "id" SERIAL NOT NULL,
        "email" character varying(100) NOT NULL,
        "name" character varying(100) NOT NULL,
        "passwordHash" character varying(255) NOT NULL,
        "userId" integer,
        CONSTRAINT "UQ_auth_email" UNIQUE ("email"),
        CONSTRAINT "REL_auth_users" UNIQUE ("userId"),
        CONSTRAINT "PK_auth" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "addresses" 
      ADD CONSTRAINT "FK_addresses_geos" 
      FOREIGN KEY ("geoId") 
      REFERENCES "geos"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_addresses" 
      FOREIGN KEY ("addressId") 
      REFERENCES "addresses"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_companies" 
      FOREIGN KEY ("companyId") 
      REFERENCES "companies"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "auth" 
      ADD CONSTRAINT "FK_auth_users" 
      FOREIGN KEY ("userId") 
      REFERENCES "users"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_auth_users"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_companies"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_addresses"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_addresses_geos"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
    await queryRunner.query(`DROP TABLE "geos"`);
  }
}
