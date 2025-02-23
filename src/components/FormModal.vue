<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-mask" @click.self="$emit('update:modelValue', false)">
      <div class="modal-container">
        <div class="modal-header">
          <button @click="$emit('update:modelValue', false)" class="quit-btn">&times;</button>
          <h3>{{ title }}</h3>
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
  props: {
    modelValue: Boolean, // Se usa con v-model
    title: String,
    reusableForm: Object,
    formProps: Object, // Props del formulario
  },
  emits: ["update:modelValue"],


};
</script>

<style>
.quit-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
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
  justify-content: center;
  /* Center the modal horizontally */
  align-items: center;
  /* Center the modal vertically */
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 90%;
  /* Make the modal responsive */
  max-width: 600px;
  /* Set a maximum width for larger screens */
  margin: auto;
  padding: 30px;
  /* Increased padding for better spacing */
  background-color: #fff;
  border-radius: 8px;
  /* Rounded corners */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  /* Deeper shadow for a "lifted" effect */
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 20px; /* Add space below the header */
  border-bottom: 1px solid #eee; /* Add a subtle line below the header */
}

.modal-header h3 {
  margin: 0;
  color: #42b983;
  font-size: 24px; 
}

.modal-body {
  margin: 20px 0;
  padding: 10px 0; 
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
}
</style>