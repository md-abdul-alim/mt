import axios from 'axios'


// Create instance called instance
const instance = axios.create({
    baseURL: 'https://example.com',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
});

export default instance