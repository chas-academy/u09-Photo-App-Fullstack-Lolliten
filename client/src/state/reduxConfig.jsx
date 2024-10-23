/* 
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reduxConfig";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // Add middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check if needed
    }),
});

export default store;
*/
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light", //config global
  user: {
    isLoggedIn: false,
    friendRequests: [],
  }, //start with null
  token: null, //auth info
  posts: [],
  search: {
    query: "",
    results: [],
    isLoading: false,
    error: null,
  },
   sentRequests: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user; //in payload we send in the param user
      state.token = action.payload.token; //params for token
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => { //add a null check in the component that dispatches this action.
        state.user = { //spreads all existing properties 
            ...state.user, //into the new object we're creating.
            friends: action.payload.friends
          };
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts]; // Add new post to the top
    },
    setPost: (state, action) => {
      //only show current post
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post; //set new updated post
        return post;
      });
      state.posts = updatedPosts;
    },
    /* when array works. if first element in array is null then set state.user.friendRequest into []  */
    setFriendRequests: (state, action) => {
    if (Array.isArray(action.payload.friendRequests)) {
        state.user.friendRequests = action.payload.friendRequests;
        console.log("set friend request: isArray")
    } else {
        console.log("set friend request: is not Array")
        const newFriendRequests = state.user.friendRequests
        newFriendRequests.push(action.payload.friendRequests)
        state.user.friendRequests = newFriendRequests;
    }
},
    // Updates the search query
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    //Updates the search results and resets loading/error states
    setSearchResults: (state, action) => {
      state.search.results = action.payload;
      state.search.isLoading = false;
      state.search.error = null;
    },
    //Sets the loading state to true when a search begins
    setSearchLoading: (state) => {
      state.search.isLoading = true;
    },
    setSearchError: (state, action) => {
      state.search.error = action.payload;
      state.search.isLoading = false;
    },
    setUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // Merge existing user data with new data
    },
    setSentRequests: (state, action) => {
      state.sentRequests = action.payload.sentRequests; // Update sentRequests
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  addPost,
  setPost,
  setFriendRequests,
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
  setUserProfile,
  setSentRequests,
} = authSlice.actions;

export default authSlice.reducer;
