import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface PropTypes {
    className?: string;
}

const GithubStarBadge = ({ className }: PropTypes) => {
    const [stars, setStars] = useState(0);

    useEffect(() => {
        const fetchStars = async () => {
            if (stars > 100) return;
            try {
                const response = await fetch(
                    "https://api.github.com/repos/yogendrarana/node-blueprint"
                );

                if (response.ok) {
                    const data = await response.json();
                    const starsCount =
                        data.stargazers_count >= 1000
                            ? `${(data.stargazers_count / 1000).toFixed(2)}k`
                            : data.stargazers_count;
                    setStars(starsCount);
                }
            } catch (error) {
                console.error("Error fetching GitHub stars:", error);
            }
        };

        fetchStars();
    }, [stars, setStars]);

    return (
        <motion.a
            href="https://github.com/yogendrarana/node-blueprint"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("flex items-center", className)}
        >
            <button
                className={cn(
                    "px-2 py-1 gap-2 border-2 cursor-pointer text-sm bg-white text-black font-mono border-black shadow-[4px_4px_0_0_#000]",
                    "hover:bg-gray-100 transition-all duration-200",
                    "active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000]",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    "dark:border-gray-800 dark:bg-black dark:text-white dark:shadow-gray-800 dark:hover:bg-gray-900",
                    className
                )}
            >
                GithHub {stars}
            </button>
        </motion.a>
    );
};

export default GithubStarBadge;
