<template lang="html">
  <section class="post">
    <h1 class="post title">{{post.title}}</h1>
    <h4>By: {{post.username}}</h4>
    <img style="width:550px;" :src="post.image" alt="">
    <div v-html="post.post"class="post">

    </div>
  </section>
</template>

<script>
export default {
  name: 'SinglePost',
  data(){
    return {

    }
  },
  created: function(){
    this.$store.dispatch('getSinglePost',{id:this.$route.params.id});
  },
  computed: {
    post: function(){
      return this.$store.getters.post;
    }
  }
}
</script>

<style lang="css">
.post{
  text-align: center;
}
.title{
  font-size: 45px;
}
</style>
