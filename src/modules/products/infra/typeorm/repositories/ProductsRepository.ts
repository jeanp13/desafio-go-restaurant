import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    // console.log(product);
    await this.ormRepository.save(product);
    // console.log(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    // console.log(product);
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => {
      return product.id;
    });

    const productsFiltered = await this.ormRepository.findByIds(productsIds);

    return productsFiltered;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const exists = await this.findAllById(products);
    exists.forEach(p => {
      const product = products.find(prod => prod.id === p.id);
      if (product) {
        p.quantity -= product.quantity;
      }
    });
    // const productsAfterOrder = products.map(p => {
    //   const find = exists.find(prod => prod.id === p.id);
    //   if (!find) {
    //     find?.quantity = find?.quantity - p.quantity;
    //   }
    //   return find;
    // });
    // console.log(productsAfterOrder);
    await this.ormRepository.save(exists);
    return exists;
  }
}

export default ProductsRepository;
