<template>
  <section class="parent">
    <div  v-for="post in posts">
      <router-link :to="{ name: 'SinglePost', params: {id: post.id}}">
        <figure class="preview__figure" style="margin: auto;" v-bind:style="{ backgroundImage: 'url(' + post.image + ')' }">
          <figcaption class="preview__details">
            <span class="preview__title">
              {{post.title}}
            </span>
            <div class="preview__meta">
              <span class="preview__published">
                {{dateString(post.created)}}
              </span>

            </div>
          </figcaption>
        </figure>
      </router-link>

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
  filters: {
    reverse: function(arr) {
        return arr.reverse();
    }
  },
  computed: {
    posts: function(){
      return this.$store.getters.allPosts;
    }
  },
  methods: {
    dateString: function (date) {
      let day = new Date(date);
      return day.toDateString();
    }
  }
}
</script>

<style>
.parent{
  display: grid;
  grid-column-gap: 10px;
  grid-template: auto auto auto /1fr 1fr 1fr;
  grid-row-gap: 60px;
}
.child{
  height: 300px;
}
.preview__figure {
    position: relative;
    padding-top: 140%;
    transition: padding-top 275ms cubic-bezier(.2,.3,.4,.9);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50%;
  }
  .preview__details {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.preview__title {
    display: block;
    height: 100%;
    padding: .75rem;
    color: #fcfdff;
    background-color: rgba(10,9,8,0);
    transition: background-color 225ms cubic-bezier(.4,.25,.3,1);
    font-size: 2.1rem;
    font-weight: 600;

}
.preview__title:hover {
    background-color: rgba(10,9,8,.65);
}
@media screen and (max-width: 1074px) {
  .parent{
    grid-template: auto auto/ auto auto;
  }
}
</style>
