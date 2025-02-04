<template>
    <div class="asset">
      <div class="card-header">
        <img id="asset-img" :src="asset.image_url|| asset.link" alt="Asset image" />
        <h2 class="font-weight-medium">{{ asset.name }}</h2>
      </div>
      <div class="card-body">
        <p class="font-weight-medium">{{ asset.description }}</p>
      </div>
      <div class="card-footer">
        <button
          class="btn"
          :class="{ 'btn-success': isRequested }"
          @click="handleRequest"
        >
          <span v-html="buttonText"></span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { assetService } from "@/services/asset";
  
  const props = defineProps({
    asset: Object,
  });
  
  const emit = defineEmits(['asset-requested']); 
  
  const buttonText = ref("Request");
  const isRequested = ref(false);
  
  const handleRequest = async () => {
    if (!isRequested.value) {
      try {
        await assetService.assetRequest(props.asset.id);
  
        buttonText.value = "Requested &#10003;"; 
        isRequested.value = true;
  
        emit('asset-requested');
  
        
        setTimeout(() => {
          buttonText.value = "Request";
          isRequested.value = false;
        }, 900);
      } catch (error) {
        
        alert("Request failed: ");
      }
    }
  };
  </script>
  
<style scoped>
  .asset {
    width: 280px;
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
    justify-content: end;
    margin-bottom: 1rem;
  }
  
  .card-body {
    margin: 0;
  }
  
  #asset-img {
    width: 90%;
    height: 200px;
    border-radius: 3px;
  }
  
  .btn {
    padding: 8px;
    width: 45%;
    border: none;
    border-radius: 5px;
    background-color: #f05414;
    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.2s ease;
    box-shadow: 2px 3px 0px rgba(0, 0, 0, 0.2);
  }
  
  .btn:hover {
    transform: translateY(-0.13em);
    box-shadow: 4px 5px 2px rgba(0, 0, 0, 0.3);
  }
  
  .btn:active {
    transform: translateY(0);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    background-color: #03490f;
  }
  
  .btn-success {
    background-color: #03490f;
    color: #ffffff;
  }
</style>