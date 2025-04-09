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

      <!-- Paginación movida arriba de la tabla -->
      <div class="pagination-container" role="navigation" aria-label="Paginación de la lista de estudiantes">
        <button 
          :disabled="currentPage === 1" 
          @click="prevPage"
          aria-label="Página anterior"
          :aria-disabled="currentPage === 1 ? 'true' : 'false'"
          class="pagination-button"
        >
          Anterior
        </button>
        <span aria-live="polite" class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
          aria-label="Página siguiente"
          :aria-disabled="currentPage === totalPages ? 'true' : 'false'"
          class="pagination-button"
        >
          Siguiente
        </button>
      </div>

      <!-- Se elimina la vista de tarjetas y se usa la tabla para todas las vistas -->
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
import { onMounted, ref, computed, inject,onBeforeUnmount  } from "vue";
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
    
    // Mantenemos esta referencia para ajustar el pageSize, pero eliminamos su uso para la visualización
    const isMobileView = ref(window.innerWidth < 768);

    const requestURL = inject("requestURL");

    // Variables de paginación
    const currentPage = ref(1);
    const pageSize = ref(isMobileView.value ? 5 : 10); // Ajuste dinámico según el tipo de vista

    const updateViewMode = () => {
      isMobileView.value = window.innerWidth < 768;
      // Ajustar pageSize basado en el tipo de vista
      pageSize.value = isMobileView.value ? 5 : 10;
      // Asegurarse de que la página actual sigue siendo válida
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
      }
    };

    // Event listener para cambios de tamaño de ventana
    window.addEventListener('resize', updateViewMode);

    // Limpiar event listener al desmontar el componente
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateViewMode);
    });

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
        const response = await axios.get(`${requestURL}/api/v1/users/all`, {
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
        const response = await axios.get(`${requestURL}/api/v1/varios/centros`, {
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
      updateViewMode(); // Verificar el modo de vista inicial
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
      return Math.ceil(filteredUserInfo.value.length / pageSize.value) || 1;
    });

    // Usuarios paginados según la página actual
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredUserInfo.value.slice(start, start + pageSize.value);
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
  height: 100%;
  width: 100%;
}

/* Contenedor de la sección derecha */
.right-container {
  flex: 1;
  position: relative;
  margin: 0.5rem;
  overflow-y: auto;
  width: 100%;
}

.page-header {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0.75rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.page-title {
  margin: 0;
  font-size: 1.4rem;
  color: #002D62;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFCC00;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.bi-search {
  color: #002D62;
  font-size: 1.1rem;
}

.filter-select {
  background-color: #fff;
  color: #002D62;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  max-width: 100%;
}

/* Estilos actualizados para la tabla - se ajustan para que sean más responsive */
.table-responsive {
  margin: 0 0 1rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Mejora el desplazamiento táctil en iOS */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem; /* Texto más pequeño */
}

.table th,
.table td {
  padding: 0.5rem; /* Reduce el padding para compactar filas */
  border: 1px solid #dee2e6;
  text-align: left;
  vertical-align: middle;
}

.table th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
  font-weight: 600;
  color: #002D62;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-active .status-circle,
.status-inactive .status-circle {
  display: inline-block;
  width: 8px; /* Tamaño reducido */
  height: 8px; /* Tamaño reducido */
  border-radius: 50%;
  margin-right: 5px;
}

.status-active .status-circle {
  background-color: green;
}

.status-inactive .status-circle {
  background-color: red;
}

/* Botones más pequeños */
.btn-sm {
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
}

.btn-primary {
  background-color: #002D62;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #001F4D;
}

/* Paginación responsiva */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.pagination-button {
  padding: 0.3rem 0.8rem;
  background-color: #002D62;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 80px;
  touch-action: manipulation; /* Optimiza para toques */
  transition: background-color 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #001F4D;
}

.pagination-info {
  text-align: center;
  min-width: 120px;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Media queries para responsividad */
@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-container {
    width: 100%;
    margin-top: 0.5rem;
    justify-content: space-between;
  }
  
  .filter-select {
    flex-grow: 1;
    width: 100%;
  }
  
  .table th,
  .table td {
    padding: 0.4rem;
    font-size: 0.8rem;
  }

  .table th:nth-child(3),
  .table td:nth-child(3) {
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .pagination-container {
    padding: 0.25rem;
  }
  
  .pagination-button {
    min-width: 70px;
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
  
  .pagination-info {
    font-size: 0.8rem;
    min-width: 100px;
  }

  .btn-sm {
    padding: 0.15rem 0.4rem;
    font-size: 0.75rem;
  }
}

/* Ajustes específicos para pequeñas pantallas */
@media (max-width: 480px) {
  .page-title {
    font-size: 1.2rem;
  }
  
  .right-container {
    margin: 0.25rem;
  }
  
  .pagination-button {
    min-width: 60px;
    font-size: 0.75rem;
  }
  
  .pagination-info {
    min-width: 80px;
    font-size: 0.75rem;
  }

  /* Optimizaciones adicionales para la tabla en pantallas muy pequeñas */
  .table th:nth-child(2),
  .table td:nth-child(2) {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .table th:nth-child(3),
  .table td:nth-child(3) {
    max-width: 60px;
  }
}

/* Ajustes para orientación horizontal en dispositivos móviles */
@media (max-height: 500px) and (orientation: landscape) {
  .manage-users-page {
    height: auto;
    min-height: 100%;
  }
  
  .page-header {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .filter-container {
    width: auto;
  }
}

/* Soporte para dispositivos con safe-area-inset (notch) */
@supports (padding: max(0px)) {
  .right-container {
    padding-left: max(0.5rem, env(safe-area-inset-left));
    padding-right: max(0.5rem, env(safe-area-inset-right));
    padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  }
}
</style>