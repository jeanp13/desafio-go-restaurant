import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Customer does not find');
    }
    // console.log(products);

    const exists = await this.productsRepository.findAllById(products);
    const newProducts = products.map(p => {
      const find = exists.find(prod => prod.id === p.id);
      if (!find) {
        throw new AppError('Products does not found');
      }
      return {
        product_id: p.id,
        price: find.price,
        quantity: p.quantity,
      };
    });
    console.log(newProducts);
    const order = await this.ordersRepository.create({
      customer,
      products: newProducts,
    });

    return order;
  }
}

export default CreateOrderService;
