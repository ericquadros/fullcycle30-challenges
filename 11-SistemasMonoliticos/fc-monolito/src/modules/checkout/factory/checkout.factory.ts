import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.factory";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import CheckoutFacade from "../facade/checkout.facade";

export class CheckoutFacadeFactory {
  static create() {
    const orderRepository = new OrderRepository();
    
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      orderRepository,
      invoiceFacade,
      paymentFacade
    );

    const facade = new CheckoutFacade({
      placeOrderUseCase: placeOrderUseCase,
    });

    return facade;
  }
} 