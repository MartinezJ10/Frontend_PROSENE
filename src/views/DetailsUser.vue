<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="details-user-page container py-4" role="main">
    <!-- Card central con sombra -->
    <!-- role="region" identifica la sección de detalles -->
    <div class="card mx-auto shadow-sm p-4" style="max-width: 600px;" role="region" aria-label="Detalles del usuario">
      <div class="card-body">
        <!-- Título principal -->
        <h1 class="card-title text-center mb-4">Detalles de Usuario</h1>

        <!-- Sección de información del usuario -->
        <div class="mb-4">
          <h2 class="h5 fw-bold">Información Personal</h2>
          <p class="mb-1"><strong>Nombre:</strong> {{ fullName }}</p>
          <p class="mb-1"><strong>Número de Identidad:</strong> {{ userFound.persona?.numeroidentidad || 'N/A' }}</p>
          <p class="mb-1"><strong>Edad:</strong> {{ edad }}</p>
          <p class="mb-1"><strong>Sexo:</strong> {{ userFound.persona?.sexo || 'N/A' }}</p>
          <p class="mb-1"><strong>Dirección:</strong> {{ userFound.persona?.direccion || 'N/A' }}</p>
          <p class="mb-1"><strong>Teléfono:</strong> {{ userFound.persona?.telefono || 'N/A' }}</p>
          <p class="mb-1"><strong>Correo:</strong> {{ userFound?.email || 'N/A' }}</p>
        </div>

        <!-- Sección de acciones (botones) -->
        <div class="d-flex flex-wrap gap-2 justify-content-center">
          <!-- Botón "Revisar Ficha" solo si es Estudiante -->
          <button
            v-if="userFound.role_id === 3"
            class="btn btn-info"
            @click="router.push(`/enrollmentDetails/${userFound.idusuario}`)"
            aria-label="Revisar ficha de inscripción"
          >
            Revisar Ficha de Inscripción
          </button>

          <!-- Botón "Actualizar" -->
          <button 
            class="btn btn-warning text-dark" 
            @click="showModal = true"
            aria-label="Actualizar usuario"
          >
            Actualizar
          </button>
          <!-- role="dialog" para el modal -->
          <FormModal
            title="Actualizar Usuario"
            v-model="showModal"
            :reusableForm="reusableFormComponent"
            :formProps="{
              fields: updateUsersFields,
              submitButtonText: 'Actualizar Usuario',
              onSubmit: updateSingleUser
            }"
            role="dialog"
            aria-label="Modal de actualización de usuario"
          />

          <!-- Botón "Eliminar" -->
          <button 
            class="btn btn-danger" 
            @click="deleteSingleUser"
            aria-label="Eliminar usuario"
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>

    <!-- Componente de mensaje -->
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
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import FormModal from '../components/FormModal.vue';
import ReusableForm from '../components/ReusableForm.vue';
import Mensaje from '../components/Mensaje.vue';

