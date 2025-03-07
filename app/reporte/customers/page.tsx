import { Metadata } from "next";


export const metadata:  Metadata = {
    title: "Customers"

};
const Customers = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000) );

    return (
        <div>
           <h1>El contenido del Customers</h1> 
        </div>
    );
};

export default Customers;

