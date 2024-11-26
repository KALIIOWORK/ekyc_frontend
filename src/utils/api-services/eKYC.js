import { useAxios } from "../../context";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";


export const useGetListOfeKYC = (
    filters,
    params
) => {
    const axios = useAxios();
    return useQuery({
        queryKey: ["getListOfeKYC", filters],
        queryFn: () => axios.get(`/ekyc/getListOfeKYC`, { params: filters }),
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

export const useGeteKYCById = (
    id,
    params
) => {
    const axios = useAxios();
    return useQuery({
        queryKey: ["geteKYCById", id],
        queryFn: () => axios.get(`/ekyc/geteKYCById/${id}`),
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

export const useToggleIsJoined = (
    params
) => {
    const axios = useAxios();
    return useMutation({
        queryKey: ["toggleIsJoined"],
        mutationFn: (data) => axios.post(`/ekyc/toggleIsJoined`, data),
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

