import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import TerminalIcon from "./icons/terminal";

export default function SiteHeader() {
    const [stars, setStars] = useState(0);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/yogendrarana/node-blueprint");

                if (response.ok) {
                    const data = await response.json();
                    const starsCount = data.stargazers_count >= 1000 ? `${(data.stargazers_count / 1000).toFixed(2)}k` : data.stargazers_count;
                    setStars(starsCount);
                }
            } catch (error) {
                console.error("Error fetching GitHub stars:", error);
            }
        };

        fetchStars();
    }, [stars, setStars]);

    return (
        <div className="flex justify-between items-center">
            <a href="/" className="text-lg font-semibold flex items-center gap-2">
                <TerminalIcon className="h-5 w-5" /> Node Blueprint
            </a>

            <motion.a
                href="https://github.com/yogendrarana/node-blueprint"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={"flex items-center"}
            >
                <button
                    className={cn(
                        "px-2 py-1 gap-2 border-2 cursor-pointer text-sm bg-white text-black font-mono border-black shadow-[4px_4px_0_0_#000]",
                        "hover:bg-gray-100 transition-all duration-200",
                        "active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000]",
                        "disabled:opacity-50 disabled:pointer-events-none",
                        "dark:border-gray-800 dark:bg-black dark:text-white dark:shadow-gray-800 dark:hover:bg-gray-900"
                    )}
                >
                    GithHub {stars}
                </button>
            </motion.a>
        </div>
    );
}
