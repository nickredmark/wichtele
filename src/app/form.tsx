import { FC, PropsWithChildren } from "react";

export const Form: FC<
  PropsWithChildren<{
    inline?: boolean;
    canSubmit?: boolean;
    onSubmit: () => void;
    submitLabel: string;
  }>
> = ({ inline = false, canSubmit = true, onSubmit, submitLabel, children }) => (
  <form
    className={`${inline ? "flex-row" : ""}`}
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
