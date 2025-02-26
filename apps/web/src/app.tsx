import SiteBody from "./components/site-body";
import Container from "./components/container";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";

function App() {
    return (
        <Container>
            <div className="py-8 flex flex-col gap-4">
                <SiteHeader />
                <SiteBody />
                <SiteFooter />
            </div>
        </Container>
    );
}

export default App;
