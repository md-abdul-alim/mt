import { useState, useEffect } from "react";

const useItemDropdown = () => {

    const [buyers, setbuyers] = useState([]);

    const [productDropdown, setProductDropdown] = useState([]);
    const [brandDropdown, setBrandDropdown] = useState([]);


    useEffect(() => {

        async function getbuyers() {
            const response = await fetch("/api/buyer/list/", {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-buyer": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
              },
            });
            const body = await response.json();
            setbuyers(body);
          }
          getbuyers();
    }, []);

    return {
        productDropdown, 
        setProductDropdown, 
        brandDropdown,
        setBrandDropdown,
        buyers,
        buyers,
    };
};

export default useItemDropdown;
