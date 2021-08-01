import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterColumnOrderProducts1627856123185
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'price');
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 5,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'price');
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'price',
        type: 'numeric',
      }),
    );
  }
}
