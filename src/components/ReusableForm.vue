<template>
    <form @submit.prevent="handleSubmit" method="post">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
            <label :for="field.name">{{ field.label }}</label>
            <input v-if="field.type === 'text' || field.type === 'password' || field.type === 'email'"
                v-model="formData[field.name]"  :type="field.type" :name="field.name" :id="field.name" 
                @blur="validateField(field)" required />
            <span v-if="errors[field.name]" class="error-message">
                <i class="warning-icon">⚠️</i> {{ errors[field.name] }}
            </span>

            <select v-if="field.type === 'select'" v-model="formData[field.name]" :name="field.name" :id="field.name" 
                required>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>
        <button class="rounded-button" type="submit">{{ submitButtonText }}</button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    fields: {
        type: Array,
        required: true
    },
    submitButtonText: {
        type: String,
        default: 'Submit'
    },
    onSubmit: {
        type: Function,
        required: true
    }
});

// Initialize formData based on the fields prop
const formData = ref({});
const errors = ref({});

// Function to initialize or update formData
const initializeFormData = () => {
    formData.value = props.fields.reduce((acc, field) => {
        acc[field.name] = field.value || ''; // Use field.value if provided, otherwise default to ''
        return acc;
    }, {});
};

// Initialize formData when the component is first rendered
initializeFormData();

// Watch for changes in the fields prop and reinitialize formData
watch(() => props.fields, () => {
    initializeFormData();
}, { deep: true });

// Validation methods
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const validateRequiredField = (field) => {
    const value = formData.value[field.name]?.trim();
    if (!value) {
        errors.value[field.name] = `${field.label} es requerido`;
    } else {
        errors.value[field.name] = '';
    }
};

const validateField = (field) => {
    validateRequiredField(field);
    if (field.type === 'email' && !validateEmail(formData.value[field.name])) {
        errors.value[field.name] = 'La dirección email es invalida';
    } else if (field.type === 'password' && !validatePassword(formData.value[field.name])) {
        errors.value[field.name] = 'La contraseña debe tener al menos 8 caracteres';
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
</script>

<style scoped>
form {
    display: grid;
    grid-template-columns: 1fr;
    padding: 20px;
}

.form-group {
    display: flex;
    justify-items: left;
    flex-direction: column;
    margin: 10px 0;
}

label {
    text-align: left;
    margin-bottom: 8px;
    font-size: 20px;
}

input,
select {
    padding: 6px 10px;
    font-size: 16px;
    border-radius: 20px;
    border: 1.5px solid var(--obscure);
    width: 100%;
}

input:focus,
select:focus {
    border: 1.5px solid var(--main-blue);
    outline: none;
}

.error-message {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    background-color: #ffebee;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d32f2f;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-icon {
    margin-right: 8px;
    font-size: 18px;
}
</style>