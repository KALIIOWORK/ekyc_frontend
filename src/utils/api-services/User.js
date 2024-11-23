import { useAxios } from "../../context";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";

export const useGetUserByUsername = (username, params) => {
    const axios = useAxios();
    return useQuery({
        queryKey: ["getUserByUsername", username],
        queryFn: () => axios.get(`/user/getUserByUsername/${username}`),
        onError: (err) => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            });
        },
        ...params
    });
};

export const useVerifyCustomer = (params) => {
    const axios = useAxios();
    return useMutation({
        queryKey: ["verifyCustomer"],
        mutationFn: (formData) => axios.post(`/user/verifyCustomer`, formData),
        onError: (err) => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            });
        },
        ...params

    });
}