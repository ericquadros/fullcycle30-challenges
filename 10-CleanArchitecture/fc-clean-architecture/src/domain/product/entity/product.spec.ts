import Product from "./product";
import NotificationError from "../../@shared/notification/notification.error";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Product("", "Product 1", 100);
    }).toThrow(NotificationError);
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new Product("123", "", 100);
    }).toThrow(NotificationError);
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      new Product("123", "Product 1", -1);
    }).toThrow(NotificationError);
  });

  it("should throw error when name and price are invalid", () => {
    expect(() => {
      new Product("123", "", -1);
    }).toThrow(NotificationError);
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should throw error when changing to invalid name", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changeName("");
    }).toThrow(NotificationError);
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });

  it("should throw error when changing to invalid price", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changePrice(-1);
    }).toThrow(NotificationError);
  });

  it("should create a valid product", () => {
    const product = new Product("123", "Product 1", 100);
    expect(product.id).toBe("123");
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);
  });

  it("should get all validation errors", () => {
    let product = new Product("123", "Product 1", 100);
    expect(() => {
      try {
        product.changeName("");
      } catch (error) {
        expect(error).toBeInstanceOf(NotificationError);
        const notificationError = error as NotificationError;
        expect(notificationError.errors).toHaveLength(1);
        expect(notificationError.errors[0].message).toBe("Name is required");
        throw error;
      }
    }).toThrow(NotificationError);
  });
});
