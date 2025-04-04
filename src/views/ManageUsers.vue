<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="manage-users-page" role="main">
    <!-- Encabezado: Título y selector de centro regional -->
    <div class="page-header">
      <h1 class="page-title">Lista de Empleados</h1>
      <!-- role="search" identifica el filtro como área de búsqueda -->
      <div class="filter-container" role="search">
        <i class="bi bi-search" aria-hidden="true"></i>
        <!-- aria-label describe el propósito del select -->
        <select v-model="selectedCentroRegional" class="filter-select" aria-label="Filtrar por centro regional">
          <option value="">Todos los Centros</option>
          <option v-for="centro in centrosRegionales" :key="centro.value" :value="centro.value">
            {{ centro.label }}
          </option>
        </select>
        <i class="bi bi-chevron-down select-icon" aria-hidden="true"></i>
      </div>
    </div>

    <!-- Contenedor de tarjetas de usuarios -->
    <!-- role="region" para la lista de usuarios -->
    <div class="card-container" role="region" aria-label="Lista de empleados">
      <div
        v-for="(user, index) in filteredUserInfo"
        :key="index"
        class="user-card"
        @click="router.push(`/detailsUser/${user.idusuario}`)"
        @keydown.enter="router.push(`/detailsUser/${user.idusuario}`)"
        role="button"
        tabindex="0"
        :aria-label="`Ver detalles de ${user.email}, estado: ${user.isactive ? 'Activo' : 'Inactivo'}`"
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
    <!-- aria-live para anunciar mensajes dinámicos -->
    <Mensaje
      v-if="showMessage"
      :mensaje="messageContent"
      :tipo="messageType"
      :visible="showMessage"
      @update:visible="showMessage = false"
      aria-live="polite"
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
      selectedCentroRegional
    };
  }
};
</script>

<style scoped>
/* Contenedor principal */
.manage-users-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
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
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  color: #002D62;
  flex: 1;
  min-width: 200px;
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
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

/* Estilo para el icono de búsqueda */
.bi-search {
  color: #002D62;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.select-icon {
  flex-shrink: 0;
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
  flex: 1;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  width: 100%;
  box-sizing: border-box;
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
  max-height: none;
  display: flex;
  flex-direction: column;
}

.user-card:hover, .user-card:focus {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.1);
}

.user-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.user-email {
  font-weight: 600;
  color: #333;
  margin: 0;
  word-break: break-word;
  flex: 1;
  min-width: 150px;
}

.status {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
}

.status-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  flex-shrink: 0;
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
  word-break: break-word;
}

.user-role span {
  color: #002D62;
  font-weight: 600;
}

/* Responsive Styles - Optimizados para dispositivos móviles */
@media (max-width: 1024px) {
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    padding: 1rem 1.5rem;
  }
  
  .page-title {
    font-size: 1.7rem;
  }
}

@media (max-width: 992px) {
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    padding: 1rem;
  }
  
  .page-header {
    padding: 1rem;
    margin: 0.75rem;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .user-card {
    padding: 0.9rem 1.25rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-container {
    width: 100%;
    max-width: 100%;
  }
  
  .page-title {
    width: 100%;
    text-align: center;
    margin-bottom: 0.75rem;
  }
  
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
    padding: 0.75rem;
  }
}

/* Tablets pequeñas y teléfonos grandes */
@media (max-width: 640px) {
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.7rem;
    padding: 0.7rem;
  }
  
  .page-header {
    margin: 0.6rem;
    padding: 0.9rem;
  }
  
  .user-card {
    padding: 0.85rem 1.1rem;
  }
  
  .user-email {
    font-size: 0.95rem;
  }
}

/* Optimización para dispositivos móviles medianos (iPhone XR, 11, etc) */
@media (max-width: 576px) {
  .card-container {
    grid-template-columns: 1fr;
    gap: 0.6rem;
    padding: 0.6rem;
  }
  
  .page-header {
    margin: 0.5rem;
    padding: 0.8rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .filter-container {
    padding: 0.45rem 0.8rem;
  }
  
  .filter-select {
    padding: 0.45rem 0.8rem;
    font-size: 0.95rem;
  }
  
  .user-card {
    padding: 0.8rem 1rem;
  }
}

/* Dispositivos más pequeños (iPhone SE, dispositivos más antiguos) */
@media (max-width: 480px) {
  .page-header {
    margin: 0.4rem;
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.4rem;
  }
  
  .filter-container {
    padding: 0.4rem 0.7rem;
  }
  
  .filter-select {
    padding: 0.4rem 0.7rem;
    font-size: 0.9rem;
  }
  
  .user-card {
    padding: 0.75rem 0.9rem;
  }
  
  .card-container {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .bi-search,
  .select-icon {
    font-size: 1rem;
  }
  
  .user-email {
    font-size: 0.9rem;
  }
  
  .status,
  .user-role,
  .user-center {
    font-size: 0.85rem;
  }
}

/* Dispositivos muy pequeños (iPhone 5/SE antiguo, Galaxy S5, etc) */
@media (max-width: 375px) {
  .page-header {
    margin: 0.3rem;
    padding: 0.6rem;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .filter-container {
    padding: 0.35rem 0.6rem;
  }
  
  .filter-select {
    padding: 0.35rem 0.6rem;
    font-size: 0.85rem;
  }
  
  .user-card {
    padding: 0.7rem 0.8rem;
  }
  
  .bi-search,
  .select-icon {
    font-size: 0.9rem;
  }
  
  .user-email {
    font-size: 0.85rem;
    line-height: 1.2;
  }
  
  .status,
  .user-role,
  .user-center {
    font-size: 0.8rem;
    line-height: 1.2;
  }
  
  .status-circle {
    width: 8px;
    height: 8px;
  }
}

/* Optimizaciones adicionales para dispositivos muy pequeños */
@media (max-width: 320px) {
  .page-title {
    font-size: 1.2rem;
  }
  
  .user-card {
    padding: 0.6rem 0.7rem;
  }
  
  .user-email {
    font-size: 0.8rem;
  }
  
  .status,
  .user-role,
  .user-center {
    font-size: 0.75rem;
  }
}
</style>