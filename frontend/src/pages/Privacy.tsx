export const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Política de Privacidad</h1>
        <p className="text-gray-600">
          Última actualización: 5 de febrero de 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            1. Información que recopilamos
          </h2>
          <p>
            Recopilamos información que proporcionas al registrarte, como tu
            nombre, correo electrónico y datos de uso del servicio.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            2. Cómo utilizamos tu información
          </h2>
          <p>
            Utilizamos tu información para mejorar nuestro servicio,
            personalizar la experiencia del usuario y cumplir con requisitos
            legales.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Compartir datos</h2>
          <p>
            No compartimos tu información con terceros, salvo cuando sea
            necesario para cumplir con la ley o mejorar nuestro servicio.
          </p>
        </section>

        <footer className="mt-6 border-t pt-4 text-center">
          <p>
            Para más detalles, contacta en{" "}
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
