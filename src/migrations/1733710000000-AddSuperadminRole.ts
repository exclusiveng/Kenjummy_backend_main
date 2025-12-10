import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperadminRole1733710000000 implements MigrationInterface {
    name = 'AddSuperadminRole1733710000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'superadmin' to the enum type. We use IF NOT EXISTS to make it safe to re-run.
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS 'superadmin'`);

        // Drop the old check constraint and add a new one that includes 'superadmin'
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_users_role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_role" CHECK (role IN ('user', 'admin', 'superadmin'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the check constraint to its original state
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_users_role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_role" CHECK (role IN ('user', 'admin'))`);

        // Postgres does not support removing an enum value, so the 'superadmin' value will remain in the type.
        // The check constraint above will prevent its use. The complex downgrade logic is often not worth the risk.
    }

}
