<template>
  <div class="profile-container">
    <!-- Display User Data Card -->
    <div class="card profile-card">
      <div class="card-header">
        <div class="header-content">
          <div class="avatar-section">
            <!-- v-avatar is retained -->
            <v-avatar class="profile-avatar" size="140">
              <v-img :src="userData.profile_picture_url || '/default-avatar.png'">
                <template v-slot:placeholder>
                  <v-icon size="64" color="grey-lighten-2">mdi-account</v-icon>
                </template>
              </v-img>
            </v-avatar>
            <div class="name-email">
              <h1 class="user-name">{{ userData.first_name }} {{ userData.last_name }}</h1>
              <p class="user-email">{{ userData.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card-body profile-body">
        <div class="input-grid">
          <div class="input-group">
            <label for="firstName">First Name</label>
            <input id="firstName" type="text" :value="userData.first_name" readonly class="light-input" />
          </div>
          <div class="input-group">
            <label for="lastName">Last Name</label>
            <input id="lastName" type="text" :value="userData.last_name" readonly class="light-input" />
          </div>
          <div class="input-group">
            <label for="email">Email</label>
            <input id="email" type="text" :value="userData.email" readonly class="light-input" />
          </div>
          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input id="phone" type="text" :value="userData.phone_number" readonly class="light-input" />
          </div>
          <div class="input-group">
            <label for="jobRole">Job Role</label>
            <input id="jobRole" type="text" :value="userData.role" readonly class="light-input" />
          </div>
          <div class="input-group">
            <label for="department">Department</label>
            <input id="department" type="text" :value="userData.department" readonly class="light-input" />
          </div>
        </div>
      </div>

      <div class="card-actions profile-actions">
        <button class="edit-btn" @click="dialog = true">
          Edit Profile
        </button>
        <button class="password-btn" @click="passwordDialog = true">
          Change Password
        </button>
      </div>
    </div>

    <!-- Edit Profile Modal (Plain HTML Modal) -->
    <div class="modal" v-if="dialog">
      <div class="modal-content edit-dialog">
        <div class="dialog-header">
          <h2>Edit Profile</h2>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="updateProfile">
            <div class="avatar-upload">
              <!-- v-avatar remains for the avatar preview -->
              <v-avatar size="120" class="edit-avatar">
                <template v-if="profilePictureUrl || userData.profile_picture_url">
                  <img :src="profilePictureUrl || userData.profile_picture_url" alt="Edit Avatar" class="avatar-img" />
                </template>
                <template v-else>
                  <i class="mdi mdi-account avatar-icon"></i>
                </template>
              </v-avatar>
              <input
                type="file"
                @change="previewImage"
                accept="image/*"
                class="file-input"
              />
            </div>
            <div class="form-grid">
              <div class="input-group">
                <label for="editFirstName">First Name</label>
                <input id="editFirstName" type="text" v-model="formData.first_name" class="light-input" />
              </div>
              <div class="input-group">
                <label for="editLastName">Last Name</label>
                <input id="editLastName" type="text" v-model="formData.last_name" class="light-input" />
              </div>
              <div class="input-group">
                <label for="editPhone">Phone Number</label>
                <input id="editPhone" type="text" v-model="formData.phone_number" class="light-input" />
              </div>
            </div>
            <div class="dialog-actions">
              <button type="submit" @click="updateProfile" class="save-btn">Save Changes</button>
              <button type="button" class="cancel-btn" @click="dialog = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Password Change Modal (Plain HTML Modal) -->
    <div class="modal" v-if="passwordDialog">
      <div class="modal-content password-dialog">
        <div class="dialog-header">
          <h2>Change Password</h2>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleChangePassword">
            <div class="input-group">
              <label for="oldPassword">Old Password</label>
              <input id="oldPassword" type="password" v-model="oldPassword" class="light-input" />
            </div>
            <div class="input-group">
              <label for="newPassword">New Password</label>
              <input id="newPassword" type="password" v-model="newPassword" class="light-input" />
            </div>
            <div class="input-group">
              <label for="confirmNewPassword">Confirm New Password</label>
              <input id="confirmNewPassword" type="password" v-model="confirmNewPassword" class="light-input" />
            </div>
            <div class="dialog-actions">
              <button type="submit" class="save-btn">Update Password</button>
              <button type="button" class="cancel-btn" @click="passwordDialog = false">Close</button>
            </div>
            <div v-if="confirmNewPassword && newPassword !== confirmNewPassword" class="error-message">
              Passwords do not match
            </div>
            <div v-if="message" :style="{ color: messageColor }" class="message">
              {{ message }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { userService } from '@/services/user';

// User Data
const userData = ref({
  profile_picture_url: '',
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  department: '',
  role: '',
  created_at: '',
});

// Dialog and Form Data
const dialog = ref(false);
const passwordDialog = ref(false);
const formData = ref({
  first_name: '',
  last_name: '',
  phone_number: '',
});
const profilePicture = ref(null);
const profilePictureUrl = ref('');
const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const message = ref('');
const messageColor = ref('');
const loading = ref(false);

// Fetch User Data
const fetchUserProfile = async () => {
  try {
    const response = await userService.userDetails();
    userData.value = {
      profile_picture_url: response.profile_picture_url,
      first_name: response.first_name,
      last_name: response.last_name,
      email: response.email,
      phone_number: response.phone_number,
      department: response.department,
      role: response.role,
      created_at: response.created_at,
    };
    // Initialize form data
    formData.value = {
      first_name: response.first_name,
      last_name: response.last_name,
      phone_number: response.phone_number,
    };
  } catch (err) {
    console.error(err);
  }
};

// Image Preview
const previewImage = (event) => {
  const file = event.target.files[0]; // Get the first file
  if (file) {
    console.log("Selected file:", file); // Debugging log
    profilePicture.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePictureUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Update Profile
const updateProfile = async () => {
  message.value = '';
  loading.value = true;
  try {
    const formDataObj = new FormData();
    formDataObj.append('first_name', formData.value.first_name);
    formDataObj.append('last_name', formData.value.last_name);
    formDataObj.append('phone_number', formData.value.phone_number);
    if (profilePicture.value) {
      formDataObj.append('profile_picture', profilePicture.value);
    }
    const updatedUser = await userService.updateProfile(formDataObj);
    console.log(updatedUser)
    userData.value = {
      ...userData.value,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone_number: updatedUser.phone_number,
      profile_picture_url: updatedUser.profile_picture_url,
    };
    message.value = 'Profile updated successfully!';
    dialog.value = false;
  } catch (err) {
    message.value = err.message || 'Failed to update profile';
  } finally {
    loading.value = false;
  }
};

// Handle Change Password
const handleChangePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    message.value = "New password and confirm password do not match.";
    messageColor.value = "red";
    return;
  }

  if (newPassword.value.length < 8) {
    message.value = "New password must be at least 8 characters long.";
    messageColor.value = "red";
    return;
  }

  try {
    await userService.updatePassword({ password: newPassword.value });

    message.value = "Password updated successfully!";
    messageColor.value = "green";

    // Clear inputs after successful update
    oldPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";

    passwordDialog.value = false; // Close dialog if applicable
  } catch (err) {
    message.value = err.response?.data?.error || "Failed to update password.";
    messageColor.value = "red";
  }
};

// Format Date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Fetch data on mount
onMounted(fetchUserProfile);
</script>

<style scoped>
/* Container */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

/* Card */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

/* Header */
.card-header {
  background: #f8f9fa;
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
}
.header-content {
  max-width: 800px;
  margin: 0 auto;
}
.avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.profile-avatar {
  border: 3px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.name-email {
  flex: 1;
}
.user-name {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3436;
}
.user-email {
  font-size: 1rem;
  color: #636e72;
}

/* Body */
.card-body {
  padding: 2rem;
}
.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.input-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3436;
}
/* Light grey background for inputs */
.light-input {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
}

/* Actions */
.card-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}
.action-btn {
  text-transform: none;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}
.edit-btn {
  background-color:#f05214 ;
  color: #fff;
  font-weight: 600;
  width: 150px;
  padding: 10px;
  border-radius: 8px;
}
.password-btn {
  background-color:#f05214 ;
  color: #ffffff;
  border: 1px solid #e9ecef;
  width: 200px;
  padding: 10px;
  font-weight: 600;
  border-radius: 8px;
}

/* Modal (Plain HTML) */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  overflow: hidden;
}
.edit-dialog,
.password-dialog {
  padding: 1.5rem;
}
.dialog-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}
.dialog-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3436;
}
.dialog-body {
  padding: 1.5rem;
}
.avatar-upload,
.avatar-section,
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}
.edit-avatar {
  border: 3px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.file-input {
  padding: 0.5rem;
}
.form-grid {
  display: grid;
  gap: 1.5rem;
}
.dialog-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
.save-btn {
  background-color: #4a90e2;
  color: #fff;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.cancel-btn {
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
}

/* Error and message */
.error-message {
  color: red;
  margin-top: 1rem;
}
.message {
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  .card-body {
    padding: 1rem;
  }
  .action-btn {
    width: 100%;
  }
  .dialog-actions {
    flex-direction: column;
  }
}
@media (min-width: 1024px) {
  .input-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
