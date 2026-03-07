import axios from 'axios';

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);

    return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
    if (typeof window === 'undefined') {
        // we are on the server
        const response = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
            {
                headers: {
                    Host: 'ticketing.dev'
                }
            }
        )
        console.log(response.data);
        return response.data;
    } else {
        // we are on the browser
        const { data } = await axios.get('/api/users/currentuser')
        return data;
    }
}

export default LandingPage;