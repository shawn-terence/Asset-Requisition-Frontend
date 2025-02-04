<template>
  <div class="user-details-container">
    <!-- Back Button -->
    <button class="font-weight-bold mb-5" @click="$router.go(-1)">
      <i class="mdi mdi-arrow-left"></i>
      Back to Users
    </button>

    <!-- User Profile Section -->
    <div class="profile-container">
    <p class="profile-title">{{ userData.user.first_name }}'s Profile</p>
    <div class="card" id="profile-card">
      <!-- Card Header -->
      <div class="card-header">
        <div class="header-content">
          <div class="avatar-container">
            <img
              :src="userData.user.profile_picture_url || 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678099-profile-filled-256.png'"
              alt="Profile Avatar"
              class="profile-avatar"
            />
          </div>
          <div class="name-email">
            <p class="name">{{ userData.user.first_name }} {{ userData.user.last_name }}</p>
            <p class="email">{{ userData.user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Card Body: User Details -->
      <div class="card-body">
        <div class="details-grid">
          <div class="detail">
            <p class="detail-label">Phone Number</p>
            <p class="detail-value">{{ userData.user.phone_number }}</p>
          </div>
          <div class="detail">
            <p class="detail-label">Department</p>
            <p class="detail-value">{{ userData.user.department }}</p>
          </div>
          <div class="detail">
            <p class="detail-label">Role</p>
            <v-chip :color="roleColor(userData.user.role)" style="width: fit-content;" dark small>
              {{ userData.user.role }}
            </v-chip>
          </div>
          <div class="detail">
            <p class="detail-label">Member Since</p>
            <p class="detail-value">{{ formatDate(userData.user.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
      </div>
    </div>
  </div>

    <!-- Assigned Assets Section -->
    <div class="card">
      <div class="card-header">
        <span class="icon"><i class="mdi mdi-laptop"></i></span>
        <span class="header-text">
          Assigned Assets ({{ userData.assets.length }})
        </span>
      </div>
      <div class="card-body">
        <div v-if="userData.assets.length">
          <div class="list-item" v-for="asset in userData.assets" :key="asset.id">
            <div class="list-item-prepend">
              <div class="avatar small-avatar">
                <img v-if="asset.image_url" :src="asset.image_url" alt="Asset Image" class="avatar-img" />
                <i v-else class="mdi mdi-desktop-classic"></i>
              </div>
            </div>
            <div class="list-item-content">
              <div class="list-item-title">{{ asset.name }}</div>
              <div class="list-item-subtitle">
                {{ asset.category }} • {{ asset.serial_number }}
              </div>
            </div>
            <div class="list-item-append">
              <span class="chip" :style="{ backgroundColor: asset.status ? 'green' : 'red' }">
                {{ asset.status ? 'Available' : 'Checked Out' }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="alert">
          No assets assigned to this user
        </div>
      </div>
    </div>

    <!-- Requests Section -->
    <div class="card">
      <div class="card-header">
        <span class="icon"><i class="mdi mdi-clipboard-list"></i></span>
        <span class="header-text">
          Asset Requests ({{ userData.requests.length }})
        </span>
      </div>
      <div class="card-body">
        <div v-if="userData.requests.length">
          <div class="list-item" v-for="request in userData.requests" :key="request.id">
            <div class="list-item-prepend">
              <i class="mdi mdi-file-document-outline" style="color: #1976d2;"></i>
            </div>
            <div class="list-item-content">
              <div class="list-item-title">{{ request.asset.name }}</div>
              <div class="list-item-subtitle">
                {{ formatDate(request.created_at) }} • {{ request.notes }}
              </div>
            </div>
            <div class="list-item-append">
              <span class="chip" :style="{ backgroundColor: statusColor(request.status) }">
                {{ request.status }}
              </span>
              <div class="list-item-return-status">
                <small>{{ request.return_status || '—' }}</small>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="alert">
          No requests made by this user
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '@/services/user'

const route = useRoute()
const userData = ref({
  user: {},
  assets: [],
  requests: []
})

onMounted(async () => {
  try {
    const response = await userService.allUserDetails(route.params.id)
    userData.value = response
  } catch (error) {
    console.error('Error fetching user details:', error)
  }
})

const roleColor = (role) => {
  const colors = {
    admin: 'deep-purple',
    employee: 'teal',
    superadmin: 'red'
  }
  return colors[role] || 'grey'
}

const statusColor = (status) => {
  const colors = {
    approved: 'green',
    pending: 'orange',
    rejected: 'red'
  }
  return colors[status.toLowerCase()] || 'grey'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Container */
.user-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: sans-serif;
}



/* Card Styles */
/* .card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
} */

/* Card Header */
/* .card-header {
  background: #f5f5f5;
  padding: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #000;
} */
/* .card-header .icon {
  margin-right: 8px;
}
.header-text {
  display: inline-block;
} */

/* Card Body */
/* .card-body {
  padding: 1rem;
} */

/* Profile Section Styles */
/* .profile-container {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
} */
/* @media (max-width: 900px) {
  .profile-container {
    flex-direction: column;
  }
}
.profile-image {
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
} */
/* .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-icon {
  font-size: 80px;
  color: white;
}
.user-details {
  flex: 1;
}
.details-grid {
  display: flex;
  gap: 16px;
}
@media (max-width: 900px) {
  .details-grid {
    flex-direction: column;
    align-items: center;
  }
}
.details-col {
  display: flex;
  flex-direction: column;
}
.detail-item {
  margin-bottom: 10px;
  display: flex;
  gap: 4px;
} */
.detail-label {
  font-weight: bold;
}

/* List Item Styles for Assets & Requests */
.list-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0;
}
.list-item:last-child {
  border-bottom: none;
}
.list-item-prepend {
  margin-right: 1rem;
}
.small-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.list-item-content {
  flex: 1;
}
.list-item-title {
  font-weight: bold;
}
.list-item-subtitle {
  font-size: 0.875rem;
  color: #555;
}
.list-item-append {
  text-align: right;
}
.list-item-return-status {
  font-size: 0.75rem;
  color: #888;
}

/* Chip Style */
.chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  color: white;
  font-size: 14px;
}

/* Alert */
.alert {
  padding: 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  text-align: center;
}
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 96rem; /* Approx. 6xl width */
  margin: 0 auto;
  padding: 1rem;
}

.profile-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

/* ===== Card Styles ===== */
.card {
  width: 100%;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

/* --- Card Header --- */
.card-header {
  background: #f5f5f5;
  padding: 1rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
}

/* --- Avatar --- */
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 96px;  /* w-24 */
  height: 96px; /* h-24 */
  border-radius: 50%;
  object-fit: cover;
}

@media (min-width: 640px) {
  .profile-avatar {
    width: 160px; /* sm:w-40 */
    height: 160px; /* sm:h-40 */
  }
}

@media (min-width: 768px) {
  .profile-avatar {
    width: 144px; /* md:w-36 */
    height: 144px; /* md:h-36 */
  }
}

@media (min-width: 1024px) {
  .profile-avatar {
    width: 160px; /* lg:w-40 */
    height: 160px; /* lg:h-40 */
  }
}

/* --- Name and Email --- */
.name-email {
  text-align: center;
}

@media (min-width: 768px) {
  .name-email {
    text-align: left;
  }
}

.name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.email {
  font-size: 1rem;
  margin: 0;
  color: #555;
}

/* ===== Card Body (Details Grid) ===== */
.card-body {
  padding: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.detail {
  display: flex;
  flex-direction: column;
}

.detail-label {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: #333;
  font-weight: 500;
}

.detail-value {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

/* ===== Card Footer ===== */
.card-footer {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #f5f5f5;
}

.btnM {
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btnM:hover {
  background: #1565c0;
}
</style>
