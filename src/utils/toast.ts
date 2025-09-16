import { addToast } from "@heroui/react";

type ToastProps = {
  content: string;
  status?:
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
  description?: string;
  variant?: "solid" | "bordered" | "flat";
  baseClassName?: string;
  descriptionClassName?: string;
};

export const showToast = ({
  content,
  status = "default",
  description,
  variant = "flat",
  baseClassName,
  descriptionClassName,
}: ToastProps): void => {
  addToast({
    title: content,
    description: description,
    color: status,
    variant: variant,
    classNames: {
      base: `${baseClassName} font-manrope`,
      description: `${descriptionClassName} text-[12px]`,
      title: "text-sm",
    },
  });
};
