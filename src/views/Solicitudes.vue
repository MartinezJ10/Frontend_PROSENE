<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="container my-4 relative-container" role="main">
    <div class="page-header mb-4">
      <h1 class="page-title">Lista de Solicitudes</h1>

      <button 
        class="btn btn-unah" 
        @click="toggleFilters"
        :aria-expanded="showFilters ? 'true' : 'false'"
        aria-controls="filters-overlay"
      >
        <i class="bi bi-funnel-fill me-2" aria-hidden="true"></i>
        {{ showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros' }}
      </button>
    </div>

    <!-- Sección de filtros superpuesta (overlay) -->
    <transition name="slide-fade">
      <div 
        v-if="showFilters" 
        class="filters-overlay" 
        id="filters-overlay"
        role="region"
        aria-label="Filtros de búsqueda"
      >
        <!-- Filtro por Usuario -->
        <div class="col-12 col-sm-3">
          <label for="userFilter" class="form-label fw-semibold">Usuario</label>
          <input
            id="userFilter"
            type="text"
            class="form-control"
            v-model="searchUsername"
            placeholder="Buscar usuario..."
            @input="filterSolicitudes"
            aria-label="Filtrar por nombre de usuario"
          />
        </div>
        <!-- Filtro por Centro Regional -->
        <div class="col-12 col-sm-3">
          <label for="centroFilter" class="form-label fw-semibold">Centro Regional</label>
          <select
            id="centroFilter"
            class="form-select"
            v-model="searchCentro"
            @change="filterSolicitudes"
            aria-label="Filtrar por centro regional"
          >
            <option value="">Todos los centros</option>
            <option
              v-for="centro in centros"
              :key="centro.idcentroregional"
              :value="centro.centroregional"
            >
              {{ centro.centroregional }}
            </option>
          </select>
        </div>
        <!-- Filtro por Estado -->
        <div class="col-12 col-sm-3">
          <label for="estadoFilter" class="form-label fw-semibold">Estado</label>
          <select
            id="estadoFilter"
            class="form-select"
            v-model="searchEstado"
            @change="filterSolicitudes"
            aria-label="Filtrar por estado de solicitud"
          >
            <option value="">Todos los estados</option>
            <option
              v-for="estado in estados"
              :key="estado.idestadosolicitud"
              :value="estado.idestadosolicitud"
            >
              {{ estado.descripcion }}
            </option>
          </select>
        </div>
        <!-- Filtro por Tipo de Solicitud -->
        <div class="col-12 col-sm-3">
          <label for="tipoFilter" class="form-label fw-semibold">Tipo de Solicitud</label>
          <select
            id="tipoFilter"
            class="form-select"
            v-model="searchTipo"
            @change="filterSolicitudes"
            aria-label="Filtrar por tipo de solicitud"
          >
            <option value="">Todos los tipos</option>
            <option
              v-for="tipo in tiposSolicitud"
              :key="tipo.idtiposolicitud"
              :value="tipo.descripcion"
            >
              {{ tipo.descripcion }}
            </option>
          </select>
        </div>
      </div>
    </transition>

    <!-- Contenedor derecho que envuelve la tabla y la paginación -->
    <div class="right-container">
      <!-- Tabla de Solicitudes -->
      <div class="table-responsive" role="region" aria-label="Lista de solicitudes">
        <table class="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Tipo de Solicitud</th>
              <th scope="col">
                Fecha
                <button
                  class="btn btn-sm btn-outline-primary ms-2 arrow-button"
                  @click="toggleDateSort"
                  :aria-label="`Ordenar por fecha ${dateSortOrder === 'asc' ? 'descendente' : 'ascendente'}`"
                >
                  {{ dateSortOrder === 'asc' ? '↑' : '↓' }}
                </button>
              </th>
              <th scope="col">Centro Regional</th>
              <th scope="col">Estado</th>
              <th scope="col" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(solicitud, index) in paginatedSolicitudes" :key="index">
              <td>{{ solicitud.fullName }}</td>
              <td>{{ solicitud.tipo }}</td>
              <td>{{ formatDate(solicitud.fecha) }}</td>
              <td>{{ solicitud.centro }}</td>
              <td>
                <span
                  class="badge d-inline-block w-100 text-center"
                  :style="{ backgroundColor: getStatusColor(solicitud.estado), color: '#fff' }"
                  style="max-width: 150px;"
                >
                  {{ getStatusText(solicitud.estado) }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="goToDetails(solicitud.idsolicitud)"
                  :aria-label="`Ver detalles de la solicitud de ${solicitud.fullName}`"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
            <tr v-if="paginatedSolicitudes.length === 0">
              <td colspan="6" class="text-center text-muted">
                No se encontraron solicitudes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card de paginación al pie del contenedor derecho -->
      <div class="pagination-container" role="navigation" aria-label="Paginación de la lista de solicitudes">
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
    </div>

    <!-- Mensaje de retroalimentación -->
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
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Mensaje from "../components/Mensaje.vue";
import ReusableForm from "../components/ReusableForm.vue";
import ReusableModal from "../components/ReusableModal.vue";

export default {
  name: "Solicitudes",
  components: { Mensaje, ReusableForm, ReusableModal },
  setup() {
    const router = useRouter();

    const showMessage = ref(false);
    const messageContent = ref("");
    const messageType = ref("");

    const solicitudes = ref([]);
    const searchEstado = ref("");
    const searchUsername = ref("");
    const searchTipo = ref("");
    const searchCentro = ref("");

    const estados = ref([]);
    const tiposSolicitud = ref([]);
    const centros = ref([]);

    // Control de filtros
    const showFilters = ref(false);
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    // Estado para ordenar la fecha
    const dateSortOrder = ref("asc");

    const retrieveSolicitudes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/solicitudes/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        solicitudes.value = response.data.map((solicitud) => ({
          idsolicitud: solicitud.idsolicitud,
          fullName: solicitud.usuariosolicitante.persona
            ? `${solicitud.usuariosolicitante.persona.primernombre} ${solicitud.usuariosolicitante.persona.primerapellido}`
            : solicitud.usuariosolicitante.email,
          email: solicitud.usuariosolicitante.email,
          centro: solicitud.usuariosolicitante.centroregional.centroregional,
          estado: solicitud.estadosolicitud.idestadosolicitud,
          fecha: solicitud.fechacreacion,
          tipo: solicitud.tiposolicitud.descripcion,
        }));
      } catch (err) {
        console.error("Failed to retrieve Solicitudes:", err.message);
      }
    };

    const retrieveCentros = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/centros", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        centros.value = response.data;
      } catch (err) {
        console.error("Failed to retrieve centros:", err.message);
      }
    };

    const retrieveEstados = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/estados", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        estados.value = response.data;
      } catch (err) {
        console.error("Failed to retrieve estados:", err.message);
      }
    };

    const retrieveTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/tipos", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        tiposSolicitud.value = response.data;
      } catch (err) {
        console.error("Failed to retrieve tipos de solicitud:", err.message);
      }
    };

    const getStatusText = (estado) => {
      const estadoObj = estados.value.find((e) => e.idestadosolicitud === estado);
      return estadoObj ? estadoObj.descripcion : "Desconocido";
    };

    const getStatusColor = (estado) => {
      switch (estado) {
        case 1:
          return "#17a2b8";
        case 2:
          return "#FFCC00";
        case 3:
          return "#1E7E34";
        case 4:
          return "#6c757d";
        case 5:
          return "#B22222";
        default:
          return "#6c757d";
      }
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filterSolicitudes = () => {
      // Reinicia a la primera página al filtrar
      currentPage.value = 1;
    };

    const filteredSolicitudes = computed(() => {
      return solicitudes.value.filter((solicitud) => {
        const matchesCentro = searchCentro.value
          ? solicitud.centro === searchCentro.value
          : true;
        const matchesEstado = searchEstado.value
          ? solicitud.estado === parseInt(searchEstado.value)
          : true;
        const matchesUsername = searchUsername.value
          ? solicitud.fullName.toLowerCase().includes(searchUsername.value.toLowerCase())
          : true;
        const matchesTipo = searchTipo.value
          ? solicitud.tipo === searchTipo.value
          : true;
        return matchesCentro && matchesEstado && matchesUsername && matchesTipo;
      });
    });

    const sortedSolicitudes = computed(() => {
      return [...filteredSolicitudes.value].sort((a, b) => {
        return dateSortOrder.value === "asc"
          ? new Date(a.fecha) - new Date(b.fecha)
          : new Date(b.fecha) - new Date(a.fecha);
      });
    });

    // Variables de paginación
    const currentPage = ref(1);
    const pageSize = ref(5);
    const totalPages = computed(() => {
      return Math.ceil(sortedSolicitudes.value.length / pageSize.value) || 1;
    });
    const paginatedSolicitudes = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return sortedSolicitudes.value.slice(start, start + pageSize.value);
    });

    const toggleDateSort = () => {
      dateSortOrder.value = dateSortOrder.value === "asc" ? "desc" : "asc";
    };

    const goToDetails = (id) => {
      router.push(`/detailsSolicitud/${id}`);
    };

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

    onMounted(async () => {
      await retrieveSolicitudes();
      await retrieveEstados();
      await retrieveTipos();
      await retrieveCentros();
    });

    return {
      showMessage,
      messageContent,
      messageType,
      solicitudes,
      searchEstado,
      searchUsername,
      searchTipo,
      searchCentro,
      centros,
      estados,
      tiposSolicitud,
      sortedSolicitudes,
      dateSortOrder,
      toggleDateSort,
      goToDetails,
      getStatusText,
      getStatusColor,
      formatDate,
      filterSolicitudes,
      showFilters,
      toggleFilters,
      // Paginación
      currentPage,
      pageSize,
      totalPages,
      paginatedSolicitudes,
      nextPage,
      prevPage
    };
  },
};
</script>

