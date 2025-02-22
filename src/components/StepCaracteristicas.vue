<template>
  
      <!-- Título Nivel Medio -->
      <FormKit
        type="text"
        validation="required"
        name="titulonivelmedio"
        label="Título Nivel Medio"
        v-model="formData.titulonivelmedio"
      />
  
      <!-- Instituto Educativo -->
      <FormKit
        type="text"
        name="institutoeducativo"
        label="Instituto Educativo"
        validation="required"
        v-model="formData.institutoeducativo"
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
      />
  
      <!-- Número de Cuenta -->
      <FormKit
        type="text"
        name="estudiaenunah"
        label="Número de Cuenta"
        v-model="formData.numerodecuenta"
        :disabled="!formData.estudiaenunah"
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
  import { ref,defineProps } from 'vue';
  
  defineProps({
  formData: {
    type: Object,
    required: true,
  },
});
  </script>