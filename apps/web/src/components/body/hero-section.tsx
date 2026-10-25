import { Sparkles } from "lucide-react";
import { Crosshair } from "./crosshair";

export default function HeroSection() {
	return (
		<section className="w-full border-b border-border">
			<div className="max-w-6xl mx-auto border-x border-border relative bg-background">
				<Crosshair className="-top-[5px] -left-[5px]" />
				<Crosshair className="-top-[5px] -right-[5px]" />
				<Crosshair className="-bottom-[5px] -left-[5px]" />
				<Crosshair className="-bottom-[5px] -right-[5px]" />

				<div className="px-4 sm:px-8 md:px-12 py-14 md:py-20">
					<div className="max-w-2xl mx-auto text-center flex flex-col items-center">
						<div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-border bg-muted text-xs font-mono text-foreground">
							<Sparkles className="h-3 w-3 text-foreground" />
							<span>simple. fast. modular.</span>
						</div>

						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
							Set up your Node.js project in seconds
						</h1>

						<p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
							Scaffold production-ready Node.js backends with your preferred framework, database, and ORM in a single command.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
