<script setup lang="ts">
import { ref, Ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";
import { User } from "../models/user"

const { isAuthenticated, userData } = useAuthStore();
import { userService } from "@/services/apiService";

const router = useRouter();
const route = useRoute();

const user: Ref<User|null> = ref(null);
const loading = ref(false);
const error: Ref<boolean> = ref(false);

let userId = computed(() => route.params.userId as string);

const fetchUser = async () => {
  loading.value = true;
  try {
    const response = await userService.getUser(userId.value);
    user.value = response;
    console.log(response)
    return response;
  } catch (e) {
    error.value = true;
    router.push({ name: "Home" });
  } finally {
    loading.value = false;
  } 
};

onMounted(() => {
  fetchUser();
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur {{ user?.username }}
      <span class="badge rounded-pill bg-primary" data-test-admin>Admin</span>
    </h1>
    <div class="text-center" data-test-loading v-if="loading">
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>
    <div data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div
              class="col-md-6 mb-6 py-2"
              v-for="product in user?.products"
              :key="product.id"
              data-test-product
            >
              <div class="card">
                <RouterLink
                  :to="{
                    name: 'Product',
                    params: { productId: product.id },
                  }"
                >
                  <img
                    :src="product.pictureUrl"
                    class="card-img-top"
                    data-test-product-picture
                  />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink
                      :to="{
                        name: 'Product',
                        params: { productId: product.id },
                      }"
                      data-test-product-name
                    >
                    {{ product.name }}
                    </RouterLink>
                  </h5>
                  <p class="card-text" data-test-product-description>
                    {{ product.description }}
                  </p>
                  <p class="card-text" data-test-product-price>
                    Prix de départ : {{ product.originalPrice }} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2>Offres</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Offre</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="bid in user?.bids"
                :key="bid.id"
                data-test-bid
              >
                <td>
                  <RouterLink
                    :to="{
                      name: 'Product',
                      params: { productId: bid.productId },
                    }"
                    data-test-bid-product
                  >
                    {{ bid.product.name }}
                  </RouterLink>
                </td>
                <td data-test-bid-price>{{ bid.price }} €</td>
                <td data-test-bid-date>{{ formatDate(bid.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
