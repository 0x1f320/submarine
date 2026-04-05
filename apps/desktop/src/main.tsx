import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./app";
import { NoProject } from "./pages/no-project";
import { Project } from "./pages/project";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<App />}>
						<Route index element={<NoProject />} />
						<Route path="projects/:projectId" element={<Project />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>,
);
