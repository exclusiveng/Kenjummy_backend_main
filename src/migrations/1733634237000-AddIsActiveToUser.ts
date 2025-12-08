import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToUser1733634237000 implements MigrationInterface {
    name = 'AddIsActiveToUser1733634237000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN "isActive" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    }

}