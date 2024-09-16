import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light", //config global
    user: {
        isLoggedIn: false,
    }, //start with null
    token: null, //auth info
    posts: [],
    search: {
        query: "",
        results: [],
        isLoading: false,
        error: null
    },
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
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.log("This user friend does not exist :(")
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => { //only show current post
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post_id) return action.payload.post; //set new updated post 
                return post;
            });
            state.posts = updatedPosts;
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
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setSearchQuery, setSearchResults, setSearchLoading, setSearchError } = authSlice.actions;
export default authSlice.reducer;