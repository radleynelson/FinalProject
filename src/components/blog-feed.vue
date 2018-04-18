<template>
  <section>
    <div v-for="post in posts">

    </div>
  </section>
</template>

<script>
export default {
  data() {
    return{

    }
  },
  created: function() {
    this.$store.dispatch('getAllPosts');
  },
  computed: {
    posts: function(){
      return this.$store.get('getAllPosts');
    }
  }
}
</script>

<style lang="css">
</style>
