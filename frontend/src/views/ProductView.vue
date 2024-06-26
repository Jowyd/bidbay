<script setup lang="ts">
import { ref, computed, Ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import { productService, bidService } from "@/services/apiService";
import { Product } from '@/models/product';
import { Bid } from '@/models/bid';


const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const route = useRoute();

const productId:Ref<string> = ref<string>(route.params.productId as string);
const loading: Ref<boolean> = ref<boolean>(false);
const error: Ref<boolean> = ref<boolean>(false);
const product: Ref<Product|null> = ref<Product|null>(null);

const fetchProduct = async () => {
  loading.value = true;
  try {
    const response = await productService.getProductById(productId.value);
    product.value = response;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

fetchProduct();

/**
 * @param {number|string|Date|VarDate} date
 */
function formatDate(date:Date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options as Intl.DateTimeFormatOptions);
}

const countdown = ref(0);


const updateCountdown = () => {
  if (product.value) {
    const endDate = new Date(product.value.endDate).getTime();
    const now = new Date().getTime();
    const distance = endDate - now;
    countdown.value = Math.max(0, distance);
  } else {
    countdown.value = 0;
  }
};
setInterval(() => {
  updateCountdown();
}, 1000);

updateCountdown();

const formattedCountdown = computed(() => {
  const totalSeconds = Math.floor(countdown.value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

function isYou(){
  return userData.value?.id === product.value?.sellerId;
}

function haveRight(){
  return userData.value?.id === product.value?.sellerId || isAdmin.value;
}

function canDeleteBid(bid:Bid){
  return bid.bidderId === userData.value?.id || isAdmin.value;
}

const deleteBid = async (bid:Bid) => {
  try {
    await bidService.deleteBid(bid.id);
    fetchProduct();
  } catch (err) {
    console.error(err);
    error.value = true;
  }
};

const bidAmount = ref(0);

const submitBid = async () => {
  try {
    await bidService.createBid(productId.value, bidAmount.value);
    fetchProduct();
  } catch (err) {
    console.error(err);
    error.value = true;
  }
};

</script>

<template>
  <div class="row">
    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" v-if="error" data-test-error>
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row" data-test-product v-if="!loading && !error && product">
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img
          :src="product?.pictureUrl"
          alt=""
          class="img-fluid rounded mb-3"
          data-test-product-picture
        />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : {{ formattedCountdown }}
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{ product?.name }}
            </h1>
          </div>
          <div class="col-lg-6 text-end">
            <RouterLink
              :to="{ name: 'ProductEdition', params: { productId: productId } }"
              class="btn btn-primary"
              data-test-edit-product
              v-if="haveRight()"
            >
              Editer
            </RouterLink>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product
            v-if="haveRight()"
            >
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{
            product?.description
          }}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : 17 €</li>
          <li data-test-product-end-date>Date de fin : 20 juin 2026</li>
          <li>
            Vendeur :
            <router-link
              v-if="product?.sellerId"
              :to="{ name: 'User', params: { userId: (isYou() ? 'me' :product?.sellerId) } }"
              data-test-product-seller
            >
              {{ isYou() ? "Vous": product?.seller.username }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids v-if="product?.bids && product?.bids.length > 0">
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bid in product?.bids" :key="bid.id" data-test-bid>
              <td>
                <router-link
                  :to="{ name: 'User', params: { userId: bid.bidderId } }"
                  data-test-bid-bidder
                >
                  {{ bid.bidder.username }}
                </router-link>
              </td>
              <td data-test-bid-price>{{ bid.price }} €</td>
              <td data-test-bid-date>{{ formatDate(bid.date) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid v-if="canDeleteBid(bid)" @click="deleteBid(bid)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids v-else>Aucune offre pour le moment</p>

        <form data-test-bid-form v-if="!isYou()">
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input
              type="number"
              class="form-control"
              id="bidAmount"
              data-test-bid-form-price
              v-model="bidAmount"
            />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            v-bind:disabled="bidAmount < 10 || bidAmount <= (product?.bids[product.bids.length-1]?.price ?? 0)" 
            data-test-submit-bid
            @click="submitBid()"
          >
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
