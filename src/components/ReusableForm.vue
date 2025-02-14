<template>
    <form @submit.prevent="handleSubmit" method="post">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
            <label :for="field.name">{{ field.label }}</label>
            <input v-if="field.type === 'text' || field.type === 'password' || field.type === 'email'"
                v-model="formData[field.name]" :type="field.type" :name="field.name" :id="field.name" required />

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
import { ref } from 'vue';

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

//Accumulator and field for each field in the array
const formData = ref(props.fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
}, {}));

//Simply put the handleSubmit to the given function
const handleSubmit = () => {
    props.onSubmit(formData.value);
};

</script>

<style scoped>
form {
    display: grid;
    grid-template-columns: 1fr;
    /* Default to one column layout */
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
</style>