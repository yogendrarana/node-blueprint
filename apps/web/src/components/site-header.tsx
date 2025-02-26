import GithubStarBadge from "./ui/github-badge";

export default function SiteHeader() {
    return (
        <div className="flex justify-between items-center">
            <a href="/" className="text-lg font-semibold">
                Node Blueprint
            </a>

            <GithubStarBadge />
        </div>
    );
}
