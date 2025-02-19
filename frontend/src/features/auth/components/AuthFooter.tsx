import { Link } from "react-router-dom";

export const AuthFooter = () => {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
      Al hacer clic en continuar, aceptas nuestros{" "}
      <Link to="/terminos">Términos de servicio</Link> y nuestra{" "}
      <Link to="/privacidad">Política de privacidad</Link>.
    </div>
  );
};
