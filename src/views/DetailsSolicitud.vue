<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="details-solicitud" role="main">
    <h1>Detalles de la Solicitud</h1>
    <div class="details-solicitud-container" v-if="solicitud">
      <!-- role="region" identifica la sección de información -->
      <div class="details-solicitud-info" role="region" aria-label="Información de la solicitud">
        <!-- Lista de definiciones para los datos -->
        <dl class="info-list">
          <div class="info-item">
            <dt>Email del Solicitante:</dt>
            <dd>{{ solicitud.usuariosolicitante?.email }}</dd>
          </div>

          <div class="info-item">
            <dt>Centro Regional del Solicitante:</dt>
            <dd>{{ solicitud.usuariosolicitante?.centroregional?.centroregional }}</dd>
          </div>

          <div class="info-item">
            <dt>Email del Responsable:</dt>
            <dd>
              {{ solicitud.estadosolicitud?.descripcion === "Recibida"
                ? "Sin asignar"
                : solicitud.responsablesolicitud?.email
              }}
            </dd>
          </div>
          <div v-if="solicitud.toBecario" class="info-item">
            <dt>Becario:</dt>
            <dd>
              {{ solicitud.nombreBecario
              }}
            </dd>
          </div>
          <div class="info-item">
            <dt>Centro Regional del Responsable:</dt>
            <dd>
              {{ solicitud.estadosolicitud?.descripcion === "Recibida"
                ? "Sin asignar"
                : solicitud.responsablesolicitud?.centroregional?.centroregional
              }}
            </dd>
          </div>

          <div class="info-item">
            <dt>Estado de la Solicitud:</dt>
            <dd>{{ solicitud.estadosolicitud?.descripcion }}</dd>
          </div>

          <div class="info-item">
            <dt>Tipo de Solicitud:</dt>
            <dd>{{ solicitud.tiposolicitud?.descripcion }}</dd>
          </div>

          <div class="info-item">
            <dt>Fecha de Creación:</dt>
            <dd>{{ formatDate(solicitud.fechacreacion) }}</dd>
          </div>

          <div class="info-item description-item">
            <dt>Descripción:</dt>
            <dd class="description-text">{{ solicitud.descripcion }}</dd>
          </div>
        </dl>
      </div>

      <div class="buttons-container">
        <!-- Botón "Atender" -->
        <button class="btn btn-outline-primary" @click="assignSolicitud"
          v-if="solicitud.estadosolicitud?.idestadosolicitud === 1" aria-label="Atender esta solicitud">
          Atender
        </button>

        <!-- Botón "Asignar a Empleado" (solo para rol=1) -->
        <button class="btn btn-outline-primary" v-if="currentUserRole === 1" @click="showModal = true"
          aria-label="Asignar esta solicitud a un empleado">
          <i class="bi bi-person-badge me-2" aria-hidden="true"></i>
          Asignar a Empleado
        </button>
        <!-- Botón "Asignar a Becario"  -->
        <button class="btn btn-outline-dark" v-if="solicitud.estadosolicitud?.idestadosolicitud === 1"
          @click="showBecarioModal = true" aria-label="Asignar esta solicitud a un becario">
          <i class="bi bi-person-badge me-2" aria-hidden="true"></i>
          Asignar a Becario
        </button>

        <!-- Botón "Rechazar" -->
        <button class="btn btn-outline-danger" @click="showRejectModal = true"
          v-if="solicitud.estadosolicitud?.idestadosolicitud === 1" aria-label="Rechazar esta solicitud">
          Rechazar
        </button>

        <!-- Botón "Finalizar" (estado 3) -->
        <button class="btn btn-outline-success" @click="showFinalizeModal = true"
          v-if="solicitud.estadosolicitud?.idestadosolicitud === 2 && isResponsible"
          aria-label="Finalizar esta solicitud">
          Finalizar Solicitud
        </button>

        <!-- Botón "Cancelar" (estado 4) -->
        <button class="btn btn-outline-warning" @click="showCancelModal = true"
          v-if="solicitud.estadosolicitud?.idestadosolicitud === 2 && isResponsible"
          aria-label="Cancelar esta solicitud">
          Cancelar Solicitud
        </button>
      </div>

      <!-- Modal para asignar empleado -->
      <FormModal title="Asignar a Empleado" v-model="showModal" :reusableForm="reusableFormComponent" :formProps="{
        fields: asignToEmployeeFields,
        submitButtonText: 'Asignar a Empleado',
        onSubmit: asignToEmployee
      }" role="dialog" aria-label="Modal para asignar solicitud a empleado" />

      <!-- Modal para asignar becario -->
      <FormModal title="Asignar a Becario" v-model="showBecarioModal" :reusableForm="reusableFormComponent" :formProps="{
        fields: asignToBecarioFields,
        submitButtonText: 'Asignar a Becario',
        onSubmit: asignToBecario
      }" role="dialog" aria-label="Modal para asignar solicitud a becario" />
      <!-- Modal para cancelar solicitud -->
      <FormModal title="Cancelación de Solicitud" v-model="showCancelModal" :reusableForm="reusableFormComponent" :formProps="{
        fields: cancelFields,
        submitButtonText: 'Cancelar solicitud',
        onSubmit: cancelSolicitud
      }" role="dialog" aria-label="Modal para asignar cancelar solicitud" />
      <!-- Modal para rechazar solicitud -->
      <FormModal title="Rechazar Solicitud" v-model="showRejectModal" :reusableForm="reusableFormComponent" :formProps="{
        fields: rejectFields,
        submitButtonText: 'Rechazar solicitud',
        onSubmit: rejectSolicitud
      }" role="dialog" aria-label="Modal para asignar rechazar solicitud" />
      <!-- Modal para cancelar solicitud -->
      <FormModal title="Finalizar Solicitud" v-model="showFinalizeModal" :reusableForm="reusableFormComponent" :formProps="{
        fields: finalizeFields,
        submitButtonText: 'Finalizar solicitud',
        onSubmit: finalizeSolicitud
      }" role="dialog" aria-label="Modal para asignar finalizar solicitud" />
    </div>

    <Mensaje
        v-if="showMessage"
        :mensaje="messageContent"
        :tipo="messageType"
        :visible="showMessage"
        @update:visible="showMessage = $event"
        aria-live="polite"
        class="responsive-mensaje"
      />
  </div>
