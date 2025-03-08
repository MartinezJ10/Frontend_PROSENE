<template>
  <div>
    <div class="upper-container">
      <h1>Lista de Usuarios</h1>
      <button class="rounded-button" @click="showModal = true">Crear Usuario</button>
      <FormModal title="Crear Usuario" v-model="showModal" :reusableForm="reusableFormComponent" :formProps="{
        fields: createUsersFields,
        submitButtonText: 'Crear Usuario',
        onSubmit: handleUserCreationSubmit
      }">
      </FormModal>
    </div>

    <div class="card-container">
      <div v-for="(user, index) in userInfo" :key="index" class="user-card"
        @click="router.push(`/detailsUser/${user.idusuario}`)">
        <div class="user-card-header">
          <p><strong> {{ user.email }}</strong></p>
          <div class="status">
            <div class="status-circle" :style="{ backgroundColor: user.isActive ? 'green' : 'red' }"></div>
            <span v-if="user.isActive">Activo</span>
            <span v-else-if="!user.isActive">Inactivo</span>
          </div>
        </div>
        <div class="user-card-body">
          <p v-if="user.role_id === 1">Rol: Administrador</p>
          <p v-else-if="user.role_id === 2">Rol: Empleado/Colaborador</p>
          <p v-else-if="user.role_id === 3">Rol: Estudiante</p>
          <p>{{ user.centroregional.centroregional }}</p>
        </div>
      </div>
    </div>
    <Mensaje v-if="showMessage" :mensaje="messageContent" :tipo="messageType" :visible="showMessage"
      @update:visible="showMessage = false" />
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';
import FormModal from "../components/FormModal.vue";
import ReusableForm from "../components/ReusableForm.vue";
import Mensaje from "../components/Mensaje.vue";

export default {
  name: "ManageUsers",
  components: {
    FormModal,
    ReusableForm,
    Mensaje,
  },
  setup() {
    const showModal = ref(false);
    const showMessage = ref(false);
    const messageContent = ref('');
    const messageType = ref('');
    const router = useRouter();
    const userInfo = ref({});
    const centrosRegionales = ref([]);
    const roles = ref([]);
    const currentUserRole = ref(null); // Track the current user's role

    const errorLog = async (err) => {
      console.error("ERROR IN REQUEST:", {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config
      });
    };

    // Retrieve the current user's role from the JWT token
    const getCurrentUserRole = () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        currentUserRole.value = payload.role_id; // Assuming the role_id is stored in the token
      }
    };

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

    const retrieveCentrosRegionales = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/varios/centros",
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );
        centrosRegionales.value = response.data.map((centro) => ({
          value: centro.idcentroregional,
          label: centro.centroregional
        }));
      } catch (err) {
        errorLog(err);
      }
    };

    const retrieveRoles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/varios/roles",
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );

        roles.value = response.data.map((rol) => ({
          value: rol.id,
          label: rol.name
        }));
      } catch (err) {
        errorLog(err);
      }
    };

    // Filter roles based on the current user's role
    const filterRoles = () => {
      if (currentUserRole.value === 2) { // Empleado
        return roles.value.filter(role => role.value === 3); // Only allow Estudiantes
      } else if (currentUserRole.value === 1) { // Administrador
        return roles.value.filter(role => role.value === 2 || role.value === 3); // Allow Empleados and Estudiantes
      }
      return []; // Default to no roles if the current user's role is unknown
    };

    onMounted(async () => {
      getCurrentUserRole(); // Get the current user's role
      await retrieveUsers();
      await retrieveRoles();
      await retrieveCentrosRegionales();

      // Initialize createUsersFields with filtered roles
      createUsersFields.value = [
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Contraseña", type: "password" },
        {
          name: "roles", label: "Roles", type: "select", options: filterRoles()
        },
        {
          name: "centroregional", label: "Centro Regional", type: "select", options: centrosRegionales.value
        },
      ];
    });

    const createUsersFields = ref([]);

    const handleUserCreationSubmit = async (formData) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/users/create",
          {
            email: formData.email,
            password: formData.password,
            role_id: formData.roles,
            idcentroregional: formData.centroregional,
          }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          }
        }
        );
        await retrieveUsers(); // Refresh the user list

        console.log("USER CREATED FINE");
        showModal.value = false;
        messageContent.value = 'Usuario creado con éxito';
        messageType.value = 'exito';
        showMessage.value = true;
      } catch (err) {
        console.error("User creation failed:" || err.message);
        messageContent.value = 'Error al crear el usuario';
        messageType.value = 'error';
        showMessage.value = true;
        showModal.value = false;
      }
    };

    const reusableFormComponent = ReusableForm;

    return {
      router,
      userInfo,
      createUsersFields,
      handleUserCreationSubmit,
      showModal,
      reusableFormComponent,
      showMessage,
      messageContent,
      messageType,
    };
  },
};
</script>

<style scoped>
.card-container {
  display: flex;
  margin: 2rem;
  flex-direction: column;
  justify-content: center;
}


.upper-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem
}

.upper-container .rounded-button {
  position: relative;
  width: auto;
  height: 4rem;
}

.user-card {
  border: 1px solid var(--obscure);
  background-color: var(--accent-yellow);
  border-radius: 15px;
  margin: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;

}

.user-card:hover {
  cursor: pointer;
  transform: scale(1.01);
  transition: transform 0.2s ease;
}


.user-card p {
  margin: 0;
}

.user-card-body p {
  display: flex;
  align-self: flex-start;

}

.user-card-header {
  display: flex;
  justify-content: space-between;
}

.status {
  display: flex;
  align-items: center;
  justify-items: center;
}

.status-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  margin-right: 5px;
}
</style>