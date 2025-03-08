import Customer from "../entity/customer";
import Address from "../value-object/address";

export default class CreateCustomerWithAddressService {
  static execute(
    id: string, 
    name: string, 
    street: string, 
    number: number, 
    zipcode: string, 
    city: string
  ): Customer {
    // Criar customer (isso vai disparar o primeiro evento)
    const customer = new Customer(id, name);

    // Criar e mudar endereço (isso vai disparar o segundo evento)
    const address = new Address(street, number, zipcode, city);
    customer.changeAddress(address);

    return customer;
  }
} 