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
interface IUpdateProductsQuantityDTO {
  id: string;
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
      if (find.quantity < p.quantity) {
        throw new AppError('This Products with insufficient quantities');
      }
      return {
        product_id: p.id,
        price: find.price,
        quantity: p.quantity,
      };
    });
    // console.log(newProducts);
    const order = await this.ordersRepository.create({
      customer,
      products: newProducts,
    });

    const productsAfterOrder = products.map(p => {
      const find = exists.find(prod => prod.id === p.id);
      if (!find) {
        throw new AppError('Products does not found');
      }
      return {
        id: p.id,
        quantity: p.quantity,
        // quantity: find?.quantity - p.quantity,
      } as IUpdateProductsQuantityDTO;
    });
    // console.log(productsAfterOrder);
    await this.productsRepository.updateQuantity(productsAfterOrder);
    return order;
    // return {
    //   id: order.id,
    //   order_products: order.order_products,
    //   customer: order.customer,
    //   created_at: order.created_at,
    //   updated_at: order.updated_at,
    //   customer_id: order.customer_id,
    // };
  }
}

export default CreateOrderService;
