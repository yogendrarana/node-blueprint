import { useMemo, useState } from "react";
import posthog from "posthog-js";
import { Copy, Check, Terminal, PartyPopper, ChevronDown, RotateCcw } from "lucide-react";

import NPM from "./icons/npm";
import Yarn from "./icons/yarn";
import Pnpm from "./icons/pnpm";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import ComingSoon from "./coming-soon";
import { Checkbox } from "./ui/checkbox";
import ProjectStructure from "./project-structure";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { frameworks, orms, databases, features, auths } from "@/constants/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const packageManagers = [
    {
        name: "npx",
        value: "npx",
        icon: <Terminal className="h-4 w-4" />
    },
    {
        name: "npm",
        value: "npm",
        icon: <NPM className="h-4 w-4" />
    },
    {
        name: "yarn",
        value: "yarn",
        icon: <Yarn className="h-4 w-4" />
    },
    {
        name: "pnpm",
        value: "pnpm",
        icon: <Pnpm className="h-4 w-4" />
    }
];

export default function SiteBody() {
    const [copied, setCopied] = useState(false);
    const [shortFlag, setShortFlags] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [selectedOrm, setSelectedOrm] = useState<string>("");
    const [selectedAuth, setSelectedAuth] = useState<string>("");
    const [selectedDatabase, setSelectedDatabase] = useState<string>("");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedFramework, setSelectedFramework] = useState<string>("");
    const [selectedPackageManager, setSelectedPackageManager] = useState("npx");

    const command = useMemo(() => {
        let command = `${selectedPackageManager} ${selectedPackageManager === "npx" ? "create-node-blueprint" : "create node-blueprint"} ${
            selectedPackageManager === "npm" && (projectName || selectedFramework || selectedDatabase || selectedOrm) ? "--" : ""
        }`;

        if (projectName) {
            command += ` ${shortFlag ? "-n" : "--name"} ${projectName}`;
        }

        if (selectedFramework) {
            command += ` ${shortFlag ? "-f" : "--framework"} ${selectedFramework}`;
        }

        if (selectedDatabase) {
            command += ` ${shortFlag ? "-d" : "--database"} ${selectedDatabase}`;
        }

        if (selectedOrm) {
            command += ` ${shortFlag ? "-o" : "--orm"} ${selectedOrm}`;
        }

        if (selectedAuth) {
            command += ` ${shortFlag ? "-a" : "--auth"} ${selectedAuth}`;
        }

        if (selectedFeatures.length) {
            selectedFeatures.forEach((feat) => {
                command += ` --features ${feat}`;
            });
        }

        return command;
    }, [projectName, selectedDatabase, selectedFeatures, selectedFramework, selectedOrm, selectedPackageManager, shortFlag, selectedAuth]);

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

    return (
        <main className="py-12 md:py-20">
            <div className="mb-20 flex flex-col gap-6 items-center text-center">
                <Badge variant="outline" className="py-1 px-4 flex gap-3 text-sm bg-slate-100 text-slate-800 hover:bg-slate-100 rounded-full">
                    <PartyPopper className="h-3 w-3" />
                    simple. fast. modern.
                </Badge>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Set up your Node.js project in seconds</h1>
                <p className="text-sm sm:text-lg text-slate-600 max-w-3xl">
                    Node Blueprint helps you scaffold Node.js applications with your preferred framework, database, and ORM in just one command.
                </p>
            </div>

            {/* terminal */}
            <div className={cn("bg-gray-900 rounded-md p-4 mb-8 relative")}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">Terminal</span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            className="ml-auto mr-2 flex items-center cursor-pointer gap-1 px-2 py-1 text-sm text-white bg-gray-800 rounded hover:bg-gray-700 ring-0"
                        >
                            <button className="flex items-center gap-2">
                                {packageManagers.find((manager) => manager.value === selectedPackageManager)?.icon}
                                {selectedPackageManager}
                                <ChevronDown size={14} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {packageManagers.map((manager) => (
                                <DropdownMenuItem
                                    key={manager.value}
                                    onClick={() => setSelectedPackageManager(manager.value)}
                                    className="flex items-center gap-2"
                                >
                                    {manager.icon}
                                    {manager.name}
                                    {selectedPackageManager === manager.value && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <button
                        onClick={copyToClipboard}
                        className="flex items-center cursor-pointer gap-1 p-2 text-sm text-white bg-gray-800 rounded hover:bg-gray-700 ring-0"
                        aria-label="Copy command"
                    >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                </div>
                <div className="text-green-400 font-mono overflow-x-auto p-2 px-0 text-sm flex flex-col justify-between gap-1">
                    {(projectName || selectedFramework || selectedDatabase || selectedOrm) && (
                        <div className="text-gray-400">{selectedPackageManager === "npm" ? "# For npm 7+, extra double-dash is needed:" : ""}</div>
                    )}
                    <div>{command}</div>
                </div>
            </div>

            {/* input name */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Project Name</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md">
                            <Switch id="switch-flag-length" checked={shortFlag} className="cursor-pointer" onCheckedChange={setShortFlags} />
                            <Label htmlFor="switch-flag-length" className="cursor-pointer">
                                Use short cli flags
                            </Label>
                        </div>
                        <button
                            onClick={resetCommand}
                            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm bg-accent rounded-md"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    </div>
                </div>
                <input
                    value={projectName}
                    placeholder="project-name"
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full border mb-8 px-4 py-2 rounded-md"
                />
            </div>

            {/* radio groups */}
            <div className="grid md:grid-cols-5 gap-4 mb-12">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Framework *</h3>
                    <RadioGroup
                        className="gap-0 -space-y-px rounded-md shadow-xs"
                        id="framework"
                        value={selectedFramework}
                        onValueChange={(value: string) => setSelectedFramework(value)}
                    >
                        {frameworks.map((option, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "border border-input relative outline-none",
                                    "first:rounded-t-md last:rounded-b-md ",
                                    "has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-data-[state=checked]:z-10"
                                )}
                            >
                                <div className={cn("h-12 px-3 flex gap-1 items-center")}>
                                    <RadioGroupItem
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={option.status !== "available"}
                                    />
                                    <Label htmlFor={option.flag} className="ml-2">
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && <ComingSoon />}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Database *</h3>
                    <RadioGroup
                        className="gap-0 -space-y-px rounded-md shadow-xs"
                        id="database"
                        value={selectedDatabase}
                        onValueChange={(value: string) => {
                            if (selectedOrm) {
                                setSelectedOrm("");
                            }
                            setSelectedDatabase(value === selectedDatabase ? "" : value);
                        }}
                    >
                        {databases.map((option, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "border border-input relative outline-none",
                                    "first:rounded-t-md last:rounded-b-md ",
                                    "has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-data-[state=checked]:z-10"
                                )}
                            >
                                <div className={cn("h-12 px-3 flex gap-1 items-center")}>
                                    <RadioGroupItem id={option.flag} value={option.flag} className="after:absolute after:inset-0" />
                                    <Label htmlFor={option.flag} className={cn("ml-2")}>
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && <ComingSoon />}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">ORM *</h3>
                    <RadioGroup
                        className="gap-0 -space-y-px rounded-md shadow-xs"
                        id="orm"
                        value={selectedOrm}
                        onValueChange={(value: string) => setSelectedOrm(value === selectedOrm ? "" : value)}
                    >
                        {orms.map((option, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "border border-input relative outline-none",
                                    "first:rounded-t-md last:rounded-b-md ",
                                    "has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-data-[state=checked]:z-10"
                                )}
                            >
                                <div className={cn("h-12 px-3 flex gap-1 items-center")}>
                                    <RadioGroupItem
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={
                                            option.status !== "available" ||
                                            (selectedDatabase === "mongodb" && (option.flag === "drizzle" || option.flag === "prisma")) ||
                                            ((selectedDatabase === "mysql" || selectedDatabase === "postgres") && option.flag === "mongoose")
                                        }
                                    />
                                    <Label
                                        htmlFor={option.flag}
                                        className={cn("ml-2", {
                                            "text-muted-foreground opacity-50":
                                                option.status !== "available" ||
                                                (selectedDatabase === "mongodb" && (option.flag === "drizzle" || option.flag === "prisma")) ||
                                                ((selectedDatabase === "mysql" || selectedDatabase === "postgres") && option.flag === "mongoose")
                                        })}
                                    >
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && <ComingSoon />}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Auth </h3>
                    <RadioGroup
                        className="gap-0 -space-y-px rounded-md shadow-xs"
                        id="auth"
                        value={selectedAuth}
                        onValueChange={(value: string) => setSelectedAuth(value)}
                    >
                        {auths.map((option, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "border border-input relative outline-none",
                                    "first:rounded-t-md last:rounded-b-md ",
                                    "has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-data-[state=checked]:z-10"
                                )}
                            >
                                <div className={cn("h-12 px-3 flex gap-1 items-center")}>
                                    <RadioGroupItem
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={option.status !== "available"}
                                    />
                                    <Label
                                        htmlFor={option.flag}
                                        className={cn("ml-2", {
                                            "text-muted-foreground opacity-50":
                                                option.status !== "available" ||
                                                (selectedDatabase === "mongodb" && (option.flag === "drizzle" || option.flag === "prisma")) ||
                                                ((selectedDatabase === "mysql" || selectedDatabase === "postgres") && option.flag === "mongoose")
                                        })}
                                    >
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && <ComingSoon />}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                        Features <sup className="text-gray-500">(optional)</sup>
                    </h3>
                    <div className="gap-0 -space-y-px rounded-md shadow-xs">
                        {features.map((option, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "border border-input relative outline-none",
                                    "first:rounded-t-md last:rounded-b-md ",
                                    "has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-data-[state=checked]:z-10"
                                )}
                            >
                                <div className={cn("h-12 px-3 flex gap-1 items-center")}>
                                    <Checkbox
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={option.status !== "available"}
                                        checked={selectedFeatures.includes(option.flag)}
                                        onCheckedChange={() => {
                                            if (selectedFeatures.includes(option.flag)) {
                                                setSelectedFeatures(selectedFeatures.filter((feature) => feature !== option.flag));
                                            } else {
                                                setSelectedFeatures([...selectedFeatures, option.flag]);
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={option.flag}
                                        className={cn("ml-2", {
                                            "text-muted-foreground opacity-50": option.status !== "available"
                                        })}
                                    >
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && <ComingSoon />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Structure Preview */}
            <div>
                <h3 className="text-lg font-semibold">Project Structure Preview</h3>
                <p className="text-sm text-gray-600 mb-4">
                    This is what your project will look like after running the command. Don't worry, you can always restructure your project to your
                    liking.
                </p>

                <div className="border border-border rounded-md overflow-hidden bg-white shadow-sm">
                    <div className="border-b bg-gray-50 px-4 py-3 flex items-center">Project Structure</div>
                    <div className="p-4 overflow-y-auto">
                        <ProjectStructure name={projectName} framework={selectedFramework} orm={selectedOrm} features={selectedFeatures} />
                    </div>
                </div>
            </div>
        </main>
    );
}
