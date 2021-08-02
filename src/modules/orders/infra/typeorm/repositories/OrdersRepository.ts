import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({ customer_id: customer.id });

    const orderSaved = await this.ormRepository.save(order);

    const order_products = products.map(p => {
      const op = Object.assign(new OrdersProducts(), {
        order: orderSaved,
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price * p.quantity,
      });
      return op;
    });

    // Object.assign(new OrdersProducts(), {
    //   order: orderSaved,
    //   products,
    // });

    const orderProductSaved = Object.assign(new Order(), {
      order,
      customer_id: customer.id,
      order_products,
    });

    // console.log(order_products);
    const newOrder = await this.ormRepository.save(orderProductSaved);
    // console.log(newOrder);

    return newOrder;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne({ where: { id } });

    return order;
  }
}

export default OrdersRepository;
