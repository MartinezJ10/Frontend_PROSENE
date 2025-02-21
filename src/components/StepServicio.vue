<template>
      <!-- ID Formulario -->
      <FormKit
        type="number"
        label="ID Formulario"
        validation="required"
        v-model="formData.idformulario"
      />
  
      <!-- Apoyo en Proceso de Admisión -->
      <FormKit
        type="checkbox"
        label="Apoyo en Proceso de Admisión"
        v-model="formData.apoyoenprocesodeadmision"
      />
  
      <!-- Apoyo en PAA -->
      <FormKit
        type="checkbox"
        label="Apoyo en PAA"
        v-model="formData.apoyoenpaa"
      />
  
      <!-- Orientación General -->
      <FormKit
        type="checkbox"
        label="Orientación General"
        v-model="formData.orientacionfeneral"
      />
  
      <!-- Orientación Vocacional -->
      <FormKit
        type="checkbox"
        label="Orientación Vocacional"
        v-model="formData.orientacionvocacional"
      />
  
      <!-- Coordinación con Profesores -->
      <FormKit
        type="checkbox"
        label="Coordinación con Profesores"
        v-model="formData.coordinacionconprofesores"
      />
  
      <!-- Orientación y Movilidad -->
      <FormKit
        type="checkbox"
        label="Orientación y Movilidad"
        v-model="formData.orientacionymovilidad"
      />
  
      <!-- Transcripción a Braille -->
      <FormKit
        type="checkbox"
        label="Transcripción a Braille"
        v-model="formData.transcripcionalbraille"
      />
  
      <!-- Lectura y Grabación de Texto -->
      <FormKit
        type="checkbox"
        label="Lectura y Grabación de Texto"
        v-model="formData.lecturaygrabaciondetexto"
      />
  
      <!-- Tutorial de Materia -->
      <FormKit
        type="checkbox"
        label="Tutorial de Materia"
        v-model="formData.tutorialdemateria"
      />
  
      <!-- Servicio de Notarios -->
      <FormKit
        type="checkbox"
        label="Servicio de Notarios"
        v-model="formData.serviciodenotarios"
      />
  
      <!-- Intérpretes de Lengua de Señas -->
      <FormKit
        type="checkbox"
        label="Intérpretes de Lengua de Señas"
        v-model="formData.interpretesdelenguadesenias"
      />
  
      <!-- Adecuación de Acceso al Entorno -->
      <FormKit
        type="checkbox"
        label="Adecuación de Acceso al Entorno"
        v-model="formData.adecuaciondeaccesoalentorno"
      />
  
      <!-- Otros Servicios -->
      <FormKit
        type="text"
        validation="required"
        label="Otros Servicios"
        v-model="formData.otrosservicios"
      />
  
      <!-- Barreras para Estudiar en UNAH -->
      <FormKit
        type="text"
        validation="required"
        label="Barreras para Estudiar en UNAH"
        v-model="formData.barrerasparaestudiarenunah"
      />

      <FormKit @click="submitForm" type="submit" label="Submit" />


      
  </template>
  
  <script setup>
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