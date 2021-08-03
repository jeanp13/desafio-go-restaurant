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
        order_id: orderSaved.id,
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price, //* p.quantity,
      });
      return op;
    });

    // Object.assign(new OrdersProducts(), {
    //   order: orderSaved,
    //   products,
    // });

    const newOrder = Object.assign(new Order(), {
      id: order.id,
      customer,
      order_products,
    });

    // console.log(newOrder);
    const orderProductSave = await this.ormRepository.save(newOrder);
    // console.log(newOrder);

    return orderProductSave;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne({ where: { id } });

    return order;
  }
}

export default OrdersRepository;
