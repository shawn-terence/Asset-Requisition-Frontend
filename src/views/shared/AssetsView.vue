<template>
  <div class="container">
    <div class="my-assets">
      <h1 class="text-xl font-weight-bold text-center">My Assets</h1>

      <!-- Loading State -->
      <div v-if="loading" class="loader">
        <p>Loading your assets...</p>
      </div>
      <!-- Display Assets -->
      <div v-else class="assets-container">
        <div v-if="assets.length === 0" class="no-assets">
          <p>You have no assets assigned to you.</p>
          <div>
            <img class="image" src="https://res.cloudinary.com/dcqpver8i/image/upload/v1738304391/package_17143265_xzhtdg.png" alt="empty assets"/>
          </div>
        </div>
        

        <div class="asset-cont" v-else>
          <div v-for="asset in assets" :key="asset.id" class="asset">
            <div class="card-header">
              <img id="asset-img" :src="asset.image_url" :alt="asset.name || 'Asset image'" />
              <h2 class="font-weight-medium">{{ asset.name }}</h2>
            </div>
            <div class="card-body">
              <p class="font-weight-medium">{{ asset.description }}</p>
              <p><strong>Category:</strong> {{ asset.category }}</p>
              <p><strong>Serial Number:</strong> {{ asset.serial_number }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userService } from "@/services/user";
const id=localStorage.getItem('userId')
const assets = ref([]);
const loading = ref(true);
const error = ref("");

// Fetch the user's assets
const fetchAssets = async () => {
  try {
    const response = await userService.userAssets();
    assets.value = response;
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch assets:", err);
  } finally {
    loading.value = false;
  }
};


// Fetch assets when the component is mounted
onMounted(() => {
  fetchAssets();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 20px;
}
.image{
  opacity: 10%;
  width: 90%;
  padding: .5rem;
}
.my-assets {
  max-width: 1200px;
  margin: 0 auto;
}

.assets-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-cont {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 20px;
}

.asset {
  max-width: 300px;
  height: fit-content;
  min-height: 420px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 3px 6px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 50px;
}

.card-header {
  width: 100%;
  height: 70%;
  background-color: #93d4fa83;
  padding: 5px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  border-radius: 10px;
}

.card-header h2 {
  align-self: flex-start;
  margin: 0;
}

.card-footer {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-bottom: 1rem;
}

.card-body {
  margin: 0;
  width: 100%;
}

#asset-img {
  width: 90%;
  height: 200px;
  border-radius: 3px;
  object-fit: cover;
}

.status {
  padding: 8px;
  width: 100px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  cursor: default; /* Disable pointer events for status */
}

.status-pending {
  background-color: #f05414; /* Orange for pending */
}

.status-approved {
  background-color: #03490f; /* Green for approved */
}

.status-rejected {
  background-color: #ff0000; /* Red for rejected */
}

.loader {
  text-align: center;
  margin-top: 20px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
}

.no-assets {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  color: #666;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .asset-cont {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 10px;
  }

  .asset {
    min-height: 380px;
  }

  #asset-img {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .asset-cont {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 10px;
  }

  .asset {
    min-height: 350px;
  }

  #asset-img {
    height: 120px;
  }
}
</style>