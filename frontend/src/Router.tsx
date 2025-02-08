import { AuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { Button } from "@/components/ui/button";
import { AxiosErrorInterceptor } from "@/interceptors/AxiosErrorInterceptor";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { LoginPage } from "@/pages/LoginPage";
import { PrivacyPolicy } from "@/pages/Privacy";
import { RegisterPage } from "@/pages/RegisterPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { TermsOfService } from "@/pages/Terms";
import { AuthProvider } from "@/providers/AuthProvider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

export const Router = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AxiosErrorInterceptor>
          <Routes>
            {/* Static pages */}
            <Route path="/terminos" element={<TermsOfService />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />

            {/* Public routes */}
            <Route element={<PublicRoute />}>
              {/* Auth routes */}
              <Route
                element={
                  <AuthLayout>
                    <Outlet />
                  </AuthLayout>
                }
              >
                <Route path="/iniciar-sesion" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route
                  path="/olvide-contrasena"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/restablecer-contrasena"
                  element={<ResetPasswordPage />}
                />
              </Route>
            </Route>

            {/* Private routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={
                  <MainLayout>
                    <h1 className="text-3xl font-bold underline">
                      Hello world!
                    </h1>
                    <Button variant="secondary">Click me</Button>
                  </MainLayout>
                }
              />
            </Route>
          </Routes>
        </AxiosErrorInterceptor>
      </BrowserRouter>
    </AuthProvider>
  );
};
