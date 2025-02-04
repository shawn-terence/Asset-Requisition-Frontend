<template>
  <v-app-bar elevation="1" prominent>
    <v-app-bar-nav-icon
      variant="text"
      color="black"
      @click.stop="toggleDrawer"
    ></v-app-bar-nav-icon>
    <div class="logo">
      <img class="logo-image" src="https://res.cloudinary.com/dcqpver8i/image/upload/v1738303825/rnbijs02uf8lrcrabeic.png" alt="Logo" />
      <v-toolbar-title>ARS</v-toolbar-title>
    </div>
    <v-spacer></v-spacer>
  </v-app-bar>

  <v-navigation-drawer 
    v-model="drawer" 
    app 
    temporary
    color="white"
  >
    <div class="nav-container">
      <div class="scrollable-content">
        <div class="shared">
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/home' }" to="/dashboard/home" elevation="0">
            <v-icon size="x-large" start>mdi-home</v-icon>
            <p class="font-weight-medium">Home Page</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/assets' }" elevation="0" to="/dashboard/assets">
            <v-icon size="x-large" start>mdi-apps</v-icon>
            <p class="font-weight-medium">My Assets</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/my-requests' }" elevation="0" to="/dashboard/my-requests">
            <v-icon size="x-large" start>mdi-email-outline</v-icon>
            <p class="font-weight-medium">My Requests</p>
          </v-btn>
        </div>

        <div v-if="isAdmin" class="admin">
          <p class="text-h6 font-weight-bold ml-2">Admin</p>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/admin/assets' }" to="/dashboard/admin/assets" elevation="0">
            <v-icon size="x-large" start>mdi-cog</v-icon>
            <p class="font-weight-medium">Manage Assets</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/admin/requests' }" elevation="0" to="/dashboard/admin/requests">
            <v-icon size="x-large" start>mdi-file-document-multiple</v-icon>
            <p class="font-weight-medium">Manage Requests</p>
          </v-btn>
          <v-btn class="sidebar-button" :class="{ active: route.path === '/dashboard/admin/users' }" elevation="0" to="/dashboard/admin/users">
            <v-icon size="x-large" start>mdi-account-group</v-icon>
            <p class="font-weight-medium">Manage Users</p>
          </v-btn>
        </div>
      </div>

      <div class="logout-container">
        <v-btn
          class="sidebar-button"
          :class="{ active: route.path === '/dashboard/user/profile' }"
          elevation="0"
          to="/dashboard/user/profile"
        >
          <v-icon>mdi-account-edit</v-icon>
          <p class="font-weight-medium">Profile</p>
        </v-btn>
        <v-btn class="sidebar-button" @click="logout" elevation="0">
          <v-icon size="x-large" start>mdi-logout</v-icon>
          <p class="font-weight-medium">Logout</p>
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import image from '@/assets/image.png';
import { userService } from '@/services/user';

const drawer = ref(false);
const route = useRoute();
const router = useRouter();
const userRole = localStorage.getItem('userRole');

const isAdmin = computed(() => {
  return userRole === 'admin' || userRole === 'superadmin';
});

const logout = async () => {
  const timeout = setTimeout(() => {
    router.push({ name: 'Login' });
  }, 4000);

  try {
    await userService.userLogout();
    clearTimeout(timeout);
    router.push({ name: 'Login' });
  } catch (error) {
    clearTimeout(timeout);
    router.push({ name: 'Login' });
  }
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>

<style scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  width: 50px;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.shared {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.logout-container {
  border-top: 1px solid #eee;
  padding: 16px 8px;
  margin-top: auto;
}

.sidebar-button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 200px;
  padding: 12px;
  margin: 4px 0;
  border-radius: 8px;
  text-transform: none;
  color: #4a4a4a;
  transition: background-color 0.2s ease;
}

.sidebar-button:hover {
  background-color: #f052143b;
}

.sidebar-button.active {
  background-color: #f052147a;
  color: #fff;
  border-left: 4px solid #f05214;
}

.sidebar-button .v-icon {
  margin-right: 12px;
}

.admin {
  margin-top: 8px;
  padding-bottom: 8px;
}
</style>