<template>
      <!-- ID Formulario -->
      <FormKit
        type="number"
        label="ID Formulario"
        validation="required"
        v-model="formData.idformulario"
      />
  
      <!-- Hipoacusia -->
      <FormKit
        type="text"
        validation="required"

        label="Hipoacusia"
        v-model="formData.hipoacusia"
      />
  
      <!-- Sordera -->
      <FormKit
        type="text"
        validation="required"

        label="Sordera"
        v-model="formData.sordera"
      />
  
      <!-- Baja Visión -->
      <FormKit
        type="text"
        validation="required"

        label="Baja Visión"
        v-model="formData.bajavision"
      />
  
      <!-- Movilidad Reducida Miembros Inferiores -->
      <FormKit
        type="text"
        validation="required"

        label="Movilidad Reducida Miembros Inferiores"
        v-model="formData.movilidadreducidamiembrosinferiores"
      />
  
      <!-- Movilidad Reducida Miembros Superiores -->
      <FormKit
        type="text"
        validation="required"

        label="Movilidad Reducida Miembros Superiores"
        v-model="formData.movilidadreducidamiembrossuperiores"
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