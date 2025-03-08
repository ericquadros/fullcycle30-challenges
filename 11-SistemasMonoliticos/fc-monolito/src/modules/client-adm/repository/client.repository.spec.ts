import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "./client.model"
import ClientRepository from "./client.repository"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"

describe("Client Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a client", async () => {
    const repository = new ClientRepository(sequelize)
    const client = new Client({
      id: new Id('1'),
      name: 'Client 1',
      email: 'client@example.com',
      document: '123456789',
      address: new Address(
        'Street 1',
        '123',
        'Complement',
        'City',
        'State',
        '12345-678'
      )
    })

    await repository.add(client)

    const clientDb = await ClientModel.findOne({ where: { id: '1' } })

    expect(clientDb).toBeDefined()
    expect(clientDb.name).toEqual(client.name)
    expect(clientDb.email).toEqual(client.email)
    expect(clientDb.document).toEqual(client.document)
    expect(clientDb.street).toEqual(client.address.street)
    expect(clientDb.number).toEqual(client.address.number)
    expect(clientDb.complement).toEqual(client.address.complement)
    expect(clientDb.city).toEqual(client.address.city)
    expect(clientDb.state).toEqual(client.address.state)
    expect(clientDb.zipCode).toEqual(client.address.zipCode)
  })

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'Client 1',
      email: 'client@example.com',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345-678',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new ClientRepository(sequelize)
    const result = await repository.find('1')

    expect(result.id.id).toEqual(client.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.address.street).toEqual(client.street)
    expect(result.address.number).toEqual(client.number)
    expect(result.address.complement).toEqual(client.complement)
    expect(result.address.city).toEqual(client.city)
    expect(result.address.state).toEqual(client.state)
    expect(result.address.zipCode).toEqual(client.zipCode)
  })
})