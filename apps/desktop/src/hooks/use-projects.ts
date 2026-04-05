import { useQuery } from "@tanstack/react-query";
import { commands } from "@/bindings";

export function useProjects() {
	return useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			const result = await commands.listProjects();
			if (result.status === "error") {
				throw new Error(result.error);
			}
			return result.data;
		},
	});
}
