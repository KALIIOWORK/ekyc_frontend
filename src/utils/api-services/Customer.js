import { useAxios } from "../../context";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";

export const useCreateCustomer = (
    params
) => {
    const axios = useAxios();
    return useMutation({
        queryKey: ["createNewCustomer"],
        mutationFn: (formData) => axios.post(`/customer/createNewCustomer`, formData),
        onError: (err) => {
            //console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            });
        },
        ...params
    });
}