<template>
  <div>
    <v-container class="main">
      <!-- Snackbar for notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.message }}
      </v-snackbar>

      <!-- Edit Asset Dialog -->
      <v-dialog v-model="editDialog" max-width="700">
        <v-card>
          <v-card-title class="text-h5 font-weight-bold text-center">Edit Asset</v-card-title>
          <v-card-text>
            <form @submit.prevent="saveEditedAsset" class="form">
              <p class="message">Update the asset details below.</p>

              <label>
                <input
                  class="input"
                  type="file"
                  id="image"
                  accept="image/*"
                  @change="handleEditFileInput"
                />
                <span>Upload Image</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="name"
                  v-model="editedAsset.name"
                  required
                />
                <span>Name</span>
              </label>

              <label>
                <textarea
                  class="input"
                  id="description"
                  v-model="editedAsset.description"
                  required
                ></textarea>
                <span>Description</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="category"
                  v-model="editedAsset.category"
                  required
                />
                <span>Category</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="serial_number"
                  v-model="editedAsset.serial_number"
                  required
                />
                <span>Serial Number</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="tag"
                  v-model="editedAsset.tag"
                  required
                />
                <span>Tag</span>
              </label>
              <div class="footer">
                <button type="submit" class="submit">Save Changes</button>
                <button type="button" class="submit-cancel" @click="editDialog = false">Cancel</button>
              </div>

            </form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Search and Filter Section -->

      <v-tabs v-model="tab" class="tabs">
        <v-tab value="all-assets">All Assets</v-tab>
        <v-tab value="add-asset">Add Asset</v-tab>
        <v-tab value="available-assets">Available Assets</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- All Assets Tab -->
        <v-window-item value="all-assets">
          <div class="search-cont">
            <div  class="search-filter" v-if="tab === 'all-assets' || tab === 'available-assets'">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by name..."
              class="search-input"
            />
            <div class="categories">
              <div v-for="category in uniqueCategories" :key="category">
              <label>
                <input 
                  type="checkbox" 
                  :value="category" 
                  v-model="selectedCategories" 
                />
                {{ category }}
              </label>
              </div>              
            </div>
            </div>
          </div>
          <v-card>
            <v-card-title>All Assets</v-card-title>
            <v-card-text class="assets-table">
              <v-table fixed-header>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Description</th>
                    <th class="text-left">Category</th>
                    <th class="text-left">Serial Number</th>
                    <th class="text-left">Tag</th>
                    <th class="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="asset in filteredPaginatedAssets" :key="asset.id">
                    <td>{{ asset.name }}</td>
                    <td>{{ asset.description }}</td>
                    <td>{{ asset.category }}</td>
                    <td>{{ asset.serial_number }}</td>
                    <td>{{ asset.tag }}</td>
                    <td>
                      <v-chip :color="asset.status ? 'green' : 'red'">
                        {{ asset.status ? "Available" : "Requested" }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                class="mt-4"
              ></v-pagination>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Add Asset Tab -->
        <v-window-item value="add-asset">
          <v-card>
            <v-card-text>
              <form @submit.prevent="addAsset" class="form">
                <p class="title">Add Asset</p>
                <p class="message">Fill out the form to add a new asset.</p>

                <label>
                  <input
                    class="input"
                    type="file"
                    id="image"
                    accept="image/*"
                    @change="handleFileInput"
                    required
                  />
                  <span>Upload Image</span>
                </label>

                <label>
                  <input
                    class="input"
                    type="text"
                    id="name"
                    v-model="newAsset.name"
                    required
                  />
                  <span>Name</span>
                </label>

                <label>
                  <textarea
                    class="input"
                    id="description"
                    v-model="newAsset.description"
                    required
                  ></textarea>
                  <span>Description</span>
                </label>

                <label>
                  <input
                    class="input"
                    type="text"
                    id="category"
                    v-model="newAsset.category"
                    required
                  />
                  <span>Category</span>
                </label>

                <label>
                  <input
                    class="input"
                    type="text"
                    id="serial_number"
                    v-model="newAsset.serial_number"
                    required
                  />
                  <span>Serial Number</span>
                </label>

                <label>
                  <input
                    class="input"
                    type="text"
                    id="tag"
                    v-model="newAsset.tag"
                    required
                  />
                  <span>Tag</span>
                </label>

                <button type="submit" class="submit">Add Asset</button>
              </form>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Available Assets Tab -->
        <v-window-item value="available-assets">
          <div class="search-cont">
            <div  class="search-filter" v-if="tab === 'all-assets' || tab === 'available-assets'">
            <div>
              <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by name..."
              class="search-input"
              />
            </div>

            <div class="categories">
              <div v-for="category in uniqueCategories" :key="category">
              <label>
                <input 
                  type="checkbox" 
                  :value="category" 
                  v-model="selectedCategories" 
                />
                {{ category }}
              </label>
              </div>              
            </div>
            </div>
          </div>
          <v-card>
            <v-card-title>Available Assets</v-card-title>
            <v-card-text>
              <div class="asset-grid">
                <div
                  v-for="asset in filteredAvailableAssets"
                  :key="asset.id"
                  class="asset-card"
                >
                  <div class="card-header">
                    <img
                      id="asset-img"
                      :src="asset.image_url || asset.link"
                      alt="Asset image"
                    />
                    <h2>{{ asset.name }}</h2>
                  </div>
                  <div class="card-body">
                    <p>{{ asset.description }}</p>
                    <p><strong>Category:</strong> {{ asset.category }}</p>
                    <p><strong>Serial Number:</strong> {{ asset.serial_number }}</p>
                    <p><strong>Tag:</strong> {{ asset.tag }}</p>
                  </div>
                  <div class="card-footer">
                    <button
                      class="btn btn-warning"
                      @click="editAsset(asset)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-error"
                      @click="deleteAsset(asset.id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { assetService } from "@/services/asset";

// Reactive state
const tab = ref("all-assets");
const searchQuery = ref("");
const selectedCategories = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const editDialog = ref(false);

// Data states
const allAssets = ref([]);
const availableAssets = ref([]);
const newAsset = ref({
  name: "",
  description: "",
  category: "",
  serial_number: "",
  tag: "",
  image: null,
  status: true,
});

const editedAsset = ref({
  id: null,
  name: "",
  description: "",
  category: "",
  serial_number: "",
  tag: "",
  image: null,
});

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});
const handleEditFileInput = (event) => {
  const file = event.target?.files?.[0] || event;
  editedAsset.value.image = file || null;
};

