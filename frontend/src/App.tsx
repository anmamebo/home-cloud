import { MainLayout } from "@/components/layout/main-layout";
import { ModeToggle, ThemeProvider } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <h1 className="text-3xl font-bold underline">Hello world!</h1>
                  <ModeToggle />
                  <Button variant="secondary">Click me</Button>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
