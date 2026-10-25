import { useState, useEffect } from "react";
import { ArrowUpRight, Star } from "lucide-react";

export default function SiteHeader() {
	const [stars, setStars] = useState<string | number>("—");

	useEffect(() => {
		let mounted = true;
		const fetchStars = async () => {
			try {
				const response = await fetch("https://api.github.com/repos/yogendrarana/node-blueprint");
				if (response.ok && mounted) {
					const data = await response.json();
					const starsCount =
						data.stargazers_count >= 1000 ? `${(data.stargazers_count / 1000).toFixed(1)}k` : data.stargazers_count;
					setStars(starsCount);
				}
			} catch {
				// fallback silently when offline or rate-limited
			}
		};

		fetchStars();
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
			<div className="max-w-6xl mx-auto border-x border-border flex items-stretch justify-between h-14">
				{/* Left: Brand Cell */}
				<a href="/" className="px-4 sm:px-6 flex items-center gap-2.5 hover:bg-muted/60 transition-colors shrink-0">
					<span className="font-semibold tracking-tight text-sm sm:text-base text-foreground whitespace-nowrap">
						Node Blueprint
					</span>
					<span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border whitespace-nowrap">
						v1.7.0
					</span>
				</a>

				{/* Right: Grouped Navigation & External Links */}
				<div className="flex items-stretch divide-x divide-border border-l border-border ml-auto text-xs font-mono">
					<a
						href="#composer"
						className="hidden md:flex px-4 items-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors whitespace-nowrap"
					>
						Builder
					</a>
					<a
						href="#preview"
						className="hidden md:flex px-4 items-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors whitespace-nowrap"
					>
						Project Structure
					</a>
					<a
						href="#cli"
						className="hidden md:flex px-4 items-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors whitespace-nowrap"
					>
						CLI
					</a>

					<a
						href="https://www.npmjs.com/package/create-node-blueprint"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 px-3.5 sm:px-4 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
					>
						npm
						<ArrowUpRight size={13} className="text-muted-foreground" />
					</a>

					<a
						href="https://github.com/yogendrarana/node-blueprint"
						target="_blank"
						rel="noopener noreferrer"
						className="px-4 sm:px-5 flex items-center gap-2 font-medium bg-background text-foreground hover:bg-muted/60 transition-colors"
					>
						<Star size={13} className="text-foreground fill-foreground" />
						<span>GitHub</span>
						<span className="px-1.5 py-0.5 text-[11px] border border-border bg-muted text-muted-foreground">{stars}</span>
					</a>
				</div>
			</div>
		</header>
	);
}
