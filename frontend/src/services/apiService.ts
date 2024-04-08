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
      const response = await fetch(`${URL}/products`, {
        headers: {
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
      });
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

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${URL}/products/${id}`, {
        headers: {
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
      });
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
          "Authorization": "Bearer " + useAuthStore().token.value,
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
          "Authorization": "Bearer " + useAuthStore().token.value,
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
        headers: {
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
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
export const bidService = {
  async getBids(): Promise<Bid[]> {
    try {
      const response = await fetch(`${URL}/bids`, {
        headers: {
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }
      const bids: Bid[] = await response.json();
      return bids;
    }
    catch (error) {
      console.error("Error fetching bids:", error);
      throw error;
    }
  },

  async getBidById(id: string): Promise<Bid> {
    try {
      const response = await fetch(`${URL}/bids/${id}`, {
        headers: {
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bid");
      }
      const bid: Bid = await response.json();
      return bid;
    }
    catch (error)
    {
      console.error("Error fetching bid:", error);
      throw error;
    }
  },


  async createBid(productId: string, price: number): Promise<Bid> {
    try {
      const response = await fetch(`${URL}/products/${productId}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
        body: JSON.stringify({
          price: price,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create bid");
      }
      const createdBid: Bid = await response.json();
      return createdBid;
    } catch (error) {
      console.error("Error creating bid:", error);
      throw error;
    }
  },

  async updateBid(bid: Bid): Promise<Bid> {
    try {
      const response = await fetch(`${URL}/bids/${bid.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
        body: JSON.stringify(bid),
      });
      if (!response.ok) {
        throw new Error("Failed to update bid");
      }
      const updatedBid: Bid = await response.json();
      return updatedBid;
    } catch (error) {
      console.error("Error updating bid:", error);
      throw error;
    }
  },
  async deleteBid(id: string): Promise<void> {
    try {
      const response = await fetch(`${URL}/bids/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + useAuthStore().token.value,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete bid");
      }
    } catch (error) {
      console.error("Error deleting bid:", error);
      throw error;
    }
  },
}
