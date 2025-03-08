import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import { ClientAdmSequelizeFactory } from "../repository/sequelize.factory";

export default class ClientAdmFacadeFactory {
  static async create() {
    const sequelize = await ClientAdmSequelizeFactory.getInstance();
    const repository = new ClientRepository(sequelize);
    const findUsecase = new FindClientUseCase(repository);
    const addUsecase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUseCase: addUsecase,
      findUseCase: findUsecase,
    });

    return facade;
  }
} 