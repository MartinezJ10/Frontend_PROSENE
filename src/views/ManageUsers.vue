<template>
  <div class="card-container">
    <div v-for="(user, index) in userInfo" :key="index" class="user-card">
     
        <div class="user-card-header">
          <p><strong> {{ user.first_name }} {{ user.last_name }}</strong></p>
          <div class="status">
            <div class="status-circle"></div>
            <span>Inactivo</span>
          </div>
        </div> 
        <div class="user-card-body">
          <p> {{ user.email }}</p>
          <p> {{ user.role_id }}</p>
          <p>Creado el 1/31/2025 10:25 am</p>
        </div>
      </div>
  
  </div>
    
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';

export default {
  name: "ManageUsers",

  setup() {
    const router = useRouter();
        const userInfo = ref({});
        const retrieveUsers = async () => {

            try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/users/all",
                {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                }
                }
            );
            userInfo.value = response.data;
            } catch (err) {
                console.error("User Listing Failed:" || err.message);
            }
        };
        
        onMounted(() => {
            retrieveUsers();
        })

    return {
      router,
      userInfo,
    };
  },
};
</script>

<style scoped> 
.card-container{
  display: flex;
  margin: 2rem;
  flex-direction: column;
  justify-content: center;
}
.user-card{
  border: 2px solid var(--obscure);
  background-color: var(--accent-yellow);
  border-radius: 15px;
  margin: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;

}
.user-card p{
  margin: 0;
}
.user-card-body p {
  display: flex;
  align-self: flex-start;

}
.user-card-header{
  display: flex;
  justify-content: space-between;
}
.status{
  display: flex;
  align-items: center;
  justify-items: center;
}
.status-circle{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  margin-right: 5px;
}
</style>