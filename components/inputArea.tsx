import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function InputArea() {
	return (
		<div className="flex w-full max-w-sm items-center space-x-2">
			<Input type="text" placeholder="github username" />
			<Button type="submit">Find</Button>
		</div>
	)
}
