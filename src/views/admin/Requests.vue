<template>
    <v-container>
      <!-- Vuetify Tabs -->
      <v-tabs v-model="activeTab">
        <v-tab value="pending">Pending Requests</v-tab>
        <v-tab value="approved">All Requests</v-tab>
      </v-tabs>
  
      <!-- Tab Content -->
      <v-window v-model="activeTab">
        <v-window-item value="pending">
          <PendingRequests />
        </v-window-item>
        <v-window-item value="approved">
            <AllRequests/>
        </v-window-item>
      </v-window>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import PendingRequests from '@/components/PendingRequests.vue';
  import AllRequests from '@/components/AllRequets.vue';
  const activeTab = ref('pending');
  </script>
  
  <style scoped>
  </style>