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
    formProps: Object,
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Fondo ligeramente transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Transición más sutil */
}

.modal-container {
  background: #fff;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 40px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra suave */
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease;
}

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

.modal-header {
  position: relative;
  padding: 18px 24px;
  border-bottom: 1px solid #eee; /* Borde sutil */
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 300; /* Peso de fuente ligero */
  color: #333;
  font-family: 'Roboto', sans-serif;
}

.quit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
}

.quit-btn:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
  color: #444;
  font-family: 'Open Sans', sans-serif;
  line-height: 1.6;
}

@media (max-width: 600px) {
  .modal-container {
    max-width: 95%;
  }
  .modal-header {
    padding: 16px;
  }
  .modal-title {
    font-size: 1.3rem;
  }
  .quit-btn {
    top: 8px;
    right: 8px;
    font-size: 1.6rem;
  }
  .modal-body {
    padding: 20px;
  }
}
</style>