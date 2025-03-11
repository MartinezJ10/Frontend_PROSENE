<template>
    <div class="container my-4">
      <!-- Título y Filtros -->
      <div class="row mb-4 align-items-end">
        <div class="col-12 col-md-6">
          <h1 class="mb-0 text-primary">Lista de Solicitudes</h1>
        </div>
        <div class="col-12 col-md-6 mt-3 mt-md-0">
          <div class="row g-2">
            <!-- Filtro por fecha -->
            <div class="col-12 col-sm-6">
              <label for="dateFilter" class="form-label fw-semibold">Fecha</label>
              <input
                id="dateFilter"
                type="date"
                class="form-control"
                v-model="searchDate"
                @input="filterSolicitudes"
              />
            </div>
            <!-- Filtro por estado -->
            <div class="col-12 col-sm-6">
              <label for="estadoFilter" class="form-label fw-semibold">Estado</label>
              <select
                id="estadoFilter"
                class="form-select"
                v-model="searchEstado"
                @change="filterSolicitudes"
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
          </div>
        </div>
      </div>
  
      <!-- Tabla de Solicitudes -->
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">
                Fecha
                <button
                  class="btn btn-sm btn-outline-primary ms-2 arrow-button"
                  @click="toggleDateSort"
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
            <tr
              v-for="(solicitud, index) in sortedSolicitudes"
              :key="index"
            >
              <td>{{ solicitud.email }}</td>
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
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
            <tr v-if="sortedSolicitudes.length === 0">
              <td colspan="5" class="text-center text-muted">
                No se encontraron solicitudes.
              </td>
            </tr>
          </tbody>
        </table>

      </div>
  
      <!-- Mensaje de retroalimentación -->
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
  import { onMounted, ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import Mensaje from "../components/Mensaje.vue";
  
  export default {
    name: "Solicitudes",
    components: { Mensaje },
    setup() {
      const router = useRouter();
  
      const showMessage = ref(false);
      const messageContent = ref("");
      const messageType = ref("");
  
      const solicitudes = ref([]);
      const searchDate = ref("");
      const searchEstado = ref("");
      const estados = ref([]);
  
      // Estado para ordenar la fecha
      const dateSortOrder = ref("asc");
  
      // Obtener solicitudes desde la API
      const retrieveSolicitudes = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/v1/solicitudes/all", {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          });
          solicitudes.value = response.data.map((solicitud) => ({
            idsolicitud: solicitud.idsolicitud,
            email: solicitud.usuariosolicitante.email,
            centro: solicitud.usuariosolicitante.centroregional.centroregional,
            estado: solicitud.estadosolicitud.idestadosolicitud,
            fecha: solicitud.fechacreacion,
          }));
        } catch (err) {
          console.error("Failed to retrieve Solicitudes:", err.message);
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
  
      const getStatusText = (estado) => {
        const estadoObj = estados.value.find((e) => e.idestadosolicitud === estado);
        return estadoObj ? estadoObj.descripcion : "Desconocido";
      };
  
      const getStatusColor = (estado) => {
      switch (estado) {
        case 1: // Recibida
          return '#17a2b8'; // Azul claro
        case 2: // En proceso
          return '#FFCC00'; // Amarillo
        case 3: // Finalizada
          return '#1E7E34'; // Verde
        case 4: // Cancelada
          return '#6c757d'; // Naranja
        case 5: // Rechazada
          return '#B22222'; // Rojo
        default:
          return '#6c757d'; // Gris para estados desconocidos
      }
    };

  
      const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
  
      const isSameDate = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.toISOString().split("T")[0] === d2.toISOString().split("T")[0];
      };
  
      // Filtrar solicitudes
      const filteredSolicitudes = computed(() => {
        return solicitudes.value.filter((solicitud) => {
          const matchesDate = searchDate.value
            ? isSameDate(solicitud.fecha, searchDate.value)
            : true;
          const matchesEstado = searchEstado.value
            ? solicitud.estado === parseInt(searchEstado.value)
            : true;
          return matchesDate && matchesEstado;
        });
      });
  
      // Ordenar solicitudes
      const sortedSolicitudes = computed(() => {
        return [...filteredSolicitudes.value].sort((a, b) => {
          return dateSortOrder.value === "asc"
            ? new Date(a.fecha) - new Date(b.fecha)
            : new Date(b.fecha) - new Date(a.fecha);
        });
      });
  
      // Alternar el orden de fecha
      const toggleDateSort = () => {
        dateSortOrder.value = dateSortOrder.value === "asc" ? "desc" : "asc";
      };
  
      const goToDetails = (id) => {
        router.push(`/detailsSolicitud/${id}`);
      };

      
  
      onMounted(async () => {
        await retrieveSolicitudes();
        await retrieveEstados();
      });
  
      return {
        showMessage,
        messageContent,
        messageType,
        solicitudes,
        searchDate,
        searchEstado,
        estados,
        sortedSolicitudes,
        dateSortOrder,
        toggleDateSort,
        goToDetails,
        getStatusText,
        getStatusColor,
        formatDate,
      };
    },
  };
  </script>
  
  
  <style scoped>
  /* Ajustes menores para la tabla */
  .table th,
  .table td {
    vertical-align: middle; /* Centra el contenido verticalmente */
  }

  .arrow-button {
    border: none;
    color: black;
  }
  </style>
  