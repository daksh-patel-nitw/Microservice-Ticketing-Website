import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async (props={}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {...body,...props});

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            console.log(err);
            console.log(err.response);
            setErrors(err.response.data.errors);
        }
    };

    return { doRequest, errors };
};