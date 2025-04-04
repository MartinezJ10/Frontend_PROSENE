<template>
  <!-- Dificultad para Orientarse en Entorno -->
  <FormKit
    type="select"
    label="Dificultad para Orientarse en Entorno"
    name="dificultadparaorientarseenentorno"
    :options="opcionesDificultad"
    v-model="formData.dificultadparaorientarseenentorno"
    aria-labelledby="dificultadOrientarseLabel"
  />
  <label id="dificultadOrientarseLabel" class="sr-only">Dificultad para Orientarse en Entorno</label>

  <!-- Dificultad para Salvar Desniveles -->
  <FormKit
    type="select"
    label="Dificultad para Salvar Desniveles"
    name="dificultadparasalvardesniveles"
    :options="opcionesDificultad"
    v-model="formData.dificultadparasalvardesniveles"
    aria-labelledby="dificultadSalvarDesnivelesLabel"
  />
  <label id="dificultadSalvarDesnivelesLabel" class="sr-only">Dificultad para Salvar Desniveles</label>

  <!-- Dificultad para Usar Gradas -->
  <FormKit
    type="select"
    name="dificultadparausargradas"
    label="Dificultad para Usar Gradas"
    :options="opcionesDificultad"
    v-model="formData.dificultadparausargradas"
    aria-labelledby="dificultadUsarGradasLabel"
  />
  <label id="dificultadUsarGradasLabel" class="sr-only">Dificultad para Usar Gradas</label>

  <!-- Dificultad para Viajar en Transporte Público -->
  <FormKit
    type="select"
    name="dificultadparaviajarentrasportepublico"
    label="Dificultad para Viajar en Transporte Público"
    :options="opcionesDificultad"
    v-model="formData.dificultadparaviajarentrasportepublico"
    aria-labelledby="dificultadViajarTransportePublicoLabel"
  />
  <label id="dificultadViajarTransportePublicoLabel" class="sr-only">Dificultad para Viajar en Transporte Público</label>

  <!-- Dificultad para Subir y Bajar del Vehículo -->
  <FormKit 
    type="select"
    label="Dificultad para Subir y Bajar del Vehículo"
    name="dificultadparasubirybajardelvehiculo"
    :options="opcionesDificultad"
    v-model="formData.dificultadparasubirybajardelvehiculo"
    aria-labelledby="dificultadSubirBajarVehiculoLabel"
  />
  <label id="dificultadSubirBajarVehiculoLabel" class="sr-only">Dificultad para Subir y Bajar del Vehículo</label>

  <!-- Dificultad para Desplazarse Distancias -->
  <FormKit
    type="select"
    name="dificultadparadesplazarsedistancias"
    label="Dificultad para Desplazarse Distancias"
    :options="opcionesDificultad"
    v-model="formData.dificultadparadesplazarsedistancias"
    aria-labelledby="dificultadDesplazarseDistanciasLabel"
  />
  <label id="dificultadDesplazarseDistanciasLabel" class="sr-only">Dificultad para Desplazarse Distancias</label>
</template>

<script setup>
import { ref, defineProps } from 'vue';

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
