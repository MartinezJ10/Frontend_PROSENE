<template>
    <div class="details-solicitud">
        <h1>Detalles de la Solicitud</h1>
        <div class="details-solicitud-container" v-if="solicitud">
            <div class="details-solicitud-info">
                <h2>Información de la Solicitud</h2>
                <div class="info-item">
                    <span class="info-label">ID de la Solicitud:</span>
                    <span class="info-value">{{ solicitud.idsolicitud }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email del Solicitante:</span>
                    <span class="info-value">{{ solicitud.usuariosolicitante?.email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Centro Regional del Solicitante:</span>
                    <span class="info-value">{{ solicitud.usuariosolicitante?.centroregional?.centroregional }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email del Responsable:</span>
                    <span class="info-value">
                        {{ solicitud.estadosolicitud?.descripcion === "Recibida" ? "Sin asignar" :
                            solicitud.responsablesolicitud?.email }}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Centro Regional del Responsable:</span>
                    <span class="info-value">
                        {{ solicitud.estadosolicitud?.descripcion === "Recibida" ? "Sin asignar" :
                            solicitud.responsablesolicitud?.centroregional?.centroregional }}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estado de la Solicitud:</span>
                    <span class="info-value">{{ solicitud.estadosolicitud?.descripcion }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo de Solicitud:</span>
                    <span class="info-value">{{ solicitud.tiposolicitud?.descripcion }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Fecha de Creación:</span>
                    <span class="info-value">{{ formatDate(solicitud.fechacreacion) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Descripcion:</span>
                    <span class="info-value description-text">{{ solicitud.descripcion }}</span>
                </div>
            </div>
            
            <div class="buttons-container">
                <button class="btn btn-outline-primary" @click="assignSolicitud"
                    v-if="solicitud.estadosolicitud?.idestadosolicitud === 1">
                    <i class="bi bi-check-circle me-2"></i>
                    Atender
                </button>
                <button class="btn btn-outline-primary" v-if="currentUserRole === 1" @click="showModal = true">
                    <i class="bi bi-person-badge me-2"></i>
                    Asignar a Empleado
                </button>
            </div>
            
            <FormModal title="Asignar a Empleado" v-model="showModal" :reusableForm="reusableFormComponent" :formProps="{
                fields: asignToEmployeeFields,
                submitButtonText: 'Asignar a Empleado',
                onSubmit: asignToEmployee
            }" />
        </div>
        <Mensaje v-if="showMessage" :mensaje="messageContent" :tipo="messageType" :visible="showMessage"
            @update:visible="showMessage = false" />
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Mensaje from '../components/Mensaje.vue'; // Importa el componente
import utils from '../utils';

import ReusableForm from "../components/ReusableForm.vue";
import FormModal from "../components/FormModal.vue";


export default {
    name: "DetailsSolicitud",
    components: {
        Mensaje, FormModal
    },
    setup() {
        const showMessage = ref(false); // Controla la visibilidad del mensaje
        const messageContent = ref(''); // Contenido del mensaje
        const messageType = ref(''); // Tipo de mensaje (éxito o error)
        const showModal = ref(false)

        const solicitud = ref({});
        const router = useRouter();
        const route = useRoute();
        const currentUserRole = utils.getCurrentUserRole();
        const reusableFormComponent = ReusableForm

        const solicitud_id = parseInt(route.params.id,10);

        const asignToEmployeeFields = ref([])
        const allEmployees = ref([])
        const solicitud_estado = ref()

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
                
                solicitud_estado.value = response.data.estadosolicitud.idestadosolicitud
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
                        idestadosolicitud: 2 // Cambia el estado de la solicitud a 2
                    };

                    const response = await axios.put(
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

        const asignToEmployee = async (formData) => {
            try {
                console.log({
                    idsolicitud: solicitud_id,
                    idresponsablesolicitud: formData.idresponsablesolicitud,
                    
                });
                console.log("estado", solicitud_estado.value);
                
                if (solicitud_estado.value === 1) {
                        const response = await axios.put(
                        'http://localhost:8000/api/v1/solicitudes/atender',
                        {
                            idsolicitud: solicitud_id,
                            idresponsablesolicitud: formData.idresponsablesolicitud,
                            idestadosolicitud: 2 //cambio a en proceso
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                            }
                        }
                    );
                }
                const response = await axios.put(
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
        }

        const retrieveEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/users/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    }
                });

                allEmployees.value = response.data.filter(user => user.role_id === 2).map(user => ({
                    value: user.idusuario,
                    label: user.email
                }));

            } catch (err) {
                console.error("User Listing Failed:", err.message);
            }
        }

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
            showMessage, // Añade la referencia de visibilidad del mensaje
            messageContent, // Añade la referencia del contenido del mensaje
            messageType, // Añade la referencia del tipo de mensaje
            currentUserRole,
            reusableFormComponent,
            showModal,
            asignToEmployee,
            asignToEmployeeFields
        };
    },
};
</script>

<style scoped>
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
    max-width: 600px;
}

.details-solicitud-info h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    color: #555;
}

.info-value {
    color: #333;
}

/* Nuevo contenedor para los botones */
.buttons-container {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.btn {
    padding: 10px 20px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn-outline-primary {
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    background-color: transparent;
    border-radius: 5px;
}

.btn-outline-primary:hover {
    background-color: var(--primary-color);
    color: white;
}

.description-text {
    text-align: center;
}
</style>