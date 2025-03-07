
import React from "react";
import { bebas } from "../ui/fonts";
import { FaReact } from "react-icons/fa";

const Logo = () => {
    return (
        <div className={`${bebas.className} flex flex-row items-center leading-none text-white`}>
            <FaReact className="h-20 w-20 rotate-[15deg]" />
            <p className="text-[35px] ml-3"> SisMed </p>
            </div>
    );
};

export default Logo;