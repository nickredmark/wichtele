import { FC, PropsWithChildren } from "react";

export const Form: FC<
  PropsWithChildren<{
    canSubmit?: boolean;
    onSubmit: () => void;
    submitLabel: string;
  }>
> = ({ canSubmit = true, onSubmit, submitLabel, children }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!canSubmit) {
        return;
      }
      onSubmit();
    }}
  >
    {children}
    <button type="submit" disabled={!canSubmit}>
      {submitLabel}
    </button>
  </form>
);
