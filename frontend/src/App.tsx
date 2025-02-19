import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { Router } from "@/routes/Router";

function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
