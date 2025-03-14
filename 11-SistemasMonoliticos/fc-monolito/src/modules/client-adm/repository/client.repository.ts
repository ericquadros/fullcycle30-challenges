import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";
import { Sequelize } from "sequelize-typescript";

export default class ClientRepository implements ClientGateway {
  private _sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this._sequelize = sequelize;
  }

  async add(entity: Client): Promise<void> {
    console.log("Repository - Adding client:", {
      id: entity.id.id,
      name: entity.name,
      email: entity.email,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipCode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });

    try {
      await ClientModel.create({
        id: entity.id.id,
        name: entity.name,
        email: entity.email,
        document: entity.document,
        street: entity.address.street,
        number: entity.address.number,
        complement: entity.address.complement,
        city: entity.address.city,
        state: entity.address.state,
        zipCode: entity.address.zipCode,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      });
      console.log("Repository - Client added successfully");
    } catch (error) {
      console.error("Repository - Error adding client:", error);
      throw error;
    }
  }

  async find(id: string): Promise<Client> {
    console.log("Repository - Finding client with id:", id);

    const client = await ClientModel.findOne({ 
      where: { id },
      raw: true
    });

    console.log("Repository - Found client:", client);

    if (!client) {
      throw new Error("Client not found");
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address(
        client.street,
        client.number,
        client.complement,
        client.city,
        client.state,
        client.zipCode,
      ),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    });
  }
}