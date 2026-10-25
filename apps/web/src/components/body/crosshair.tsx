import { cn } from "@/lib/utils";

export function Crosshair({ className }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none select-none absolute w-2.5 h-2.5 flex items-center justify-center text-muted-foreground font-mono text-xs leading-none z-20",
				className,
			)}
		>
			+
		</span>
	);
}

export function SectionSeparator() {
	return (
		<div className="w-full border-b border-border">
			<div className="max-w-6xl mx-auto border-x border-border h-6 bg-diagonal-hatch" />
		</div>
	);
}
