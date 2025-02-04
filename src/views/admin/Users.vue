<template>
    <div>
      <button color="primary" class="new-user-btn" @click="showDialog = true">
        Add New User
      </button>
  
      <v-data-table :headers="headers" :items="users" class="data-table">
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
  
        <!-- Add the 'More Details' column with a link icon -->
        <template v-slot:item.more_details="{ item }">
          <v-btn
            icon
            @click="goToUserDetails(item.id)"
            class="detail-btn"
          >
            <v-icon >mdi mdi-dots-horizontal</v-icon> 
          </v-btn>
        </template>
      </v-data-table>
  
      <v-dialog v-model="showDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <p class="text-center font-weight-bold ">Add New User</p>
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="registerUser" class="form">
              <p class="message">Register a new user below.</p>

              <label>
                <input
                  class="input"
                  type="text"
                  id="first_name"
                  v-model="newUser.first_name"
                  required
                />
                <span>First Name</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="last_name"
                  v-model="newUser.last_name"
                  required
                />
                <span>Last Name</span>
              </label>

              <label>
                <input
                  class="input"
                  type="email"
                  id="email"
                  v-model="newUser.email"
                  required
                />
                <span>Email</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="phone_number"
                  v-model="newUser.phone_number"
                  required
                />
                <span>Phone Number</span>
              </label>

              <label>
                <input
                  class="input"
                  type="text"
                  id="department"
                  v-model="newUser.department"
                  required
                />
                <span>Department</span>
              </label>

              <label>
                <select
                  class="input"
                  id="role"
                  v-model="newUser.role"
                  required
                >
                  <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                </select>
                <span>Role</span>
              </label>

              <label>
                <input
                  class="input"
                  type="password"
                  id="password"
                  v-model="newUser.password"
                />
                <span>Password</span>
              </label>

              <div class="footer">
                <button type="submit" class="submit" @click="registerUser">Register</button>
                <button type="button" class="submit-cancel" @click="showDialog = false">Cancel</button>
              </div>
            </form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
<script setup>
  import { ref, onMounted } from "vue";
  import { userService } from "@/services/user";
  import { useRouter } from 'vue-router';
  
  const users = ref([]);
  const showDialog = ref(false);
  const router = useRouter();
  
  const newUser = ref({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    department: "",
    role: "",
    password: "password123", // Preset password
  });
  
  const roles = ["admin", "employee", "superadmin"];
  
  const headers = [
    { title: "First Name", key: "first_name" },
    { title: "Last Name", key: "last_name" },
    { title: "Email", key: "email" },
    { title: "Phone Number", key: "phone_number" },
    { title: "Department", key: "department" },
    { title: "Role", key: "role" },
    { title: "Date Joined", key: "created_at" },
    { title: "More Details", key: "more_details" }, // New column for the icon
  ];
  
  onMounted(async () => {
    await fetchUsers();
  });
  
  const fetchUsers = async () => {
    try {
      users.value = await userService.allUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  const registerUser = async () => {
    try {
      console.log({...newUser.value});
      await userService.userRegister({...newUser.value});
      showDialog.value = false;
      await fetchUsers();
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);;
    }
    fetchUsers();
  };
  
  const goToUserDetails = (userId) => {
    router.push({ name: "UsersDetails", params: { id: userId } }); // Navigate to user details page
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
</script>
<style  scoped>
.detail-btn{
  box-shadow: none;
}
.detail-btn:hover{
  box-shadow: none;
  background-color: transparent;
}
.detail-btn:focus{
  box-shadow: none;
  background-color: transparent;
}
.detail-btn:active{
  box-shadow: none;
  background-color: transparent;
}
.data-table{
  border: .5px solid rgba(0, 0, 0, 0.151);
  padding: 0;
  border-radius: 15px;
}
.form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #3b383828;
  position: relative;
  background-color: #ffffff;
}
.new-user-btn{
  margin: 1rem;
  font-weight: 800;
  color: rgb(255, 255, 255);
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  border-radius: 10px;

}
.form label {
  position: relative;
}

.form label .input {
  color: #000;
  width: 100%;
  padding: 20px 5px 5px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
  font-size: medium;
}

.form label .input + span {
  color: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 10px;
  top: 0px;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 12.5px;
  font-size: 0.9em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  color: #00bfff;
  top: 0px;
  font-size: 0.7em;
  font-weight: 600;
}

.input-field {
  border-radius: 0.5rem;
}

.submit {
  border: none;
  outline: none;
  padding: 12px 24px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  background-color: #f05414;
  cursor: pointer;
  width: 30%;
}
.submit-cancel{
  border: none;
  outline: none;
  padding: 12px 24px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  background-color: #c71010;
  cursor: pointer;
  width: 30%;
}

.submit:hover {
  background-color: #259fe6;
}
.footer{
  display: flex;
  justify-content: space-around;
}
</style>