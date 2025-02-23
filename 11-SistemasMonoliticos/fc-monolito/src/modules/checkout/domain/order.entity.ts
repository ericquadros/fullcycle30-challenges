import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type OrderProps = {
  id?: Id;
  clientId: string;
  items: {
    id?: Id;
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Order extends BaseEntity {
  private _clientId: string;
  private _items: OrderItem[];
  private _status: string;

  constructor(props: OrderProps) {
    super(props.id);
    this._clientId = props.clientId;
    this._items = props.items.map((item) => new OrderItem(item));
    this._status = props.status || "pending";
    this.validate();
  }

  validate(): void {
    if (this._clientId.length === 0) {
      throw new Error("Client id is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }
  }

  get clientId(): string {
    return this._clientId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get status(): string {
    return this._status;
  }

  set status(status: string) {
    this._status = status;
  }

  get total(): number {
    return this._items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  approve(): void {
    this._status = "approved";
  }

  decline(): void {
    this._status = "declined";
  }
}

type OrderItemProps = {
  id?: Id;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
};

class OrderItem extends BaseEntity {
  private _productId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(props: OrderItemProps) {
    super(props.id);
    this._productId = props.productId;
    this._name = props.name;
    this._price = props.price;
    this._quantity = props.quantity;
  }

  get productId(): string {
    return this._productId;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get quantity(): number {
    return this._quantity;
  }
} 