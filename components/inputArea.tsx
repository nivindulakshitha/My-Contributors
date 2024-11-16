import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function InputArea() {
	return (
		<div className="flex w-full max-w-sm items-center gap-2">
			<Input type="text" placeholder="GitHub username" />
			<Button type="submit">Find</Button>
		</div>
	)
}
