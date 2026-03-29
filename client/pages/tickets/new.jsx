import { useState } from "react";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return
        }
        setPrice(value.toFixed(2));
    }

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: (ticket) => console.log(ticket)
    })

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }

    const titleError = errors?.find(err => err.field === "title") || null;
    const priceError = errors?.find(err => err.field === "price") || null;
    return (
        <div>
            <h1>Create Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        name="title" />
                    {titleError && (
                        <div className="text-danger">
                            {titleError.message}
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control"
                        name="price" />
                    {priceError && (
                        <div className="text-danger">
                            {priceError.message}
                        </div>
                    )}
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default NewTicket;