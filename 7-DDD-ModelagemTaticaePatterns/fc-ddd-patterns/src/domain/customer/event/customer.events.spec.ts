import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";
import EnviaConsoleLogAddressChangedHandler from "./handler/envia-console-log-address-changed.handler";

describe("Customer events tests", () => {
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    eventDispatcher = EventDispatcher.getInstance();
    // Limpa todos os event handlers registrados
    eventDispatcher.unregisterAll();
  });

  it("should notify all handlers when customer is created", () => {
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customer = new Customer("123", "John Doe");

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify handler when customer address is changed", () => {
    const eventHandler = new EnviaConsoleLogAddressChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const customer = new Customer("123", "John Doe");
    const address = new Address("Street", 123, "12345678", "City");
    customer.changeAddress(address);

    expect(spyEventHandler).toHaveBeenCalled();
  });
}); 