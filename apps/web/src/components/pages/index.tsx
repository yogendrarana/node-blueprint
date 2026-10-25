import SiteBody from "../site-body";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

const Index = () => {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			<SiteHeader />
			<div className="flex-1">
				<SiteBody />
			</div>
			<SiteFooter />
		</div>
	);
};

export default Index;
