<template>
  
      <!-- Usa Braille -->
      <FormKit
        type="checkbox"
        name="usabraille"
        label="Usa Braille"
        v-model="formData.usabraille"
      />
  
      <!-- Usa LSHO -->
      <FormKit
        type="checkbox"
        name="usalsho"
        label="Usa LSHO"
        v-model="formData.usalsho"
      />
  
      <!-- Usa Comunicación Gestual -->
      <FormKit
        type="checkbox"
        name="usacomunicaciongestual"
        label="Usa Comunicación Gestual"
        v-model="formData.usacomunicaciongestual"
      />
  
      <!-- Usa Lectura Labial -->
      <FormKit
        type="checkbox"
        name="usalecturalabial"
        label="Usa Lectura Labial"
        v-model="formData.usalecturalabial"
      />
  
      <!-- Usa Comunicación Total -->
      <FormKit
        type="checkbox"
        name="usacomunicaciontotal"
        label="Usa Comunicación Total"
        v-model="formData.usacomunicaciontotal"
      />
  
      <!-- Usa ACABO -->
      <FormKit
        type="checkbox"
        name="usaacabo"
        label="Usa ACABO"
        v-model="formData.usaacabo"
      />
  
      <!-- Uso de Calculadora -->
      <FormKit
        type="checkbox"
        name="usodecalculadora"
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