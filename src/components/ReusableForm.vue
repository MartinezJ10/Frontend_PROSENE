<template>
    <form @submit.prevent="handleSubmit" method="post">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
            <label :for="field.name">{{ field.label }}</label>
            
           
            <input v-if="field.type === 'text'" v-model="formData[field.name]" :type="field.type" :name="field.name"
            :id="field.name" />
           
            
            <input v-if="field.type === 'password'" v-model="formData[field.name]" :type="field.type" :name="field.name"
            :id="field.name" />

            <input v-if="field.type === 'email'" v-model="formData[field.name]" :type="field.type" :name="field.name"
            :id="field.name" />


        </div>
        <button type="submit">{{ submitButtonText }}</button>

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
    form{
        display: grid;
        grid-template-columns: 1fr;  /* Default to one column layout */
        padding: 20px;
    }
    .form-group{
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

    input {
        padding: 6px 10px;
        font-size: 16px;
        border-radius: 20px;
        border: 1.5px solid var(--obscure);
        width: 100%;
    }
    input:focus {
        border: 1.5px solid var(--main-blue);
        outline: none; /* Remove the outer blue stroke */
    }
    button {
        padding: 12px;
        background-color: var(--main-blue);
        color: white;
        font-size: 18px;
        border: 1.5px solid var(--main-blue);
        border-radius: 20px;
        cursor: pointer;
        width: 50%;
    }
    button:hover {
        background-color: white;
        color: var(--main-blue);
        border: 1.5px solid var(--main-blue);
        transition: 0.5s ease;
    }

</style>