<style scoped>
/* Para que el contenedor principal permita posicionamiento absoluto en sus hijos */
.relative-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
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
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  color: #002D62;
}

.btn-unah {
  background-color: #002f6c;
  color: white;
  font-weight: bold;
  border: none;
}

.btn-unah:hover {
  background-color: #ffcc00;
  color: #002f6c;
}

.table th,
.table td {
  vertical-align: middle;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
}

.table th, .table td {
  border: 1px solid #dee2e6;
  padding: 10px;
}

.arrow-button {
  border: none;
  color: black;
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Contenedor derecho similar a StudentList.vue */
.right-container {
  position: relative;
  height: calc(100vh - 120px); /* Ajusta según la altura del header */
  overflow-y: auto;
  padding-bottom: 80px; /* Espacio para la paginación */
}

/* Card de paginación al pie del contenedor derecho */
.pagination-container {
  position: absolute;
  top: 55vh;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #dee2e6;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
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

h1 {
  color: #002D62;
}

/* Estilos para el overlay de filtros */
.filters-overlay {
  position: absolute;
  top: 70px; /* Ajusta este valor según la altura de tu header */
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Media queries para hacer la vista responsiva */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .filters-overlay {
    top: 60px;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .right-container {
    height: calc(100vh - 150px);
  }
  .table th,
  .table td {
    padding: 8px;
  }
  .pagination-container {
    position: static;
    margin-top: 1rem;
    box-shadow: none;
    border: none;
  }
}
</style>