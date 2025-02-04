<template >
  <v-app>
      <RouterView />
  </v-app>
</template>

<script>
import DefaultLayout from "@/layout/DefaultLayout.vue";
import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
    DefaultLayout,
  },
};
</script>
<style>
</style>

