import {configureStore} from "@reduxjs/toolkit";
import ErrorReducer from "./ErrorReducer";
import StocksReducer from "./StocksReducer";

export const store = configureStore({
    reducer: {
        errors: ErrorReducer,
        stocks: StocksReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch