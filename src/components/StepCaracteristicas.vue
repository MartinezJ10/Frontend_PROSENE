<template>  
  <!-- Título Nivel Medio -->
  <FormKit
    type="text"
    validation="required"
    name="titulonivelmedio"
    label="Título Nivel Medio"
    v-model="formData.titulonivelmedio"
    :validation-messages="{ required: 'El título de nivel medio es obligatorio' }"
    aria-required="true"
  />

  <!-- Instituto Educativo -->
  <FormKit
    type="text"
    name="institutoeducativo"
    label="Instituto Educativo"
    validation="required"
    v-model="formData.institutoeducativo"
    :validation-messages="{ required: 'El instituto educativo es obligatorio' }"
    aria-required="true"
  />

  <!-- Fecha de Egresado -->
  <FormKit
    type="date"
    name="fechaegresado"
    label="Fecha de Egresado"
    v-model="formData.fechaegresado"
  />

  <!-- Estudia en UNAH -->
  <FormKit
    type="checkbox"
    name="estudiaenunah"
    label="Estudia en UNAH"
    v-model="formData.estudiaenunah"
  />

  <!-- Carrera -->
  <FormKit
    type="text"
    name="carrera"
    label="Carrera"
    v-model="formData.carrera"
    :disabled="!formData.estudiaenunah"
    :aria-disabled="!formData.estudiaenunah ? 'true' : 'false'"
  />

  <!-- Número de Cuenta -->
  <FormKit
    type="text"
    name="numerodecuenta"
    label="Número de Cuenta"
    v-model="formData.numerodecuenta"
    :disabled="!formData.estudiaenunah"
    :aria-disabled="!formData.estudiaenunah ? 'true' : 'false'"
  />

  <!-- Puntuación PAARV -->
  <FormKit
    type="number"
    name="puntuacionpaarv"
    label="Puntuación PAARV"
    v-model="formData.puntuacionpaarv"
  />

  <!-- Puntuación PAARM -->
  <FormKit
    type="number"
    name="puntuacionpaarm"
    label="Puntuación PAARM"
    v-model="formData.puntuacionpaarm"
  />
</template>

<script setup>
import { ref, defineProps } from 'vue';

defineProps({
  formData: {
    type: Object,
    required: true,
  },
});
</script>