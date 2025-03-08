import { Router, Request, Response } from 'express';
import CreateCustomerWithAddressService from '../../../domain/customer/service/create-customer-with-address.service';

export const customerRoutes = Router();

customerRoutes.post('/', (req: Request, res: Response) => {
  try {
    const { id, name, street, number, zipcode, city } = req.body;

    const customer = CreateCustomerWithAddressService.execute(
      id,
      name,
      street,
      number,
      zipcode,
      city
    );

    res.status(201).json({
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        zipcode: customer.Address.zip,
        city: customer.Address.city
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unexpected error'
    });
  }
}); 