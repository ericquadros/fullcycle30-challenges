import { OutputListProductDTO } from "../../../usecase/product/list/list.product.dto";

export default class ProductPresenter {
  static listXML(data: OutputListProductDTO): string {
    const xmlElements = data.products.map((product) => {
      return `
        <product>
          <id>${product.id}</id>
          <name>${product.name}</name>
          <price>${product.price}</price>
        </product>
      `;
    });

    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <products>
        ${xmlElements.join("")}
      </products>
    `;
  }
} 