import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ErrorMessage} from "../type/PageTypes";
import {AppState} from "./Store";

interface ErrorProps {
    errors: ErrorMessage[],
}

const emptyErrors: ErrorProps = {errors: []}

const errorSlice = createSlice({
    name: 'Errors',
    initialState: emptyErrors,
    reducers: {
        addError(state, action: PayloadAction<ErrorMessage>) {
            state.errors = [...state.errors, action.payload];
        },
        removeError(state, action: PayloadAction<ErrorMessage>) {
            state.errors = state.errors.filter((value) => value !== action.payload);
        },
        clearErrors(state) {
            state.errors = [];
        }
    }
})

export const {clearErrors, removeError, addError} = errorSlice.actions
export const errorSelector = (state:AppState) => state.errors.errors;
export default errorSlice.reducer;