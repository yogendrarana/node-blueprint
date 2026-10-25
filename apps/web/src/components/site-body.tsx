import { useState } from "react";
import HeroSection from "./body/hero-section";
import ComposerSection from "./body/composer-section";
import ProjectStructureSection from "./body/project-structure-section";
import CliFlagsSection from "./body/cli-flags-section";
import { SectionSeparator } from "./body/crosshair";

export default function SiteBody() {
	const [projectName, setProjectName] = useState("");
	const [selectedOrm, setSelectedOrm] = useState<string>("drizzle");
	const [selectedAuth, setSelectedAuth] = useState<string>("jwt");
	const [selectedDatabase, setSelectedDatabase] = useState<string>("postgres");
	const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["docker"]);
	const [selectedFramework, setSelectedFramework] = useState<string>("express");

	return (
		<main className="w-full">
			<HeroSection />
			<SectionSeparator />

			<ComposerSection
				projectName={projectName}
				setProjectName={setProjectName}
				selectedFramework={selectedFramework}
				setSelectedFramework={setSelectedFramework}
				selectedDatabase={selectedDatabase}
				setSelectedDatabase={setSelectedDatabase}
				selectedOrm={selectedOrm}
				setSelectedOrm={setSelectedOrm}
				selectedAuth={selectedAuth}
				setSelectedAuth={setSelectedAuth}
				selectedFeatures={selectedFeatures}
				setSelectedFeatures={setSelectedFeatures}
			/>
			<SectionSeparator />

			<ProjectStructureSection
				projectName={projectName}
				selectedFramework={selectedFramework}
				selectedOrm={selectedOrm}
				selectedFeatures={selectedFeatures}
				selectedAuth={selectedAuth}
				selectedDatabase={selectedDatabase}
			/>
			<SectionSeparator />

			<CliFlagsSection />
		</main>
	);
}
