<template>
    <div class="login">
        <h2>Iniciar sesión</h2>
        <form class="ui form" @submit.prevent="onLogin">
            <div class="field">
                <input type="email" placeholder="Correo electronico" v-model="formData.email" :class="{ error: formError.email }"/>
            </div>
            <div class="field">
                <input type="password" placeholder="Contraseña" v-model="formData.password" :class="{ error: formError.password }"/>
            </div>
            <div>
                <button type="submit" class="ui button positive fluid" :class="{ loading }">Entrar</button>
            </div>
        </form>
        <p @click="changeForm">Crear nueva cuenta</p>
    </div>
</template>
<script>
import { ref } from 'vue';
import * as Yup from 'yup';
import { auth, loginUser } from '@/utils/firebase';
export default {
    name:"Login",
    props:{
        changeForm: Function,
    },
    setup(){
        let formData = {};
        let formError = ref({});
        let loading = ref(false);
        const schemaForm = Yup.object().shape({
            email: Yup.string().email(true).required(true),
            password: Yup.string().required(true),
        });
        const onLogin = async () => {
            loading.value = true;
            formError.value = {};
            try {
                await schemaForm.validate(formData, { abortEarly: false});
                try {
                    const { email, password } = formData;
                    await loginUser(auth, email, password);
                } catch (error) {
                    console.log(error);
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
            onLogin,
            formError,
            loading,
        }
    }
}
</script>
<style scoped>
    .login {
        background-color: #fff;
        padding: 30px;
        box-shadow: 0 0 38px -5px rgba(0, 0, 0, 0.45);
        width: 400px;
        border-radius: 10px;
    }

    h2 {
        text-align: center;
        margin-bottom: 30px;
    }

    form {
        input.error {
            border-color: #faa;
            background-color: #ffeded;
        }
    }

    p {
        text-align: center;
        margin-top: 30px;
        &:hover {
            cursor: pointer;
            opacity: 0.6;
        }
    }
</style>