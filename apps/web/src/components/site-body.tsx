import { useState } from "react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import RadioOption from "./radio-option";
import ProjectStructure from "./project-structure";
import { Copy, Check, Terminal, PartyPopper } from "lucide-react";
import { frameworks, orms, databases } from "@/constants/constants";

export default function SiteBody() {
    const [copied, setCopied] = useState(false);
    const [shortFlag, setShortFlags] = useState(false);
    const [selectedOrm, setSelectedOrm] = useState<string>("");
    const [selectedDatabase, setSelectedDatabase] = useState<string>("");
    const [selectedFramework, setSelectedFramework] = useState<string>("");
    const [projectName, setProjectName] = useState("node-blueprint-starter");

    const getCommand = () => {
        let command = `npx node-blueprint create ${shortFlag ? "-n" : "--name"} ${projectName}`;

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
                    <div className="p-4 overflow-y-auto">
                        <ProjectStructure name={projectName} orm={selectedOrm} />
                    </div>
                </div>
            </div>
        </main>
    );
}
