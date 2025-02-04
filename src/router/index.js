import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/shared/HomeView.vue';
import AssetsView from '../views/shared/AssetsView.vue';
import LoginView from '../views/shared/LoginView.vue';
import RequestsView from '@/views/shared/RequestsView.vue';
import AdminAssets from '@/views/admin/Assets.vue';
import AdminRequests from '@/views/admin/Requests.vue';
import AdminUsers from '@/views/admin/Users.vue';
import UsersDetails from '@/views/admin/UsersDetails.vue';
import UserProfile from '@/views/shared/UserProfile.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: () => import('../layout/DefaultLayout.vue'),
      children: [
        { path: 'home', name: 'Home', component: HomeView },
        { path: 'assets', name: 'Assets', component: AssetsView },
        { path: 'my-requests', name: 'Requests', component: RequestsView },
        { path: 'user/profile', name: 'UserProfile', component: UserProfile },

        // Admin-only routes (nested under the default layout)
        { path: 'admin/assets', name: 'AdminAssets', component: AdminAssets, meta: { requiresAdmin: true } },
        { path: 'admin/requests', name: 'AdminRequests', component: AdminRequests, meta: { requiresAdmin: true } },
        { path: 'admin/users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAdmin: true } },
        { path: 'admin/users/:id', name: 'UsersDetails', component: UsersDetails},
      ],
    },
  ],
});

// Route guard to check for admin access
router.beforeEach((to, from, next) => {
  // Get the user's role from localStorage (or your state management library)
  const userRole = localStorage.getItem('userRole');

  // Check if the route requires admin access
  if (to.meta.requiresAdmin) {
    // Allow access if the user is an admin or superadmin
    if (userRole === 'admin' || userRole === 'superadmin') {
      next(); // Proceed to the route
    } else {
      // Redirect to login or a "not authorized" page
      next({ name: 'Login' }); // Or redirect to a "403 Forbidden" page
    }
  } else {
    // Allow access to non-admin routes
    next();
  }
});

export default router;