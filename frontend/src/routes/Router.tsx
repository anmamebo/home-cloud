import { AuthLayout } from "@/components/layouts/AuthLayout";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { FolderProvider } from "@/contexts/FolderContext";
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from "@/features/auth";
import { AxiosErrorInterceptor } from "@/interceptors/AxiosErrorInterceptor";
import { PrivacyPolicy, TermsOfService } from "@/pages/docs";
import { MainPage } from "@/pages/filesystem/MainPage";
import { ProtectedRoute, PublicRoute } from "@/routes/utils";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

export const Router = () => {
  return (
    <AuthProvider>
      <FolderProvider>
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
                  element={
                    <MainLayout>
                      <Outlet />
                    </MainLayout>
                  }
                >
                  <Route
                    path="/"
                    element={<Navigate to="/carpeta" replace />}
                  />
                  <Route path="/carpeta" element={<MainPage />} />
                  <Route path="/carpeta/:folderId" element={<MainPage />} />
                </Route>
              </Route>
            </Routes>
          </AxiosErrorInterceptor>
        </BrowserRouter>
      </FolderProvider>
    </AuthProvider>
  );
};
