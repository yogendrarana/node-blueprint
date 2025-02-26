import React from "react";
import { cn } from "../lib/utils";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}

const Container: React.FC<ContainerProps> = ({ children, as: Comp = "div", className = "" }) => {
    const baseStyles = `w-full max-w-7xl mx-auto px-4 sm:px-10 md:px-12 lg:px-20 xl:px-24`;
    
    return <Comp className={cn(baseStyles, className)}>{children}</Comp>;
};

export default Container;
