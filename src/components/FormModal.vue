<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-mask" @click.self="$emit('update:modelValue', false)">
      <div class="modal-container">
        <div class="modal-header">
          <!-- Botón de cierre en la esquina superior derecha -->
          <button @click="$emit('update:modelValue', false)" class="quit-btn">&times;</button>
          <!-- Título del modal -->
          <h3 class="modal-title">{{ title }}</h3>
        </div>

        <div class="modal-body">
          <slot>
            <!-- Componente dinámico con las props del formulario -->
            <component :is="reusableForm" v-bind="formProps" />
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    modelValue: Boolean, // Se usa con v-model
    title: String,
    reusableForm: Object,
    formProps: Object, // Props del formulario
  },
  emits: ["update:modelValue"],
};
</script>

<style scoped>
.quit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #003366;
}

.quit-btn:hover {
  color: #002244;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 100vw;
  max-width: 500px;
  height: 90vh;
  margin: auto;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  position: relative;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}

.modal-title {
  margin-top: 40px; 
  font-size: 1.5em;
  font-weight: bold;
  letter-spacing: 1px;
  color: black;
}

.modal-body {
  margin: 20px 0;
  color: #003366;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
