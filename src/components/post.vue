<template lang="html">
  <section>
    <h1>{{title}}</h1>
    <div v-if="loggedIn">
      <vue-editor v-model="text"></vue-editor>
      <form v-on:submit.prevent="updatePost">
        <button class="alternate" type="submit">Save</button>
      </form>
    </div>
    <div v-else>
      <h1>You must log in to access this page</h1>
    </div>
  </section>

</template>

<script>
import { VueEditor } from 'vue2-quill-editor'
export default {
  name: 'post',
  components: {
      VueEditor
   },
   data() {
       return {
         text: ''
       }
     },
     created: function() {
       this.$store.dispatch('getContent',{id:this.$route.params.id});
       this.text = this.$store.getters.content
     },
     computed: {
       loggedIn: function() {
         this.text = this.$store.getters.content
         return this.$store.getters.loggedIn;
       },
       content: function(){
         this.$store.set
         return this.$store.getters.content;
       },
       title: function(){
         return this.$store.getters.currentTitle;
       }

     },
     methods: {
       updatePost: function(){
         this.$store.commit('setContent',this.text);
         this.$store.dispatch('updatePost',{id:this.$route.params.id});
       }
     }
}
</script>

<style lang="css">
</style>
