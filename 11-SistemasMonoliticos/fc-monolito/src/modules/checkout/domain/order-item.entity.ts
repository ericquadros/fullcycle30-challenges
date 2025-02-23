import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type OrderItemProps = {
  id?: Id;
  productId: string;
  quantity: number;
  price: number;
};

export default class OrderItem extends BaseEntity {
  private _productId: string;
  private _quantity: number;
  private _price: number;

  constructor(props: OrderItemProps) {
    super(props.id);
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._price = props.price;
    this.validate();
  }

  validate(): void {
    if (this._productId.length === 0) {
      throw new Error("Product id is required");
    }
    if (this._quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    if (this._price <= 0) {
      throw new Error("Price must be greater than zero");
    }
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  get total(): number {
    return this._price * this._quantity;
  }
} 