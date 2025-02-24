<template>
    <div>
      <h3 class="text-center">{{ title }}</h3>
      <form @submit.prevent="handleSubmit" class="form-container">
        <div v-for="(field, index) in formFields" :key="index" class="mb-3">
          <label :for="field.id" class="form-label">{{ field.label }}</label>
          
          <!-- Input Fields (text, email, password, select, textarea) -->
          <input
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
            :type="field.type"
            class="form-control"
            :id="field.name"
            v-model="formData[field.name]"
            :class="{'is-invalid': errors[field.name], 'is-valid': formData[field.name] && !errors[field.name]}"
            :placeholder="field.placeholder"
            @blur="validateField(field)"
            required
            autocomplete="new-password"
          />
          
          <!-- Select Fields -->
          <select
            v-if="field.type === 'select'"
            v-model="formData[field.name]"
            :id="field.name"
            class="form-control"
            @blur="validateField(field)"
            required
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
  
          <!-- Textazrea Fields -->
          <textarea rows = "8"
            v-if="field.type === 'text-area'"
            class="form-control text-area-field"
            :id="field.name"
            v-model="formData[field.name]"
            :class="{'is-invalid': errors[field.name], 'is-valid': formData[field.name] && !errors[field.name]}"
            :placeholder="field.placeholder"
            @blur="validateField(field)"
            required
          ></textarea>

                    <!-- Agregar campo de fecha -->
          <input
            v-if="field.type === 'date'"
            type="date"
            class="form-control"
            :id="field.name"
            v-model="formData[field.name]"
            :class="{'is-invalid': errors[field.name], 'is-valid': formData[field.name] && !errors[field.name]}"
            @blur="validateField(field)"
            required
          />
              
      
          <!-- Error Message -->
          <div v-if="errors[field.name]" class="invalid-feedback">
            {{ errors[field.name] }}
          </div>
        </div>
    
        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-100">{{ submitButtonText }}</button>
        
        <slot name="extra-links"></slot> <!-- Espacio para enlaces opcionales -->
    
      </form>
    </div>
  </template>
  
    
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    title: String,
    fields: Array,
    submitButtonText: {
      type: String,
      default: 'Enviar'
    },
    onSubmit: {
        type: Function,
        required: true
    }
  });
  
  // Initialize formData and errors
  const formData = ref({});
  const errors = ref({});
  
  // Initialize form data based on fields prop
  const initializeFormData = () => {
    formData.value = props.fields.reduce((acc, field) => {
      acc[field.name] = field.value || ''; // Default to empty string if no value provided
      return acc;
    }, {});
  };
  
  initializeFormData();
  
  watch(() => props.fields, () => {
    initializeFormData();
  }, { deep: true });
  
  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 2;
  const validateRequiredField = (field) => {
    const value = formData.value[field.name];
    if (!value) {
      errors.value[field.name] = `${field.label} es requerido`;
    } else {
      errors.value[field.name] = '';
    }
  };
  
  const validateField = (field) => {
    validateRequiredField(field);
    if (field.type === 'email' && !validateEmail(formData.value[field.name])) {
      errors.value[field.name] = 'La dirección de email es inválida';
    } else if (field.type === 'password' && !validatePassword(formData.value[field.name])) {
      errors.value[field.name] = 'La contraseña debe tener al menos 6 caracteres';
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    let valid = true;
    props.fields.forEach(field => {
      validateField(field);
      if (errors.value[field.name]) {
        valid = false;
      }
    });
  
    if (valid) {
      props.onSubmit(formData.value);
    }
  };
  
  // Compute form fields (copy of fields with default values)
  const formFields = computed(() => {
    return props.fields.map(field => {
      if (!(field.name in formData.value)) {
        formData.value[field.name] = '';
      }
      return { ...field };
    });
  });
  </script>
    
  <style scoped> 
  .form-control,
  .btn-primary {
    border-color: #003366;
  }
  
  .form-control:focus,
  .btn-primary:focus {
    box-shadow: 0 0 0 0.25rem rgba(0, 51, 102, 0.25);
  }
  
  .btn-primary {
    background-color: #003366;
    border-color: #003366;
  }
  
  .btn-primary:hover {
    background-color: #002244;
    border-color: #002244;
  }
  
  .is-valid {
    border-color: #003366;
  }
  
  .is-invalid {
    border-color: red;
  }

  .form-label {
    font-weight: 400;
    width: 100%;
    margin-bottom: 2px;
    color:black;
  }
  
  .text-area-field {
    resize: none;
  }
  </style>
  
