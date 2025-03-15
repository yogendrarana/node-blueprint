import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import ProjectStructure from "./project-structure";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Copy, Check, Terminal, PartyPopper, ChevronDown } from "lucide-react";
import { frameworks, orms, databases } from "@/constants/constants";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import NPM from "./icons/npm";
import Yarn from "./icons/yarn";
import Pnpm from "./icons/pnpm";

const packageManagers = [
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
    const [selectedOrm, setSelectedOrm] = useState<string>("");
    const [selectedDatabase, setSelectedDatabase] = useState<string>("");
    const [selectedFramework, setSelectedFramework] = useState<string>("");
    const [projectName, setProjectName] = useState("node-blueprint-starter");
    const [selectedPackageManager, setSelectedPackageManager] = useState("npm");

    const getCommand = () => {
        // Update command with package manager
        let command = `${selectedPackageManager} create node-blueprint ${
            shortFlag ? "-n" : "--name"
        } ${projectName}`;

        if (selectedFramework) {
            command += ` ${shortFlag ? "-f" : "--framework"} ${selectedFramework}`;
        }

        if (selectedDatabase) {
            command += ` ${shortFlag ? "-d" : "--database"} ${selectedDatabase}`;
        }

        if (selectedOrm) {
            command += ` ${shortFlag ? "-o" : "--orm"} ${selectedOrm}`;
        }

        return command;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getCommand());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="py-12 md:py-20">
            <div className="mb-20 flex flex-col gap-6 items-center text-center">
                <Badge
                    variant="outline"
                    className="py-1 px-4 flex gap-3 text-sm bg-slate-100 text-slate-800 hover:bg-slate-100 rounded-full"
                >
                    <PartyPopper className="h-3 w-3" />
                    simple. fast. modern.
                </Badge>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                    Set up your Node.js project in seconds
                </h1>
                <p className="text-sm sm:text-lg text-slate-600 max-w-3xl">
                    Node Blueprint helps you scaffold Node.js applications with your preferred
                    framework, database, and ORM in just one command.
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
                                {
                                    packageManagers.find(
                                        (manager) => manager.value === selectedPackageManager
                                    )?.icon
                                }
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
                                    {selectedPackageManager === manager.value && (
                                        <Check className="h-4 w-4" />
                                    )}
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
                <div className="text-green-400 font-mono overflow-x-auto p-2 px-0 text-sm flex justify-between items-center">
                    {getCommand()}
                </div>
            </div>

            {/* input name */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Project Name</h3>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="switch-flag-length"
                            checked={shortFlag}
                            className="cursor-pointer"
                            onCheckedChange={setShortFlags}
                        />
                        <Label htmlFor="switch-flag-length">Use shorts cli flags</Label>
                    </div>
                </div>
                <input
                    value={projectName}
                    placeholder="node-blueprint-starter"
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full border mb-8 px-4 py-2 rounded-md"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Framework</h3>
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
                                <div className={cn("h-12 px-3 flex gap-2 items-center")}>
                                    <RadioGroupItem
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={option.status !== "available"}
                                    />
                                    <Label htmlFor={option.flag} className="ml-2">
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && (
                                        <div className="ml-auto text-muted-foreground text-xs">
                                            <Badge
                                                className={cn("border border-gray-200", {
                                                    "text-gray-600": option.status === "coming-soon"
                                                })}
                                                variant="outline"
                                            >
                                                {option.status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Database</h3>
                    <RadioGroup
                        className="gap-0 -space-y-px rounded-md shadow-xs"
                        id="database"
                        value={selectedDatabase}
                        onValueChange={(value: string) => {
                            if (value === "mongodb" && selectedOrm === "drizzle") {
                                setSelectedOrm("");
                            } else if (
                                (value === "mysql" || value === "postgres") &&
                                selectedOrm === "mongoose"
                            ) {
                                setSelectedOrm("");
                            }
                            setSelectedDatabase(value);
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
                                <div className={cn("h-12 px-3 flex gap-2 items-center")}>
                                    <RadioGroupItem
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={option.status !== "available"}
                                    />
                                    <Label htmlFor={option.flag} className="ml-2">
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && (
                                        <div className="ml-auto text-muted-foreground text-xs">
                                            <Badge
                                                className={cn("border border-gray-200", {
                                                    "text-gray-600": option.status === "coming-soon"
                                                })}
                                                variant="outline"
                                            >
                                                {option.status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">ORM</h3>
                    <RadioGroup
                        className="gap-0 -space-y-px rounded-md shadow-xs"
                        id="orm"
                        value={selectedOrm}
                        onValueChange={(value: string) => setSelectedOrm(value)}
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
                                <div className={cn("h-12 px-3 flex gap-2 items-center")}>
                                    <RadioGroupItem
                                        id={option.flag}
                                        value={option.flag}
                                        className="after:absolute after:inset-0"
                                        disabled={
                                            option.status !== "available" ||
                                            (selectedDatabase === "mongodb" &&
                                                option.flag === "drizzle") ||
                                            ((selectedDatabase === "mysql" ||
                                                selectedDatabase === "postgres") &&
                                                option.flag === "mongoose")
                                        }
                                    />
                                    <Label
                                        htmlFor={option.flag}
                                        className={cn("ml-2", {
                                            "text-muted-foreground opacity-50":
                                                option.status !== "available" ||
                                                (selectedDatabase === "mongodb" &&
                                                    option.flag === "drizzle") ||
                                                ((selectedDatabase === "mysql" ||
                                                    selectedDatabase === "postgres") &&
                                                    option.flag === "mongoose")
                                        })}
                                    >
                                        {option.label}
                                    </Label>
                                    {option.status === "coming-soon" && (
                                        <div className="ml-auto text-muted-foreground text-xs">
                                            <Badge
                                                className={cn("border border-gray-200", {
                                                    "text-gray-600": option.status === "coming-soon"
                                                })}
                                                variant="outline"
                                            >
                                                {option.status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>

            {/* Project Structure Preview */}
            <div>
                <h3 className="text-lg font-semibold">Project Structure Preview</h3>
                <p className="text-sm text-gray-600 mb-4">
                    This is what your project will look like after running the command.
                </p>

                <div className="border border-border rounded-md overflow-hidden bg-white shadow-sm">
                    <div className="border-b bg-gray-50 px-4 py-3 flex items-center">
                        Project Structure
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <ProjectStructure name={projectName} orm={selectedOrm} />
                    </div>
                </div>
            </div>
        </main>
    );
}
