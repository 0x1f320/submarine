import { useQuery } from "@tanstack/react-query";
import { commands } from "@/bindings";

export function usePages(projectId: number) {
	return useQuery({
		queryKey: ["pages", projectId],
		queryFn: async () => {
			const result = await commands.listPages(projectId);
			if (result.status === "error") {
				throw new Error(result.error);
			}
			return result.data;
		},
	});
}
