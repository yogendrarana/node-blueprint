import React from "react";
import { FileType, generateProjectStructure } from "@/lib/helpers";
import { ChevronDown, ChevronRight, Folder, FolderOpen, File } from "lucide-react";

export interface ProjectConfig {
    name: string;
    orm: string;
    framework: string;
    features: string[];
}

export default function ProjectStructure({ name, orm, framework, features }: ProjectConfig) {
    const [structure, setStructure] = React.useState<FileType[]>([]);
    const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        const s = generateProjectStructure({ name, framework, orm, features });
        console.log(features);
        setStructure(s);
    }, [name, orm, features, framework]);

    // toggle folder open/close
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

    const renderFileTree = (structure: FileType, path = "", level = 0) => {
        const currentPath = path ? `${path}/${structure.name}` : structure.name;
        const isExpanded = expandedFolders.has(currentPath);

        return (
            <div key={currentPath} className="select-none">
                <div
                    className="flex items-center py-1.5 px-2 rounded cursor-pointer"
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={() => {
                        if (structure.type === "directory") {
                            toggleFolder(currentPath);
                        }
                    }}
                >
                    {structure.type === "directory" ? (
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

                {structure.type === "directory" && isExpanded && structure.children && (
                    <div>
                        {structure.children.map((child) =>
                            renderFileTree(child, currentPath, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    return <div>{structure.map((root) => renderFileTree(root))}</div>;
}
