import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Order from "../../domain/order.entity";
import OrderItem from "../../domain/order-item.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _repository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    // Busca o cliente
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    // Valida produtos e estoque
    await Promise.all(
      input.products.map(async (p) => {
        const product = await this._productFacade.checkStock({
          productId: p.productId,
        });
        if (product.stock < p.quantity) {
          throw new Error(
            `Product ${p.productId} is out of stock`
          );
        }
      })
    );

    // Recupera os produtos do catálogo
    const products = await Promise.all(
      input.products.map((p) => this._catalogFacade.find({ id: p.productId }))
    );

    // Cria os itens do pedido
    const items = products.map((product, index) => {
      return new OrderItem({
        id: new Id(),
        productId: product.id,
        quantity: input.products[index].quantity,
        price: product.price,
      });
    });

    // Cria o pedido
    const order = new Order({
      id: new Id(),
      clientId: client.id,
      items,
    });

    // Processa o pagamento
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    // Atualiza o status do pedido baseado no pagamento
    if (payment.status === "approved") {
      order.approve();
    } else {
      order.decline();
    }

    // Gera a invoice se aprovado
    let invoice;
    if (payment.status === "approved") {
      invoice = await this._invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: client.street,
        number: client.number,
        complement: client.complement,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        items: products.map((product, index) => ({
          id: product.id,
          name: product.name,
          price: product.price * input.products[index].quantity,
        })),
      });
    }

    // Salva o pedido
    await this._repository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: invoice ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: products.map((product, index) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: input.products[index].quantity,
      })),
    };
  }
} 