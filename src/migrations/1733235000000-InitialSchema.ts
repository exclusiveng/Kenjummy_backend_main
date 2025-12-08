import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1733235000000 implements MigrationInterface {
    name = 'InitialSchema1733235000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "fullName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'user',
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
                CONSTRAINT "CHK_users_role" CHECK ("role" IN ('user', 'admin'))
            )
        `);

        // Create bookings table
        await queryRunner.query(`
            CREATE TABLE "bookings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "serviceType" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "fullName" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "email" character varying NOT NULL,
                "pickup" character varying,
                "dropoff" character varying,
                "departure" character varying,
                "destination" character varying,
                "date" date,
                "time" time,
                "vehicle" character varying,
                "duration" character varying,
                "specialRequest" character varying,
                "numberOfPassengers" integer,
                "startDate" date,
                "startTime" time,
                "endDate" date,
                "endTime" time,
                "purpose" character varying,
                "travelTime" character varying,
                "days" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id"),
                CONSTRAINT "CHK_bookings_serviceType" CHECK ("serviceType" IN ('charter', 'intercity', 'vip', 'hire')),
                CONSTRAINT "CHK_bookings_status" CHECK ("status" IN ('pending', 'confirmed', 'completed', 'cancelled'))
            )
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "bookings" 
            ADD CONSTRAINT "FK_bookings_userId" 
            FOREIGN KEY ("userId") 
            REFERENCES "users"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);

        // Create index on user email for faster lookups
        await queryRunner.query(`
            CREATE INDEX "IDX_users_email" ON "users" ("email")
        `);

        // Create index on booking status for faster filtering
        await queryRunner.query(`
            CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")
        `);

        // Create index on booking userId for faster joins
        await queryRunner.query(`
            CREATE INDEX "IDX_bookings_userId" ON "bookings" ("userId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_bookings_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_bookings_status"`);
        await queryRunner.query(`DROP INDEX "IDX_users_email"`);

        // Drop foreign key
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_userId"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
