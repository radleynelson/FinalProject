<template>
  <div>
    <div v-if="loggedIn">
      <user-feed/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
import WelcomePage from './welcome-page';
import UserFeed from './UserFeed'
 export default {
   name: 'admin',
   components: {WelcomePage,UserFeed},
   data () {
     return {
       username: '',
       email: '',
       password: '',
       name: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     }
   },
   methods: {
     register: function() {
       this.$store.dispatch('register',{
	        username: this.username,
          email: this.email,
          password: this.password,
	        name: this.name,
       });
     }
   }
 }
</script>

<style scoped>
</style>
