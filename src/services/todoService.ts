import axios from 'axios';

const API_GET_URL = process.env.REACT_APP_API_RECORD_GET_URL as string;
const API_ADD_URL = process.env.REACT_APP_API_RECORD_ADD_URL as string;
const API_UPDATE_URL = process.env.REACT_APP_API_RECORD_UPDATE_URL as string;
const API_DELETE_URL = process.env.REACT_APP_API_RECORD_DELETE_URL as string;

export const fetchTodos = async (token: string | null) => {
    console.log(API_GET_URL);
    const response = await axios.get(API_GET_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addTodo = async (
    token: string | null,
    title: string,
    description: string,
    deadline: string | null,
    status: string | null
) => {
    const response = await axios.post(
        API_ADD_URL,
        { Title: title, Description: description, Status: status, Deadline: deadline },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};


export const updateTodoStatus = async (token: string | null, id: string, status: string, title: string , deadline: string | null , description: string) => {
    await axios.put(
        `${API_UPDATE_URL}${id}`,
        { Title: title, Description: description, Status: status, Deadline: deadline },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const deleteTodo = async (token: string | null, id: string) => {
    await axios.delete(`${API_DELETE_URL}${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};