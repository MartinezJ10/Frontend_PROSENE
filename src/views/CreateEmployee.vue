<template>
  <div class="create-employee-page">
    <ReusableForm
      :fields="employeeFields"
      submitButtonText="Crear Empleado"
      :onSubmit="handleCreateEmployee"
    />

    <Mensaje
      v-if="showMessage"
      :mensaje="messageContent"
      :tipo="messageType"
      :visible="showMessage"
      @update:visible="showMessage = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ReusableForm from '../components/ReusableForm2.vue';
import Mensaje from '../components/Mensaje.vue';

const employeeFields = ref([]);
const showMessage = ref(false);
const messageContent = ref('');
const messageType = ref('');
const centrosRegionales = ref([]);
const roles = ref([]);

const retrieveCentrosRegionales = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/varios/centros',
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
    );
    centrosRegionales.value = response.data.map(centro => ({
      value: centro.idcentroregional,
      label: centro.centroregional
    }));
  } catch (err) {
    console.error('Error retrieving centros regionales:', err.message || err);
  }
};

const retrieveRoles = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/varios/roles',
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
    );
    roles.value = response.data
      .filter(rol => rol.id === 2)
      .map(rol => ({ value: rol.id, label: rol.name }));
  } catch (err) {
    console.error('Error retrieving roles:', err.message || err);
  }
};

onMounted(async () => {
  await retrieveCentrosRegionales();
  await retrieveRoles();

  employeeFields.value = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Ingrese el email' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Ingrese la contraseña' },
    { name: 'centroregional', label: 'Centro Regional', type: 'select', options: centrosRegionales.value },
    { name: 'primernombre', label: 'Primer Nombre', type: 'text', placeholder: 'Ingrese el primer nombre' },
    { name: 'segundonombre', label: 'Segundo Nombre', type: 'text', placeholder: 'Ingrese el segundo nombre' },
    { name: 'primerapellido', label: 'Primer Apellido', type: 'text', placeholder: 'Ingrese el primer apellido' },
    { name: 'segundoapellido', label: 'Segundo Apellido', type: 'text', placeholder: 'Ingrese el segundo apellido' },
    { name: 'numeroidentidad', label: 'Número de Identidad', type: 'text', placeholder: 'Ingrese el número de identidad' },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ingrese la dirección' },
    { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ingrese el teléfono' },
    { name: 'fechanacimiento', label: 'Fecha de Nacimiento', type: 'date' },
    { name: 'sexo', label: 'Sexo', type: 'select', options: [
      { value: 'Hombre', label: 'Hombre' },
      { value: 'Mujer', label: 'Mujer' },
      { value: 'Otro', label: 'Otro' }
    ]}
  ];
});

const handleCreateEmployee = async (formData) => {
  try {
    const userResponse = await axios.post(
      'http://localhost:8000/api/v1/users/create',
      { email: formData.email, password: formData.password, role_id: 2, idcentroregional: formData.centroregional },
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
    );
    const createdUserId = userResponse.data.idusuario;

    await axios.post(
      'http://localhost:8000/api/v1/users/detalles_personales',
      {
        idusuario: createdUserId,
        primernombre: formData.primernombre,
        segundonombre: formData.segundonombre,
        primerapellido: formData.primerapellido,
        segundoapellido: formData.segundoapellido,
        numeroidentidad: formData.numeroidentidad,
        direccion: formData.direccion,
        telefono: formData.telefono,
        fechanacimiento: formData.fechanacimiento,
        sexo: formData.sexo
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
    );

    messageContent.value = 'Empleado creado con éxito';
    messageType.value = 'exito';
    showMessage.value = true;
  } catch (err) {
    console.error('Error creating employee:', err.message || err);
    messageContent.value = 'Error al crear el empleado';
    messageType.value = 'error';
    showMessage.value = true;
  }
};
</script>

<style scoped>
.create-employee-page {
  padding: 20px;
  padding-top: 0px;
  background: transparent;
}
</style>
