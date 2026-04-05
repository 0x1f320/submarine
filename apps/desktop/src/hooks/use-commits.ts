import { useQuery } from "@tanstack/react-query";
import { commands } from "@/bindings";

export function useCommits(pageId: number) {
	return useQuery({
		queryKey: ["commits", pageId],
		queryFn: async () => {
			const result = await commands.listCommits(pageId);
			if (result.status === "error") {
				throw new Error(result.error);
			}
			return result.data;
		},
		refetchInterval: 2000,
	});
}
