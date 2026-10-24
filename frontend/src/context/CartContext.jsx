import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartCount, setCartCount] = useState(0);


    // Get total different products from DB
    const getCartCount = async () => {

        try {

            const response = await api.get(
                "/api/user/cart/count"
            );

            setCartCount(response.data.count);
            //console.log(response.data.count);
            //console.log("NEW CART COUNT:", response.data.count);

        } catch (error) {
            console.log("Cart Count Error:", error);
        }
    };


    // Add product to cart
    const addToCart = async (product) => {

        const response = await api.post(
            "/api/user/cart/items",
            {
                product_id: product.id,
                quantity: 1
            }
        );

        // DB se latest product count lao
        await getCartCount();

        return response.data;
    };


    // App load hone par db se count lao
    useEffect(() => {

        getCartCount();

    }, []);


    return (
        <CartContext.Provider
            value={{
                cartCount,
                addToCart,
                getCartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};


export const useCart = () => {

    return useContext(CartContext);

};