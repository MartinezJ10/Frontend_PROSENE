<template>
    <!-- User Authentication Details -->
    <FormKit 
        type="email" 
        name="email" 
        label="Email" 
        validation="required|email" 
        autocomplete="new-password" 
        v-model="formData.email" 
        aria-labelledby="emailLabel" 
    />
    <label id="emailLabel" class="sr-only"></label>

    <FormKit 
        type="password" 
        name="password" 
        label="Password" 
        validation="required" 
        autocomplete="new-password" 
        v-model="formData.password" 
        aria-labelledby="passwordLabel" 
    />
    <label id="passwordLabel" class="sr-only"></label>

    <FormKit 
        type="select" 
        name="idcentroregional" 
        label="Centro Regional" 
        :options="centrosRegionales" 
        validation="required" 
        v-model="formData.idcentroregional" 
        aria-labelledby="centroRegionalLabel" 
    />
    <label id="centroRegionalLabel" class="sr-only"></label>

    <!-- User Profile Details -->
    <FormKit 
        type="text" 
        name="numeroidentidad" 
        label="Número de Identidad" 
        validation="required" 
        v-model="formData.numeroidentidad" 
        aria-labelledby="numeroIdentidadLabel" 
    />
    <label id="numeroIdentidadLabel" class="sr-only"></label>

    <FormKit 
        type="text" 
        name="primernombre" 
        label="Primer Nombre" 
        validation="required" 
        v-model="formData.primernombre" 
        aria-labelledby="primerNombreLabel" 
    />
    <label id="primerNombreLabel" class="sr-only"></label>

    <FormKit 
        type="text" 
        name="segundonombre" 
        label="Segundo Nombre" 
        v-model="formData.segundonombre" 
        aria-labelledby="segundoNombreLabel" 
    />
    <label id="segundoNombreLabel" class="sr-only"></label>

    <FormKit 
        type="text" 
        name="primerapellido" 
        label="Primer Apellido" 
        validation="required" 
        v-model="formData.primerapellido" 
        aria-labelledby="primerApellidoLabel" 
    />
    <label id="primerApellidoLabel" class="sr-only"></label>

    <FormKit 
        type="text" 
        name="segundoapellido" 
        label="Segundo Apellido" 
        v-model="formData.segundoapellido" 
        aria-labelledby="segundoApellidoLabel" 
    />
    <label id="segundoApellidoLabel" class="sr-only"></label>

    <FormKit 
        type="text" 
        name="direccion" 
        label="Dirección" 
        validation="required" 
        v-model="formData.direccion" 
        aria-labelledby="direccionLabel" 
    />
    <label id="direccionLabel" class="sr-only"></label>

    <FormKit 
        type="tel" 
        name="telefono" 
        label="Teléfono" 
        validation="required" 
        v-model="formData.telefono" 
        aria-labelledby="telefonoLabel" 
    />
    <label id="telefonoLabel" class="sr-only"></label>

    <FormKit 
        type="date" 
        name="fechanacimiento" 
        label="Fecha de Nacimiento" 
        validation="required" 
        v-model="formData.fechanacimiento" 
        aria-labelledby="fechaNacimientoLabel" 
    />
    <label id="fechaNacimientoLabel" class="sr-only"></label>

    <FormKit 
        type="select" 
        name="sexo" 
        label="Sexo" 
        :options="[
            { value: 'Hombre', label: 'Hombre' },
            { value: 'Mujer', label: 'Mujer' },
            { value: 'Otro', label: 'Otro' }
        ]" 
        validation="required" 
        v-model="formData.sexo" 
        aria-labelledby="sexoLabel" 
    />
    <label id="sexoLabel" class="sr-only"></label>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import axios from 'axios';

const centrosRegionales = ref([]);

defineProps({
    formData: {
        type: Object,
        required: true,
    },
});

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

onMounted(async () => {
    await retrieveCentrosRegionales();
});
</script>
