import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

export default () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(email,password);
        await doRequest();
    }

    const emailError = errors?.find(err => err.field === "email") || null;
    const passwordError = errors?.find(err => err.field === "password") || null; 

    return (
        <div className="container d-flex justify-content-center mt-2">

            <div className="card shadow" style={{ width: "400px" }}>

                <div className="card-body">

                    <h3 className="card-title text-center mb-4">Sign Up</h3>

                    <form onSubmit={onSubmit}>


                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="form-control"
                            />

                            {emailError && (
                                <div className="text-danger">
                                    {emailError.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="form-control"
                            />

                            {passwordError && (
                                <div className="text-danger">
                                    {passwordError.message}
                                </div>
                            )}

                        </div>

                        <button className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    )
}