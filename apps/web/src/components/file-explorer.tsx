import { useState, useEffect } from "react";
import { generateProjectStructure } from "@/lib/helpers";
import { ChevronRight, ChevronDown, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

type FileType = {
    name: string;
    type: "file" | "directory";
    children?: FileType[];
};

type FileExplorerProps = {
    framework?: string;
    database?: string;
    orm?: string;
};

export const FileExplorer = ({
    framework = "express",
    database = "postgres",
    orm = "drizzle"
}: FileExplorerProps) => {
    const [fileStructure, setFileStructure] = useState<FileType[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["", "src"]));

    useEffect(() => {
        // Generate structure based on selections
        setFileStructure(generateProjectStructure(framework, database, orm));
    }, [framework, database, orm]);

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    const renderTree = (items: FileType[], path = "") => {
        return items
            .sort((a, b) => {
                // Directories first, then files
                if (a.type === "directory" && b.type === "file") return -1;
                if (a.type === "file" && b.type === "directory") return 1;
                // Alphabetical sort within the same type
                return a.name.localeCompare(b.name);
            })
            .map((item) => {
                const itemPath = path ? `${path}/${item.name}` : item.name;
                const isExpanded = expandedFolders.has(itemPath);

                return (
                    <div key={itemPath} className="select-none">
                        <div
                            className="flex items-center py-1 px-2 text-sm hover:bg-slate-100 cursor-pointer"
                            onClick={() => item.type === "directory" && toggleFolder(itemPath)}
                        >
                            <span className="w-4 mr-1">
                                {item.type === "directory" ? (
                                    isExpanded ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )
                                ) : null}
                            </span>
                            <span className="mr-2">
                                {item.type === "directory" ? (
                                    isExpanded ? (
                                        <FolderOpenIcon size={16} className="text-yellow-500" />
                                    ) : (
                                        <FolderIcon size={16} className="text-yellow-500" />
                                    )
                                ) : (
                                    <FileIcon size={16} className="text-slate-500" />
                                )}
                            </span>
                            <span className="truncate">{item.name}</span>
                        </div>
                        {item.type === "directory" && isExpanded && (
                            <div className="pl-6">{renderTree(item.children || [], itemPath)}</div>
                        )}
                    </div>
                );
            });
    };

    return (
        <div className="border rounded-lg overflow-hidden w-full shadow-sm bg-white h-[400px]">
            <div className="p-2 text-sm font-medium text-slate-700 border-b sticky top-0 bg-slate-50">
                Project Explorer
            </div>
            <div className="p-2 overflow-y-auto h-[calc(400px-40px)]">
                {renderTree(fileStructure)}
            </div>
        </div>
    );
};
