import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase"

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  document: "123456789",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888"
  )
})

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client))
  }
}

describe("Find Client use case unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository()
    const usecase = new FindClientUseCase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(client.id.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.street).toEqual(client.address.street)
    expect(result.number).toEqual(client.address.number)
    expect(result.complement).toEqual(client.address.complement)
    expect(result.city).toEqual(client.address.city)
    expect(result.state).toEqual(client.address.state)
    expect(result.zipCode).toEqual(client.address.zipCode)
    expect(result.createdAt).toEqual(client.createdAt)
    expect(result.updatedAt).toEqual(client.updatedAt)
  })
})