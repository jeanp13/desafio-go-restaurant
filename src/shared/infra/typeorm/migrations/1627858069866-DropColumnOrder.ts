import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class DropColumnOrder1627858069866
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      }),
    );
  }
}
