import { Input, InputProps } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useField } from "formik";
import { useEffect, useRef, useState, RefObject } from "react";

export interface FormikInputProps extends InputProps {
  label: string;
  name: string;
  setFocusOnLoad?: boolean;
  setArrayTouched?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  inputRef?: RefObject<HTMLInputElement> | undefined;
  helperText?: string;
}

export const FormikInput: React.FC<FormikInputProps> = ({
  label,
  setArrayTouched,
  setFocusOnLoad = false,
  inputRef: propInputRef,
  onKeyDown,
  helperText,
  ...props
}) => {
  const [field, meta, { setValue }] = useField(props.name);
  const fieldValue = field.value || "";
  const [internalVal, setInternalVal] = useState(fieldValue);

  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = meta.touched && meta.error;

  useEffect(() => {
    if (fieldValue !== internalVal) {
      setInternalVal(fieldValue);
    }
  }, [fieldValue]);

  useEffect(() => {
    if (inputRef && setFocusOnLoad) {
      inputRef.current?.focus();
    }
  }, [inputRef, setFocusOnLoad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalVal(e.target.value);
  };

  const handleBlur = () => {
    internalVal && setArrayTouched && setArrayTouched();
    setValue(internalVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      //@ts-ignore
      setValue(e.target.value);
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={props.name}>{label}</Label>
      <Input
        ref={propInputRef || inputRef}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        value={internalVal}
        {...props}
      />
      {helperText && (
        <span className="mt-1 text-xs font-bold text-muted-foreground">
          {helperText}
        </span>
      )}
      {hasError && <span className="text-xs text-red-500">{meta.error}</span>}
    </div>
  );
};
