import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateForeingkyOrdersProducts1627858333255
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'orders_products',
      'FK_Orders_Products_Orders',
    );
    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'FK_Orders_Products_Orders',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'orders_products',
      'FK_Orders_Products_Orders',
    );
    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'FK_Orders_Products_Orders',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
