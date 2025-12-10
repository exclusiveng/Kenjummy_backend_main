import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperadminRole1733710000000 implements MigrationInterface {
    name = 'AddSuperadminRole1733710000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1) If a role enum exists, add the new value; if not, skip quietly (table may be varchar+check)
        await queryRunner.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
              BEGIN
                ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS 'superadmin';
              EXCEPTION
                WHEN duplicate_object THEN NULL;
              END;
            END IF;
          END$$;
        `);

        // 2) Relax column type to varchar if it was enum (avoids enum mismatch) — safe even if already varchar
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE varchar USING "role"::text`);

        // 3) Replace the check constraint to include superadmin
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_role" CHECK ("role" IN ('user', 'admin', 'superadmin'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the check constraint to its original state.
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_role" CHECK ("role" IN ('user', 'admin'))`);

        // Attempt to drop enum value by recreating type only if the enum exists.
        await queryRunner.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
              -- recreate enum without superadmin
              CREATE TYPE "public"."users_role_enum_old" AS ENUM('user','admin');
              ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::text::"public"."users_role_enum_old";
              DROP TYPE "public"."users_role_enum";
              ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum";
            END IF;
          END$$;
        `);
    }

}
