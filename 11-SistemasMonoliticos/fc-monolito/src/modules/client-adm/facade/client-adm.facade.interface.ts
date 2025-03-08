import Address from "../../@shared/domain/value-object/address"
import { AddClientInputDto, AddClientOutputDto } from "../usecase/add-client/add-client.dto";
import { FindClientUseCaseInputDto, FindClientUseCaseOutputDto } from "../usecase/find-client/find-client.usecase.dto";

export type AddClientFacadeInputDto = AddClientInputDto;
export type AddClientFacadeOutputDto = AddClientOutputDto;
export type FindClientFacadeInputDto = FindClientUseCaseInputDto;
export type FindClientFacadeOutputDto = FindClientUseCaseOutputDto;

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
