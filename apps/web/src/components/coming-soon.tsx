import { Badge } from "./ui/badge";

function ComingSoon() {
    return (
        <div className="ml-auto text-muted-foreground text-xs">
            <Badge className="border border-gray-200 text-gray-600" variant="outline">
                coming soon
            </Badge>
        </div>
    );
}

export default ComingSoon;