// Computed properties
const filteredAssets = computed(() => {
  return allAssets.value.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (selectedCategories.value.length === 0 || selectedCategories.value.includes(asset.category))
  );
});


const filteredAvailableAssets = computed(() => {
  return availableAssets.value.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (selectedCategories.value.length === 0 || selectedCategories.value.includes(asset.category))
  );
});

const uniqueCategories = computed(() => {
  return [...new Set(allAssets.value.map(asset => asset.category))].sort();
});

const totalPages = computed(() => {
  return Math.ceil(filteredAssets.value.length / itemsPerPage.value);
});

const filteredPaginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAssets.value.slice(start, end);
});

// Methods
const fetchAllAssets = async () => {
  loading.value = true;
  try {
    const response = await assetService.getAllAssets();
    allAssets.value = response;
  } catch (error) {
    showSnackbar(`Error fetching assets: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const fetchAvailableAssets = async () => {
  loading.value = true;
  try {
    const response = await assetService.getAvailableAssets();
    availableAssets.value = response;
  } catch (error) {
    showSnackbar(`Error fetching available assets: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const handleFileInput = (event) => {
  const file = event.target?.files?.[0] || event;
  newAsset.value.image = file || null;
};

const addAsset = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("name", newAsset.value.name);
    formData.append("description", newAsset.value.description);
    formData.append("category", newAsset.value.category);
    formData.append("serial_number", newAsset.value.serial_number);
    formData.append("tag", newAsset.value.tag);
    formData.append("status", newAsset.value.status);
    if (newAsset.value.image) formData.append("image", newAsset.value.image);

    await assetService.addAsset(formData);
    showSnackbar("Asset added successfully!", "success");
    
    // Reset form
    newAsset.value = {
      name: "",
      description: "",
      category: "",
      serial_number: "",
      tag: "",
      image: null,
      status: true,
    };

    await Promise.all([fetchAllAssets(), fetchAvailableAssets()]);
  } catch (error) {
    showSnackbar(`Error adding asset: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const deleteAsset = async (id) => {
  loading.value = true;
  try {
    await assetService.deleteAsset(id);
    showSnackbar("Asset deleted successfully!", "success");
    await Promise.all([fetchAllAssets(), fetchAvailableAssets()]);
  } catch (error) {
    showSnackbar(`Error deleting asset: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const editAsset = (asset) => {
  editedAsset.value = {
    id: asset.id,
    name: asset.name,
    description: asset.description,
    category: asset.category,
    serial_number: asset.serial_number,
    tag: asset.tag,
    image: null,
  };
  editDialog.value = true;
};

const saveEditedAsset = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("name", editedAsset.value.name);
    formData.append("description", editedAsset.value.description);
    formData.append("category", editedAsset.value.category);
    formData.append("serial_number", editedAsset.value.serial_number);
    formData.append("tag", editedAsset.value.tag);
    if (editedAsset.value.image) formData.append("image", editedAsset.value.image);

    await assetService.updateAsset(editedAsset.value.id, formData);
    showSnackbar("Asset updated successfully!", "success");
    editDialog.value = false;
    await Promise.all([fetchAllAssets(), fetchAvailableAssets()]);
  } catch (error) {
    showSnackbar(`Error updating asset: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
};

const showSnackbar = (message, color) => {
  snackbar.value = { show: true, message, color };
};

// Initial fetch
onMounted(() => {
  Promise.all([fetchAllAssets(), fetchAvailableAssets()]);
});
</script>
<style scoped>
.search-cont{
  display: flex;
  justify-content: center;
  width: 100%;
}
.search-filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 5px;

}
.asset-dialog{
  max-width: 600px;
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  border: 1px solid #3b383867;
  background-color: #ffffff;
}
.assets-table {
  border: 1px solid rgba(82, 82, 82, 0.158);
  border-radius: 20px;
  padding: 0;
}

/* .search-input{
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 1rem;
  margin-left: 5px;
  margin-right: 5px;
} */
.search-input{
  border:1px solid #ddd;
  border-radius: 15px;
  height: 50px;
  min-width: 200px;
  padding: 5px;
}
.search-input:focus {
  outline-color: #93d4fa83;
}
.footer{
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.category-select {
  min-width: 200px;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 0.5rem;
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.asset-card {
  max-width: 300px;
  min-height: 420px;
  height: fit-content;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  box-shadow: 3px 6px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 5px;
}

.card-header {
  width: 100%;
  height: 70%;
  background-color: #93d4fa83;
  padding: 10px 5px 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  border-radius: 10px;
}

.card-header img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.card-header h2 {
  align-self: flex-start;
  margin: 0;
}

.card-body {
  text-align: start;
}

.card-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  gap: 10px;
  padding-top: 15px;
}

#asset-img {
  width: 90%;
  height: 200px;
  border-radius: 3px;
}

.btn {
  padding: 8px;
  width: 45%;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(1);
}

.btn-warning {
  background: #fa672c;
  color: rgb(255, 255, 255);
}

.btn-error {
  background: #ce0e21;
  color: white;
}

.form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #3b383828;
  position: relative;
  background-color: #ffffff;
}

.form label {
  position: relative;
}

.form label .input {
  color: #000;
  width: 100%;
  padding: 20px 5px 5px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
  font-size: medium;
}

.form label .input + span {
  color: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 10px;
  top: 0px;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 12.5px;
  font-size: 0.9em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  color: #00bfff;
  top: 0px;
  font-size: 0.7em;
  font-weight: 600;
}

.input-field {
  border-radius: 0.5rem;
}

.submit {
  border: none;
  outline: none;
  padding: 12px 24px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  background-color: #f05414;
  cursor: pointer;
  width: 30%;
  min-width: 150px;
}
.submit-cancel{
  border: none;
  outline: none;
  padding: 12px 24px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  background-color: #c71010;
  cursor: pointer;
  width: 30%;
  min-width: 150px;
}

.submit:hover {
  background-color: #259fe6;
}

.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #f05414;
  position: relative;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: #f05414;
}

.title::after {
  animation: pulse 1s linear infinite;
}

.signin {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.signin a {
  color: #00bfff;
}

.signin a:hover {
  text-decoration: underline royalblue;
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
@media (max-width:420px) {
  .footer{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
}
@media screen and (max-width: 600px) {
  .asset-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  .search-input {
    min-width: 200px;
  }
  .card-footer {
    flex-direction: column;
  }
  .card-footer button {
    width: 100%;
  }
}
</style>
