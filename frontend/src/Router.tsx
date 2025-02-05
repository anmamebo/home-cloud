import { MainLayout } from "@/components/layout/MainLayot";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { LoginPage } from "@/pages/LoginPage";
import { PrivacyPolicy } from "@/pages/Privacy";
import { RegisterPage } from "@/pages/RegisterPage";
import { TermsOfService } from "@/pages/Terms";
import { AuthProvider } from "@/providers/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicRoute } from "./components/PublicRoute";

export const Router = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/terminos" element={<TermsOfService />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />

          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/iniciar-sesion" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Route>

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
