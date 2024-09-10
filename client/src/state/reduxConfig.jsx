import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light", //config global
    user: {
        isLoggedIn: false,
    }, //start with null
    token: null, //auth info
    posts: [],
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
        }
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;