import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { Router } from "./Router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
