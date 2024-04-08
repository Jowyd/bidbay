<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { productService } from "@/services/apiService";
import { Product } from "@/models/product";

const loading = ref(false);
const error = ref(false);
const products: Ref<Product[]> = ref([]);
const searchTerm = ref("");
const sortOption = ref("name");

async function fetchProducts() {
  loading.value = true;
  error.value = false;
  try {
    const response = await productService.getProducts();
    console.log(response);
    products.value = response;
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

fetchProducts();
const filteredProducts = computed(() => {
  if (searchTerm.value) {
    return products.value.filter((product) => {
      return product.name
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
    });
  } else {
    return products.value;
  }
});

function sortProducts(type: string) {
  if (type === "price") {
    products.value = products.value?.sort(
      (a, b) => a.originalPrice - b.originalPrice
    );
    sortOption.value = "prix";
  } else {
    products.value = products.value?.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    sortOption.value = "nom";
  }
}
</script>

<template>
  <div>
    <h1 class="text-center mb-4">Liste des produits</h1>

    <div class="row mb-3">
      <div class="col-md-6">
        <form>
          <div class="input-group">
            <span class="input-group-text">Filtrage</span>
            <input
              type="text"
              class="form-control"
              placeholder="Filtrer par nom"
              data-test-filter
              v-model="searchTerm"
            />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-test-sorter
          >
            Trier par nom
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-on:click="sortProducts('name')">
              <a class="dropdown-item" href="#"> Nom </a>
            </li>
            <li v-on:click="sortProducts('price')">
              <a class="dropdown-item" href="#" data-test-sorter-price>
                Prix
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div
      class="alert alert-danger mt-4"
      role="alert"
      data-test-error
      v-if="error"
    >
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="product in filteredProducts"
        data-test-product
        :key="product.id"
      >
        <div class="card">
          <RouterLink
            :to="{ name: 'Product', params: { productId: product.id } }"
          >
            <img
              :src="product.pictureUrl"
              data-test-product-picture
              class="card-img-top"
            />
          </RouterLink>
          <div class="card-body">
            <h5 class="card-title">
              <RouterLink
                data-test-product-name
                :to="{ name: 'Product', params: { productId: product.id } }"
              >
                {{ product.name }}
              </RouterLink>
            </h5>
            <p class="card-text" data-test-product-description>
              {{ product.description }}
            </p>
            <p class="card-text">
              Vendeur :
              <RouterLink
                data-test-product-seller
                :to="{ name: 'User', params: { userId: product.sellerId } }"
              >
                {{ product.seller.username }}
              </RouterLink>
            </p>
            <p class="card-text" data-test-product-date>
              En cours jusqu'au {{ product.endDate }}
            </p>
            <p class="card-text" data-test-product-price>
              Prix actuel : {{ product.originalPrice }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>