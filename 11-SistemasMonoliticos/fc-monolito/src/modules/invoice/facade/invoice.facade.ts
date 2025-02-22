import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUseCase: UseCaseInterface;
  generateUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUseCase: UseCaseInterface;
  private _generateUseCase: UseCaseInterface;

  constructor(useCaseProps: UseCaseProps) {
    this._findUseCase = useCaseProps.findUseCase;
    this._generateUseCase = useCaseProps.generateUseCase;
  }

  async find(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findUseCase.execute(input);
  }

  async generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateUseCase.execute(input);
  }
} 