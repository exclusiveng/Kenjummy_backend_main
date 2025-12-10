import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1733827200000 implements MigrationInterface {
    name = 'InitialSchema1733827200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "CHK_users_role" CHECK ("role" IN ('user', 'admin', 'superadmin')), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_servicetype_enum" AS ENUM('charter', 'intercity', 'vip', 'hire')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "bookings" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "serviceType" "public"."bookings_servicetype_enum" NOT NULL,
            "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending',
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
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "numberOfPassengers" integer,
            "startDate" date,
            "startTime" time,
            "endDate" date,
            "endTime" time,
            "purpose" character varying,
            "travelTime" character varying,
            "days" text array,
            "userId" uuid NOT NULL,
            CONSTRAINT "PK_6bookings_id" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_user"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_servicetype_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}