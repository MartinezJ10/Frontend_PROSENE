<template>
    <div class="details-user">
        <h1>Detalles de Usuario</h1>
        <div class="details-user-container">
            <div class="details-user-info">
                <h2>Información del Usuario</h2>
                <p><strong>Email: {{ userFound.email }}</strong></p>
                <p v-if="userFound.role_id === 1">Rol: Administrador</p>
                <p v-else-if="userFound.role_id === 2">Rol: Empleado/Colaborador</p>
                <p v-else-if="userFound.role_id === 3">Rol: Estudiante</p>
                <p>Centro Regional: {{ userFound.centroregional?.centroregional }}</p>
            </div>
            <div class="details-user-actions">
                <button class="rounded-button" @click="showDetailsModal = true">Detalles Personales</button>
                <FormModal title="Detalles Personales de Usuario" v-model="showDetailsModal"
                    :reusableForm="reusableFormComponent" :formProps="{
                        fields: detailsUsersFields,
                        submitButtonText: 'Confirmar',
                        onSubmit: submitUserDetails
                    }">
                </FormModal>

                <button class="rounded-button" @click="showModal = true">Actualizar</button>
                <FormModal title="Actualizar Usuario" v-model="showModal" :reusableForm="reusableFormComponent"
                    :formProps="{
                        fields: updateUsersFields,
                        submitButtonText: 'Actualizar Usuario',
                        onSubmit: updateSingleUser
                    }">
                </FormModal>
                <button class="rounded-button danger" @click=deleteSingleUser>Eliminar</button>
            </div>
        </div>
        <!--componente de mensaje -->
      <Mensaje v-if="showMessage" :mensaje="messageContent" :tipo="messageType" :visible="showMessage" @update:visible="showMessage = false" />
    </div>

</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import FormModal from '../components/FormModal.vue';
import ReusableForm from '../components/ReusableForm.vue';
import Mensaje from '../components/Mensaje.vue'; // Importa el componente

