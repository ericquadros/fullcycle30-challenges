export interface PlaceOrderFacadeInputDto {
  clientId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}

export interface PlaceOrderFacadeOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
} 