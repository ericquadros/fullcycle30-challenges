import EventDispatcher from "../../domain/@shared/event/event-dispatcher";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";
import EventDispatcherConfig from "./event-dispatcher-config";

describe("EventDispatcherConfig Tests", () => {
  beforeEach(() => {
    // Limpar todos os handlers antes de cada teste
    const eventDispatcher = EventDispatcher.getInstance();
    eventDispatcher.unregisterAll();
  });

  it("should register all handlers and handle customer events correctly", () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "log");
    EventDispatcherConfig.initialize();

    // Act
    const customer = new Customer("1", "John Doe");
    const address = new Address("Street", 123, "12345-678", "City");
    customer.changeAddress(address);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Endereço do cliente: 1, John Doe alterado para: Street, 123, 12345-678 City"
    );

    consoleSpy.mockRestore();
  });

  it("should handle multiple customers independently", () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "log");
    EventDispatcherConfig.initialize();

    // Act
    const customer1 = new Customer("1", "John");
    const customer2 = new Customer("2", "Jane");

    const address1 = new Address("Street 1", 123, "12345-678", "City 1");
    const address2 = new Address("Street 2", 456, "98765-432", "City 2");

    customer1.changeAddress(address1);
    customer2.changeAddress(address2);

    // Assert - Verificar se os eventos foram disparados para ambos os customers
    expect(consoleSpy).toHaveBeenCalledWith(
      "Endereço do cliente: 1, John alterado para: Street 1, 123, 12345-678 City 1"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Endereço do cliente: 2, Jane alterado para: Street 2, 456, 98765-432 City 2"
    );

    consoleSpy.mockRestore();
  });
}); 