import { useContext } from "react";
import { LoaderContext } from "./LoadingContext";
import { AxiosContext } from '../utils/axios/AxiosProvider'

export const useLoader = () => useContext(LoaderContext);
export const useAxios = () => useContext(AxiosContext);