import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperadminRole1733710000000 implements MigrationInterface {
    name = 'AddSuperadminRole1733710000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the enum type with initial values if it doesn't exist
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        // Add the new 'superadmin' value. The previous ADD VALUE is not transactional in older Postgres, so we add it separately.
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" ADD VALUE 'superadmin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate enum without superadmin (Postgres does not support removing enum values directly)
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::text::"public"."users_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
    }

}
