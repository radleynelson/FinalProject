<template>
  <section>
    <router-link to="/"><h1 class="title">Sports Blog</h1></router-link>

    <nav>
      <ul id="menu">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/admin">Admin</router-link></li>
        <li class="right" v-if="loggedIn"><a @click="logout" href="#">Logout</a></li>
        <li class="right" v-if="loggedIn">{{user.username}}</li>
        <form v-else class="right" v-on:submit.prevent="login">
  	       <input v-model="email" placeholder="Email Address">
  	        <input type="password" v-model="password" placeholder="Password">
  	         <button class="primary" type="submit">Login</button>
        </form>
      </ul>
      <div class="flexWrapper errorPlace">
        <p v-if="loginError" class="flexRight error">{{loginError}}</p>
      </div>
    </nav>
  </section>

</template>

<script>
 export default {
   name: 'AppHeader',
   data () {
     return {
       email: '',
       password: '',
     }
   },
   computed: {
     user: function() {
       return this.$store.getters.user;
     },
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     loginError: function() {
       return this.$store.getters.loginError;
     },
   },
   methods: {
     login: function() {
       this.$store.dispatch('login',{
         email: this.email,
         password: this.password,
       }).then(user => {
	        this.email = '';
	         this.password = '';
       });
     },
     logout: function() {
       this.$store.dispatch('logout');
     }
   }
 }
</script>

<style scoped>
 /* Strip the ul of padding and list styling */
 nav {
     display: grid;
     margin-bottom: 20px;
 }
 ul {
     list-style-type:none;
     margin:0;
     padding:0;
 }
 /* Create a horizontal list with spacing */
 li {
     display:inline-block;
     float: left;
     margin-right: 20px;
     height: 50px;
     text-align: center;
     line-height: 50px;
     color: #666;
 }
 /*Active color*/
 li a.active {
 }
 /*Hover state for top level links*/
 li:hover a {
 }
 .right {
     float: right;
 }
 .errorPlace {
     height: 20px;
 }
 img {
     width: 50px;
 }
 .title{
   font-size: 50px;
   text-decoration: none !important;

 }
 section {
   margin-bottom: none !important;
   padding-bottom: none !important;
 }
 a{
   text-decoration: none !important;
   color: #054958;
 }
</style>
