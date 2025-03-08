import EventDispatcher from "../../domain/@shared/event/event-dispatcher";
import EnviaConsoleLog1CustomerCreatedHandler from "../../domain/customer/event/handler/envia-console-log1-customer-created.handler";
import EnviaConsoleLog2CustomerCreatedHandler from "../../domain/customer/event/handler/envia-console-log2-customer-adress-changed.handler";
import EnviaConsoleLogAddressChangedHandler from "../../domain/customer/event/handler/envia-console-log-address-changed.handler";

export default class EventDispatcherConfig {
  static initialize(): void {
    const eventDispatcher = EventDispatcher.getInstance();
    
    // Registrar handlers para CustomerCreatedEvent
    eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog1CustomerCreatedHandler());
    eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog2CustomerCreatedHandler());
    
    // Registrar handler para CustomerAddressChangedEvent
    eventDispatcher.register(
      "CustomerAddressChangedEvent", 
      new EnviaConsoleLogAddressChangedHandler()
    );
  }
} 