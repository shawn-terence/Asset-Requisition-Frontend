<template>
    <div class="layout">
      <div :class="['maincont', isSidebar ? 'sidebar-layout' : 'navbar-layout']">
        <!-- Conditional Rendering of Sidebar or Navbar -->
        <Sidebar v-if="isSidebar" />
        <Navbar v-else />
        <v-main class="content">
          <slot />
          <RouterView />
        </v-main>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/Navbar.vue";
  import Sidebar from "@/components/Sidebar.vue";
  import { RouterView } from "vue-router";
  
  export default {
    components: {
      Navbar,
      Sidebar,
    },
    data() {
      return {
        isSidebar: window.innerWidth >= 1024, // Sidebar for large viewports
      };
    },
    methods: {
      handleResize() {
        this.isSidebar = window.innerWidth >= 1024;
      },
    },
    mounted() {
      this.handleResize(); // Set correct layout on mount
      window.addEventListener("resize", this.handleResize); // Update layout on resize
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.handleResize); // Cleanup event listener
    },
  };
  </script>
  
  <style scoped>
  .layout {
    display: flex;
    flex-direction: column;
    padding-right: 10px;
    height: fit-content;
    background-color: rgba(240, 240, 240, 0.849);
  }
  
  .maincont {
    display: flex;
    min-height: 95vh;
  }
  
  .sidebar-layout {
    flex-direction: row; 

  }
  
  .navbar-layout {
    flex-direction: column;
    margin-bottom: 1rem;
  }
  
  .content {
    width: 80vw;
    margin: 1rem;
    padding: 1rem;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-height:fit-content;
  }
  
  .footer {
    text-align: center;
    padding: 1rem;
    background: #333;
    color: #fff;
  }
  @media(max-width:1020px) {
    .content{
      width: 95vw;
      position: relative;
      top: 4rem;
    }
    
  }
  </style>
  