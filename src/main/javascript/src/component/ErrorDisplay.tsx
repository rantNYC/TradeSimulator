import React, {useEffect} from "react";
import {ErrorMessage} from "../type/PageTypes";
import {XCircle} from "react-feather";
import './ErrorDisplay.scss';
import {errorSelector} from "../store/ErrorReducer";
import {useAppSelector} from "../store/StoreHooks";

interface ErrorDisplayProps{
    removeMessage(message: ErrorMessage) : void;
}

const ErrorDisplay = (props : ErrorDisplayProps) => {

    const errors = useAppSelector(errorSelector);

    useEffect(() => {

    }, [errors])

    return (
        <React.Fragment>
            {errors.map((value, index) => {
                if (value && value.error !== '') {
                    return (
                        <div key={index} className="error">
                            <label>{value.error}</label>
                            <div className="error-close">
                                <XCircle onClick={() => props.removeMessage(value)}/>
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