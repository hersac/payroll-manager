<template>
    <div class="upload-payroll">
        <button @click="showCloseForm" class="ui button primary">Nueva nomina</button>
        <form @submit.prevent="handlerSubmit" class="ui form upload-payroll__form" :class="{ open: showForm }">
            <div class="field">
                <label for="file" class="ui icon button">
                    <i class="file icon" />
                    Seleccionar nómina
                    <span v-if="file">({{ file.name }})</span>
                </label>
                <input type="file" id="file" style="display: none;" @change="uploadFile" >
            </div>
            <div class="field">
                <div class="ui calendar">
                    <div class="ui input left icon">
                        <input type="date" @change="changeDate" :value="date">
                    </div>
                </div>
            </div>
            <button class="ui button positive" :class="{ loading }"> Subir nomina </button>

            <p v-if="error">{{ error }}</p>
        </form>
    </div>
</template>
<script>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { nominaUpload } from '@/utils/firebase';
export default {
    name:"UploadPayroll",
    props: {
        getPayrolls: Function,
    },
    setup(props){
        let showForm = ref(false);
        let file = ref(null);
        let date = ref(null);
        let loading = ref(false);
        let error = ref(null);

        const showCloseForm = () => {
            showForm.value = !showForm.value;
        };

        const uploadFile = (e) => {
            error.value = null;
            const fileTemp = e.target.files[0];
            if(fileTemp.type === "application/pdf"){
                file.value = fileTemp;
            } else {
                file.value = "";
                error.value = "Fichero no valido";
            }
        };

        const changeDate = (e) => {
            date.value = e.target.value;
        };

        const handlerSubmit = async () => {
            loading.value = true;
            if(file.value && date.value){
                try {
                    const nameFile = uuidv4();
                    await nominaUpload(nameFile, file.value, date.value);
                    props.getPayrolls();
                } catch (err) {
                    console.log(err);
                }
            }
            loading.value = false;
            file.value = null;
            date.value = null;
            error.value = null;
            document.getElementById("file").value="";
        };

        return {
            showForm,
            file,
            date,
            loading,
            error,
            showCloseForm,
            uploadFile,
            changeDate,
            handlerSubmit,

        }
    }
    
}
</script>
<style lang="scss" scoped>
    .upload-payroll {
        > .ui.button.primary {
            margin-bottom: 40px;
        }

        &__form {
            display: flex;
            align-items: center;
            flex-direction: column;
            height: 0px;
            overflow: hidden;
            transition: height 0.3s ease;

            &.open {
                height: 200px;
            }
        }
    }
</style>