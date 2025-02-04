<template>
  <div class="container">
    <h1 class="text-xl font-weight-bold text-center">My Requests</h1>
    <div class="my-requests"> 

      <!-- Loading State -->
      <div v-if="loading" class="loader">
        <p>Loading your requests...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <!-- Display Requests -->
      <div v-else class="requests-container">
        <div v-if="requests.length === 0" class="no-requests">
          <p>You have not made any requests yet.</p>
          <div >
            <img class="image" src="https://res.cloudinary.com/dcqpver8i/image/upload/v1738304549/data-access_12512055_cbsslr.png" alt="empty assets"/>
          </div>
        </div>

        <div class="request-cont" v-else>
          <div v-for="request in requests" :key="request.id" class="asset">
            <div class="card-header">
              <img id="asset-img" :src="request.asset.image_url||request.asset.link" :alt="request.asset.name || 'Asset image'" />
              <h2 class="font-weight-medium">{{ request.asset.name }}</h2>
            </div>
            <div class="card-body">
              <p class="font-weight-medium">{{ request.asset.description }}</p>
              <p><strong>Category:</strong> {{ request.asset.category }}</p>
              <p><strong>Serial Number:</strong> {{ request.asset.serial_number }}</p>
            </div>
            <div class="card-footer">
              <div class="status" :class="statusClass(request.status)">
                {{ request.status }}
              </div>
              <button class="delete-btn" @click="handleDelete(request.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { requestsService } from "@/services/request";

const requests = ref([]);
const loading = ref(true);
const error = ref("");

// Fetch the user's requests
const fetchRequests = async () => {
  try {
    const response = await requestsService.employeeRequests();
    requests.value = response;
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch requests:", err);
  } finally {
    loading.value = false;
  }
};

// Handle delete request
const handleDelete = async (id) => {
  try {
    await requestsService.deleteRequest(id);
    fetchRequests();
  } catch (err) {
    error.value = err.message;
    console.error("Failed to delete request:", err);
  }
};

// Compute the status class based on the request's status
const statusClass = (status) => {
  return {
    "status-pending": status === "pending",
    "status-approved": status === "approved",
    "status-rejected": status === "rejected",
  };
};

// Fetch requests when the component is mounted
onMounted(() => {
  fetchRequests();
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
.my-requests {
  max-width: 1200px;
  margin: 0 auto;
}

.requests-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.request-cont {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%; /* Changed to 100% for better responsiveness */
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
  justify-content: space-between; /* Align status and delete button */
  align-items: center;
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
  color: #f05414; /* Orange for pending */
}

.status-approved {
  color: #03490f; /* Green for approved */
}

.status-rejected {
  color: #ff0000; /* Red for rejected */
}

.delete-btn {
  padding: 8px;
  border: none;
  border-radius: 5px;
  background-color: #f12323;
  color: #ffffff;
  width: 100px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #cc0000;
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

.no-requests {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  color: #666;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .request-cont {
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
  .request-cont {
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