export default {
    name: "DetailsUser",
    components: {
        FormModal,
        ReusableForm,
        Mensaje,
    },
    setup() {
        const showModal = ref(false);
        const showDetailsModal = ref(false);
        const showMessage = ref(false); // Controla la visibilidad del mensaje
        const messageContent = ref(''); // Contenido del mensaje
        const messageType = ref(''); // Tipo de mensaje (éxito o error)

        const userFound = ref({});
        const reusableFormComponent = ReusableForm;
        const updateUsersFields = ref([]);
        const detailsUsersFields = ref([]);
        const centrosRegionales = ref([]);
        const roles = ref([]);
        const isActiveOptions = ref([
            { value: true, label: 'Activo' },
            { value: false, label: 'Inactivo' }
        ]);

        const router = useRouter();
        const routeData = useRoute();

        const userId = routeData.params.id;

        const getSingleUserDetails = async (userId) => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/users/get/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                userFound.value = response.data;
            } catch (err) {
                console.error("ERROR FINDING USER:" || err.message);
            }
        };

        const deleteSingleUser = async () => {
            try {
                const response = await axios.put(
                    `http://localhost:8000/api/v1/users/delete/?email=${userFound.value.email}`,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                console.log(response.data);

                messageContent.value = 'Usuario eliminado con éxito'; // Establece el contenido del mensaje
                messageType.value = 'exito'; // Tipo de mensaje de éxito
                showMessage.value = true; // Muestra el mensaje

                router.push("/manageUsers");

            } catch (err) {
                console.error("ERROR DELETING USER:", {
                    message: err.message,
                    response: err.response, // Full response from the server
                    request: err.request,   // Request details
                    config: err.config      // Axios request configuration
                });
                
                messageContent.value = 'Error al eliminar el usuario'; // Establece el contenido del mensaje de error
                messageType.value = 'error'; // Tipo de mensaje de error
                showMessage.value = true; // Muestra el mensaje
            }
        };

        const retrieveCentrosRegionales = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/varios/centros",
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                centrosRegionales.value = response.data.map((centro) => ({
                    value: centro.idcentroregional,
                    label: centro.centroregional
                }));
            } catch (err) {
                console.error("Failed to retrieve Centros Regionales:" || err.message);
            }
        };

        const retrieveRoles = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/varios/roles",
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                roles.value = response.data.map((rol) => ({
                    value: rol.id,
                    label: rol.name
                }));
            } catch (err) {
                console.error("Failed to retrieve Roles:" || err.message);
            }
        };

        watch(
            () => userFound.value,
            (newUserFound) => {
                updateUsersFields.value = [
                    { name: "email", label: "Email", type: "email", value: newUserFound.email },
                    {
                        name: "rol", label: "Rol", type: "select", value: newUserFound.idrol, options: roles.value
                    },
                    {
                        name: "isActive", label: "Activo", type: "select", value: newUserFound.isActive, options: isActiveOptions.value
                    },
                    {
                        name: "centroregional", label: "Centro Regional", type: "select", value: newUserFound.idcentroregional, options: centrosRegionales.value
                    },
                ];
            },
            { deep: true, immediate: true }
        );


        const updateSingleUser = async (formData) => {
            console.log("It got here");
            console.log(formData);
            
            try {
                const response = await axios.put(
                    `http://localhost:8000/api/v1/users/update/?email=${userFound.value.email}`,
                    {
                        email: formData.email,
                        role_id: formData.rol,
                        isActive: formData.isActive,
                        idcentroregional: formData.centroregional,
                
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                messageContent.value = 'Usuario actualizado con éxito'; // Establece el contenido del mensaje
                messageType.value = 'exito'; // Tipo de mensaje de éxito
                showMessage.value = true; // Muestra el mensaje

                showModal.value = false; // Cierra la pantalla de actualización del usuario

                router.push("/manageUsers");
            } catch (err) {
                console.error("ERROR UPDATING USER:" || err.message);

                messageContent.value = 'Error al actualizar el usuario'; // Establece el contenido del mensaje de error
                messageType.value = 'error'; // Tipo de mensaje de error
                showMessage.value = true; // Muestra el mensaje

                showModal.value = false; // Cierra la pantalla de actualización del usuario
            }
        };

        detailsUsersFields.value = [
            { name: 'numeroidentidad', label: 'Número de Identidad', type: 'text' },
            { name: 'primernombre', label: 'Primer Nombre', type: 'text' },
            { name: 'segundonombre', label: 'Segundo Nombre', type: 'text' },
            { name: 'primerapellido', label: 'Primer Apellido', type: 'text' },
            { name: 'segundoapellido', label: 'Segundo Apellido', type: 'text' },
            { name: 'direccion', label: 'Dirección', type: 'text' },
            { name: 'telefono', label: 'Teléfono', type: 'text' },
            { name: 'fechanacimiento', label: 'Fecha de Nacimiento', type: 'date' },
            {
                name: 'sexo',
                label: 'Sexo',
                type: 'select',
                options: [
                    { value: 'Hombre', label: 'Hombre' },
                    { value: 'Mujer', label: 'Mujer' },
                    { value: 'Otro', label: 'Otro' },
                ],
            },
        ];

        const submitUserDetails = async (formData) => {
            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/users/detalles_personales`,
                    {
                        idusuario: userFound.value.idusuario,
                        numeroidentidad: formData.numeroidentidad,
                        primernombre: formData.primernombre,
                        segundonombre: formData.segundonombre,
                        primerapellido: formData.primerapellido,
                        segundoapellido: formData.segundoapellido,
                        direccion: formData.direccion,
                        telefono: formData.telefono,
                        fechanacimiento: formData.fechanacimiento,
                        sexo: formData.sexo
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                console.log("DETALLES INSERTADOS CORRECTAMENTE");

                showDetailsModal.value = false;

            } catch (err) {
                console.error("ERROR CREATING DETAILS:" || err.message);
            }
        };

        onMounted(async () => {
            await retrieveCentrosRegionales();
            await retrieveRoles();
            await getSingleUserDetails(userId);
        });

        return {
            userFound,
            deleteSingleUser,
            showModal,
            reusableFormComponent,
            updateSingleUser,
            FormModal,
            updateUsersFields,
            detailsUsersFields,
            submitUserDetails,
            showDetailsModal,
            showMessage, // Añade la referencia de visibilidad del mensaje
            messageContent, // Añade la referencia del contenido del mensaje
            messageType, // Añade la referencia del tipo de mensaje
        };
    },
};
</script>

<style>
.details-user {
    padding: 20px;
}

.details-user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.details-user-info h2 {
    margin-bottom: 10px;
}

.details-user-info p {
    margin: 5px 0;
    font-size: 18px;
}

.details-user-actions {
    display: flex;
    width: 50%;
    gap: 10px;
}
</style>