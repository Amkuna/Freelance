import axios from 'axios';


export const baseURL = 'http://localhost';

export const maxFileSize = 50000000;

//URL for api
const instance = axios.create({
    baseURL: baseURL + '/api',
});


export default instance;