import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperadminRole1733710000000 implements MigrationInterface {
    name = 'AddSuperadminRole1733710000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add 'superadmin' to the ENUM type. This is idempotent and safe.
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS 'superadmin'`);
        
        // Step 2: Dynamically find and drop the old check constraint on the 'role' column.
        // This is robust and doesn't depend on a hardcoded constraint name.
        await queryRunner.query(`
            DO $$
            DECLARE
                constraint_name text;
            BEGIN
                SELECT conname INTO constraint_name
                FROM pg_constraint 
                WHERE conrelid = 'users'::regclass AND conname LIKE '%role%' AND contype = 'c'
                LIMIT 1;

                IF constraint_name IS NOT NULL THEN
                    EXECUTE 'ALTER TABLE "users" DROP CONSTRAINT "' || constraint_name || '"';
                END IF;
            END $$;
        `);

        // Step 3: Add the new, correct check constraint.
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_role" CHECK ("role" IN ('user', 'admin', 'superadmin'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Dynamically find and drop the current check constraint.
        await queryRunner.query(`
            DO $$
            DECLARE
                constraint_name text;
            BEGIN
                SELECT conname INTO constraint_name
                FROM pg_constraint
                WHERE conrelid = 'users'::regclass AND conname = 'CHK_users_role'
                LIMIT 1;

                IF constraint_name IS NOT NULL THEN
                    EXECUTE 'ALTER TABLE "users" DROP CONSTRAINT "' || constraint_name || '"';
                END IF;
            END $$;
        `);

        // Step 2: Add the original check constraint back.
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_role" CHECK ("role" IN ('user', 'admin'))`);

        // Note: Reverting the ENUM type itself (removing 'superadmin') is a complex and risky operation
        // for a downgrade. The check constraint above is sufficient to prevent its use.
    }

}
