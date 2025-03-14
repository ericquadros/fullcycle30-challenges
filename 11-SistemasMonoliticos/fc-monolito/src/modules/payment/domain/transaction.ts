import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export enum TransactionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined"
}

type TransactionProps = {
  id?: Id;
  amount: number;
  orderId: string;
  status?: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Transaction extends BaseEntity implements AggregateRoot {
  private _amount: number;
  private _orderId: string;
  private _status: TransactionStatus;

  constructor(props: TransactionProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._amount = props.amount;
    this._orderId = props.orderId;
    this._status = props.status || TransactionStatus.PENDING;
    this.validate();
  }

  validate(): void {
    if (this._amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
  }

  approve(): void {
    this._status = TransactionStatus.APPROVED;
  }

  decline(): void {
    this._status = TransactionStatus.DECLINED;
  }

  process(): void {
    if (this._amount >= 100) {
      this.approve();
    } else {
      this.decline();
    }
  }

  get amount(): number {
    return this._amount;
  }

  get orderId(): string {
    return this._orderId;
  }

  get status(): string {
    return this._status;
  }
}
