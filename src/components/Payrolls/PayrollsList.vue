<template>
    <div class="payroll-list">
        <p class="payroll-list__not-found" v-if="payrolls?.legnth === 0">
            No tienes ninguna nomina, sube la primera.
        </p>
        <div class="payroll-list__payroll" v-for="(payroll, index) in payrolls" :key="index">
            <p> {{ formatDate(payroll.dateString) }} </p>
            <div class="action">
                <a :href="payroll.payrollUrl" target="__blank" class="ui button positive">Descargar</a>
                <button class="ui button red" @click="deletePayroll(payroll.id)">Eliminar</button>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import "moment/locale/es";
import { deleteNomina } from '@/utils/firebase';
export default {
    name:"PayrollsList",
    props:{
        payrolls: Array,
        getPayrolls: Function,
    },
    setup(props){

        const formatDate = (date) => {
            return moment(date).format("MMMM [/] YYYY");
        };

        const deletePayroll = async (id) => {
            try {
                await deleteNomina(id);
                props.getPayrolls();
            } catch (error) {
                console.log(error);
            }
        };

        return {
            formatDate,
            deletePayroll,
        }        
    }
}
</script>
<style lang="scss" scoped>
.payroll-list{
    &__not-found {
        text-align: center;
        font-size: 20px;
    }

    &__payroll {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 15px 0;
    }

    p {
        margin: 0;
        text-transform: uppercase;
        font-weight: bold;
    }
}    


</style>