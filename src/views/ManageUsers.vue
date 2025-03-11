<template>
  <div class="manage-users-page">
    <!-- Contenedor superior: Título y botón de creación -->
    <div class="page-header">
      <h1 class="page-title">Lista de Usuarios</h1>
      <button class="rounded-button" @click="showModal = true">Crear Usuario</button>
    </div>

    <!-- Modal para crear usuario -->
    <FormModal
      title="Crear Usuario"
      v-model="showModal"
      :reusableForm="reusableFormComponent"
      :formProps="{
        fields: createUsersFields,
        submitButtonText: 'Crear Usuario',
        onSubmit: handleUserCreationSubmit
      }"
    />

    <!-- Contenedor de tarjetas de usuarios -->
    <div class="card-container">
      <div
        v-for="(user, index) in userInfo"
        :key="index"
        class="user-card"
        @click="router.push(`/detailsUser/${user.idusuario}`)"
      >
        <div class="user-card-header">
          <p class="user-email"><strong>{{ user.email }}</strong></p>
          <div
            class="status"
            :class="{
              'status-active': user.isActive,
              'status-inactive': !user.isActive
            }"
          >
            <div class="status-circle"></div>
            <span v-if="user.isActive">Activo</span>
            <span v-else>Inactivo</span>
          </div>
        </div>
        <div class="user-card-body">
          <p class="user-role">
            Rol:
            <span v-if="user.role_id === 1">Administrador</span>
            <span v-else-if="user.role_id === 2">Empleado/Colaborador</span>
            <span v-else-if="user.role_id === 3">Estudiante</span>
          </p>
          <p class="user-center">{{ user.centroregional.centroregional }}</p>
        </div>
      </div>
    </div>

    <!-- Mensaje de notificación -->
    <Mensaje
      v-if="showMessage"
      :mensaje="messageContent"
      :tipo="messageType"
      :visible="showMessage"
      @update:visible="showMessage = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import FormModal from "../components/FormModal.vue";
import ReusableForm from "../components/ReusableForm.vue";
import Mensaje from "../components/Mensaje.vue";

export default {
  name: "ManageUsers",
  components: {
    FormModal,
    ReusableForm,
    Mensaje
  },
  setup() {
    const router = useRouter();
    const showModal = ref(false);
    const showMessage = ref(false);
    const messageContent = ref("");
    const messageType = ref("");
    const userInfo = ref([]);
    const centrosRegionales = ref([]);
    const roles = ref([]);
    const currentUserRole = ref(null);

    const errorLog = async (err) => {
      console.error("ERROR IN REQUEST:", {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config
      });
    };

    // Obtiene el rol actual del usuario desde el token
    const getCurrentUserRole = () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUserRole.value = payload.role_id;
      }
    };

    const retrieveUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        userInfo.value = response.data;
      } catch (err) {
        console.error("User Listing Failed:", err.message);
      }
    };

    const retrieveCentrosRegionales = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/centros", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
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
        const response = await axios.get("http://localhost:8000/api/v1/varios/roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        roles.value = response.data.map((rol) => ({
          value: rol.id,
          label: rol.name
        }));
      } catch (err) {
        errorLog(err);
      }
    };

    // Filtra los roles de acuerdo al rol del usuario actual
    const filterRoles = () => {
      if (currentUserRole.value === 2) {
        // Empleado => Solo Estudiantes
        return roles.value.filter((role) => role.value === 3);
      } else if (currentUserRole.value === 1) {
        // Administrador => Empleados y Estudiantes
        return roles.value.filter((role) => role.value === 2 || role.value === 3);
      }
      return [];
    };

    onMounted(async () => {
      getCurrentUserRole();
      await retrieveUsers();
      await retrieveRoles();
      await retrieveCentrosRegionales();

      createUsersFields.value = [
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Contraseña", type: "password" },
        {
          name: "roles",
          label: "Roles",
          type: "select",
          options: filterRoles()
        },
        {
          name: "centroregional",
          label: "Centro Regional",
          type: "select",
          options: centrosRegionales.value
        }
      ];
    });

    const createUsersFields = ref([]);

    const handleUserCreationSubmit = async (formData) => {
      try {
        await axios.post(
          "http://localhost:8000/api/v1/users/create",
          {
            email: formData.email,
            password: formData.password,
            role_id: formData.roles,
            idcentroregional: formData.centroregional
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );
        await retrieveUsers(); // Refresca la lista de usuarios

        showModal.value = false;
        messageContent.value = "Usuario creado con éxito";
        messageType.value = "exito";
        showMessage.value = true;
      } catch (err) {
        console.error("User creation failed:", err.message);
        messageContent.value = "Error al crear el usuario";
        messageType.value = "error";
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
      messageType
    };
  }
};
</script>

<style scoped>
/* Contenedor principal que abarca todo el alto de la ventana
   para permitir un scroll interno en la sección de tarjetas */
.manage-users-page {
  display: flex;
  flex-direction: column;
  /* Si deseas ocupar la pantalla completa, usa 100vh:
     height: 100vh; 
     De lo contrario, ajusta según tu layout. */
  height: 100vh;
  /* Evita márgenes que podrían generar scroll adicional */
  margin: 0;
  padding: 0;
}

/* Encabezado: Título + botón de creación */
.page-header {
  flex-shrink: 0; /* No se reduce al hacer scroll */
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem;
  background-color: #fff;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  color: #002D62;
}

/* Botón para crear usuario */
.rounded-button {
  background-color: #FFCC00;
  color: #002D62;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.rounded-button:hover {
  background-color: #FFD700;
}

/* Contenedor de las tarjetas:
   - Se expande para ocupar el espacio sobrante. */
.card-container {
  flex: 1;
  display: grid;
  /* Dos columnas de igual tamaño */
  grid-template-columns: repeat(2, 1fr);
  /* Separación entre tarjetas */
  gap: 1rem;
  /* Espacio interior */
  padding: 1rem 2rem 2rem;
}

/* Tarjeta individual de usuario */
.user-card {
  background-color: #FFFBCC; /* un amarillo claro */
  border: 2px solid #FFCC00;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  text-align: left;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.1);
}

/* Encabezado dentro de la tarjeta */
.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Email del usuario */
.user-email {
  font-weight: 600;
  color: #333;
}

/* Estado de usuario: Activo/Inactivo */
.status {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
}

.status-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

/* Clases dinámicas para cambiar color del círculo */
.status-active .status-circle {
  background-color: green;
}
.status-inactive .status-circle {
  background-color: red;
}

/* Cuerpo de la tarjeta: Rol y Centro Regional */
.user-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-role,
.user-center {
  margin: 0;
  color: #555;
}

.user-role span {
  color: #002D62;
  font-weight: 600;
}

/* Opcional: en pantallas pequeñas, puedes pasar a 1 sola columna */
@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}
</style>
