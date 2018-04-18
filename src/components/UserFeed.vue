<template>
  <div class="feed">
    <div>
      <h1>Add a Post</h1>
      <p>
        To create a post enter the title and valid URL to
        your choice of a featured image. Once you've added the
        title and image click post, and it will show up in your list
        of posts. You will then immediately click edit where you will
        then be able to edit the body of your post.
      </p>
      <h4>Please do not leave the Title or Image URL blank</h4>
      <form v-on:submit.prevent="post" class="tweetForm">
        <label for="text">Title</label>
	       <textarea v-model="text" style="width:100%" placeholder=""/><br/>
         <label for="image">Image URL</label>
         <textarea v-model="image" style="width:100%" placeholder="https://www.variety.org.au/wp-content/uploads//2016/07/placeholder-tall.png"></textarea>
	       <div class="buttonWrap">
	       <button class="primary" type="submit">Post</button>
	</div>
      </form>
    </div>
    <h4>Here are all the Posts you have made:</h4>
    <div v-for="item in feed" class="item">
      <p class="idline"><span class="time">{{item.created | since}}</span></p>
      <p class="tweet">{{item.title}}</p
      <p><router-link :to="{ name: 'post', params: {id: item.id}}">Edit Post</router-link></p>
    </div>
  </div>
</template>

<script>
 import moment from 'moment';
 export default {
   name: 'UserFeed',
   data () {
     return {
       text: '',
       image: 'https://www.variety.org.au/wp-content/uploads//2016/07/placeholder-tall.png'
     }
   },
   created: function() {
     this.$store.dispatch('getFeed');
   },
   filters: {
     since: function(datetime) {
       moment.locale('en', {
	 relativeTime: {
	   future: 'in %s',
	   past: '%s',
	   s:  'seconds',
	   ss: '%ss',
	   m:  '1m',
	   mm: '%dm',
	   h:  'h',
	   hh: '%dh',
	   d:  'd',
	   dd: '%dd',
	   M:  ' month',
	   MM: '%dM',
	   y:  'a year',
	   yy: '%dY'
	 }
       });
       return moment(datetime).fromNow();
     },
   },
   computed: {
     feed: function() {
       return this.$store.getters.feed;
     },
   },
   methods: {
     post: function() {
       this.$store.dispatch('addPost',{
         post: "Add your content here",
         title: this.text,
         image: this.image,
       }).then(tweet => {
	        this.text = "Enter Post Title";
          this.image = "";
       });
     },
   }
 }
</script>

<style scoped>
  textarea{
    width: 85%;
  }
</style>
