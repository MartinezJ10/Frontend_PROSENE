<template>

      <!-- Apoyo en Proceso de Admisión -->
      <FormKit
        type="checkbox"
        label="Apoyo en Proceso de Admisión"
        name="apoyoenprocesodeadmision"
        v-model="formData.apoyoenprocesodeadmision"
      />
  
      <!-- Apoyo en PAA -->
      <FormKit
        type="checkbox"
        name="apoyoenpaa"
        label="Apoyo en PAA"
        v-model="formData.apoyoenpaa"
      />
  
      <!-- Orientación General -->
      <FormKit
        type="checkbox"
        name="orientaciongeneral"
        label="Orientación General"
        v-model="formData.orientaciongeneral"
      />
  
      <!-- Orientación Vocacional -->
      <FormKit
        type="checkbox"
        name="orientacionvocacional"
        label="Orientación Vocacional"
        v-model="formData.orientacionvocacional"
      />
  
      <!-- Coordinación con Profesores -->
      <FormKit
        type="checkbox"
        name="coordinacionconprofesores"
        label="Coordinación con Profesores"
        v-model="formData.coordinacionconprofesores"
      />
  
      <!-- Orientación y Movilidad -->
      <FormKit
        type="checkbox"
        name="orientacionymovilidad"
        label="Orientación y Movilidad"
        v-model="formData.orientacionymovilidad"
      />
  
      <!-- Transcripción a Braille -->
      <FormKit
        type="checkbox"
        name="transcripcionalbraille"
        label="Transcripción a Braille"
        v-model="formData.transcripcionalbraille"
      />
  
      <!-- Lectura y Grabación de Texto -->
      <FormKit
        type="checkbox"
        name="lecturaygrabaciondetexto"
        label="Lectura y Grabación de Texto"
        v-model="formData.lecturaygrabaciondetexto"
      />
  
      <!-- Tutorial de Materia -->
      <FormKit
        type="checkbox"
        name="tutorialdemateria"
        label="Tutorial de Materia"
        v-model="formData.tutorialdemateria"
      />
  
      <!-- Servicio de Notarios -->
      <FormKit
        type="checkbox"
        name="serviciodenotarios"
        label="Servicio de Notarios"
        v-model="formData.serviciodenotarios"
      />
  
      <!-- Intérpretes de Lengua de Señas -->
      <FormKit
        type="checkbox"
        name="interpretesdelenguadesenias"
        label="Intérpretes de Lengua de Señas"
        v-model="formData.interpretesdelenguadesenias"
      />
  
      <!-- Adecuación de Acceso al Entorno -->
      <FormKit
        type="checkbox"
        name="adecuaciondeaccesoalentorno"
        label="Adecuación de Acceso al Entorno"
        v-model="formData.adecuaciondeaccesoalentorno"
      />
  
      <!-- Otros Servicios -->
      <FormKit
        type="text"
        name="otrosservicios"
        validation="required"
        label="Otros Servicios"
        v-model="formData.otrosservicios"
      />
  
      <!-- Barreras para Estudiar en UNAH -->
      <FormKit
        type="text"
        validation="required"
        name="barrerasparaestudiarenunah"
        label="Barreras para Estudiar en UNAH"
        v-model="formData.barrerasparaestudiarenunah"
      />

      <FormKit @click="submitForm" type="submit" label="Submit" />
      
  </template>
  
  <script >
  import { ref,defineProps } from 'vue';
  

  defineProps({
  formData: {
    type: Object,
    required: true,
  },
  submitForm: {
        type: Function,
        required: true,
    },
});

  </script>