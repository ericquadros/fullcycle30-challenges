import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import OrderItem from "../domain/order-item.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";
import OrderItemModel from "./order-item.model";
import { CheckoutSequelizeFactory } from "./sequelize.factory";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    try {
      console.log('Creating order with data:', {
        id: order.id.id,
        clientId: order.clientId,
        items: order.items.map(item => ({
          id: item.id.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const orderModel = await OrderModel.create(
        {
          id: order.id.id,
          clientId: order.clientId,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items.map((item) => ({
            id: item.id.id,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            orderId: order.id.id,
          })),
        },
        {
          include: [{ model: OrderItemModel }],
        }
      );

      console.log('Order created successfully:', orderModel.toJSON());
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return new Order({
      id: new Id(order.id),
      clientId: order.clientId,
      items: order.items.map(
        (item) => ({
          id: new Id(item.id),
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })
      ),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
} 