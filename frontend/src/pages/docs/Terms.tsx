export const TermsOfService = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Términos de Servicio</h1>
        <p className="text-gray-600">
          Última actualización: 5 de febrero de 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            1. Aceptación de los términos
          </h2>
          <p>
            Al acceder y utilizar nuestro servicio, aceptas estos términos en su
            totalidad. Si no estás de acuerdo, por favor, no utilices el
            servicio.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Uso del servicio</h2>
          <p>
            No puedes utilizar el servicio para actividades ilegales ni
            infringir derechos de terceros. Nos reservamos el derecho de
            suspender tu acceso en caso de incumplimiento.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos en cualquier momento. Si
            realizamos cambios importantes, te notificaremos por correo o
            mediante un aviso en el servicio.
          </p>
        </section>

        <footer className="mt-6 border-t pt-4 text-center">
          <p>
            Si tienes preguntas, contacta en{" "}
            <a
              className="text-muted-foreground underline underline-offset-4 hover:text-primary"
              href="mailto:anmamebo2001@gmail.com"
            >
              anmamebo2001@gmail.com
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};
