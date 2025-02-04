import { MainLayout } from "@/components/layout/MainLayot";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const Router = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<h1>LOGIN</h1>} />

          {/* Private routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <MainLayout>
                  <h1 className="text-3xl font-bold underline">Hello world!</h1>
                  <Button variant="secondary">Click me</Button>
                </MainLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
