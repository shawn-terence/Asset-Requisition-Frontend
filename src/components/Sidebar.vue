<template>
  <aside class="sidebar">
    <div class="top-section">
      <div class="logo">
        <img src="https://res.cloudinary.com/dcqpver8i/image/upload/v1738303825/rnbijs02uf8lrcrabeic.png" alt="Logo" />
        <p class="font-weight-medium text-subtitle-1">
          <b class="font-weight-black">A</b>sset <br />
          <b class="font-weight-black">R</b>equisition<br />
          <b class="font-weight-black">S</b>ystem
        </p>
      </div>

      <div class="scrollable-content">
        <div class="shared">
          <!-- Regular Routes -->
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/home' }" to="/dashboard/home" elevation="0">
            <v-icon size="x-large" start>mdi-home</v-icon>
            <p class="font-weight-medium">Home Page</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/assets' }" elevation="0" variant="flat" to="/dashboard/assets">
            <v-icon size="x-large" start>mdi-apps</v-icon>
            <p class="font-weight-medium">My Assets</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/my-requests' }" elevation="0" variant="flat" to="/dashboard/my-requests">
            <v-icon size="x-large" start>mdi-email-outline</v-icon>
            <p class="font-weight-medium">My Requests</p>
          </v-btn>
        </div>

        <!-- Admin Routes (Conditional Rendering) -->
        <template v-if="isAdmin">
          <p class="text-h6 font-weight-bold ml-2">Admin</p>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/admin/assets' }" to="/dashboard/admin/assets" elevation="0">
            <v-icon size="x-large" start>mdi-cog</v-icon>
            <p class="font-weight-medium">Manage Assets</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/admin/requests' }" elevation="0" variant="flat" to="/dashboard/admin/requests">
            <v-icon size="x-large" start>mdi-file-document-multiple</v-icon>
            <p class="font-weight-medium">Manage Requests</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/admin/users' }" elevation="0" variant="flat" to="/dashboard/admin/users">
            <v-icon size="x-large" start>mdi-account-group</v-icon>
            <p class="font-weight-medium">Manage Users</p>
          </v-btn>
        </template>
      </div>
    </div>
    <!-- Logout Button at Bottom -->
    <div class="logout-container">
      <v-btn
        class="sidebar-button"
        :class="{ active: route.path === '/dashboard/user/profile' }"
        elevation="0"
        variant="flat"
        to="/dashboard/user/profile"
        >
          <v-icon>mdi-account-edit</v-icon>
          <p class="font-weight-medium">Profile</p>
        </v-btn>
      <v-btn class="sidebar-button" @click="logout" elevation="0" variant="flat">
        <v-icon size="x-large" start>mdi-logout</v-icon>
        <p class="font-weight-medium">Logout</p>
      </v-btn>
    </div>
  </aside>
</template>

<script setup>
import { computed,onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LogoImage from '@/assets/image.png';
import { userService } from '@/services/user';

const route = useRoute();
const router = useRouter();

const userRole = localStorage.getItem('userRole');

const isAdmin = computed(() => {
  return userRole === 'admin' || userRole === 'superadmin';
});

const logout = async () => {
  try {
    await userService.userLogout();
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>

<style scoped>
.profile-section {
  margin: 0 -1.5rem;
}

.profile-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.logout-container {
  margin-top: auto;
}
.sidebar {
  background-color: #ffffff;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.5rem;
  width: 280px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}
.shared{
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.top-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.logo p {
  margin: 0;
  line-height: 1.3;
  font-size: 1.1rem;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin: 0 -1rem;
  padding: 0 1rem;
}

/* Scrollbar Styling */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.sidebar-button {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  width: 90%;
  padding: 0.875rem 1rem;
  margin: 0.25rem 0.25rem;
  border-radius: 8px;
  text-transform: none;
  font-size: 0.95rem;
  color: #4a4a4a;
  transition: all 0.2s ease;
}

.sidebar-button:hover {
  background-color: #f052143b !important;
}

.sidebar-button.active {
  background-color: #f052147a !important;
  color: #fff !important;
  border-left: 4px solid #f05214;
}

.sidebar-button :deep(.v-icon) {
  margin-inline-end: 12px;
}

.logout-container {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin: 0 -1.5rem;
  padding: 1rem 1.5rem;
}

.v-divider {
  opacity: 0.5;
}
</style>