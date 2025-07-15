import React, { useState } from "react";
import { useFieldContext } from ".";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { FieldErrors } from "./errors-field";

type TextFieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordField = ({ label, ...inputProps }: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const field = useFieldContext<string>();

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name}>{label}</Label>
      <div className="relative">
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...inputProps}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      <FieldErrors meta={field.state.meta} />
    </div>
  );
};
