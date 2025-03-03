<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="modal-mask"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="modal-container">
        <div class="modal-header">
          <button
            @click="$emit('update:modelValue', false)"
            class="quit-btn"
            aria-label="Cerrar Modal"
          >
            &times;
          </button>
          <h3 class="modal-title">{{ title }}</h3>
        </div>

        <div class="modal-body">
          <slot>
            <component :is="reusableForm" v-bind="formProps" />
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'FormModal',
  props: {
    modelValue: Boolean,
    title: String,
    reusableForm: Object,
    formProps: Object
  },
  emits: ['update:modelValue']
};
</script>

<style scoped>
/* Fondo semitransparente y centrado con padding para evitar desbordes */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  padding: 20px; /* Espacio alrededor para que la modal no toque los bordes */
  box-sizing: border-box;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

/* Transiciones para la entrada y salida */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Contenedor del modal con altura máxima y scroll interno si es necesario */
.modal-container {
  background: #fff;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 40px); /* Altura máxima considerando el padding del mask */
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease;
}

/* Animación al abrir */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Encabezado con degradado */
.modal-header {
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #003366, #0056b3);
  color: #fff;
  text-align: center;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
}

/* Botón de cierre */
.quit-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.quit-btn:hover {
  transform: scale(1.2);
  color: #ffcccb;
}

/* Cuerpo del modal */
.modal-body {
  padding: 20px;
  color: #333;
}

/* Ajustes para dispositivos móviles */
@media (max-width: 600px) {
  .modal-container {
    max-width: 90%;
  }
  .modal-header {
    padding: 15px;
  }
  .modal-title {
    font-size: 1.3rem;
  }
  .quit-btn {
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
  }
  .modal-body {
    padding: 15px;
  }
}
</style>
