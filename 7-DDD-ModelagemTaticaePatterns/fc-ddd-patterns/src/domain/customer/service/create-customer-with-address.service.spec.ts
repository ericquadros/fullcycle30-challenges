import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1CustomerCreatedHandler from "../event/handler/envia-console-log1-customer-created.handler";
import EnviaConsoleLog2CustomerCreatedHandler from "../event/handler/envia-console-log2-customer-adress-changed.handler";
import EnviaConsoleLogAddressChangedHandler from "../event/handler/envia-console-log-address-changed.handler";
import CreateCustomerWithAddressService from "./create-customer-with-address.service";

describe("CreateCustomerWithAddress service unit test", () => {
  let eventDispatcher: EventDispatcher;
  let handler1: EnviaConsoleLog1CustomerCreatedHandler;
  let handler2: EnviaConsoleLog2CustomerCreatedHandler;
  let handlerAddress: EnviaConsoleLogAddressChangedHandler;
  let spyEventHandler1: jest.SpyInstance;
  let spyEventHandler2: jest.SpyInstance;
  let spyEventHandlerAddress: jest.SpyInstance;

  beforeEach(() => {
    eventDispatcher = EventDispatcher.getInstance();
    eventDispatcher.unregisterAll();

    // Criar handlers e registrar no dispatcher
    handler1 = new EnviaConsoleLog1CustomerCreatedHandler();
    handler2 = new EnviaConsoleLog2CustomerCreatedHandler();
    handlerAddress = new EnviaConsoleLogAddressChangedHandler();

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);
    eventDispatcher.register("CustomerAddressChangedEvent", handlerAddress);

    // Criar spies para os handlers
    spyEventHandler1 = jest.spyOn(handler1, "handle");
    spyEventHandler2 = jest.spyOn(handler2, "handle");
    spyEventHandlerAddress = jest.spyOn(handlerAddress, "handle");
  });

  it("should log correct messages for both events", () => {
    const consoleSpy = jest.spyOn(console, "log");

    const customer = CreateCustomerWithAddressService.execute(
      "123",
      "João da Silva",
      "Rua das Flores",
      123,
      "12345-678",
      "São Paulo"
    );

    // Verificar se o customer foi criado corretamente
    expect(customer.id).toBe("123");
    expect(customer.name).toBe("João da Silva");
    expect(customer.Address.street).toBe("Rua das Flores");
    expect(customer.Address.number).toBe(123);
    expect(customer.Address.zip).toBe("12345-678");
    expect(customer.Address.city).toBe("São Paulo");

    // Verificar se os eventos foram disparados
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyEventHandlerAddress).toHaveBeenCalled();

    // Verificar as mensagens específicas dos logs
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Endereço do cliente: 123, João da Silva alterado para: Rua das Flores, 123, 12345-678 São Paulo"
    );

    consoleSpy.mockRestore();
  });
}); 