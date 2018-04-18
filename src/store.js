import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import router from './router'


Vue.use(Vuex);

const getAuthHeader = () => {
  return { headers: {'Authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
    loginError: '',
    registerError: '',
    feed: [],
    content: '<h1>hello</h1>',
    currentTitle: '',
    allPosts: [],
    post: {},
  },
  getters: {
    user: state => state.user,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === '')
	return false;
      return true;
    },
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    feed: state => state.feed,
    content: state => state.content,
    allPosts: state => state.allPosts.reverse(),
    post: state => state.post,
    currentTitle: state => state.currentTitle
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setToken (state, token) {
      state.token = token;
      if (token === '')
	localStorage.removeItem('token');
      else
	localStorage.setItem('token', token)
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setFeed (state, feed) {
      state.feed = feed;
    },
    setContent (state, content){
      state.content = content;
    },
    setAllPosts (state, posts){
      state.allPosts = posts;
    },
    setPost (state, post){
      state.post = post;
    },
    setCurrentTitle (state, title){
      state.currentTitle = title;
    }
  },
  actions: {

    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token) {
       // see if we can use the token to get my user account
       axios.get("/api/me",getAuthHeader()).then(response => {
         context.commit('setToken',token);
         context.commit('setUser',response.data.user);
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         context.commit('setUser',{});
         context.commit('setToken','');
       });
      }
    },
    // Registration, Login //
    register(context,user) {
      axios.post("/api/users",user).then(response => {
	context.commit('setUser', response.data.user);
  context.commit('setToken',response.data.token);
	context.commit('setRegisterError',"");
	context.commit('setLoginError',"");
      }).catch(error => {
	context.commit('setLoginError',"");
  context.commit('setUser',{});
  context.commit('setToken','');
	if (error.response) {
	  if (error.response.status === 403)
	    context.commit('setRegisterError',"That email address already has an account.");
	  else if (error.response.status === 409)
	    context.commit('setRegisterError',"That user name is already taken.");
	  return;
	}
	context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    //Log In
    login(context,user) {
      axios.post("/api/login",user).then(response => {
	context.commit('setUser', response.data.user);
	context.commit('setToken',response.data.token);
	context.commit('setRegisterError',"");
	context.commit('setLoginError',"");
      }).catch(error => {
	context.commit('setRegisterError',"");
  context.commit('setUser',{});
  context.commit('setToken','');
	if (error.response) {
	  if (error.response.status === 403 || error.response.status === 400)
	    context.commit('setLoginError',"Invalid login.");
	  context.commit('setRegisterError',"");
	  return;
	}
	context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },

    logout(context,user) {
     context.commit('setUser', {});
     context.commit('setToken','');
   },

   //Posting
   getFeed(context) {
      axios.get("/api/users/" + context.state.user.id + "/posts").then(response => {
	       context.commit('setFeed',response.data.tweets);
      }).catch(err => {
	console.log("getFeed failed:",err);
      });
    },

    addPost(context,post) {
      axios.post("/api/users/" + context.state.user.id + "/posts",post).then(function(response) {
        context.commit('setPost',response.data.post)
        console.log('router', router);
        console.log('data to go into router in vuex',response.data);
        router.push({ name: 'post', params: { id: response.data.post.id}})
	return context.dispatch('getFeed');
      }).catch(err => {
	console.log("addPost failed:",err);
      });
    },

    updatePost(context, postID){
      let content = context.state.content;
      console.log(postID.id);
      axios.put("/api/users/" + context.state.user.id + "/post/"+postID.id, {post: content}).then(response => {
        console.log(response);
        return
      }).catch(err => {
        console.log("saving post faliled:", err);
      })
    },

    getContent(context, postID){
      axios.get("/api/users/" + context.state.user.id + "/post/"+postID.id).then(response => {
        context.commit('setContent',response.data.post.post);
        context.commit('setCurrentTitle',response.data.post.title);
        console.log(response.data);
      }).catch(err => {
        console.log('getContent failed', err);
      })
    },

    getSinglePost(context, postID){
      axios.get("/api/post/" +postID.id).then(response => {
        context.commit('setPost',response.data.post);
        console.log(response.data);
      }).catch(err => {
        console.log('getContent failed', err);
      })
    },

    getAllPosts(context) {
      axios.get("/api/posts").then(response => {
        context.commit('setAllPosts', response.data.posts);
      }).catch(err => {
        console.log("could get posts", err);
      })
    },

    deletePost(context,id) {
      axios.delete("/api/post/"+id).then(response => {
        context.dispatch('getFeed');
      }).catch(err => {
        console.log("Couldn't delete Post", err);
      })
    }
  }

});
