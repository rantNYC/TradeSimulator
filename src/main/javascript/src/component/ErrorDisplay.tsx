import React, {useEffect} from "react";
import {ErrorMessage} from "../type/PageTypes";
import {XCircle} from "react-feather";
import './ErrorDisplay.scss';
import {clearErrors, errorSelector, removeError} from "../store/ErrorReducer";
import {useAppDispatch, useAppSelector} from "../store/StoreHooks";



const ErrorDisplay = () => {

    const dispatch = useAppDispatch();
    const errors = useAppSelector(errorSelector);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (errors.length > 0){
                console.log('Removing error');
                dispatch(clearErrors())
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [errors, dispatch]);

    const removeMessage = (message: ErrorMessage) => {
        dispatch(removeError(message));
    }

    return (
        <React.Fragment>
            {errors.map((value, index) => {
                if (value && value.error !== '') {
                    return (
                        <div key={index} className="error">
                            <label>{value.error}</label>
                            <div className="error-close">
                                <XCircle onClick={() => removeMessage(value)}/>
                            </div>
                        </div>
                    )
                }

                return null;
            })}
        </React.Fragment>
    )
}

export default ErrorDisplay;