import axios from 'axios';
import { createContext } from 'react';

import { isDevelopment } from '../helper';
import { BASE_URL } from '../url';
import { useLoader } from '../../context'
import { useSelector } from 'react-redux';

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
    const { startLoading, stopLoading } = useLoader();
    const token = useSelector(state => state.auth.token);
    // const state = useSelector(state => state);
    // console.log(state)
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    axiosInstance.interceptors.request.use((config) => {
        startLoading();
        return config;
    });

    const errorHandler = (err) => {
        stopLoading();
        const error = err?.response?.data?.error || err?.response?.data?.message || 'Something went wrong';
        throw error;
    };

    axiosInstance.interceptors.response.use(
        (response) => {
            stopLoading();
            if (isDevelopment) console.info(response.config.url, '===>', response?.data)
            if (response.status === 200) return response
            const err = new Error(response?.data?.error)
            err.config = response.config
            throw err
        }, errorHandler)

    return (
        <AxiosContext.Provider value={axiosInstance}>
            {children}
        </AxiosContext.Provider>
    );
};