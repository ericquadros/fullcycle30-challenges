import ClientAdmFacadeInterface, { AddClientFacadeInputDto, AddClientFacadeOutputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export interface UseCaseProps {
  addUseCase: AddClientUseCase;
  findUseCase: FindClientUseCase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUseCase: AddClientUseCase;
  private _findUseCase: FindClientUseCase;

  constructor(props: UseCaseProps) {
    this._addUseCase = props.addUseCase;
    this._findUseCase = props.findUseCase;
  }

  async add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto> {
    try {
      const output = await this._addUseCase.execute(input);      
      return output;
    } catch (error) {
      throw error;
    }
  }

  async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    try {
      const output = await this._findUseCase.execute(input);
      return output;
    } catch (error) {
      throw error;
    }
  }
}