</template>

<script>
import { onMounted, ref, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Mensaje from '../components/Mensaje.vue';
import utils from '../utils';
import ReusableForm from "../components/ReusableForm.vue";
import FormModal from "../components/FormModal.vue";

export default {
  name: "DetailsSolicitud",
  components: {
    Mensaje,
    FormModal
  },
  setup() {
    const showMessage = ref(false);
    const messageContent = ref('');
    const messageType = ref('');
    const showModal = ref(false);
    const showBecarioModal = ref(false);
    const showCancelModal = ref(false);
    const showRejectModal = ref(false);
    const showFinalizeModal = ref(false);

    const solicitud = ref({});
    const router = useRouter();
    const route = useRoute();
    const currentUserRole = utils.getCurrentUserRole();
    const reusableFormComponent = ReusableForm;

    const solicitud_id = parseInt(route.params.id, 10);
    const requestURL = inject("requestURL");

    const asignToEmployeeFields = ref([]);
    const asignToBecarioFields = ref([]);
    const finalizeFields = ref([]);
    const cancelFields = ref([]);
    const rejectFields = ref([]);

    const allEmployees = ref([]);
    const solicitud_estado = ref();
    const currentUserId = utils.getCurrentUserID();
    const isResponsible = computed(() => {
      return solicitud.value?.responsablesolicitud?.idusuario === currentUserId;
    });

    const getSolicitudDetails = async (solicitud_id) => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `${requestURL}/api/v1/solicitudes/get/${solicitud_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        solicitud.value = response.data;
        solicitud_estado.value = response.data.estadosolicitud.idestadosolicitud;
      } catch (err) {
        console.error("ERROR FINDING SOLICITUD:", err.message);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const assignSolicitud = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const payloadData = {
            idsolicitud: solicitud_id,
            idresponsablesolicitud: utils.getCurrentUserID(),
            idestadosolicitud: 2 // "En proceso"
          };

          await axios.put(
            `${requestURL}/api/v1/solicitudes/atender_solicitud`,
            payloadData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          messageContent.value = 'Solicitud asignada con éxito';
          messageType.value = 'exito';
          showMessage.value = true;
          await getSolicitudDetails(solicitud_id);
        }
      } catch (err) {
        messageContent.value = 'Error al asignar la solicitud';
        messageType.value = 'error';
        showMessage.value = true;
        await getSolicitudDetails(solicitud_id);
      }
    };

    const rejectSolicitud = async (formData) => {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const payloadData = {
            idsolicitud: solicitud_id,
            idresponsablesolicitud: utils.getCurrentUserID(),
            idestadosolicitud: 5,
            retroalimentacionRechazada: formData.retroalimentacionRechazada
          };

          await axios.put(
            `${requestURL}/api/v1/solicitudes/cambiar_estado`,
            payloadData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          messageContent.value = 'Solicitud rechazada con éxito';
          messageType.value = 'exito';
          showMessage.value = true; 
          showRejectModal.value = false; // Cierra el modal
          await getSolicitudDetails(solicitud_id);
        }
      } catch (err) {
        messageContent.value = 'Error al rechazar la solicitud';
        messageType.value = 'error';
        showMessage.value = true;
        console.error("ERROR REJECTING SOLICITUD:", err.message);
      }
    };

    const finalizeSolicitud = async (formData) => {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const payloadData = {
            idsolicitud: solicitud_id,
            idresponsablesolicitud: utils.getCurrentUserID(),
            idestadosolicitud: 3, // "Finalizada"
            retroalimentacionFinalizada: formData.retroalimentacionFinalizada
          };

          await axios.put(
            `${requestURL}/api/v1/solicitudes/cambiar_estado`,
            payloadData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          messageContent.value = 'Solicitud finalizada con éxito';
          messageType.value = 'exito';
          showFinalizeModal.value = false;
          await getSolicitudDetails(solicitud_id);
        }
      } catch (err) {
        messageContent.value = 'Error al finalizar la solicitud';
        messageType.value = 'error';
        showMessage.value = true;
        console.error("ERROR FINALIZING SOLICITUD:", err.message);
      }
    };

    const cancelSolicitud = async (formData) => {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const payloadData = {
            idsolicitud: solicitud_id,
            idresponsablesolicitud: utils.getCurrentUserID(),
            idestadosolicitud: 4, // "Cancelada"
            retroalimentacionCancelada: formData.retroalimentacionCancelada
          };

          await axios.put(
            `${requestURL}/api/v1/solicitudes/cambiar_estado`,
            payloadData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          messageContent.value = 'Solicitud cancelada con éxito';
          messageType.value = 'exito';
          showCancelModal.value = false;
          await getSolicitudDetails(solicitud_id);
        }
      } catch (err) {
        messageContent.value = 'Error al cancelar la solicitud';
        messageType.value = 'error';
        showMessage.value = true;
        console.error("ERROR CANCELING SOLICITUD:", err.message);
      }
    };

    const asignToEmployee = async (formData) => {
      try {
        const token = localStorage.getItem("jwt");
        if (solicitud_estado.value === 1) {
          // Primero se pasa a "En proceso" si estaba en "Recibida"
          await axios.put(
            `${requestURL}/api/v1/solicitudes/cambiar_estado`,
            {
              idsolicitud: solicitud_id,
              idresponsablesolicitud: formData.idresponsablesolicitud,
              retroalimentacionEnProceso: formData.retroalimentacionEnProceso,
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
        }
        // Luego se asigna la solicitud
        await axios.put(
          `${requestURL}/api/v1/solicitudes/asignar_colaborador`,
          {
            idsolicitud: solicitud_id,
            idresponsablesolicitud: formData.idresponsablesolicitud,
            retroalimentacionEnProceso: formData.retroalimentacionEnProceso,
            idestadosolicitud: 2
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        getSolicitudDetails(solicitud_id);
        //cerrar modal
        showModal.value = false;
      } catch (err) {
        console.error("ERROR ASIGNING EMPLOYEE:", err.message);
      }
    };

    const retrieveEmployees = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${requestURL}/api/v1/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Filtra solo usuarios con rol = 2
        allEmployees.value = response.data
          .filter(user => user.role_id === 2)
          .map(user => ({
            value: user.idusuario,
            label: user.email
          }));
      } catch (err) {
        console.error("User Listing Failed:", err.message);
      }
    };

    const asignToBecario = async (formData) => {
      try {
        const token = localStorage.getItem("jwt");
        const responsableID = utils.getCurrentUserID();
        // Luego se asigna la solicitud
        await axios.put(
          `${requestURL}/api/v1/solicitudes/asignar_becario`,
          {
            idsolicitud: solicitud_id,
            idresponsablesolicitud: responsableID,
            nombreBecario: formData.nombreBecario,
            retroalimentacionEnProceso: formData.retroalimentacionEnProceso,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        getSolicitudDetails(solicitud_id);
        //cerrar modal
        showBecarioModal.value = false;
      } catch (err) {
        utils.errorLog(err)
      }
    };

    onMounted(async () => {
      await getSolicitudDetails(solicitud_id);
      await retrieveEmployees();
      asignToEmployeeFields.value = [
        {
          name: 'idresponsablesolicitud',
          label: 'Empleado',
          type: 'select',
          options: allEmployees.value,
        },
        {
          name: 'retroalimentacionEnProceso',
          label: 'Retroalimentación',
          type: 'text-area',
        }
      ];

      asignToBecarioFields.value = [
        {
          name: 'nombreBecario',
          label: 'Nombre Becario',
          type: 'text',
        },
        {
          name: 'retroalimentacionEnProceso',
          label: 'Detalles de asignación',
          type: 'text-area',
        },
      ];
      asignToBecarioFields.value = [
        {
          name: 'nombreBecario',
          label: 'Nombre Becario',
          type: 'text',
        },
        {
          name: 'retroalimentacionEnProceso',
          label: 'Detalles de asignación',
          type: 'text-area',
        },
      ];
      rejectFields.value = [
        {
          name: 'retroalimentacionRechazada',
          label: 'Razón de Rechazo',
          type: 'text-area',
        },
      ];
      cancelFields.value = [
        {
          name: 'retroalimentacionCancelada',
          label: 'Razón de Cancelación',
          type: 'text-area',
        },
      ];
      finalizeFields.value = [
        {
          name: 'retroalimentacionFinalizada',
          label: 'Resolución',
          type: 'text-area',
        },
      ];
    });

    return {
      finalizeFields,
      cancelFields,
      rejectFields,
      solicitud,
      formatDate,
      assignSolicitud,
      rejectSolicitud,
      finalizeSolicitud,
      cancelSolicitud,
      showMessage,
      messageContent,
      messageType,
      currentUserRole,
      reusableFormComponent,
      showModal,
      asignToEmployee,
      asignToEmployeeFields,
      isResponsible,
      showBecarioModal,
      asignToBecario,
      asignToBecarioFields,
      showCancelModal,
      showRejectModal,
      showFinalizeModal,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.details-solicitud {
  padding: 15px;
  width: 100%;
  max-width: 100%;
}

.details-solicitud-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.details-solicitud-info {
  background-color: var(--background-color);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px var(--text-shadow-color);
  width: 100%;
  max-width: 800px;
}

/* Lista de definiciones */
.info-list {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 15px;
}

.info-item {
  display: contents;
}

/* En pantallas más grandes, usamos dos columnas */
@media (min-width: 768px) {
  .info-list {
    grid-template-columns: 2fr 3fr;
    column-gap: 10px;
  }
}

/* Para pantallas pequeñas, mostramos cada item de forma apilada */
@media (max-width: 767px) {

  .info-item dt,
  .info-item dd {
    padding: 5px 0;
  }

  .info-item dt {
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
  }

  .description-item {
    display: flex;
    flex-direction: column;
  }
}

dt {
  font-weight: bold;
  color: #555;
}

dd {
  color: #333;
  margin: 0;
  word-break: break-word;
}

.description-text {
  text-align: left;
}

/* Contenedor de botones */
.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
  max-width: 800px;
}

/* En pantallas muy pequeñas, los botones toman el ancho completo */
@media (max-width: 500px) {
  .buttons-container {
    flex-direction: column;
    width: 100%;
  }

  .buttons-container button {
    width: 100%;
  }
}

.btn {
  padding: 10px 20px;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;
  border-radius: 5px;
  white-space: nowrap;
}

/* Botón primario */
.btn-outline-primary {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background-color: transparent;
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Botón de rechazo (rojo) */
.btn-outline-danger {
  color: #dc3545;
  border: 1px solid #dc3545;
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

/* Botón "Finalizar" (verde) */
.btn-outline-success {
  color: #28a745;
  border: 1px solid #28a745;
  background-color: transparent;
}

.btn-outline-success:hover {
  background-color: #28a745;
  color: white;
}

/* Botón "Cancelar" (amarillo) */
.btn-outline-warning {
  color: #ffc107;
  border: 1px solid #ffc107;
  background-color: transparent;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  color: black;
}

/* Mejora para lectores de pantalla - visualmente oculto pero accesible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
