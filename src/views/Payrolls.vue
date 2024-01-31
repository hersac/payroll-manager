<template>
    <div class="payrolls">
        <BasicLayout>
            <h1>Mis Nominas</h1>
            <UploadPayroll :getPayrolls="getPayrolls"/>
            <PayrollsList :payrolls="payrolls" :getPayrolls="getPayrolls"/>
        </BasicLayout>
    </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { getNominas } from "@/utils/firebase";
import BasicLayout from '@/layouts/BasicLayout.vue';
import UploadPayroll from '@/components/Payrolls/UploadPayroll.vue';
import PayrollsList from '@/components/Payrolls/PayrollsList.vue';

export default {
    name:"Payrolls",
    components:{
        BasicLayout,
        UploadPayroll,
        PayrollsList,
    },
    setup(){
        let payrolls = ref(null);

        onMounted(() => {
            getPayrolls();
        });

        const getPayrolls = async ()=>{
            payrolls.value = await getNominas();
        };

        return {
            payrolls,
            getPayrolls,
        }

    }
}
</script>
<style lang="scss" scoped>

.payrolls {
    text-align: center;
}

</style>