<template>
  <div class="ui secondary menu">
    <div class="ui container">
      <div class="menu left">
        <router-link to="/" class="item">Nominas</router-link>
      </div>

      <router-link to="/" class="menu center">
        <img src="../assets/nomina.png" alt="logo" class="ui small image" />
      </router-link>

      <div class="menu right">
        <router-link to="/account" class="item">
            Hola, {{ user.displayName || user.email }}
        </router-link>

        <span class="ui item logout" @click="logout">
          <i class="sign-out icon" />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { auth } from '@/utils/firebase';
export default {
    name:"Menu",
    setup(){
        const store = useStore();
        const user = computed(()=>store.state.user);

        const logout = ()=>{auth.signOut()}

        return {
            user,
            logout,
        }
    }
};
</script>
<style lang="scss" scoped>

.ui.menu.secondary {
    background-color: #16202b;
    .item {
        color: #fff;
        &:hover{
            color: #1fa1f1;
        }
    }

    .menu.left {
        width: 50%;
    }

    .menu.right {
        width: 50%;
        justify-content: flex-end;

        .logout:hover {
            cursor: pointer;
            i {
                color: #f00;
            }
        }
    }

    .menu.center {
        background-color: #16212b;
        position: relative;
        top: 15px;
        padding: 20px;
        margin: -20px;
        border-radius: 50%;

        &:hover {
            box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.3);
            -webkit-box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.3);
        }

        .ui.image{
            width: 40px;
        }
    }
}

</style>
