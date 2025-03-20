<template>
  <div class="manage-users-page">
    <!-- Encabezado: Título y selector de centro regional -->
    <div class="page-header">
      <h1 class="page-title">Lista de Empleados</h1>
      <!-- Se agrega clase dinámica según el estado del navbar -->
      <div :class="'filter-container'">
        <i class="bi bi-search"></i>
        <select v-model="selectedCentroRegional" class="filter-select">
          <option value="">Todos los Centros</option>
          <option v-for="centro in centrosRegionales" :key="centro.value" :value="centro.value">
            {{ centro.label }}
          </option>
        </select>
        <i class="bi bi-chevron-down select-icon"></i>
      </div>
    </div>

    <!-- Contenedor de tarjetas de usuarios -->
    <div class="card-container">
      <div
        v-for="(user, index) in filteredUserInfo"
        :key="index"
        class="user-card"
        @click="router.push(`/detailsUser/${user.idusuario}`)"
      >
        <div class="user-card-header">
          <p class="user-email"><strong>{{ user.email }}</strong></p>
          <div
            class="status"
            :class="{
              'status-active': user.isactive,
              'status-inactive': !user.isactive
            }"
          >
            <div class="status-circle"></div>
            <span v-if="user.isactive">Activo</span>
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
import { onMounted, ref, computed } from "vue";
import Mensaje from "../components/Mensaje.vue";
import utils from "../utils";

export default {
  name: "ManageUsers",
  components: {
    Mensaje
  },
  setup() {
    const router = useRouter();
    const showMessage = ref(false);
    const messageContent = ref("");
    const messageType = ref("");
    const userInfo = ref([]);
    const centrosRegionales = ref([]);
    const selectedCentroRegional = ref("");
    // Variable que indica el estado del navbar. Debes actualizarla según tu lógica.
    const isNavbarExpanded = ref(false);

    const errorLog = async (err) => {
      console.error("ERROR IN REQUEST:", {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config
      });
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
        utils.errorLog(err);
      }
    };

    onMounted(async () => {
      await retrieveUsers();
      await retrieveCentrosRegionales();
      // Aquí podrías vincular isNavbarExpanded al estado real de tu navbar
    });

    // Propiedad computada que filtra usuarios según el centro regional seleccionado
    const filteredUserInfo = computed(() => {
      if (!selectedCentroRegional.value) {
        return userInfo.value.filter(user => user.role_id === 1 || user.role_id === 2);
      }
      return userInfo.value.filter(
        user =>
          (user.role_id === 1 || user.role_id === 2) &&
          user.centroregional.idcentroregional === selectedCentroRegional.value
      );
    });

    return {
      router,
      userInfo,
      filteredUserInfo,
      showMessage,
      messageContent,
      messageType,
      centrosRegionales,
      selectedCentroRegional,
      isNavbarExpanded
    };
  }
};
</script>

<style scoped>
/* Contenedor principal */
.manage-users-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* Encabezado: Título + selector de centro regional */
.page-header {
  flex-shrink: 0;
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

/* Contenedor del filtro, adaptado al estilo de la página */
.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFCC00;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: width 0.3s ease;
}

/* Cuando el navbar está expandido, se reduce el ancho */
.filter-container.navbar-expanded {
  width: 200px;
}

/* Estilo para el icono de búsqueda */
.bi-search {
  color: #002D62;
  font-size: 1.2rem;
}

/* Selector de centro regional */
.filter-select {
  background-color: #fff;
  color: #002D62;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  appearance: none;
  width: 100%;
}

.filter-select:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.filter-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 45, 98, 0.2);
}

/* Contenedor de tarjetas de usuarios */
.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem 2rem 2rem;
}

/* Tarjeta individual */
.user-card {
  background-color: #FFFBCC;
  border: 2px solid #FFCC00;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  text-align: left;
  max-height: 25vh;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.1);
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-email {
  font-weight: 600;
  color: #333;
}

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

.status-active .status-circle {
  background-color: green;
}
.status-inactive .status-circle {
  background-color: red;
}

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

/* Responsive */
@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-container {
    width: 100%;
    margin-top: 1rem;
  }
  .filter-select {
    width: 100%;
  }
}
</style>
