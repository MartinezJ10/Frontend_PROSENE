<template>
  <div class="landing">
        <div class="landing-block nav" >
          <button>
            Crear Usuario
          </button>
          <button>
            Ver Usuarios
          </button>
        </div>
        <div class="landing-block mid">
          <div class="form-container">
            <h2>Crear Usuario</h2>
            <ReusableForm
            :fields="createUsersFields"
            submitButtonText="Crear Usuario"
            :onSubmit="handleUserCreationSubmit"
            />
          </div>
        </div>
        <div class="landing-block notification-bar"></div>
        <div class="landing-block upper-options"></div>
    </div>

</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import ReusableForm from "../components/ReusableForm.vue";

export default {
  name: "ManageUsers",
  components: {
    ReusableForm,
  },
  setup() {
    const router = useRouter();

    const createUsersFields = ref([
      { name: "name", label: "Nombre", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Contraseña", type: "password" },
      { name: "rol", label: "Rol", type: "text" },
    ]);

    //Handle user creation
    const handleUserCreationSubmit = async (formData) => {
      console.log("CREATING USER");
      console.log(formData);
      console.log(localStorage.getItem("jwt"));
      
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/users/create",
          {
            first_name: formData.name,
            last_name: formData.name,
            email: formData.email,
            password: formData.password,
            role_id: formData.rol,
          },{
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );
        console.log("USER CREATED FINE");
        router.push("/landingAdmin");  
      } catch (err) {
        console.error("User creation failed:" || err.message);
      }
    };
          
    return {
      createUsersFields,
      handleUserCreationSubmit,
      router,
    };
  },
};
</script>

<style scoped>
.landing{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 15px;
    grid-row-gap: 15px; 
    width: calc(100% - 30px); 
    height: calc(100vh - 30px);
    margin: 15px;

}
.landing-block{
    border-radius: 20px;
}
.nav{
    grid-area: 1 / 1 / 7 / 2;
    background-color: var(--main-blue);
}
.mid{
    grid-area: 2 / 2 / 7 / 4;
    background-color: var(--accent-blue);
}
.notification-bar{
    grid-area: 2 / 4 / 7 / 5; 
    background-color: var(--main-blue);
}
.upper-options{
    grid-area: 1 / 2 / 2 / 5; 
    background-color: white;
}
.form-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    height: 100%;
    width: 100%;
}

@media (max-width: 850px) {
    .landing {
        grid-template-columns: 1fr; 
        grid-template-rows: auto;
    }   
    .landing-block{
        grid-area: unset; 
    }

}

</style>