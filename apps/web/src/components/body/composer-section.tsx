import { useMemo, useState } from "react";
import posthog from "posthog-js";
import { Copy, Check, Terminal, RotateCcw, CheckCircle2 } from "lucide-react";

import NPM from "../icons/npm";
import Yarn from "../icons/yarn";
import Pnpm from "../icons/pnpm";
import Bun from "../icons/bun";
import { cn } from "@/lib/utils";
import ComingSoon from "../coming-soon";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { frameworks, orms, databases, features, auths, stackPresets, type StackPreset } from "@/constants/constants";
import { Crosshair } from "./crosshair";

const packageManagers = [
	{
		name: "npx",
		value: "npx",
		icon: <Terminal className="h-3.5 w-3.5" />,
	},
	{
		name: "npm",
		value: "npm",
		icon: <NPM className="h-3.5 w-3.5" />,
	},
	{
		name: "pnpm",
		value: "pnpm",
		icon: <Pnpm className="h-3.5 w-3.5" />,
	},
	{
		name: "yarn",
		value: "yarn",
		icon: <Yarn className="h-3.5 w-3.5" />,
	},
	{
		name: "bun",
		value: "bun",
		icon: <Bun className="h-3.5 w-3.5" />,
	},
];

export interface ComposerSectionProps {
	projectName: string;
	setProjectName: (value: string) => void;
	selectedFramework: string;
	setSelectedFramework: (value: string) => void;
	selectedDatabase: string;
	setSelectedDatabase: (value: string) => void;
	selectedOrm: string;
	setSelectedOrm: (value: string) => void;
	selectedAuth: string;
	setSelectedAuth: (value: string) => void;
	selectedFeatures: string[];
	setSelectedFeatures: (value: string[]) => void;
}

