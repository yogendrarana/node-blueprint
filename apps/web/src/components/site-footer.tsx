import { ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
	return (
		<footer className="w-full bg-background">
			<div className="max-w-6xl mx-auto border-x border-border">
				{/* Top Footer Grid */}
				<div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
					<div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-4">
						<div className="flex items-center gap-2.5">
							<span className="font-semibold tracking-tight text-foreground whitespace-nowrap">Node Blueprint</span>
							<span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border">
								v1.7.0
							</span>
						</div>
						<p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
							Zero-config CLI tool that scaffolds production-ready Node.js applications with your preferred HTTP framework,
							database, and ORM in a single command.
						</p>
						<p className="text-xs font-mono text-muted-foreground">
							Created by{" "}
							<a
								href="https://yogendrarana.com.np"
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
							>
								Yogendra Rana
							</a>
						</p>
					</div>

					<div className="md:col-span-3 p-6 sm:p-8 flex flex-col gap-3">
						<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Navigation</span>
						<ul className="space-y-2 text-xs font-mono text-muted-foreground">
							<li>
								<a href="#composer" className="hover:text-foreground transition-colors">
									Builder
								</a>
							</li>
							<li>
								<a href="#preview" className="hover:text-foreground transition-colors">
									Project Structure
								</a>
							</li>
							<li>
								<a href="#cli" className="hover:text-foreground transition-colors">
									CLI
								</a>
							</li>
						</ul>
					</div>

					<div className="md:col-span-3 p-6 sm:p-8 flex flex-col gap-3">
						<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Resources</span>
						<ul className="space-y-2 text-xs font-mono text-muted-foreground">
							<li>
								<a
									href="https://github.com/yogendrarana/node-blueprint"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
								>
									GitHub Repository <ArrowUpRight size={12} />
								</a>
							</li>
							<li>
								<a
									href="https://www.npmjs.com/package/create-node-blueprint"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
								>
									NPM Package <ArrowUpRight size={12} />
								</a>
							</li>
							<li>
								<a
									href="https://github.com/yogendrarana/node-blueprint/issues"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
								>
									Report an Issue <ArrowUpRight size={12} />
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Centered Architectural Wordmark Strip */}
				<div className="px-6 py-8 sm:py-10 bg-background overflow-hidden flex items-center justify-center">
					<p className="text-center text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground/10 select-none font-mono uppercase leading-none">
						NODE BLUEPRINT
					</p>
				</div>
			</div>
		</footer>
	);
}
