<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRoute, useRouter } from "vue-router";
import { Ref, ref, onMounted, computed } from 'vue';
import { productService } from "@/services/apiService";
import { Product } from "@/models/product";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
const route = useRoute();

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}
const error: Ref<boolean> = ref<boolean>(false);
const loading: Ref<boolean> = ref<boolean>(false);
const productId:Ref<string> = ref<string>(route.params.productId as string);
const product: Ref<Product|null> = ref<Product|null>(null);
const formattedEndDate = ref<string | undefined>(undefined);

interface productModel {
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  pictureUrl: string;
  endDate: Date;
}

const modelProduct:Ref<productModel> = ref<productModel>({
  name: "",
  description: "",
  category: "",
  originalPrice: 0,
  pictureUrl: "",
  endDate: new Date()
})

const fetchProduct = async () => {
  loading.value = true;
  try {
    const response = await productService.getProductById(productId.value);
    console.log(response);
    product.value = response;
    formattedEndDate.value = new Date(response.endDate).toISOString().split('T')[0];
    modelProduct.value = response;
  } catch (err) {
    console.error(err);
    error.value = true;
    router.push({ name: "Home" });
  }finally{
    loading.value = false;
    if(product.value===null){
      router.push({ name: "Home" });
    }
  }
};

fetchProduct();

const updateProduct = async (event: Event) => {
  const form = modelProduct.value;
  console.log(modelProduct.value);
  try {
    if(product.value==null) return;
    const newProduct: Product = {
      ...product.value,
      name: form.name,
      description: form.description,
      category: form.category,
      originalPrice: form.originalPrice,
      pictureUrl: form.pictureUrl,
      endDate: form.endDate,
    };
    await productService.updateProduct(newProduct);
    router.push({ name: "Product", params: { productId: productId.value } });
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <h1 class="text-center">Modifier un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form>
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
          Une erreur est survenue
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input
            type="text"
            class="form-control"
            id="product-name"
            required
            data-test-product-name
            v-model="modelProduct.name"
          />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea
            class="form-control"
            id="product-description"
            name="description"
            rows="3"
            required
            data-test-product-description
            :value="product?.description"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input
            type="text"
            class="form-control"
            id="product-category"
            required
            data-test-product-category
            :value="product?.category"
          />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              id="product-original-price"
              name="originalPrice"
              step="1"
              min="0"
              required
              data-test-product-price
              :value="product?.originalPrice"
            />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input
            type="url"
            class="form-control"
            id="product-picture-url"
            name="pictureUrl"
            required
            data-test-product-picture
            :value="product?.pictureUrl"
          />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input
            type="date"
            class="form-control"
            id="product-end-date"
            name="endDate"
            required
            data-test-product-end-date
            :value="formattedEndDate"
          />
        </div>

        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            v-bind:disabled="loading"
            data-test-submit
            @click="updateProduct"
          >
            Modifier le produit
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              data-test-spinner v-if="loading"
            ></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
