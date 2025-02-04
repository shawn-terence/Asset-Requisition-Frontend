<template>
  <div>
    <!-- Search and Sort Controls -->
    <div class="controls">
      <!-- Regular Input Field -->
      <input
        v-model="searchQuery"
        placeholder="Search by asset name"
        class="search-input"
      />
      <!-- Date Filter Chips -->
      <div class="filter-chips">
        <v-chip
          v-for="option in sortOptions"
          :key="option.value"
          :color="sortOrder === option.value ? 'primary' : 'default'"
          @click="sortOrder = option.value"
        >
          {{ option.text }}
        </v-chip>
      </div>
    </div>

    <!-- Requests Table -->
    <v-data-table
      :headers="headers"
      :items="filteredRequests"
      mobile-breakpoint="0"
      class="data-table"
    >
      <!-- Custom rendering for the Date Requested column -->
      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <!-- Custom rendering for the Actions column -->
      <template v-slot:item.actions="{ item }">
        <button
          small
          class="action-btn"
          id="success"
          @click="confirmRequest(item.id)"
        >
          Confirm
        </button>
        <button small color="error" class="action-btn" id="deny" @click="deleteRequest(item.id)">
          Delete
        </button>
      </template>
    </v-data-table>

    <!-- Snackbar Notification -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { requestsService } from "@/services/request";

// Reactive state
const requests = ref([]);
const searchQuery = ref("");
const sortOrder = ref("asc"); // Default sort order

const snackbar = ref({
  show: false,
  message: "",
  color: "",
});

// Table headers
const headers = [
  { title: "Asset Name", key: "asset.name" },
  { title: "Serial Number", key: "asset.serial_number" },
  { title: "Requester Email", key: "employee.email" },
  { title: "Date Requested", key: "created_at" },
  { title: "Actions", key: "actions", sortable: false },
];

// Sort options
const sortOptions = [
  { text: "Oldest to Newest", value: "asc" },
  { text: "Newest to Oldest", value: "desc" },
];

// Fetch requests on component mount
onMounted(async () => {
  try {
    const data = await requestsService.getRequests();
    requests.value = data.filter((request) => request.status === "pending");
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
});

// Computed property for filtered and sorted requests
const filteredRequests = computed(() => {
  // Filter by search query
  let result = requests.value.filter((request) =>
    request.asset.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  // Sort by date
  result = result.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    return sortOrder.value === "asc" ? dateA - dateB : dateB - dateA;
  });

  return result;
});

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Confirm a request
const confirmRequest = async (id) => {
  try {
    await requestsService.requestAction(id, { action: "approve" });
    requests.value = requests.value.filter((request) => request.id !== id);
    showSnackbar("Request approved successfully!", "green");
  } catch (error) {
    console.error("Error confirming request:", error);
    showSnackbar("Failed to confirm request.", "red");
  }
};

// Delete a request
const deleteRequest = async (id) => {
  try {
    await requestsService.requestAction(id, { action: "reject" });
    requests.value = requests.value.filter((request) => request.id !== id);
    showSnackbar("Request rejected successfully!", "green");
  } catch (error) {
    console.error("Error deleting request:", error);
    showSnackbar("Failed to reject request.", "red");
  }
};

// Show snackbar notification
const showSnackbar = (message, color) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};
</script>

<style scoped>
.action-btn {
  width: 100px;
  color: white;
  font-weight: 600;
  margin: 5px;
  padding: 8px;
  border-radius: 5px;
}
#success {
  background-color: green;
}
#deny {
  background-color: #e40d22;
}
.data-table {
  border: 0.5px solid rgba(0, 0, 0, 0.151);
  padding: 0;
  border-radius: 15px;
}
.controls {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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

.filter-chips {
  display: flex;
  gap: 8px;
}

.filter-chips .v-chip {
  cursor: pointer;
}
</style>
