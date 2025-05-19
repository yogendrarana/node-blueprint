import React from "react";
import { cn } from "../lib/utils";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}

const Container: React.FC<ContainerProps> = ({ children, as: Comp = "div", className = "" }) => {
    const baseStyles = `w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10`;
    
    return <Comp className={cn(baseStyles, className)}>{children}</Comp>;
};

export default Container;
