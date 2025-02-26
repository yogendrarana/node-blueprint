import { cn } from "../lib/utils";

export default function SiteFooter() {
    return (
        <footer>
            <div className={cn("flex justify-between items-end gap-4")}>
                <div className="flex flex-col gap-2">
                    <span className="text-md font-semibold">Node Blueprint</span>
                    <p className="text-sm text-gray-500">
                        Created by{" "}
                        <a
                            href="https://yogendrarana.com.np"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-muted-foreground"
                        >
                            Yogendra Rana
                        </a>
                    </p>
                </div>

                <p
                    className={cn(
                        "text-start text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50  to-neutral-300",
                        "md:text-3xl lg:text-5xl",
                        "dark:from-neutral-950 dark:to-neutral-800"
                    )}
                >
                    Node Blueprint
                </p>
            </div>
        </footer>
    );
}
