<template>
  <!-- Usa Braille -->
  <FormKit
    type="checkbox"
    name="usabraille"
    label="Usa Braille"
    v-model="formData.usabraille"
    :aria-labelledby="'label-usabraille'" 
  /> <!-- Asocia el label con el checkbox para accesibilidad -->
  <span id="label-usabraille" hidden>Usa Braille</span> <!-- Texto oculto para que NVDA y TalkBack lo lean correctamente -->

  <!-- Usa LSHO -->
  <FormKit
    type="checkbox"
    name="usalsho"
    label="Usa LSHO"
    v-model="formData.usalsho"
    :aria-labelledby="'label-usalsho'"
  />
  <span id="label-usalsho" hidden>Usa LSHO</span>

  <!-- Usa Comunicación Gestual -->
  <FormKit
    type="checkbox"
    name="usacomunicaciongestual"
    label="Usa Comunicación Gestual"
    v-model="formData.usacomunicaciongestual"
    :aria-labelledby="'label-usacomunicaciongestual'"
  />
  <span id="label-usacomunicaciongestual" hidden>Usa Comunicación Gestual</span>

  <!-- Usa Lectura Labial -->
  <FormKit
    type="checkbox"
    name="usalecturalabial"
    label="Usa Lectura Labial"
    v-model="formData.usalecturalabial"
    :aria-labelledby="'label-usalecturalabial'"
  />
  <span id="label-usalecturalabial" hidden>Usa Lectura Labial</span>

  <!-- Usa Comunicación Total -->
  <FormKit
    type="checkbox"
    name="usacomunicaciontotal"
    label="Usa Comunicación Total"
    v-model="formData.usacomunicaciontotal"
    :aria-labelledby="'label-usacomunicaciontotal'"
  />
  <span id="label-usacomunicaciontotal" hidden>Usa Comunicación Total</span>

  <!-- Usa ACABO -->
  <FormKit
    type="checkbox"
    name="usaacabo"
    label="Usa ACABO"
    v-model="formData.usaacabo"
    :aria-labelledby="'label-usaacabo'"
  />
  <span id="label-usaacabo" hidden>Usa ACABO</span>

  <!-- Uso de Calculadora -->
  <FormKit
    type="checkbox"
    name="usodecalculadora"
    label="Uso de Calculadora"
    v-model="formData.usodecalculadora"
    :aria-labelledby="'label-usodecalculadora'"
  />
  <span id="label-usodecalculadora" hidden>Uso de Calculadora</span>
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
