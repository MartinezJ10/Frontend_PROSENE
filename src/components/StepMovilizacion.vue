<template>

      <!-- Dificultad para Orientarse en Entorno -->
      <FormKit
        type="select"
        label="Dificultad para Orientarse en Entorno"
        name="dificultadparaorientarseenentorno"
        :options="opcionesDificultad"
        v-model="formData.dificultadparaorientarseenentorno"
      />
  
      <!-- Dificultad para Salvar Desniveles -->
      <FormKit
        type="select"
        label="Dificultad para Salvar Desniveles"
        name="dificultadparasalvardesniveles"
        :options="opcionesDificultad"
        v-model="formData.dificultadparasalvardesniveles"
      />
  
      <!-- Dificultad para Usar Gradas -->
      <FormKit
        type="select"
        name="dificultadparausargradas"
        label="Dificultad para Usar Gradas"
        :options="opcionesDificultad"
        v-model="formData.dificultadparausargradas"
      />
  
      <!-- Dificultad para Viajar en Transporte Público -->
      <FormKit
        type="select"
        name="dificultadparaviajarentrasportepublico"
        label="Dificultad para Viajar en Transporte Público"
        :options="opcionesDificultad"
        v-model="formData.dificultadparaviajarentrasportepublico"
      />
  
      <!-- Dificultad para Subir y Bajar del Vehículo -->
      <FormKit 
        type="select"
        label="Dificultad para Subir y Bajar del Vehículo"
        name="dificultadparasubirybajardelvehiculo"
        :options="opcionesDificultad"
        v-model="formData.dificultadparasubirybajardelvehiculo"
      />
  
      <!-- Dificultad para Desplazarse Distancias -->
      <FormKit
        type="select"
        name="dificultadparadesplazarsedistancias"
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