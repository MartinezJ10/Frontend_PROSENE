<template>
  <!-- role="main" define el contenido principal para lectores de pantalla -->
  <div class="details-user-page container py-4" role="main">
    <!-- Card central con sombra -->
    <div class="card mx-auto shadow-sm p-4" style="max-width: 70dvw; overflow: auto;" role="region" aria-label="Detalles del usuario">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <!-- Título principal con icono -->
          <h1 class="card-title mb-0">
            <i class="bi bi-person-circle me-2"></i>Detalles de Usuario
          </h1>
          
          <!-- Badge de estado -->
          <span 
            :class="[
              'badge', 
              userFound.isactive ? 'bg-success' : 'bg-danger'
            ]"
            aria-label="Estado del usuario"
          >
            {{ userFound.isactive ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <!-- Alerta cuando los datos están cargando -->
        <div v-if="loading" class="alert alert-info" aria-live="polite">
          <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
            <span>Cargando información del usuario...</span>
          </div>
        </div>

        <!-- Contenido principal - Mostrar cuando no está cargando -->
        <template v-else>
          <!-- Sección de información personal con bordes y mejor organización -->
          <div class="info-section p-3 mb-4 border rounded bg-light">
            <h2 class="h5 fw-bold border-bottom pb-2 mb-3">
              <i class="bi bi-file-person me-2"></i>Información Personal
            </h2>
            
            <div class="row g-3">
              <!-- Primera columna -->
              <div class="col-md-6">
                <p class="mb-2"><strong>Nombre:</strong> {{ fullName || 'N/A' }}</p>
                <p class="mb-2"><strong>Número de Identidad:</strong> {{ userFound.persona?.numeroidentidad || 'N/A' }}</p>
                <p class="mb-2"><strong>Edad:</strong> {{ edad }}</p>
                <p class="mb-2"><strong>Sexo:</strong> {{ userFound.persona?.sexo || 'N/A' }}</p>
              </div>
              
              <!-- Segunda columna -->
              <div class="col-md-6">
                <p class="mb-2"><strong>Dirección:</strong> {{ userFound.persona?.direccion || 'N/A' }}</p>
                <p class="mb-2"><strong>Teléfono:</strong> 
                  <a v-if="userFound.persona?.telefono" :href="`tel:${userFound.persona?.telefono}`">
                    {{ userFound.persona?.telefono }}
                  </a>
                  <span v-else>N/A</span>
                </p>
                <p class="mb-2"><strong>Correo:</strong> 
                  <a v-if="userFound?.email" :href="`mailto:${userFound?.email}`">
                    {{ userFound?.email }}
                  </a>
                  <span v-else>N/A</span>
                </p>
                <p class="mb-2"><strong>Centro Regional:</strong> {{ centroRegionalNombre }}</p>
              </div>
            </div>
          </div>

          <!-- Sección de rol y permisos, si aplica -->
          <div v-if="userFound.role_id" class="info-section p-3 mb-4 border rounded bg-light">
            <h2 class="h5 fw-bold border-bottom pb-2 mb-3">
              <i class="bi bi-shield-lock me-2"></i>Rol y Permisos
            </h2>
            <p><strong>Rol asignado:</strong> {{ rolName }}</p>
          </div>

          <!-- Sección de acciones (botones) -->
          <div class="d-flex flex-wrap gap-2 justify-content-center mt-4">
            <!-- Botón "Revisar Ficha" solo si es Estudiante -->
            <button
              v-if="userFound.role_id === 3"
              class="btn btn-info"
              @click="router.push(`/enrollmentDetails/${userFound.idusuario}`)"
              aria-label="Revisar ficha de inscripción"
            >
              <i class="bi bi-file-earmark-text me-1"></i> Revisar Ficha de Inscripción
            </button>

            <!-- Botón "Actualizar" -->
            <button 
              class="btn btn-warning text-dark" 
              @click="showModal = true"
              aria-label="Actualizar usuario"
            >
              <i class="bi bi-pencil-square me-1"></i> Actualizar
            </button>

            <!-- Botón "Activar/Desactivar" -->
            <button
              :class="userFound.isactive ? 'btn btn-danger' : 'btn btn-success'"
              @click="confirmToggleActive"
              aria-label="Activar o Desactivar usuario"
            >
              <i :class="userFound.isactive ? 'bi bi-person-x me-1' : 'bi bi-person-check me-1'"></i>
              {{ userFound.isactive ? 'Desactivar' : 'Activar' }}
            </button>

            <!-- Botón "Volver" -->
            <button 
              class="btn btn-secondary" 
              @click="router.push('/manageUsers')"
              aria-label="Volver a la lista de usuarios"
            >
              <i class="bi bi-arrow-left me-1"></i> Volver
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal de confirmación para activar/desactivar -->
    <div v-if="showConfirmModal" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ userFound.isactive ? 'Desactivar' : 'Activar' }} Usuario</h5>
            <button type="button" class="btn-close" @click="showConfirmModal = false" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea {{ userFound.isactive ? 'desactivar' : 'activar' }} al usuario <strong>{{ fullName }}</strong>?</p>
            <p v-if="userFound.isactive" class="text-danger">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> 
              El usuario no podrá acceder al sistema mientras esté desactivado.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showConfirmModal = false">Cancelar</button>
            <button 
              type="button" 
              :class="userFound.isactive ? 'btn btn-danger' : 'btn btn-success'"
              @click="toggleActiveUser"
            >
              {{ userFound.isactive ? 'Sí, Desactivar' : 'Sí, Activar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Overlay para cuando el modal está abierto -->
    <div v-if="showConfirmModal" class="modal-backdrop fade show"></div>

    <!-- Modal para actualizar usuario -->
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

    <!-- Componente de mensaje -->
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
import { onMounted, ref, watch, computed, inject } from 'vue';
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
    const showConfirmModal = ref(false);
    const showMessage = ref(false);
    const messageContent = ref('');
    const messageType = ref('');
    const requestURL = inject('requestURL');
    const userFound = ref({});
    const updateUsersFields = ref([]);
    const reusableFormComponent = ReusableForm;
    const centrosRegionales = ref([]);
    const loading = ref(true);
    const roles = ref([
      { id: 1, nombre: 'Administrador' },
      { id: 2, nombre: 'Empleado' },
      { id: 3, nombre: 'Estudiante' },
      { id: 4, nombre: 'Administrativo' }
    ]);

    const router = useRouter();
    const routeData = useRoute();
    const userId = routeData.params.id;

    // --- Computed properties ---
    const fullName = computed(() => {
      if (!userFound.value.persona) return 'N/A';
      const nombres = [
        userFound.value.persona.primernombre || '',
        userFound.value.persona.segundonombre || ''
      ].filter(Boolean).join(' ');
      
      const apellidos = [
        userFound.value.persona.primerapellido || '',
        userFound.value.persona.segundoapellido || ''
      ].filter(Boolean).join(' ');
      
      return `${nombres} ${apellidos}`.trim();
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

    const rolName = computed(() => {
      const role = roles.value.find(r => r.id === userFound.value.role_id);
      return role ? role.nombre : 'No asignado';
    });

    const centroRegionalNombre = computed(() => {
      if (!userFound.value) return 'No asignado';
        
      // 1) Si tu API devuelve userFound.value.idcentroregional:
      const id = userFound.value.idcentroregional;
        
      // 2) Si en tu API userFound.value.centroregional es un objeto:
      // const id = userFound.value.centroregional?.idcentroregional;
        
      const match = centrosRegionales.value.find(c => c.value === id);
        
      return match
        ? match.label
        : (userFound.value.centroregional?.centroregional || 'No asignado');
    });
    

    // --- Lógica para obtener detalles del usuario ---
    const getSingleUserDetails = async (userId) => {
      loading.value = true;
      try {
        const response = await axios.get(
          `${requestURL}/api/v1/users/get/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          }
        );
        userFound.value = response.data;
      } catch (err) {
        console.error('ERROR FINDING USER:', err.message || err);
        messageContent.value = 'Error al cargar los datos del usuario';
        messageType.value = 'error';
        showMessage.value = true;
      } finally {
        loading.value = false;
      }
    };

    // --- Carga de catálogos (Centros Regionales) ---
    const retrieveCentrosRegionales = async () => {
      try {
        const response = await axios.get(
          `${requestURL}/api/v1/varios/centros`,
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
        console.error('Error al cargar centros regionales:', err.message || err);
      }
    };

    // --- Confirmar activar/desactivar usuario ---
    const confirmToggleActive = () => {
      showConfirmModal.value = true;
    };

    // --- Alternar estado activo/inactivo ---
    const toggleActiveUser = async () => {
      const email = userFound.value.email;
      const token = localStorage.getItem('jwt');
      
      try {
        if (userFound.value.isactive) {
          // Desactivar
          await axios.put(
            `${requestURL}/api/v1/users/delete/?email=${encodeURIComponent(email)}`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          messageContent.value = 'Usuario desactivado con éxito';
        } else {
          // Activar
          await axios.post(
            `${requestURL}/api/v1/users/activate?email=${encodeURIComponent(email)}`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          messageContent.value = 'Usuario activado con éxito';
        }
      
        // Cerrar modal y mostrar mensaje
        showConfirmModal.value = false;
        messageType.value = 'exito';
        showMessage.value = true;
        
        // Vuelve a traer el usuario para actualizar el estado en pantalla
        await getSingleUserDetails(userFound.value.idusuario);
      } catch (err) {
        console.error('ERROR AL CAMBIAR ESTADO:', err);
        showConfirmModal.value = false;
        messageContent.value = 'Error al cambiar el estado del usuario';
        messageType.value = 'error';
        showMessage.value = true;
      }
    };

    // --- Actualizar usuario ---
    const updateSingleUser = async (formData) => {
      try {
        const response = await axios.put(
          `${requestURL}/api/v1/users/update/?email=${userFound.value.email}`,
          {
            email: userFound.value.email,
            role_id: userFound.value.role_id,
            isactive: userFound.value.isactive,
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

        // Actualizar datos locales en lugar de redireccionar
        await getSingleUserDetails(userFound.value.idusuario);
      } catch (err) {
        console.error('ERROR UPDATING USER:', err.message || err);
        messageContent.value = 'Error al actualizar el usuario';
        messageType.value = 'error';
        showMessage.value = true;
        showModal.value = false;
      }
    };

    // --- Actualizar campos del formulario cuando cambia userFound ---
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
            required: true,
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
      updateUsersFields,
      updateSingleUser,
      showModal,
      showConfirmModal,
      reusableFormComponent,
      FormModal,
      showMessage,
      messageContent,
      messageType,
      fullName,
      toggleActiveUser,
      confirmToggleActive,
      edad,
      loading,
      rolName,
      centroRegionalNombre
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.details-user-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Ajustes a la card principal */
.card {
  border: none; 
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.card-title {
  font-size: 1.75rem;
  color: #002D62;
  font-weight: 600;
}

/* Estilizado de las secciones de información */
.info-section {
  transition: all 0.3s ease;
}

.info-section:hover {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.info-section h2 {
  color: #002D62;
}

.info-section p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.info-section p strong {
  min-width: 140px;
  display: inline-block;
  color: #555;
}

/* Estilo para los links */
a {
  color: #0056b3;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #003d7a;
  text-decoration: underline;
}

/* ---- Estilos para los botones ---- */
.btn {
  border-radius: 4px;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

/* Colores para botones */
.btn-info {
  background-color: #0BA9C3;
  border-color: #0BA9C3;
  color: white;
}
.btn-info:hover {
  background-color: #0A98B0;
  border-color: #0A98B0;
}

.btn-warning {
  background-color: #F2C63B;
  border-color: #F2C63B;
  color: #212529;
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

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

/* Ajustes para la sección de botones */
.d-flex.flex-wrap.gap-2.justify-content-center > .btn {
  min-width: 140px;
  margin: 0.25rem;
}

/* Badge personalizado */
.badge {
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
  font-weight: 500;
}

/* Estilo para el modal de confirmación */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card, .info-section {
  animation: fadeIn 0.3s ease-out;
}
</style>