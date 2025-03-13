import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Order from "../../domain/order.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor(
    private _clientFacade: ClientAdmFacadeInterface,
    private _productFacade: ProductAdmFacadeInterface,
    private _catalogFacade: StoreCatalogFacadeInterface,
    private _repository: CheckoutGateway,
    private _invoiceFacade: InvoiceFacadeInterface,
    private _paymentFacade: PaymentFacadeInterface
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    console.log('Executing PlaceOrderUseCase with input:', input);

    // Validar cliente
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    // Buscar e validar produtos
    const products = await Promise.all(
      input.products.map(async (p) => {
        const product = await this._catalogFacade.find({ id: p.productId });
        if (!product) {
          throw new Error(`Product ${p.productId} not found`);
        }
        return {
          productId: p.productId,
          name: product.name,
          price: product.purchasePrice,
          quantity: p.quantity,
        };
      })
    );

    // Calcular total
    const total = products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    console.log('Calculated total:', total);

    // Criar pedido
    const order = new Order({
      clientId: input.clientId,
      items: products.map((p) => ({
        productId: p.productId,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
    });

    // Processar pagamento
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: total,
    });

    console.log('Payment processed:', payment);

    // Atualizar status do pedido baseado no pagamento
    const status = payment.status === "approved" ? "approved" : "declined";
    order.status = status;

    // Salvar pedido
    await this._repository.addOrder(order);

    // Gerar invoice se aprovado
    let invoiceId = null;
    if (status === "approved") {
      console.log('Generating invoice for client:', client);
      
      // Validar campos obrigatórios do endereço
      if (!client.street || !client.number || !client.city || !client.state || !client.zipCode) {
        throw new Error("All address fields are required: street, number, city, state, zipCode");
      }
      
      const invoice = await this._invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: client.street,
        number: client.number,
        complement: client.complement || "",
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        items: products.map((p) => ({
          id: p.productId,
          name: p.name,
          price: p.price * p.quantity,
        })),
      });
      
      console.log('Invoice generated:', invoice);
      invoiceId = invoice.id;
    }

    console.log('Order processing completed:', {
      id: order.id.id,
      invoiceId,
      status,
      total,
      products: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
      })),
    });

    return {
      id: order.id.id,
      invoiceId,
      status,
      total,
      products: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };
  }
} 