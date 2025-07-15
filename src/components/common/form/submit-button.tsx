import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import clsx from "clsx"; // optional utility to merge classNames
import { Loader2 } from "lucide-react";
import { useFormContext } from ".";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const form = useFormContext();

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <Button
      type="submit"
      className={clsx(className)}
      disabled={isSubmitting || !canSubmit}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
