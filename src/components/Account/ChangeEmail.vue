<template>
    <div>
        <form @submit.prevent="onChangeEmail" class="ui form change-email" >
            <div class="two fields">
                <div class="field">
                    <input type="text" placeholder="Nuevo Email" v-model="formData.email" :class="{ error: formError.email }">
                </div>

                <div class="field">
                    <input type="password" placeholder="Contraseña actual" v-model="formData.password" :class="{ error: formError.password }">
                </div>
            </div>
            <p v-if="messageError">{{ messageError }}</p>
            <button type="submit" class="ui button primary" :class="{ loading }">Actualizar</button>
        </form>
    </div>
</template>
<script>
import { ref } from "vue";
import * as Yup from "yup";
import { changeEmail } from '@/utils/firebase';

export default {
    title:"ChangeEmail",
    setup(){
        let formData = {};
        let formError = ref({});
        let messageError = ref("");
        let loading = ref(false);

        const schemaForm = Yup.object().shape({
            email: Yup.string().email(true).required(true),
            password: Yup.string().required(true),
        });

        const onChangeEmail = async ()=>{
            formError.value = {};
            loading.value = true;
            messageError.value = '';
            try {
                await schemaForm.validate(formData, { abortEarly: false });
                try {
                    const { email, password } = formData;
                    await changeEmail(email, password);                    
                } catch (error) {
                    messageError.value = error.message;
                }

            } catch (err) {
                err.inner.forEach((error)=>{
                    formError.value[error.path] = error.message;
                });
            }
            loading.value = false;
        };



        return {
            formData,
            formError,
            messageError,
            onChangeEmail,
            loading,
        }
    }
}
</script>
<style lang="scss" scoped>
.ui.form.change-email {
    text-align: center;
    
    input.error {
        border-color: #faa;
        background-color: #ffeded;
    }

    .ui.button {
        margin: 20px 0 0 0;
    }
}
</style>