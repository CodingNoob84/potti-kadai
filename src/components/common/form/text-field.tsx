import React from "react";
import { useFieldContext } from ".";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors } from "./errors-field";

type TextFieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = ({ label, ...inputProps }: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...inputProps}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  );
};
