import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterColumnProducts1627852554110
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'price');
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 5,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'price');
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'numeric',
      }),
    );
  }
}