export default function ComposerSection({
	projectName,
	setProjectName,
	selectedFramework,
	setSelectedFramework,
	selectedDatabase,
	setSelectedDatabase,
	selectedOrm,
	setSelectedOrm,
	selectedAuth,
	setSelectedAuth,
	selectedFeatures,
	setSelectedFeatures,
}: ComposerSectionProps) {
	const [copied, setCopied] = useState(false);
	const [shortFlag, setShortFlags] = useState(false);
	const [selectedPackageManager, setSelectedPackageManager] = useState("npx");

	const command = useMemo(() => {
		let cmd = `${selectedPackageManager} ${selectedPackageManager === "npx" ? "create-node-blueprint" : "create node-blueprint"}${
			selectedPackageManager === "npm" &&
			(projectName || selectedFramework || selectedDatabase || selectedOrm || selectedAuth || selectedFeatures.length)
				? " --"
				: ""
		}`;

		if (projectName) {
			cmd += ` ${shortFlag ? "-n" : "--name"} ${projectName}`;
		}

		if (selectedFramework) {
			cmd += ` ${shortFlag ? "-f" : "--framework"} ${selectedFramework}`;
		}

		if (selectedDatabase) {
			cmd += ` ${shortFlag ? "-d" : "--database"} ${selectedDatabase}`;
		}

		if (selectedOrm) {
			cmd += ` ${shortFlag ? "-o" : "--orm"} ${selectedOrm}`;
		}

		if (selectedAuth) {
			cmd += ` ${shortFlag ? "-a" : "--auth"} ${selectedAuth}`;
		}

		if (selectedFeatures.length) {
			selectedFeatures.forEach((feat) => {
				cmd += ` --features ${feat}`;
			});
		}

		return cmd;
	}, [
		projectName,
		selectedDatabase,
		selectedFeatures,
		selectedFramework,
		selectedOrm,
		selectedPackageManager,
		shortFlag,
		selectedAuth,
	]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(command);
		setCopied(true);
		posthog.capture("copy-command", { property: command });
		setTimeout(() => setCopied(false), 2000);
	};

	const resetCommand = () => {
		setProjectName("");
		setSelectedFramework("");
		setSelectedDatabase("");
		setSelectedOrm("");
		setSelectedAuth("");
		setSelectedFeatures([]);
	};

	const applyPreset = (preset: StackPreset) => {
		setSelectedFramework(preset.framework);
		setSelectedDatabase(preset.database);
		setSelectedOrm(preset.orm);
		setSelectedAuth(preset.auth);
		setSelectedFeatures(preset.features);
	};

	return (
		<section id="composer" className="w-full border-b border-border scroll-mt-14">
			<div className="max-w-6xl mx-auto border-x border-border relative bg-background">
				<Crosshair className="-bottom-[5px] -left-[5px]" />
				<Crosshair className="-bottom-[5px] -right-[5px]" />

				{/* Section Header Bar */}
				<div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-background">
					<div>
						<h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">Interactive Stack Composer</h2>
						<p className="text-xs text-muted-foreground">
							Configure your stack below to synthesize the CLI command and project structure.
						</p>
					</div>

					{/* Short Flags Checkbox & Reset Controls */}
					<div className="flex items-center gap-2 sm:gap-3 ml-auto">
						<label
							htmlFor="checkbox-flag-length"
							className="flex items-center gap-2 px-2 py-1.5 border border-border bg-muted/50 hover:bg-muted text-xs font-mono cursor-pointer transition-colors"
						>
							<Checkbox
								id="checkbox-flag-length"
								checked={shortFlag}
								onCheckedChange={(checked) => setShortFlags(Boolean(checked))}
							/>
							<span className="text-xs font-mono text-foreground select-none">Short flags (-f -d -o)</span>
						</label>

						<button
							type="button"
							onClick={resetCommand}
							className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						>
							<RotateCcw size={13} />
							Reset
						</button>
					</div>
				</div>

				{/* Preset Selector Bar inside Builder */}
				<div className="px-4 sm:px-6 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center gap-2">
					<span className="text-xs font-mono text-muted-foreground mr-1">PRESETS:</span>
					{stackPresets.map((preset) => {
						const isPresetActive =
							selectedFramework === preset.framework && selectedDatabase === preset.database && selectedOrm === preset.orm;

						return (
							<button
								key={preset.id}
								type="button"
								onClick={() => applyPreset(preset)}
								className={cn(
									"px-3 py-1 text-xs font-mono border transition-colors cursor-pointer flex items-center gap-2",
									isPresetActive
										? "border-foreground bg-muted text-foreground font-semibold"
										: "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
								)}
							>
								<span>{preset.name}</span>
							</button>
						);
					})}
				</div>

				{/* Terminal Command Workbench */}
				<div className="p-4 border-b border-border bg-background">
					<div className="dark border-b border-border bg-background text-foreground">
						{/* Terminal Top Bar: Package Manager Tabs + Copy Button */}
						<div className="flex flex-wrap items-stretch justify-between border-b border-border bg-muted/50">
							<div className="flex items-stretch divide-x divide-border overflow-x-auto">
								{packageManagers.map((manager) => {
									const active = selectedPackageManager === manager.value;
									return (
										<button
											key={manager.value}
											type="button"
											onClick={() => setSelectedPackageManager(manager.value)}
											className={cn(
												"px-3.5 py-2.5 flex items-center gap-2 text-xs font-mono transition-colors cursor-pointer",
												active
													? "bg-background text-foreground font-semibold border-b-2 border-b-muted-foreground"
													: "text-muted-foreground hover:text-foreground hover:bg-muted",
											)}
										>
											{manager.icon}
											<span>{manager.name}</span>
										</button>
									);
								})}
							</div>

							<button
								type="button"
								onClick={copyToClipboard}
								aria-label="Copy command"
								className="px-4 py-2.5 flex items-center gap-2 text-xs font-mono font-medium bg-muted/60 hover:bg-muted text-foreground border-l border-border transition-colors cursor-pointer ml-auto"
							>
								{copied ? (
									<>
										<Check size={14} className="text-foreground" />
										<span>COPIED</span>
									</>
								) : (
									<>
										<Copy size={14} className="text-muted-foreground" />
										<span>COPY COMMAND</span>
									</>
								)}
							</button>
						</div>

						{/* Terminal Output Row */}
						<div className="p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto flex flex-col gap-1.5 bg-background">
							{selectedPackageManager === "npm" && (projectName || selectedFramework || selectedDatabase || selectedOrm) && (
								<div className="text-muted-foreground text-xs">
									# For npm 7+, extra double-dash (--) forwards arguments to the CLI:
								</div>
							)}
							<div className="flex items-center gap-2.5 whitespace-nowrap">
								<span className="text-muted-foreground select-none">$</span>
								<span className="text-foreground font-medium tracking-tight">{command}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Project Name Input & Active Stack Bar */}
				<div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-background">
					<div className="md:col-span-6 p-4 sm:p-5 flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor="project-name-input"
								className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium"
							>
								Project Directory / Name
							</label>
							<span className="text-[11px] font-mono text-muted-foreground">{shortFlag ? "-n <name>" : "--name <name>"}</span>
						</div>
						<div className="flex items-center border border-input focus-within:border-foreground bg-muted/30 transition-colors">
							<span className="px-3 py-2 text-xs font-mono text-muted-foreground border-r border-border bg-muted select-none">
								~/
							</span>
							<input
								id="project-name-input"
								value={projectName}
								placeholder="my-app"
								onChange={(e) => setProjectName(e.target.value)}
								className="w-full px-3 py-2 text-sm font-mono bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
							/>
						</div>
					</div>

					<div className="md:col-span-6 p-4 sm:p-5 flex flex-col justify-between gap-2 bg-muted/20">
						<div className="flex items-center justify-between">
							<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-medium">
								Active Blueprint Spec
							</span>
							<span className="text-[11px] font-mono text-foreground bg-muted border border-border px-1.5 py-0.5">
								READY TO SCAFFOLD
							</span>
						</div>
						<div className="flex flex-wrap items-center gap-1.5 pt-1">
							<span className="px-2 py-1 text-xs font-mono border border-border bg-background text-foreground">
								name: <strong>{projectName || "my-app"}</strong>
							</span>
							<span className="px-2 py-1 text-xs font-mono border border-border bg-background text-foreground">
								http: <strong>{selectedFramework || "prompt"}</strong>
							</span>
							<span className="px-2 py-1 text-xs font-mono border border-border bg-background text-foreground">
								db: <strong>{selectedDatabase || "prompt"}</strong>
							</span>
							<span className="px-2 py-1 text-xs font-mono border border-border bg-background text-foreground">
								orm: <strong>{selectedOrm || "prompt"}</strong>
							</span>
							{selectedAuth && (
								<span className="px-2 py-1 text-xs font-mono border border-border bg-background text-foreground">
									auth: <strong>{selectedAuth}</strong>
								</span>
							)}
							{selectedFeatures.map((feat) => (
								<span key={feat} className="px-2 py-1 text-xs font-mono border border-border bg-background text-foreground">
									+{feat}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* 5-Column Stack Selection Grid WITH GAPS */}
				<div className="p-4 sm:p-6 border-b border-border bg-background">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
						{/* Column 1: Framework */}
						<div className="flex flex-col border border-border divide-y divide-border bg-background">
							<div className="p-3.5 bg-muted/50 flex items-center justify-between">
								<h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">Framework *</h3>
								<span className="text-[10px] font-mono text-muted-foreground">{shortFlag ? "-f" : "--framework"}</span>
							</div>

							<RadioGroup
								className="gap-0 divide-y divide-border"
								id="framework"
								value={selectedFramework}
								onValueChange={(value) => setSelectedFramework(String(value))}
							>
								{frameworks.map((option) => {
									const isChecked = selectedFramework === option.flag;
									const isDisabled = option.status !== "available";
									return (
										<label
											key={option.id}
											htmlFor={`fw-${option.flag}`}
											className={cn(
												"px-3.5 py-3 flex items-center justify-between gap-2 transition-colors select-none",
												isDisabled ? "cursor-not-allowed opacity-50 bg-muted/30" : "cursor-pointer",
												isChecked ? "bg-muted" : "bg-background hover:bg-muted/50",
											)}
										>
											<div className="flex items-center gap-2.5">
												<RadioGroupItem id={`fw-${option.flag}`} value={option.flag} disabled={isDisabled} />
												<span className="text-sm font-medium text-foreground">{option.label}</span>
											</div>
											{option.status === "coming-soon" && <ComingSoon />}
										</label>
									);
								})}
							</RadioGroup>
						</div>

						{/* Column 2: Database */}
						<div className="flex flex-col border border-border divide-y divide-border bg-background">
							<div className="p-3.5 bg-muted/50 flex items-center justify-between">
								<h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">Database *</h3>
								<span className="text-[10px] font-mono text-muted-foreground">{shortFlag ? "-d" : "--database"}</span>
							</div>

							<RadioGroup
								className="gap-0 divide-y divide-border"
								id="database"
								value={selectedDatabase}
								onValueChange={(rawVal) => {
									const value = String(rawVal);
									if (selectedOrm) {
										if (value === "mongodb" && (selectedOrm === "drizzle" || selectedOrm === "prisma")) {
											setSelectedOrm("mongoose");
										} else if ((value === "mysql" || value === "postgres") && selectedOrm === "mongoose") {
											setSelectedOrm("drizzle");
										}
									}
									setSelectedDatabase(value === selectedDatabase ? "" : value);
								}}
							>
								{databases.map((option) => {
									const isChecked = selectedDatabase === option.flag;
									const isDisabled = option.status !== "available";
									return (
										<label
											key={option.id}
											htmlFor={`db-${option.flag}`}
											className={cn(
												"px-3.5 py-3 flex items-center justify-between gap-2 transition-colors select-none",
												isDisabled ? "cursor-not-allowed opacity-50 bg-muted/30" : "cursor-pointer",
												isChecked ? "bg-muted" : "bg-background hover:bg-muted/50",
											)}
										>
											<div className="flex items-center gap-2.5">
												<RadioGroupItem id={`db-${option.flag}`} value={option.flag} disabled={isDisabled} />
												<span className="text-sm font-medium text-foreground">{option.label}</span>
											</div>
											{option.status === "coming-soon" && <ComingSoon />}
										</label>
									);
								})}
							</RadioGroup>
						</div>

						{/* Column 3: ORM */}
						<div className="flex flex-col border border-border divide-y divide-border bg-background">
							<div className="p-3.5 bg-muted/50 flex items-center justify-between">
								<h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">ORM *</h3>
								<span className="text-[10px] font-mono text-muted-foreground">{shortFlag ? "-o" : "--orm"}</span>
							</div>

							<RadioGroup
								className="gap-0 divide-y divide-border"
								id="orm"
								value={selectedOrm}
								onValueChange={(rawVal) => {
									const value = String(rawVal);
									setSelectedOrm(value === selectedOrm ? "" : value);
								}}
							>
								{orms.map((option) => {
									const isIncompatible =
										option.status !== "available" ||
										(selectedDatabase === "mongodb" && (option.flag === "drizzle" || option.flag === "prisma")) ||
										((selectedDatabase === "mysql" || selectedDatabase === "postgres") && option.flag === "mongoose");
									const isChecked = selectedOrm === option.flag && !isIncompatible;

									return (
										<label
											key={option.id}
											htmlFor={`orm-${option.flag}`}
											className={cn(
												"px-3.5 py-3 flex items-center justify-between gap-2 transition-colors select-none",
												isIncompatible
													? "cursor-not-allowed opacity-50 bg-muted/30"
													: isChecked
														? "cursor-pointer bg-muted"
														: "cursor-pointer bg-background hover:bg-muted/50",
											)}
										>
											<div className="flex items-center gap-2.5">
												<RadioGroupItem id={`orm-${option.flag}`} value={option.flag} disabled={isIncompatible} />
												<span className="text-sm font-medium text-foreground">{option.label}</span>
											</div>
											{option.status === "coming-soon" && <ComingSoon />}
										</label>
									);
								})}
							</RadioGroup>
						</div>

						{/* Column 4: Authentication */}
						<div className="flex flex-col border border-border divide-y divide-border bg-background">
							<div className="p-3.5 bg-muted/50 flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">Auth</h3>
									<span className="text-[10px] font-mono text-muted-foreground">(opt)</span>
								</div>
								<span className="text-[10px] font-mono text-muted-foreground">{shortFlag ? "-a" : "--auth"}</span>
							</div>

							<RadioGroup
								className="gap-0 divide-y divide-border"
								id="auth"
								value={selectedAuth}
								onValueChange={(rawVal) => {
									const value = String(rawVal);
									setSelectedAuth(value === selectedAuth ? "" : value);
								}}
							>
								{auths.map((option) => {
									const isChecked = selectedAuth === option.flag;
									const isDisabled = option.status !== "available";
									return (
										<label
											key={option.id}
											htmlFor={`auth-${option.flag}`}
											className={cn(
												"px-3.5 py-3 flex items-center justify-between gap-2 transition-colors select-none",
												isDisabled
													? "cursor-not-allowed opacity-50 bg-muted/30"
													: isChecked
														? "cursor-pointer bg-muted"
														: "cursor-pointer bg-background hover:bg-muted/50",
											)}
										>
											<div className="flex items-center gap-2.5">
												<RadioGroupItem id={`auth-${option.flag}`} value={option.flag} disabled={isDisabled} />
												<span className="text-sm font-medium text-foreground">{option.label}</span>
											</div>
											{option.status === "coming-soon" && <ComingSoon />}
										</label>
									);
								})}
							</RadioGroup>
						</div>

						{/* Column 5: Features */}
						<div className="flex flex-col border border-border divide-y divide-border bg-background">
							<div className="p-3.5 bg-muted/50 flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">Features</h3>
									<span className="text-[10px] font-mono text-muted-foreground">(opt)</span>
								</div>
								<span className="text-[10px] font-mono text-muted-foreground">--features</span>
							</div>

							<div className="divide-y divide-border flex flex-col">
								{features.map((option) => {
									const isChecked = selectedFeatures.includes(option.flag);
									const isDisabled = option.status !== "available";
									return (
										<label
											key={option.id}
											htmlFor={`feat-${option.flag}`}
											className={cn(
												"px-3.5 py-3 flex items-center justify-between gap-2 transition-colors select-none",
												isDisabled
													? "cursor-not-allowed opacity-50 bg-muted/30"
													: isChecked
														? "cursor-pointer bg-muted"
														: "cursor-pointer bg-background hover:bg-muted/50",
											)}
										>
											<div className="flex items-center gap-2.5">
												<Checkbox
													id={`feat-${option.flag}`}
													value={option.flag}
													disabled={isDisabled}
													checked={isChecked}
													onCheckedChange={() => {
														if (selectedFeatures.includes(option.flag)) {
															setSelectedFeatures(selectedFeatures.filter((feature) => feature !== option.flag));
														} else {
															setSelectedFeatures([...selectedFeatures, option.flag]);
														}
													}}
												/>
												<span className="text-sm font-medium text-foreground">{option.label}</span>
											</div>
											{option.status === "coming-soon" && <ComingSoon />}
										</label>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Included By Default — Full-Width Next Row */}
				<div className="px-4 sm:px-6 py-3.5 bg-muted/40 flex flex-wrap items-center justify-between gap-3">
					<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
						Included by default in every blueprint
					</span>
					<div className="flex flex-wrap items-center gap-4 text-xs font-mono text-foreground">
						<span className="inline-flex items-center gap-1.5">
							<CheckCircle2 size={13} className="text-foreground" />
							Biome Linter & Formatter
						</span>
						<span className="inline-flex items-center gap-1.5">
							<CheckCircle2 size={13} className="text-foreground" />
							Strict ESM TypeScript
						</span>
						<span className="inline-flex items-center gap-1.5">
							<CheckCircle2 size={13} className="text-foreground" />
							4-Layer Clean Architecture
						</span>
						<span className="inline-flex items-center gap-1.5">
							<CheckCircle2 size={13} className="text-foreground" />
							Unit, Integration & E2E Test Dirs
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