export default {
  name: 'DetailsUser',
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

    const userFound = ref({});
    const updateUsersFields = ref([]);
    const reusableFormComponent = ReusableForm;
    const centrosRegionales = ref([]);
    const isactiveOptions = ref([
      { value: true, label: 'Activo' },
      { value: false, label: 'Inactivo' }
    ]);

    const router = useRouter();
    const routeData = useRoute();
    const userId = routeData.params.id;

    // --- Lógica para obtener detalles del usuario ---
    const getSingleUserDetails = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/get/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          }
        );
        userFound.value = response.data;
      } catch (err) {
        console.error('ERROR FINDING USER:', err.message || err);
      }
    };

    const fullName = computed(() => {
      if (!userFound.value.persona) return 'N/A';
      return `${userFound.value.persona.primernombre || ''} ${userFound.value.persona.primerapellido || ''}`.trim();
    });

    const edad = computed(() => {
      if (!userFound.value.persona?.fechanacimiento) return 'N/A';
      const birthDate = new Date(userFound.value.persona.fechanacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    });

    // --- Eliminar usuario ---
    const deleteSingleUser = async () => {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/v1/users/delete/?email=${userFound.value.email}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          }
        );
        console.log(response.data);

        messageContent.value = 'Usuario eliminado con éxito';
        messageType.value = 'exito';
        showMessage.value = true;

        router.push('/WelcomeMessage');
      } catch (err) {
        console.error('ERROR DELETING USER:', err.message || err);
        messageContent.value = 'Error al eliminar el usuario';
        messageType.value = 'error';
        showMessage.value = true;
      }
    };

    // --- Carga de catálogos (Centros Regionales y Roles) ---
    const retrieveCentrosRegionales = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/v1/varios/centros',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          }
        );
        centrosRegionales.value = response.data.map((centro) => ({
          value: centro.idcentroregional,
          label: centro.centroregional,
        }));
      } catch (err) {
        console.error('Failed to retrieve Centros Regionales:', err.message || err);
      }
    };

    // --- Actualizar usuario ---
    const updateSingleUser = async (formData) => {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/v1/users/update/?email=${userFound.value.email}`,
          {
            email: formData.email,
            role_id: formData.rol,
            isactive: formData.isactive,
            idcentroregional: formData.centroregional,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          }
        );

        messageContent.value = 'Usuario actualizado con éxito';
        messageType.value = 'exito';
        showMessage.value = true;
        showModal.value = false;

        router.push('/manageUsers');
      } catch (err) {
        console.error('ERROR UPDATING USER:', err.message || err);

        messageContent.value = 'Error al actualizar el usuario';
        messageType.value = 'error';
        showMessage.value = true;
        showModal.value = false;
      }
    };

    watch(
      () => userFound.value,
      (newUserFound) => {
        updateUsersFields.value = [
          {
            name: 'centroregional',
            label: 'Centro Regional',
            type: 'select',
            value: newUserFound.idcentroregional,
            options: centrosRegionales.value,
          },
        ];
      },
      { deep: true, immediate: true }
    );

    // --- Montaje del componente ---
    onMounted(async () => {
      await retrieveCentrosRegionales();
      await getSingleUserDetails(userId);
    });

    return {
      userFound,
      router,
      deleteSingleUser,
      updateUsersFields,
      updateSingleUser,
      showModal,
      reusableFormComponent,
      FormModal,
      updateUsersFields,
      showMessage,
      messageContent,
      messageType,
      fullName,
      edad
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.details-user-page {
  background-color: #f8f9fa;
}

/* Ajustes a la card principal */
.card {
  border: none; 
  border-radius: 0.75rem;
}

.card-title {
  font-size: 1.75rem;
  color: #002D62;
}

/* Ajustes de la sección de info de usuario */
.card-body h2 {
  color: #002D62;
}

.card-body p {
  font-size: 1rem;
  margin: 0.25rem 0;
}

/* ---- Estilos para los botones (vivos pero formales, esquinas cuadradas) ---- */
.btn {
  border-radius: 0; /* Esquinas cuadradas */
  font-weight: 600;
  box-shadow: none;
  opacity: 0.95;
}

/* Colores más vivos (pero formales) */
.btn-info {
  background-color: #0BA9C3;
  border-color: #0BA9C3;
}
.btn-info:hover {
  background-color: #0A98B0;
  border-color: #0A98B0;
}

.btn-primary {
  background-color: #3572B0;
  border-color: #3572B0;
}
.btn-primary:hover {
  background-color: #2E64A0;
  border-color: #2E64A0;
}

.btn-warning {
  background-color: #F2C63B;
  border-color: #F2C63B;
  color: #000;
}
.btn-warning:hover {
  background-color: #E2B333;
  border-color: #E2B333;
}

.btn-danger {
  background-color: #D55252;
  border-color: #D55252;
}
.btn-danger:hover {
  background-color: #C94B4B;
  border-color: #C94B4B;
}

/* Ajustes para la sección de botones */
.d-flex.flex-wrap.gap-2.justify-content-center > .btn {
  min-width: 140px;
  margin: 0.5rem 0;
}
</style>