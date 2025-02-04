<template>
  <div>
    <!-- Search and Filter Controls -->
    <div class="controls">
      <!-- Search Input -->
      <input
        v-model="searchQuery"
        placeholder="Search by asset name"
        class="search-input"
      />
      <!-- Filter Chips -->
      <div class="filter-chips">
        <v-chip
          v-for="option in filterOptions"
          :key="option.value"
          :color="filterStatus === option.value ? 'primary' : 'default'"
          @click="filterStatus = option.value"
        >
          {{ option.text }}
        </v-chip>
      </div>
    </div>

    <!-- Requests Table -->
    <v-data-table
      :headers="headers"
      :items="filteredRequests"
      :items-per-page="10"
      class="data-table"
    >
      <!-- Custom rendering for the Date Requested column -->
      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <!-- Custom rendering for the Request Status column -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { requestsService } from "@/services/request";

// Reactive state
const requests = ref([]);
const searchQuery = ref("");
const filterStatus = ref("all"); // Default status filter

// Table headers
const headers = [
  { title: "Asset Name", key: "asset.name" },
  { title: "Serial Number", key: "asset.serial_number" },
  { title: "Requester Email", key: "employee.email" },
  { title: "Date Requested", key: "created_at" },
  { title: "Request Status", key: "status" },
];

// Status filter options
const filterOptions = [
  { text: "All", value: "all" },
  { text: "Pending", value: "pending" },
  { text: "Approved", value: "approved" },
  { text: "Rejected", value: "rejected" },
];

// Fetch requests on component mount
onMounted(async () => {
  try {
    const data = await requestsService.getRequests();
    requests.value = data;
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
});

// Computed property for filtered and sorted requests
const filteredRequests = computed(() => {
  // Filter by status
  let result = requests.value.filter(
    (request) =>
      filterStatus.value === "all" || request.status === filterStatus.value
  );

  // Filter by search query
  result = result.filter((request) =>
    request.asset.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

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

// Get color for request status chip
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};
</script>

<style scoped>
.data-table{
  border: .5px solid rgba(0, 0, 0, 0.151);
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
  margin-top: 1rem;
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
  margin-bottom: 16px;
}

.filter-chips .v-chip {
  cursor: pointer;
}
</style>
