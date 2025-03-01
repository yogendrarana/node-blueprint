import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { CommandOption } from "@/constants/constants";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";

const RadioOption: React.FC<{
    id: string;
    options: CommandOption[];
    value: string;
    onChange: (value: string) => void;
    defaultValue?: string;
}> = ({ id, options, value, onChange, defaultValue = "" }) => (
    <RadioGroup
        className="gap-0 -space-y-px rounded-md shadow-xs"
        defaultValue={defaultValue}
        id={id}
        value={value}
        onValueChange={(value: string) => onChange(value)}
    >
        {options.map((option, index) => (
            <div
                key={index}
                className={cn(
                    "border border-input relative outline-none cursor-pointer",
                    "first:rounded-t-md last:rounded-b-md ",
                    "has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-data-[state=checked]:z-10"
                )}
            >
                <div className={cn("h-12 px-3 flex gap-2 items-center")}>
                    <RadioGroupItem
                        id={option.flag}
                        value={option.flag}
                        className="after:absolute after:inset-0"
                        disabled={option.status !== "available"}
                    />
                    <Label htmlFor={option.flag} className="ml-2">
                        {option.label}
                    </Label>
                    <div className="ml-auto text-muted-foreground text-xs">
                        <Badge
                            className={cn("border border-gray-200", {
                                "bg-gray-200 text-gray-600": option.status === "coming-soon"
                            })}
                            variant="outline"
                        >
                            {option.status}
                        </Badge>
                    </div>
                </div>
            </div>
        ))}
    </RadioGroup>
);

export default RadioOption;
