<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="manage-users-page" role="main">
    <div class="right-container">
      <div class="page-header">
        <h1 class="page-title">Lista de Estudiantes</h1>
        <!-- role="search" identifica el filtro como área de búsqueda -->
        <div class="filter-container" role="search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <!-- aria-label describe el propósito del select -->
          <select 
            v-model="selectedCentroRegional" 
            class="filter-select"
            @change="onCentroChange"
            aria-label="Filtrar por centro regional"
          >
            <option value="">Todos los Centros</option>
            <option 
              v-for="centro in centrosRegionales" 
              :key="centro.value" 
              :value="centro.value"
            >
              {{ centro.label }}
            </option>
          </select>
          <i class="bi bi-chevron-down select-icon" aria-hidden="true"></i>
        </div>
      </div>

      <!-- role="region" para la tabla de estudiantes -->
      <div class="table-responsive" role="region" aria-label="Lista de estudiantes">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Email</th>
              <th scope="col">Centro Regional</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in paginatedUsers" 
              :key="user.idusuario"
            >
              <td>
                {{ user.persona ? `${user.persona.primernombre} ${user.persona.primerapellido}` : "Sin datos" }}
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.centroregional?.centroregional || 'N/A' }}</td>
              <td>
                <span :class="{ 'status-active': user.isactive, 'status-inactive': !user.isactive }">
                  <span class="status-circle"></span>
                  {{ user.isactive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button 
                  class="btn btn-sm btn-primary" 
                  @click.stop="router.push(`/detailsUser/${user.idusuario}`)"
                  :aria-label="`Ver detalles de ${user.email}`"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="5" class="text-center">No se encontraron estudiantes.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- role="navigation" para la paginación -->
      <div class="pagination-container" role="navigation" aria-label="Paginación de la lista de estudiantes">
        <button 
          :disabled="currentPage === 1" 
          @click="prevPage"
          aria-label="Página anterior"
          :aria-disabled="currentPage === 1 ? 'true' : 'false'"
        >
          Anterior
        </button>
        <span aria-live="polite">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
          aria-label="Página siguiente"
          :aria-disabled="currentPage === totalPages ? 'true' : 'false'"
        >
          Siguiente
        </button>
      </div>

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
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import Mensaje from "../components/Mensaje.vue";
import utils from "../utils";

export default {
  name: "StudentList",
  components: { Mensaje },
  setup() {
    const router = useRouter();
    const showMessage = ref(false);
    const messageContent = ref("");
    const messageType = ref("");
    const userInfo = ref([]);
    const centrosRegionales = ref([]);
    const selectedCentroRegional = ref("");

    // Variables de paginación
    const currentPage = ref(1);
    const pageSize = 5; // Cantidad fija de usuarios por página (no necesita ser ref)

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
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        });
        userInfo.value = response.data;
      } catch (err) {
        console.error("User Listing Failed:", err.message);
        messageContent.value = "Error al cargar la lista de estudiantes";
        messageType.value = "error";
        showMessage.value = true;
      }
    };

    const retrieveCentrosRegionales = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/centros", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        });
        centrosRegionales.value = response.data.map((centro) => ({
          value: centro.idcentroregional,
          label: centro.centroregional
        }));
      } catch (err) {
        utils.errorLog(err);
        messageContent.value = "Error al cargar los centros regionales";
        messageType.value = "error";
        showMessage.value = true;
      }
    };

    // Reinicia la paginación cuando se cambia el filtro
    const onCentroChange = () => {
      currentPage.value = 1;
    };

    onMounted(async () => {
      await retrieveUsers();
      await retrieveCentrosRegionales();
    });

    // Se filtran solo los estudiantes y se aplica el filtro por centro regional
    const filteredUserInfo = computed(() => {
      return userInfo.value.filter(user =>
        user.role_id === 3 &&
        (selectedCentroRegional.value === "" ||
          user.centroregional?.idcentroregional === selectedCentroRegional.value)
      );
    });

    // Total de páginas para la paginación
    const totalPages = computed(() => {
      return Math.ceil(filteredUserInfo.value.length / pageSize) || 1;
    });

    // Usuarios paginados según la página actual
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredUserInfo.value.slice(start, start + pageSize);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    return {
      router,
      userInfo,
      centrosRegionales,
      filteredUserInfo,
      selectedCentroRegional,
      currentPage,
      totalPages,
      paginatedUsers,
      nextPage,
      prevPage,
      onCentroChange,
      showMessage,
      messageContent,
      messageType
    };
  }
};
</script>

<style scoped>
.manage-users-page {
  display: flex;
  height: 100%; /* Importante para ocupar todo el alto */
}

/* Contenedor de la sección derecha */
.right-container {
  flex: 1;
  position: relative; /* Permite posicionar elementos hijos de forma absoluta */
  margin: 1rem;
  padding-bottom: 80px; /* Espacio para que la paginación no tape el contenido */
  overflow-y: auto; /* Cambiado de none a auto para permitir scroll si es necesario */
}

.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  color: #002D62;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFCC00;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.bi-search {
  color: #002D62;
  font-size: 1.2rem;
}

.filter-select {
  background-color: #fff;
  color: #002D62;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
}

.table-responsive {
  margin: 0 0 1rem 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  text-align: left;
}

.status-active .status-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
  margin-right: 5px;
}

.status-inactive .status-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  margin-right: 5px;
}

/* Paginación fija en el pie del contenedor derecho */
.pagination-container {
  position: absolute;
  bottom: 0; /* Cambiado de top: 74vh a bottom: 0 para mejor consistencia */
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #dee2e6;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
}

.pagination-container button {
  padding: 0.5rem 1rem;
  background-color: #002D62;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-container button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>