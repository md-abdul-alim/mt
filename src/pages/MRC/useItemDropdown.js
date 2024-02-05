import { useState, useEffect } from "react";
import { GetItems, GetUmos } from 'services/dropdown/dropdown.service';
import { useSelector, useDispatch } from "react-redux";

const useItemDropdown = () => {
    const dispatch = useDispatch();
    
    const { itemList, itemLoading } = useSelector((state) => state.items);
    const { umoList, umoLoading } = useSelector((state) => state.umos);

    const [itemDropdown, setItemDropdown] = useState([]);
    const [uomDropdown, setUomDropdown] = useState([]);


    useEffect(() => {
        dispatch(GetItems());
        dispatch(GetUmos());
    }, []);

    return {
        itemDropdown, 
        setItemDropdown, 
        uomDropdown,
        setUomDropdown,
        itemList,
        umoList,
    };
};

export default useItemDropdown;
