import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderItem from "./order-item.entity";

type OrderProps = {
  id?: Id;
  clientId: string;
  items: OrderItem[];
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
    this._items = props.items;
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