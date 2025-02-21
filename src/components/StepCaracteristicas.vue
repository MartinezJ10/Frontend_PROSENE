<template>
      <!-- ID Formulario -->
      <FormKit
        type="number"
        label="ID Formulario"
        
        validation="required"
        v-model="formData.idformulario"
      />
  
      <!-- Título Nivel Medio -->
      <FormKit
        type="text"
        validation="required"

        label="Título Nivel Medio"
        v-model="formData.titulonivelmedio"
      />
  
      <!-- Instituto Educativo -->
      <FormKit
        type="text"
        label="Instituto Educativo"
        validation="required"
        v-model="formData.institutoeducativo"
      />
  
      <!-- Fecha de Egresado -->
      <FormKit
        type="date"
        label="Fecha de Egresado"
        v-model="formData.fechaegresado"
      />
  
      <!-- Estudia en UNAH -->
      <FormKit
        type="checkbox"
        label="Estudia en UNAH"
        v-model="formData.estudiaenunah"
      />
  
      <!-- Carrera -->
      <FormKit
        type="text"
        label="Carrera"
        v-model="formData.carrera"
        :disabled="!formData.estudiaenunah"
      />
  
      <!-- Número de Cuenta -->
      <FormKit
        type="text"
        label="Número de Cuenta"
        v-model="formData.numerodecuenta"
        :disabled="!formData.estudiaenunah"
      />
  
      <!-- Puntuación PAARV -->
      <FormKit
        type="number"
        label="Puntuación PAARV"
        v-model="formData.puntuacionpaarv"
      />
  
      <!-- Puntuación PAARM -->
      <FormKit
        type="number"
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