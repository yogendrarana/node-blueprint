import { useState } from "react";
import {
    Copy,
    Check,
    Terminal,
    Folder,
    FolderOpen,
    File,
    ChevronRight,
    ChevronDown,
    PartyPopper
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import RadioOption from "./radio-option";
import { frameworks, orms, databases } from "@/constants/constants";

type FileStructure = {
    name: string;
    type: "file" | "folder";
    children?: FileStructure[];
};

export default function SiteBody() {
    const [copied, setCopied] = useState(false);
    const [shortFlag, setShortFlags] = useState(false);
    const [selectedOrm, setSelectedOrm] = useState<string>("");
    const [selectedDatabase, setSelectedDatabase] = useState<string>("");
    const [selectedFramework, setSelectedFramework] = useState<string>("");
    const [projectName, setProjectName] = useState("node-blueprint-starter");
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));

    const getCommand = () => {
        let command = `npx node-blueprint create ${shortFlag ? "--n" : "-name"} ${projectName}`;

        if (selectedFramework) {
            command += ` ${shortFlag ? "--f" : "--framework"} ${selectedFramework}`;
        }

        if (selectedDatabase) {
            command += ` ${shortFlag ? "--d" : "-database"} ${selectedDatabase}`;
        }

        if (selectedOrm) {
            command += ` ${shortFlag ? "--o" : "-orm"} ${selectedOrm}`;
        }

        return command;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getCommand());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate file structure based on selections
    const getFileStructure = (): FileStructure => {
        const baseStructure: FileStructure = {
            name: projectName,
            type: "folder",
            children: [
                {
                    name: "src",
                    type: "folder",
                    children: [
                        {
                            name: "controllers",
                            type: "folder",
                            children: [
                                {
                                    name: "index.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "routes",
                            type: "folder",
                            children: [
                                {
                                    name: "index.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "services",
                            type: "folder",
                            children: [
                                {
                                    name: "index.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "utils",
                            type: "folder",
                            children: [
                                {
                                    name: "index.ts",
                                    type: "file"
                                }
                            ]
                        },
                        {
                            name: "app.ts",
                            type: "file"
                        },
                        {
                            name: "index.ts",
                            type: "file"
                        }
                    ]
                },
                {
                    name: ".env",
                    type: "file"
                },
                {
                    name: ".env.example",
                    type: "file"
                },
                {
                    name: ".gitignore",
                    type: "file"
                },
                {
                    name: "package.json",
                    type: "file"
                },
                {
                    name: "tsconfig.json",
                    type: "file"
                },
                {
                    name: "README.md",
                    type: "file"
                }
            ]
        };

        // Add database specific files
        if (selectedDatabase) {
            // Add database config folder
            const dbConfigFolder: FileStructure = {
                name: "config",
                type: "folder",
                children: [
                    {
                        name: "database.ts",
                        type: "file"
                    }
                ]
            };

            baseStructure.children
                ?.find((item) => item.name === "src")
                ?.children?.push(dbConfigFolder);

            // Add models/schema folder based on ORM
            if (selectedOrm) {
                const modelsFolder: FileStructure = {
                    name: selectedOrm === "mongoose" ? "models" : "schema",
                    type: "folder",
                    children: [
                        {
                            name: "index.ts",
                            type: "file"
                        }
                    ]
                };

                baseStructure.children
                    ?.find((item) => item.name === "src")
                    ?.children?.push(modelsFolder);
            }
        }

        return baseStructure;
    };

    const toggleFolder = (path: string) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    };

    const renderFileTree = (structure: FileStructure, path = "", level = 0) => {
        const currentPath = path ? `${path}/${structure.name}` : structure.name;
        const isExpanded = expandedFolders.has(currentPath);

        return (
            <div key={currentPath} className="select-none">
                <div
                    className="flex items-center py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer"
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={() => {
                        if (structure.type === "folder") {
                            toggleFolder(currentPath);
                        }
                    }}
                >
                    {structure.type === "folder" ? (
                        <>
                            <span className="mr-1">
                                {isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </span>
                            {isExpanded ? (
                                <FolderOpen size={16} className="text-yellow-500 mr-2" />
                            ) : (
                                <Folder size={16} className="text-yellow-500 mr-2" />
                            )}
                        </>
                    ) : (
                        <>
                            <span className="mr-1 w-4"></span>
                            <File size={16} className="text-gray-500 mr-2" />
                        </>
                    )}
                    <span className="text-sm">{structure.name}</span>
                </div>

                {structure.type === "folder" && isExpanded && structure.children && (
                    <div>
                        {structure.children.map((child) =>
                            renderFileTree(child, currentPath, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    const fileStructure = getFileStructure();

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
            <div className="bg-gray-900 rounded-md p-4 mb-8 relative">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">Terminal</span>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="text-gray-400 transition-colors cursor-pointer"
                        aria-label="Copy command"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
                <pre className="text-green-400 font-mono overflow-x-auto p-2 text-sm">
                    {getCommand()}
                </pre>
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
                    <RadioOption
                        id="framework"
                        options={frameworks}
                        value={selectedFramework}
                        onChange={setSelectedFramework}
                        defaultValue="express"
                    />
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Database</h3>
                    <RadioOption
                        id="database"
                        options={databases}
                        value={selectedDatabase}
                        onChange={setSelectedDatabase}
                        defaultValue="postgres"
                    />
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">ORM</h3>
                    <RadioOption
                        id="orm"
                        options={orms}
                        value={selectedOrm}
                        onChange={setSelectedOrm}
                        defaultValue="drizzle"
                    />
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
                    <div className="p-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
                        {renderFileTree(fileStructure, "root", 0)}
                    </div>
                </div>
            </div>
        </main>
    );
}
