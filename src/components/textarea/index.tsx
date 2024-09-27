import { Textarea } from "@/components/ui/textarea";
import { HTMLProps } from "react";

export default function TextArea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
    return (
        <div className="w-full">
            <Textarea
                {...rest}
                className="w-full h-40 resize-none p-4 border rounded-md"
            />
        </div>
    );
}
