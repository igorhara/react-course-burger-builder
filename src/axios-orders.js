import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-my-burger-b7920.firebaseio.com/'
});


export default instance;