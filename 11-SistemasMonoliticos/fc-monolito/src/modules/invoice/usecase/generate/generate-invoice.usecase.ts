import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice-items.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";


export default class GenerateInvoiceUseCase {
  constructor(private invoiceGateway: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );

    const items = input.items.map(
      (item) => new InvoiceItems(new Id(item.id), item.name, item.price)
    );

    const invoice = new Invoice(
      new Id(),
      input.name,
      input.document,
      address,
      items
    );

    const result = await this.invoiceGateway.generate(invoice);

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      street: result.address.street,
      number: result.address.number,
      complement: result.address.complement,
      city: result.address.city,
      state: result.address.state,
      zipCode: result.address.zipCode,
      items: result.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: result.total,
    };
  }
} 