import React from "react";
import { FileType, generateProjectStructure, countTreeNodes, getFilePreviewContent } from "@/lib/helpers";
import {
	ChevronDown,
	ChevronRight,
	Folder,
	FolderOpen,
	FileCode2,
	FileJson,
	FileText,
	Copy,
	Check,
	ChevronsUpDown,
	Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scrollarea";

export interface ProjectConfig {
	name: string;
	orm: string;
	framework: string;
	features: string[];
	auth?: string;
	database?: string;
}

export default function ProjectStructure({ name, orm, framework, features, auth, database }: ProjectConfig) {
	const rootName = name || "my-app";

	const structure = React.useMemo(
		() => generateProjectStructure({ name, framework, orm, features, auth }),
		[name, framework, orm, features, auth],
	);

	const defaultExpanded = React.useMemo(
		() =>
			new Set([
				rootName,
				`${rootName}/src`,
				`${rootName}/src/app`,
				`${rootName}/src/app/http`,
				`${rootName}/src/modules`,
				`${rootName}/src/modules/users`,
				`${rootName}/src/infrastructure`,
				`${rootName}/src/infrastructure/database`,
				...(orm === "prisma" ? [`${rootName}/prisma`, `${rootName}/prisma/models`] : []),
			]),
		[rootName, orm],
	);

	const [customExpanded, setCustomExpanded] = React.useState<Set<string> | null>(null);
	const [selectedFile, setSelectedFile] = React.useState<string>("");
	const [copiedCode, setCopiedCode] = React.useState(false);

	const expandedFolders = customExpanded ?? defaultExpanded;
	const activeFile = selectedFile || `${rootName}/src/app/http/server.ts`;

	const stats = React.useMemo(() => countTreeNodes(structure), [structure]);

	const preview = React.useMemo(
		() =>
			getFilePreviewContent(activeFile, {
				name,
				framework,
				orm,
				features,
				auth,
				database,
			}),
		[activeFile, name, framework, orm, features, auth, database],
	);

	const toggleFolder = (path: string) => {
		setCustomExpanded((prev) => {
			const base = prev ?? defaultExpanded;
			const newSet = new Set(base);
			if (newSet.has(path)) {
				newSet.delete(path);
			} else {
				newSet.add(path);
			}
			return newSet;
		});
	};

	const collectAllDirs = (nodes: FileType[], parentPath = ""): string[] => {
		const paths: string[] = [];
		for (const node of nodes) {
			const current = parentPath ? `${parentPath}/${node.name}` : node.name;
			if (node.type === "directory") {
				paths.push(current);
				if (node.children) {
					paths.push(...collectAllDirs(node.children, current));
				}
			}
		}
		return paths;
	};

	const toggleExpandAll = () => {
		const allDirs = collectAllDirs(structure);
		if (expandedFolders.size >= allDirs.length) {
			setCustomExpanded(new Set([rootName, `${rootName}/src`]));
		} else {
			setCustomExpanded(new Set(allDirs));
		}
	};

	const copyPreviewCode = () => {
		navigator.clipboard.writeText(preview.code);
		setCopiedCode(true);
		setTimeout(() => setCopiedCode(false), 1800);
	};

	const getFileIcon = (fileName: string) => {
		if (fileName.endsWith(".json")) {
			return <FileJson size={14} className="text-foreground shrink-0" />;
		}
		if (fileName.endsWith(".ts") || fileName.endsWith(".prisma")) {
			return <FileCode2 size={14} className="text-foreground shrink-0" />;
		}
		return <FileText size={14} className="text-muted-foreground shrink-0" />;
	};

	const renderFileTree = (node: FileType, path = "", level = 0) => {
		const currentPath = path ? `${path}/${node.name}` : node.name;
		const isExpanded = expandedFolders.has(currentPath);
		const isSelected = activeFile === currentPath;

		return (
			<div key={currentPath} className="select-none">
				<div
					className={cn(
						"group flex items-center py-1 px-2 text-xs font-mono cursor-pointer transition-colors border-l-2",
						isSelected
							? "bg-muted text-foreground border-foreground font-semibold"
							: "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
					)}
					style={{ paddingLeft: `${level * 14 + 10}px` }}
					onClick={() => {
						if (node.type === "directory") {
							toggleFolder(currentPath);
						} else {
							setSelectedFile(currentPath);
						}
					}}
				>
					{node.type === "directory" ? (
						<>
							<span className="mr-1.5 text-muted-foreground group-hover:text-foreground">
								{isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
							</span>
							{isExpanded ? (
								<FolderOpen size={14} className="text-foreground mr-2 shrink-0" />
							) : (
								<Folder size={14} className="text-muted-foreground mr-2 shrink-0" />
							)}
						</>
					) : (
						<>
							<span className="mr-1.5 w-[13px] shrink-0" />
							<span className="mr-2">{getFileIcon(node.name)}</span>
						</>
					)}
					<span className="truncate">{node.name}</span>
					{node.type === "directory" && node.children && (
						<span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
							{node.children.length}
						</span>
					)}
				</div>

				{node.type === "directory" && isExpanded && node.children && (
					<div className="relative">{node.children.map((child) => renderFileTree(child, currentPath, level + 1))}</div>
				)}
			</div>
		);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
			{/* Left Column: Explorer Tree */}
			<div className="lg:col-span-5 flex flex-col bg-background min-w-0">
				<div className="px-4 py-2.5 border-b border-border bg-muted/50 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Layers size={13} className="text-muted-foreground" />
						<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
							Explorer {/*  */}
							{stats.files} files, {stats.directories} dirs
						</span>
					</div>
					<button
						type="button"
						onClick={toggleExpandAll}
						className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 border border-transparent hover:border-border bg-transparent hover:bg-background transition-colors cursor-pointer"
					>
						<ChevronsUpDown size={12} />
						Toggle
					</button>
				</div>
				<ScrollArea className="h-[420px] w-full">
					<div className="p-2">{structure.map((root) => renderFileTree(root))}</div>
				</ScrollArea>
			</div>

			{/* Right Column: Live Code Inspector */}
			<div className="lg:col-span-7 flex flex-col bg-muted/30 text-foreground min-w-0">
				<div className="px-4 py-2.5 border-b border-border bg-muted/50 flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 min-w-0">
						<span className="inline-block w-2 h-2 rounded-full bg-foreground shrink-0" />
						<span className="text-xs font-mono text-foreground truncate">{activeFile}</span>
						<span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 bg-background text-muted-foreground border border-border">
							{preview.language}
						</span>
					</div>
					<button
						type="button"
						onClick={copyPreviewCode}
						className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground bg-background hover:bg-muted border border-border transition-colors cursor-pointer shrink-0"
					>
						{copiedCode ? <Check size={12} className="text-foreground" /> : <Copy size={12} />}
						{copiedCode ? "Copied" : "Copy snippet"}
					</button>
				</div>

				<div className="px-4 py-2 border-b border-border bg-background text-[11px] font-mono text-muted-foreground">
					{preview.description}
				</div>

				<ScrollArea className="h-[370px] w-full flex-1">
					<pre className="p-4 text-xs font-mono leading-relaxed text-foreground w-max min-w-full">
						<code>{preview.code}</code>
					</pre>
				</ScrollArea>
			</div>
		</div>
	);
}
