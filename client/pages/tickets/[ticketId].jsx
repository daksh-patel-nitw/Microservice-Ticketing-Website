import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })

    const error = errors?.[0]?.message;

    return (<div>
        <h1>{ticket.title}</h1>
        <h4>Price:{ticket.price}</h4>
        <button onClick={(event) => doRequest()} className="btn btn-primary">Purchase</button>
        {error && (
            <div className="text-danger">
                {error}
            </div>
        )}
    </div>)
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    console.log(data);
    return { ticket: data }
}

export default TicketShow