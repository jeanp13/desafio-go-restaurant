import { MigrationInterface, QueryRunner } from 'typeorm';

export default class DropForeingkyOrderOrdersProducts1627862739281
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'orders_products',
      'FK_Orders_Products_Orders',
    );
    await queryRunner.dropForeignKey(
      'orders_products',
      'FK_Orders_Products_Product',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
