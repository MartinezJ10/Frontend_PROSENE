<template>
   <FormKit
    type="text"
    label="Name"
    validation="required"
  />
      <!-- ID Formulario -->
      <FormKit
        type="number"
        label="ID Formulario"
        validation="required"
        v-model="formData.idformulario"
      />
  
      <!-- Usa Braille -->
      <FormKit
        type="checkbox"
        label="Usa Braille"
        v-model="formData.usabraille"
      />
  
      <!-- Usa LSHO -->
      <FormKit
        type="checkbox"
        label="Usa LSHO"
        v-model="formData.usalsho"
      />
  
      <!-- Usa Comunicación Gestual -->
      <FormKit
        type="checkbox"
        label="Usa Comunicación Gestual"
        v-model="formData.usacomunicaciongestual"
      />
  
      <!-- Usa Lectura Labial -->
      <FormKit
        type="checkbox"
        label="Usa Lectura Labial"
        v-model="formData.usalecturalabial"
      />
  
      <!-- Usa Comunicación Total -->
      <FormKit
        type="checkbox"
        label="Usa Comunicación Total"
        v-model="formData.usacomunicaciontotal"
      />
  
      <!-- Usa ACABO -->
      <FormKit
        type="checkbox"
        label="Usa ACABO"
        v-model="formData.usaacabo"
      />
  
      <!-- Uso de Calculadora -->
      <FormKit
        type="checkbox"
        label="Uso de Calculadora"
        v-model="formData.usodecalculadora"
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