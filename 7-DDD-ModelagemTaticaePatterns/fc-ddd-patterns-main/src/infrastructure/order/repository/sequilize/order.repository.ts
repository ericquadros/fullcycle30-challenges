import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async findById(id: string): Promise<Order | null> {
    const orderData = await OrderModel.findByPk(id, { include: [{ model: OrderItemModel }] });
    if (!orderData) return null;

    const order = new Order(
      orderData.id,
      orderData.customer_id,
      orderData.total,
      orderData.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.product_id,
        quantity: item.quantity,
      }))
    );

    return order;
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      { 
        where: { id: entity.id } 
      }
    );

    
    await OrderItemModel.destroy({
      where: { order_id: entity.id }
    });

    
    const items = entity.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id
    }));

    await OrderItemModel.bulkCreate(items);
  }

  async delete(id: string): Promise<void> {
    await OrderModel.destroy({ where: { id } });
  }
}
