<template>
    <div>
        <form @submit.prevent="onChangePassword" class="ui form change-password" >
            <div class="three fields">
                <div class="field">
                    <input type="password" placeholder="Contraseña actual" v-model="formData.password" :class="{ error: formError.password }">
                </div>

                <div class="field">
                    <input type="password" placeholder="Contraseña nueva" v-model="formData.newPassword" :class="{ error: formError.newPassword }">
                </div>

                <div class="field">
                    <input type="password" placeholder="Confirmar contraseña nueva" v-model="formData.confirmNewPassword" :class="{ error: formError.confirmNewPassword }">
                </div>
            </div>
            <p v-if="messageError">{{ messageError }}</p>
            <button type="submit" class="ui button primary" :class="{ loading }">Actualizar</button>
        </form>
    </div>
</template>
<script>
import { ref } from "vue";
import * as Yup from 'yup';
import { changePassword } from '@/utils/firebase';


export default {
    name:"ChangePassword",
    setup(){
        let formData = {};
        let formError = ref({});
        let messageError = ref("");
        let loading = ref(false);

        const schemaForm = Yup.object().shape({
            password: Yup.string().required(true),
            newPassword: Yup.string().required(true),
            confirmNewPassword: Yup.string().required(true).oneOf([Yup.ref("newPassword")], true),
        });

        const onChangePassword = async ()=>{
            formError.value = {};
            loading.value = true;
            messageError.value = '';
            try {
                await schemaForm.validate(formData, { abortEarly: false });
                try {
                    const { password, newPassword } = formData;
                    await changePassword(password, newPassword);
                                       
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
            onChangePassword,
            loading
        }
    }
}
</script>
<style lang="scss" scoped>
.ui.form.change-password {
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