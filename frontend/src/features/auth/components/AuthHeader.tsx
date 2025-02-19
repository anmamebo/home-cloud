import { CloudyIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

export const AuthHeader = ({
  title,
  subtitle,
  linkText,
  linkTo,
}: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Logo */}
      <a href="#" className="flex flex-col items-center gap-2 font-medium">
        <div className="flex h-8 w-8 items-center justify-center rounded-md">
          <CloudyIcon className="size-6" />
        </div>
        <span className="sr-only">HomeCloud</span>
      </a>

      {/* Title */}
      <h1 className="text-xl font-bold">{title}</h1>

      {/* Subtitle */}
      <div className="text-center text-sm">
        {subtitle}{" "}
        <Link to={linkTo} className="underline underline-offset-4">
          {linkText}
        </Link>
      </div>
    </div>
  );
};
