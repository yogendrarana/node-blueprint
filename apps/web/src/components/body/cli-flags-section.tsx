import { Terminal } from "lucide-react";
import { Crosshair } from "./crosshair";

export default function CliFlagsSection() {
	return (
		<section id="cli" className="w-full border-b border-border scroll-mt-14">
			<div className="max-w-6xl mx-auto border-x border-border relative bg-background">
				<Crosshair className="-bottom-[5px] -left-[5px]" />
				<Crosshair className="-bottom-[5px] -right-[5px]" />

				{/* Section Header */}
				<div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-background">
					<div>
						<h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">Node Blueprint CLI</h2>
						<p className="text-xs text-muted-foreground">
							Scaffold production-ready Node.js backends interactively or via command-line flags.
						</p>
					</div>
					<div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
						<Terminal size={14} />
						<span>create-node-blueprint</span>
					</div>
				</div>

				{/* CLI Description & Usage Modes */}
				<div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
					<div className="md:col-span-5 p-4 sm:p-6 flex flex-col justify-between gap-4 bg-background">
						<div className="space-y-2">
							<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">Overview</span>
							<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
								<code className="font-mono text-foreground">create-node-blueprint</code> is a zero-config CLI tool that generates
								a clean, modular TypeScript &amp; ESM backend architecture, initializes Git, and installs your dependencies
								automatically.
							</p>
						</div>

						<div className="p-3 border border-border bg-muted/30 font-mono text-xs flex items-center justify-between">
							<span className="text-muted-foreground">Package</span>
							<span className="text-foreground font-medium">create-node-blueprint@1.7.0</span>
						</div>
					</div>

					<div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border bg-background">
						<div className="p-4 sm:p-6 flex flex-col justify-between gap-3">
							<div className="space-y-1.5">
								<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
									Interactive Mode
								</span>
								<p className="text-xs text-muted-foreground leading-relaxed">
									Run without flags to launch step-by-step terminal prompts for selecting your stack.
								</p>
							</div>
							<div className="p-3 border border-border bg-muted/40 font-mono text-xs text-foreground overflow-x-auto whitespace-nowrap">
								<span className="text-muted-foreground select-none">$ </span>npx create-node-blueprint
							</div>
						</div>

						<div className="p-4 sm:p-6 flex flex-col justify-between gap-3">
							<div className="space-y-1.5">
								<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
									Non-Interactive Mode
								</span>
								<p className="text-xs text-muted-foreground leading-relaxed">
									Pass CLI flags directly to scaffold your project in a single command without prompts.
								</p>
							</div>
							<div className="p-3 border border-border bg-muted/40 font-mono text-xs text-foreground overflow-x-auto whitespace-nowrap">
								<span className="text-muted-foreground select-none">$ </span>npx create-node-blueprint -n app -f express -d
								postgres -o drizzle
							</div>
						</div>
					</div>
				</div>

				{/* Supported Flags Subheader */}
				<div className="px-4 sm:px-6 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
					<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
						Supported CLI Flags
					</span>
					<span className="text-[11px] font-mono text-muted-foreground">--help</span>
				</div>

				{/* Flags Table */}
				<div className="overflow-x-auto bg-background">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-border bg-muted/50 text-[11px] font-mono uppercase text-muted-foreground">
								<th className="py-3 px-4 sm:px-6 border-r border-border">Flag</th>
								<th className="py-3 px-4 sm:px-6 border-r border-border">Alias</th>
								<th className="py-3 px-4 sm:px-6 border-r border-border">Values / Type</th>
								<th className="py-3 px-4 sm:px-6">Description</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border text-xs sm:text-sm">
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--name</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">-n</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">&lt;string&gt;</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									Target directory and package.json name for the generated project.
								</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--framework</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">-f</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">express | fastify</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									HTTP server framework with pre-configured middlewares and routing.
								</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--database</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">-d</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">postgres | mysql | mongodb</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">Primary database engine and driver configuration.</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--orm</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">-o</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">
									drizzle | prisma | mongoose
								</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									ORM / ODM toolkit with starter user schema and seed script.
								</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--auth</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">-a</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">jwt</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									Scaffolds JWT authentication module, token schemas, and routes.
								</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--features</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">—</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">docker</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									Adds Dockerfile, .dockerignore, and docker-compose.yml for local development.
								</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--git</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">—</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">boolean</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									Initializes a Git repository (enabled by default; pass{" "}
									<code className="font-mono text-foreground">--no-git</code> to skip).
								</td>
							</tr>
							<tr className="hover:bg-muted/40">
								<td className="py-3 px-4 sm:px-6 font-mono font-medium text-foreground border-r border-border">--install</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-muted-foreground border-r border-border">—</td>
								<td className="py-3 px-4 sm:px-6 font-mono text-foreground border-r border-border">boolean</td>
								<td className="py-3 px-4 sm:px-6 text-muted-foreground">
									Installs project dependencies automatically (enabled by default; pass{" "}
									<code className="font-mono text-foreground">--no-install</code> to skip).
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
