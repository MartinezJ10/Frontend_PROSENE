<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <transition name="fade">
      <div v-if="visible" :class="['alert', alertClass, 'alert-dismissible', 'fade', 'show', 'notification']" role="alert">
        <i :class="iconClass"></i> {{ mensaje }}
        <button type="button" class="btn-close" @click="closeMessage" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'MensajeRetroalimentacion', // Nombre del componente
    props: {
      mensaje: {
        type: String,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      },
      tipo: {
        type: String,
        required: true,
        validator: value => ['exito', 'error', 'advertencia'].includes(value)
      }
    },
    computed: {
      alertClass() {
        return {
          'alert-success': this.tipo === 'exito',
          'alert-danger': this.tipo === 'error',
          'alert-warning': this.tipo === 'advertencia'
        };
      },
      iconClass() {
        return {
          'fas fa-check-circle': this.tipo === 'exito',
          'fas fa-times-circle': this.tipo === 'error',
          'fas fa-exclamation-circle': this.tipo === 'advertencia'
        };
      }
    },
    methods: {
      closeMessage() {
        this.$emit('update:visible', false);
      }
    },
    mounted() {
    setTimeout(() => {
      this.closeMessage();
    }, 5000);
  }
  };
  </script>
  
  <style scoped>
  .alert {
    max-width: 500px; /* Aumenta el tamaño máximo del mensaje */
    margin: 20px;
    font-family: 'Roboto', sans-serif;
    font-size: 1.2em; /* Aumenta el tamaño de la fuente */
    text-align: left;
    position: fixed;
    top: 20px;
    right: 20px; 
    padding: 20 50px; 
    border-radius: 10px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    z-index: 1000; 
    transition: transform 0.3s ease, opacity 0.3s ease; 
  }
  
  .alert i {
    margin-right: 10px;
    font-size: 1.5em; 
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .alert .btn-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2em; 
    cursor: pointer;
  }
  
  .alert .btn-close i {
    font-size: 1.2em; 
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>