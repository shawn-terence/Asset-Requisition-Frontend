<template>
  <div class="page">
    <v-expand-x-transition>
      <div class="login-container" v-show="expand">
        <div class="login-header">
          <v-img class="login-image" :src="image" />
          <h3 class="title">ARS</h3>
        </div>
        <form class="login-form" @submit.prevent="handleLogin">
          <p class="paragraph">Login to your account</p>
          
          <div class="input-group">
            <input v-model="email" required placeholder="Email" id="email" type="email" />
          </div>

          <div class="input-group">
            <input v-model="password" required placeholder="Password" id="password" type="password" />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? "Logging in..." : "Login" }}
          </button>

          <v-progress-linear v-if="loading" color="orange-darken-2" indeterminate class="mt-3"></v-progress-linear>
          <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>

          <div class="info-container">
            <div class="info-box">
              <h4>Admin Login</h4>
              <p><b>Email:</b> johndoe@example.com</p>
              <p><b>Password:</b> password123</p>
            </div>
            <div class="info-box">
              <h4>Employee Login</h4>
              <p><b>Email:</b> employee3@example.com</p>
              <p><b>Password:</b> password123</p>
            </div>
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </v-expand-x-transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userService } from "@/services/user";
import image from "@/assets/image.png";

const expand = ref(false);
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const statusMessage = ref("");
const router = useRouter();

onMounted(() => {
  expand.value = true;
});

const handleLogin = async () => {
  error.value = "";
  statusMessage.value = "";
  loading.value = true;

  const statusSteps = [
    "Authenticating...",
    "Accessing database...",
    "Validating credentials...",
    "Initiating handshake protocol...",
    // "Encrypting payload with AES-256...",
    // "Synchronizing distributed data layers...",
    // "Optimizing response cache...",
    // "Verifying OAuth 2.0 tokens...",
    // "Compiling GraphQL query AST...",
    // "Routing through edge CDN nodes...",
    // "Allocating cloud compute resources...",
    // "Performing CRON job validation...",
    // "Finalizing TLS 1.3 negotiation...",
    // "Generating JWT session keys...",
    // "Deploying serverless functions...",
    // "Balancing API gateway load...",
    // "Parsing X.509 certificates...",
    "Upstreaming WebSocket packets...",
    "Conducting CSP policy audit...",
    "Resolving DNS-over-HTTPS...",
    "Compressing asset bundles...",
    "Mounting EBS volumes...",
    "Activating hot-reload watchers...",
    "Triangulating geolocation data...",
    "Validating CORS preflight...",
    "Brewing fresh machine learning models...", // 😉
    "Initializing blockchain nonce...",
    "Orchestrating Kubernetes pods...",
    "Establishing secure session...",
  ];

  let stepIndex = 0;
  const statusInterval = setInterval(() => {
    if (stepIndex < statusSteps.length) {
      statusMessage.value = statusSteps[stepIndex];
      stepIndex++;
    }
  }, 2000);

  try {
    const response = await userService.userLogin({
      email: email.value,
      password: password.value,
    });

    clearInterval(statusInterval);
    statusMessage.value = "Login successful!";
    setTimeout(() => {
      loading.value = false;
      router.push("/dashboard/home");
    }, 1000);
    return response;
  } catch (err) {
    clearInterval(statusInterval);
    loading.value = false;
    error.value = "Login failed. Incorrect email and/or password";
    statusMessage.value = "";
  }
};
</script>

<style scoped>
/* Page Styling */
.page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f48e;
}

/* Login Container */
.login-container {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  max-width: 420px;
  padding: 1rem;
  width: 100%;
  text-align: center;
}

/* Login Header */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.login-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

/* Form Styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.paragraph {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

/* Input Fields */
.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.3s ease;
}

.input-group input:focus {
  border-color: #f05414;
  outline: none;
}

/* Login Button */
button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #f05414;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background: #e04810;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Status Messages */
.status-message {
  color: #f05414;
  font-weight: 500;
}

.error-message {
  color: red;
  font-weight: 500;
}

/* Login Info Section */
.info-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  gap: 10px;
}

.info-box {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  flex: 1;
  text-align: left;
}

.info-box h4 {
  margin-bottom: 5px;
  color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    padding: 30px;
  }

  .title {
    font-size: 1.8rem;
  }

  button {
    font-size: 0.9rem;
    padding: 10px;
  }

  .info-container {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
  }

  .title {
    font-size: 1.6rem;
  }

  .paragraph {
    font-size: 0.9rem;
  }

  .input-group input {
    padding: 10px;
    font-size: 0.9rem;
  }

  button {
    font-size: 0.85rem;
    padding: 10px;
  }
}
</style>
