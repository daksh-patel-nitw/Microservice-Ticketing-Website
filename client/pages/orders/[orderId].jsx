import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
            description: order.ticket.title,
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired!</div>
    }
    return (<div>
        Time Left to Pay: {timeLeft} seconds

        <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51TAExe1Uizy5tIxOJFxnu2raVFW0gNXdtJS4yQQX3RTeUN95LOQ4QMNpeH8B6SiGBsOZG7vxOnLUh2mmN4EMBXzM00bwNnzLEi"
            amount={order.ticket.price * 100}
            currency="INR"
            email={currentUser.email}
        />
        {errors?.[0]?.message}
    </div>)
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);
    console.log(data)
    return { order: data }
}

export default OrderShow