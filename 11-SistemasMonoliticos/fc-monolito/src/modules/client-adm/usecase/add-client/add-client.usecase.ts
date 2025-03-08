import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.dto";

export default class AddClientUseCase {

  private _clientRepository: ClientGateway

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    console.log("UseCase - Executing add client with input:", input);

    try {
      const props = {
        id: input.id ? new Id(input.id) : new Id(),
        name: input.name,
        email: input.email,
        document: input.document,
        address: new Address(
          input.street,
          input.number,
          input.complement,
          input.city,
          input.state,
          input.zipCode
        ),
      }

      console.log("UseCase - Creating client with props:", props);
      const client = new Client(props)
      console.log("UseCase - Client created:", {
        id: client.id.id,
        name: client.name,
        email: client.email,
        document: client.document,
        address: {
          street: client.address.street,
          number: client.address.number,
          complement: client.address.complement,
          city: client.address.city,
          state: client.address.state,
          zipCode: client.address.zipCode
        }
      });

      await this._clientRepository.add(client)
      console.log("UseCase - Client added to repository");

      const output = {
        id: client.id.id,
        name: client.name,
        email: client.email,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      }
      console.log("UseCase - Returning output:", output);
      return output;
    } catch (error) {
      console.error("UseCase - Error executing add client:", error);
      throw error;
    }
  }
}