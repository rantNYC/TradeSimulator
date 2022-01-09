import {configureStore} from "@reduxjs/toolkit";
import ErrorReducer from "./ErrorReducer";

export const store = configureStore({
    reducer: {
        errors: ErrorReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch