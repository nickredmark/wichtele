import {
  FC,
  PropsWithChildren,
  ReactNode,
  RefObject,
  TextareaHTMLAttributes,
} from "react";

export const Form: FC<
  PropsWithChildren<{
    formRef?: RefObject<HTMLFormElement>;
    className?: string;
    deleteLabel?: string;
    onDelete?: () => void;
    cancelLabel?: string;
    onCancel?: () => void;
    canSubmit?: boolean;
    onSubmit: () => void;
    submitLabel: ReactNode;
  }>
> = ({
  formRef,
  className = "",
  canSubmit = true,
  deleteLabel,
  onDelete,
  cancelLabel,
  onCancel,
  submitLabel,
  onSubmit,
  children,
}) => (
  <form
    ref={formRef}
    className={className}
    onSubmit={(e) => {
      e.preventDefault();
      if (!canSubmit) {
        return;
      }
      onSubmit();
    }}
  >
    {children}
    <div className="flex justify-end space-x-1">
      {deleteLabel && (
        <button
          type="button"
          className="py-1 px-2 text-red-400 text-sm border bg-white border-red-400"
          onClick={onDelete}
        >
          Delete
        </button>
      )}
      {cancelLabel && (
        <button
          type="button"
          onClick={onCancel}
          className="py-1 px-2 bg-gray-300 text-white"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={!canSubmit}
        className="py-1 px-2 bg-green-400 text-white cursor-pointer disabled:cursor-default"
      >
        {submitLabel}
      </button>
    </div>
  </form>
);
export const Textarea: FC<
  TextareaHTMLAttributes<HTMLTextAreaElement> & { onSubmit: () => void }
> = ({ onSubmit, ...props }) => (
  <textarea
    {...props}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    }}
  />
);
