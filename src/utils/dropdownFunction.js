
import { toast } from "react-toastify";


export const dropdownFunction = (e, state, values, tableData, func, tableEvent) => {
    if (!navigator.onLine) return toast.warn("Sorry, You are currently Offline");
    const data = func ? func(tableData, tableEvent) : values;
    if(data?.length === 0 || data === undefined) {
        toast.error("No Data Found")
    }
    setTimeout(() => {
        if (!e.query.trim().length && e?.length === undefined && data !== undefined) {
            state([...data]);
        } else {
            state(
                data?.filter((value) => {
                    return value.name?.toLowerCase().startsWith(e.query.toLowerCase());
                })
            );
        }
    }, 250);
};