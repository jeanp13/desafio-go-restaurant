import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

interface IProduct {
  id: string;
  quantity: number;
}
export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    console.log(request.params);
    const findOrderService = container.resolve(FindOrderService);

    const order = await findOrderService.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    // console.log(products);

    const createOrderService = container.resolve(CreateOrderService);

    const order = await createOrderService.execute({ customer_id, products });

    return response.json(order);
  }
}
