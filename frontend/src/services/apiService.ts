import { User } from "../models/user";
import { Product } from "../models/product";
import { Bid } from "../models/bid";

const URL: string = "http://localhost:3000/api";

import { useAuthStore } from "../store/auth";

export const userService = {
  async getUser(id: string): Promise<User> {
    try {
      const header = {
        Authorization: `Bearer ${useAuthStore().token.value}`,
      }
      const response = await fetch(`${URL}/users/${id}`, { headers: header });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${URL}/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products: Product[] = await response.json();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await fetch(`${URL}/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const product: Product = await response.json();
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  async createProduct(product: Product): Promise<Product> {
    try {
      const response = await fetch(`${URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error("Failed to create product");
      }
      const createdProduct: Product = await response.json();
      return createdProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(product: Product): Promise<Product> {
    try {
      const response = await fetch(`${URL}/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      const updatedProduct: Product = await response.json();
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};
