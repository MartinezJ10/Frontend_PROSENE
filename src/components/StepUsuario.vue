<template>
    <!-- User Authentication Details -->
    <FormKit type="email" name="email" label="Email" validation="required|email" v-model="formData.email" />

    <FormKit type="password" name="password" label="Password" validation="required" v-model="formData.password" />

    <FormKit type="select" name="idcentroregional" label="Centro Regional" :options="centrosRegionales" validation="required" v-model="formData.idcentroregional" />

    <!-- User Profile Details -->
    <FormKit type="text" name="numeroidentidad" label="Número de Identidad" validation="required"
        v-model="formData.numeroidentidad" />

    <FormKit type="text" name="primernombre" label="Primer Nombre" validation="required"
        v-model="formData.primernombre" />

    <FormKit type="text" name="segundonombre" label="Segundo Nombre" v-model="formData.segundonombre" />

    <FormKit type="text" name="primerapellido" label="Primer Apellido" validation="required"
        v-model="formData.primerapellido" />

    <FormKit type="text" name="segundoapellido" label="Segundo Apellido" v-model="formData.segundoapellido" />

    <FormKit type="text" name="direccion" label="Dirección" validation="required" v-model="formData.direccion" />

    <FormKit type="tel" name="telefono" label="Teléfono" validation="required" v-model="formData.telefono" />

    <FormKit type="date" name="fechanacimiento" label="Fecha de Nacimiento" validation="required"
        v-model="formData.fechanacimiento" />

    <FormKit type="select" name="sexo" label="Sexo" :options="[
        { value: 'Hombre', label: 'Hombre' },
        { value: 'Mujer', label: 'Mujer' },
        { value: 'Otro', label: 'Otro' }
    ]" validation="required" v-model="formData.sexo" />
</template>

<script setup>
import { defineProps,ref, onMounted } from 'vue';
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