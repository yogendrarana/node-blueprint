import { FolderGit2 } from "lucide-react";
import ProjectStructure from "../project-structure";
import { Crosshair } from "./crosshair";

export interface ProjectStructureSectionProps {
	projectName: string;
	selectedFramework: string;
	selectedOrm: string;
	selectedFeatures: string[];
	selectedAuth: string;
	selectedDatabase: string;
}

export default function ProjectStructureSection({
	projectName,
	selectedFramework,
	selectedOrm,
	selectedFeatures,
	selectedAuth,
	selectedDatabase,
}: ProjectStructureSectionProps) {
	return (
		<section id="preview" className="w-full border-b border-border scroll-mt-14">
			<div className="max-w-6xl mx-auto border-x border-border relative">
				<Crosshair className="-bottom-[5px] -left-[5px]" />
				<Crosshair className="-bottom-[5px] -right-[5px]" />

				<div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-background">
					<div>
						<h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">Project Structure</h2>
						<p className="text-xs text-muted-foreground">
							Click any generated file in the tree to inspect its live scaffolded code.
						</p>
					</div>

					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
						<FolderGit2 size={14} className="text-foreground" />
						<span>{projectName || "my-app"}/</span>
					</div>
				</div>

				<ProjectStructure
					name={projectName}
					framework={selectedFramework}
					orm={selectedOrm}
					features={selectedFeatures}
					auth={selectedAuth}
					database={selectedDatabase}
				/>
			</div>
		</section>
	);
}
