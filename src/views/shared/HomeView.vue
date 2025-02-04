<template>
  <div class="home-view">
    <div class="main-cont">
      <div class="searchbar">
        <input
          v-model="searchQuery"
          @input="handleInput"
          placeholder="Search assets..."
          class="search-input"
        />
        <ul v-if="showSuggestions" class="suggestions">
          <li
            v-for="(asset, index) in filteredAssets"
            :key="index"
            @click="selectAsset(asset)"
          >
            {{ asset.name }}
          </li>
        </ul>
      </div>


      <div class="category-filter">
        <div v-for="category in categories" :key="category" class="checkbox-item">
          <input
            type="checkbox"
            :id="category"
            :value="category"
            v-model="selectedCategories"
          />
          <label :for="category" class="font-weight-medium">{{ category }}</label>
        </div>
      </div>


      <div v-if="loading" class="loader">
        <p>Loading assets...</p>
      </div>


      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div class="asset-container" v-else>
        <asset-card
          v-for="(asset, index) in displayedAssets"
          :key="index"
          :asset="asset"
          @asset-requested="reloadAssets"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { assetService } from "@/services/asset";
import AssetCard from "@/components/Asset.vue";

const assets = ref([]);
const loading = ref(true);
const error = ref("");
const searchQuery = ref("");
const showSuggestions = ref(false);
const selectedCategories = ref([]);


onMounted(async () => {
  await fetchAssets();
});


const fetchAssets = async () => {
  try {
    const fetchedAssets = await assetService.getAvailableAssets();
    assets.value = fetchedAssets;
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch assets:", err);
  } finally {
    loading.value = false;
  }
};


const reloadAssets = () => {
  setTimeout(async () => {
    loading.value = true;
    await fetchAssets();
  }, 1000);
};

const categories = computed(() => {
  const allCategories = assets.value.map((asset) => asset.category);
  return [...new Set(allCategories)]; 
});


const filteredAssets = computed(() => {
  if (!searchQuery.value) return [];
  return assets.value.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


const displayedAssets = computed(() => {
  let filtered = assets.value;


  if (searchQuery.value) {
    filtered = filtered.filter((asset) =>
      asset.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }


  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((asset) =>
      selectedCategories.value.includes(asset.category)
    );
  }

  return filtered;
});


const handleInput = () => {
  showSuggestions.value = searchQuery.value.length > 0;
};


const selectAsset = (asset) => {
  searchQuery.value = asset.name; 
  showSuggestions.value = false; 
};
</script>



<style scoped>
.asset-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}
.category-filter{
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.checkbox-item{
  display: flex;
  gap: 5px;
}
.loader {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}

.main-cont {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.searchbar {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 30%;
  min-width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 15px;
}
.search-input:focus {
  outline-color: #93d4fa83;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}
</style>