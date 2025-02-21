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

      <!-- Dificultad para Orientarse en Entorno -->
      <FormKit
        type="select"
        label="Dificultad para Orientarse en Entorno"
        :options="opcionesDificultad"
        v-model="formData.dificultadparaorientarseenentorno"
      />
  
      <!-- Dificultad para Salvar Desniveles -->
      <FormKit
        type="select"
        label="Dificultad para Salvar Desniveles"
        :options="opcionesDificultad"
        v-model="formData.dificultadparasalvardesniveles"
      />
  
      <!-- Dificultad para Usar Gradas -->
      <FormKit
        type="select"
        label="Dificultad para Usar Gradas"
        :options="opcionesDificultad"
        v-model="formData.dificultadparausargradas"
      />
  
      <!-- Dificultad para Viajar en Transporte Público -->
      <FormKit
        type="select"
        label="Dificultad para Viajar en Transporte Público"
        :options="opcionesDificultad"
        v-model="formData.dificultadparaviajarentrasportepublico"
      />
  
      <!-- Dificultad para Subir y Bajar del Vehículo -->
      <FormKit 
        type="select"
        label="Dificultad para Subir y Bajar del Vehículo"
        
        :options="opcionesDificultad"
        v-model="formData.dificultadparasubirybajardelvehiculo"
      />
  
      <!-- Dificultad para Desplazarse Distancias -->
      <FormKit
        type="select"
        label="Dificultad para Desplazarse Distancias"
        :options="opcionesDificultad"
        v-model="formData.dificultadparadesplazarsedistancias"
      />
  </template>
  
  <script setup>
  import { ref,defineProps } from 'vue';
  
  // Opciones para los select
  const opcionesDificultad = [
    { label: "Mucho", value: "mucho" },
    { label: "Moderado", value: "moderado" },
    { label: "Poco", value: "poco" },
    { label: "Nada", value: "nada" },
  ];
  
  defineProps({
  formData: {
    type: Object,
    required: true,
  },
});
  </script>