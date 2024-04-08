<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { productService } from "@/services/apiService";
import { Product } from "../models/product";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
let loading = ref(false);
let errorMessage = ref("");
let product: Product = {
  name: "",
  description: "",
  category: "",
  originalPrice: 0,
  pictureUrl: "",
  endDate: "",
};

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

async function addProduct() {
  errorMessage.value = "";
  loading.value = true;

  try {
    const createdProduct = await productService.createProduct(product);
    router.push({ name: "Product", params: { productId: createdProduct.id } });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="addProduct">
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="errorMessage != ''">
          Une erreur s'est produite {{ errorMessage }}
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input type="text" class="form-control" id="product-name" v-model="product.name" required
            data-test-product-name />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea class="form-control" id="product-description" name="description" rows="3" required
            data-test-product-description v-model="product.description"></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input type="text" class="form-control" id="product-category" required data-test-product-category
            v-model="product.category" />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input type="number" class="form-control" id="product-original-price" name="originalPrice" step="1" min="0"
              required data-test-product-price v-model="product.originalPrice" />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input type="url" class="form-control" id="product-picture-url" name="pictureUrl" required
            data-test-product-picture v-model="product.pictureUrl" />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input type="date" class="form-control" id="product-end-date" name="endDate" required
            data-test-product-end-date v-model="product.endDate" />
        </div>

        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary" :disabled="loading" data-test-submit>
            Ajouter le produit
            <span data-test-spinner class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
              v-if="loading"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>