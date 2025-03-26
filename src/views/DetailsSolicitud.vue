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
            
            <div class="info-item">
              <dt>Descripción:</dt>
              <dd class="description-text">{{ solicitud.descripcion }}</dd>
            </div>
          </dl>
        </div>
  
        <div class="buttons-container">
          <!-- Botón "Atender" -->
          <button 
            class="btn btn-outline-primary" 
            @click="assignSolicitud"
            v-if="solicitud.estadosolicitud?.idestadosolicitud === 1"
            aria-label="Atender esta solicitud"
          >
            Atender
          </button>
          
          <!-- Botón "Asignar a Empleado" (solo para rol=1) -->
          <button 
            class="btn btn-outline-primary" 
            v-if="currentUserRole === 1 && solicitud.estadosolicitud?.idestadosolicitud === 1"
            @click="showModal = true"
            aria-label="Asignar esta solicitud a un empleado"
          >
            <i class="bi bi-person-badge me-2" aria-hidden="true"></i>
            Asignar a Empleado
          </button>
  
          <!-- Botón "Rechazar" -->
          <button 
            class="btn btn-outline-danger" 
            @click="rejectSolicitud"
            v-if="solicitud.estadosolicitud?.idestadosolicitud === 1"
            aria-label="Rechazar esta solicitud"
          >
            Rechazar
          </button>
  
          <!-- Botón "Finalizar" (estado 3) -->
          <button
            class="btn btn-outline-success"
            @click="finalizeSolicitud"
            v-if="solicitud.estadosolicitud?.idestadosolicitud === 2 && isResponsible"
            aria-label="Finalizar esta solicitud"
          >
            Finalizar Solicitud
          </button>
  
          <!-- Botón "Cancelar" (estado 4) -->
          <button
            class="btn btn-outline-warning"
            @click="cancelSolicitud"
            v-if="solicitud.estadosolicitud?.idestadosolicitud === 2 && isResponsible"
            aria-label="Cancelar esta solicitud"
          >
            Cancelar Solicitud
          </button>
        </div>
        
        <!-- Modal para asignar empleado -->
        <FormModal 
          title="Asignar a Empleado" 
          v-model="showModal" 
          :reusableForm="reusableFormComponent" 
          :formProps="{
            fields: asignToEmployeeFields,
            submitButtonText: 'Asignar a Empleado',
            onSubmit: asignToEmployee
          }" 
          role="dialog"
          aria-label="Modal para asignar solicitud a empleado"
        />
      </div>
  
      <!-- Mensajes dinámicos -->
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
  import { onMounted, ref, computed } from 'vue';
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
  
      const solicitud = ref({});
      const router = useRouter();
      const route = useRoute();
      const currentUserRole = utils.getCurrentUserRole();
      const reusableFormComponent = ReusableForm;
  
      const solicitud_id = parseInt(route.params.id, 10);
  
      const asignToEmployeeFields = ref([]);
      const allEmployees = ref([]);
      const solicitud_estado = ref();
      const currentUserId = utils.getCurrentUserID();
      const isResponsible = computed(() => {
        return solicitud.value?.responsablesolicitud?.idusuario === currentUserId;
      });
      
  
      const getSolicitudDetails = async (solicitud_id) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/solicitudes/get/${solicitud_id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
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
              'http://localhost:8000/api/v1/solicitudes/atender',
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
          console.error("ERROR ASSIGNING SOLICITUD:", err.message);
        }
      };
  
      // Método para rechazar la solicitud (estado 5)
      const rejectSolicitud = async () => {
        try {
          const token = localStorage.getItem("jwt");
          if (token) {
            const payloadData = {
              idsolicitud: solicitud_id,
              idresponsablesolicitud: utils.getCurrentUserID(),
              idestadosolicitud: 5 // "Rechazada"
            };
  
            await axios.put(
              'http://localhost:8000/api/v1/solicitudes/atender',
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
  
            await getSolicitudDetails(solicitud_id);
          }
        } catch (err) {
          messageContent.value = 'Error al rechazar la solicitud';
          messageType.value = 'error';
          showMessage.value = true;
          console.error("ERROR REJECTING SOLICITUD:", err.message);
        }
      };
  
      // Método para finalizar la solicitud (estado 3)
      const finalizeSolicitud = async () => {
        try {
          const token = localStorage.getItem("jwt");
          if (token) {
            const payloadData = {
              idsolicitud: solicitud_id,
              idresponsablesolicitud: utils.getCurrentUserID(),
              idestadosolicitud: 3 // "Finalizada"
            };
  
            await axios.put(
              'http://localhost:8000/api/v1/solicitudes/atender',
              payloadData,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            messageContent.value = 'Solicitud finalizada con éxito';
            messageType.value = 'exito';
            showMessage.value = true;
  
            await getSolicitudDetails(solicitud_id);
          }
        } catch (err) {
          messageContent.value = 'Error al finalizar la solicitud';
          messageType.value = 'error';
          showMessage.value = true;
          console.error("ERROR FINALIZING SOLICITUD:", err.message);
        }
      };
  
      // Método para cancelar la solicitud (estado 4)
      const cancelSolicitud = async () => {
        try {
          const token = localStorage.getItem("jwt");
          if (token) {
            const payloadData = {
              idsolicitud: solicitud_id,
              idresponsablesolicitud: utils.getCurrentUserID(),
              idestadosolicitud: 4 // "Cancelada"
            };
  
            await axios.put(
              'http://localhost:8000/api/v1/solicitudes/atender',
              payloadData,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            messageContent.value = 'Solicitud cancelada con éxito';
            messageType.value = 'exito';
            showMessage.value = true;
  
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
          if (solicitud_estado.value === 1) {
            // Primero la pasamos a "En proceso" si estaba en "Recibida"
            await axios.put(
              'http://localhost:8000/api/v1/solicitudes/atender',
              {
                idsolicitud: solicitud_id,
                idresponsablesolicitud: formData.idresponsablesolicitud,
                idestadosolicitud: 2
              },
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                }
              }
            );
          }
          // Luego se asigna la solicitud
          await axios.put(
            'http://localhost:8000/api/v1/solicitudes/asignar',
            {
              idsolicitud: solicitud_id,
              idresponsablesolicitud: formData.idresponsablesolicitud,
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
              }
            }
          );
  
          messageContent.value = 'Solicitud asignada con éxito';
          messageType.value = 'exito';
          showMessage.value = true;
          showModal.value = false;
  
          await getSolicitudDetails(solicitud_id);
        } catch (err) {
          messageContent.value = 'Error al asignar la solicitud';
          messageType.value = 'error';
          showMessage.value = true;
          console.error("ERROR ASSIGNING SOLICITUD:", err.message);
        }
      };
  
      const retrieveEmployees = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/v1/users/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
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
        ];
      });
  
      return {
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
      };
    },
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .details-solicitud {
    padding: 20px;
  }
  
  .details-solicitud-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .details-solicitud-info {
    background-color: var(--background-color);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px var(--text-shadow-color);
    width: 100%;
    max-width: 800px;
  }
  
  /* Lista de definiciones */
  .info-list {
    display: grid;
    grid-template-columns: 2fr 3fr;
    column-gap: 10px;
    row-gap: 15px;
  }
  
  .info-item {
    display: contents;
  }
  
  dt {
    font-weight: bold;
    color: #555;
  }
  
  dd {
    color: #333;
    margin: 0;
  }
  
  .description-text {
    text-align: center;
  }
  
  /* Contenedor de botones */
  .buttons-container {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 16px;
    transition: all 0.3s ease;
    border-radius: 5px;
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
  </style>
  