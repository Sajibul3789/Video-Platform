import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className, hover = false }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300",
        hover && "hover:shadow-2xl hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "p-6 border-b border-gray-100 dark:border-gray-700",
      className,
    )}
  >
    {children}
  </div>
);

export const CardBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn("p-6", className)}>{children}</div>;

export const CardFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "p-6 border-t border-gray-100 dark:border-gray-700",
      className,
    )}
  >
    {children}
  </div>
);
