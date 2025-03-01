import Container from "../container";
import SiteBody from "../site-body";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

const Index = () => {
    return (
        <Container>
            <div className="min-h-screen py-8 flex flex-col gap-4">
                <SiteHeader />
                <SiteBody />
                <SiteFooter />
            </div>
        </Container>
    );
};

export default Index;
