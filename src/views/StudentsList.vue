<template>
  <div class="manage-users-page">
    <div class="right-container">
      <div class="page-header">
        <h1 class="page-title">Lista de Estudiantes</h1>
        <div class="filter-container">
          <i class="bi bi-search"></i>
          <select 
            v-model="selectedCentroRegional" 
            class="filter-select"
            @change="onCentroChange"
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
          <i class="bi bi-chevron-down select-icon"></i>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Centro Regional</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in paginatedUsers" 
              :key="user.idusuario"
            >
              <td>
                {{ user.persona ? user.persona.primernombre + " " + user.persona.primerapellido : "Sin datos" }}
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.centroregional.centroregional }}</td>
              <td>
                <span :class="{'status-active': user.isactive, 'status-inactive': !user.isactive}">
                  <span class="status-circle"></span>
                  {{ user.isactive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button 
                  class="btn btn-sm btn-primary" 
                  @click.stop="router.push(`/detailsUser/${user.idusuario}`)"
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

      <div class="pagination-container">
        <button :disabled="currentPage === 1" @click="prevPage">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">Siguiente</button>
      </div>

      <Mensaje
        v-if="showMessage"
        :mensaje="messageContent"
        :tipo="messageType"
        :visible="showMessage"
        @update:visible="showMessage = false"
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
    const pageSize = ref(5); // cantidad fija de usuarios por página

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
          user.centroregional.idcentroregional === selectedCentroRegional.value)
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
      pageSize,
      totalPages,
      paginatedUsers,
      nextPage,
      prevPage,
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
  overflow-y: none;
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
  top: 74vh; /* Ajusta este valor según la altura de tu contenedor */
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
