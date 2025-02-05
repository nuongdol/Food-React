import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export const StoreContext = createContext(null);
const StoreContextProvider = (props)=>{
    const [cartItem, setCartItem] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState("");
    // const [food_list, setFoodList] = useState([])
    const addToCart = async (itemId)=>{
        if(!cartItem[itemId]){
            setCartItem((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if (token) {
            await axios.post(url +"/api/cart/add",{itemId},{headers:{token}})
            
        }

    }
    const removeFromCart = async (itemId) =>{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))

        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    }
    

    // useEffect(() =>{
    //     console.log(cartItem);

    // },[cartItem])

    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItem){
            if(cartItem[item]>0){
                let itemInfo = food_list.find((product)=>product._id === item);
                totalAmount += itemInfo.price * cartItem[item];
                console.log(cartItem[item])
            }
        }
        return totalAmount;
    }

    const getTotalCartQuantity = ()=>{
        let totalQuantity = 0;
        for(const item in cartItem){
            totalQuantity += cartItem[item];    
        }
        return totalQuantity;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }
    const loadCartData = async (token) =>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItem(response.data.cartData);
    }

    useEffect(() =>{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }

        }
        loadData();
    },[])
    
    const contextValue = {
        food_list,
        // trang thai cua toan cau 
        cartItem,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartQuantity,
        url,
        token,
        setToken,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;