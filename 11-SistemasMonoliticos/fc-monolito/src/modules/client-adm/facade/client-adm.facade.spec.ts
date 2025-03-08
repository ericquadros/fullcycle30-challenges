import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "../repository/client.model"
import ClientRepository from "../repository/client.repository"
import AddClientUseCase from "../usecase/add-client/add-client.usecase"
import ClientAdmFacade from "./client-adm.facade"
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory"
import Address from "../../@shared/domain/value-object/address"
import { ClientAdmSequelizeFactory } from "../repository/sequelize.factory"
import FindClientUseCase from "../usecase/find-client/find-client.usecase"
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory"

describe("Client Adm Facade test", () => {
  let sequelize: Sequelize
  let facade: ClientAdmFacade
  let repository: ClientRepository
  let addUseCase: AddClientUseCase
  let findUseCase: FindClientUseCase

  beforeEach(async () => {
    await SharedSequelizeFactory.resetInstance()
    sequelize = await ClientAdmSequelizeFactory.getInstance()    

    repository = new ClientRepository(sequelize)
    addUseCase = new AddClientUseCase(repository)
    findUseCase = new FindClientUseCase(repository)

    facade = new ClientAdmFacade({
      addUseCase: addUseCase,
      findUseCase: findUseCase,
    })
  })

  afterEach(async () => {
    await SharedSequelizeFactory.resetInstance()
  })

  it("should create a client", async () => {
    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888"
    }

    await facade.add(input)

    const client = await ClientModel.findOne({ 
      where: { id: "1" },
      raw: true
    })

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.document).toBe(input.document)
    expect(client.street).toBe(input.street)
    expect(client.number).toBe(input.number)
    expect(client.complement).toBe(input.complement)
    expect(client.city).toBe(input.city)
    expect(client.state).toBe(input.state)
    expect(client.zipCode).toBe(input.zipCode)
  })

  it("should find a client", async () => {
    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888"
    }

    const result = await facade.add(input)

    // Verificar se o cliente foi realmente criado
    const createdClient = await ClientModel.findOne({ 
      where: { id: "1" },
      raw: true
    })

    const client = await facade.find({ id: "1" })    

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.document).toBe(input.document)
    expect(client.street).toBe(input.street)
    expect(client.number).toBe(input.number)
    expect(client.complement).toBe(input.complement)
    expect(client.city).toBe(input.city)
    expect(client.state).toBe(input.state)
    expect(client.zipCode).toBe(input.zipCode)
  })
})