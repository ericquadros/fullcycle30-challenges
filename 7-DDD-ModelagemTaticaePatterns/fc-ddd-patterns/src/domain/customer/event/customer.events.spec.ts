import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import EnviaConsoleLog1CustomerCreatedHandler from "./handler/envia-console-log1-customer-created.handler";
import EnviaConsoleLog2CustomerCreatedHandler from "./handler/envia-console-log2-customer-adress-changed.handler";
import EnviaConsoleLogAddressChangedHandler from "./handler/envia-console-log-address-changed.handler";

describe("Customer events tests", () => {
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    eventDispatcher = EventDispatcher.getInstance();
    // Limpa todos os event handlers registrados
    eventDispatcher.unregisterAll();
  });

  it("should register and notify all customer events", () => {
    const eventHandler1 = new EnviaConsoleLog1CustomerCreatedHandler();
    const eventHandler2 = new EnviaConsoleLog2CustomerCreatedHandler();
    const addressChangedHandler = new EnviaConsoleLogAddressChangedHandler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    const spyAddressChangedHandler = jest.spyOn(addressChangedHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerAddressChangedEvent", addressChangedHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyAddressChangedHandler).toHaveBeenCalled();
  });
}); 