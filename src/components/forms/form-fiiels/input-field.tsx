"use client";

import React, { ReactNode, useState } from "react";
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Render } from "@/components/conditionnal-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

interface FieldIconProps {
  icon: ReactNode;
  position: "start" | "end";
}

interface InputField<T extends FieldValues> extends InputProps {
  control: Control<T>;
  fieldName: Path<T>;
  label?: ReactNode;
  description?: string;
  icon?: FieldIconProps;
  validateSchema?: Omit<RegisterOptions<T, Path<T>>, "disabled">;
}

export function InputField<T extends FieldValues>(props: InputField<T>) {
  const { control, fieldName, label, description, icon, validateSchema, className, type, ...rest } =
    props;
  const [showPassword, setShowPassword] = useState(false);

  const renderPasswordToggle = () => (
    <Render.If condition={type === "password"}>
      <Button
        type="button"
        size={"icon"}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-primary bg-transparent hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <IconEyeOff size={16} className="stroke-gray-3 fill-transparent" />
        ) : (
          <IconEye size={16} />
        )}
      </Button>
    </Render.If>
  );

  const renderIcon = () => {
    if (!icon) return null;

    const iconElement = (
      <div
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-black-3 text-xs 2xl:text-base font-semibold",
          icon.position === "start" ? "left-4" : "right-4",
        )}
      >
        {icon.icon}
      </div>
    );

    return <Render.If condition={true}>{iconElement}</Render.If>;
  };

  const getInputClassName = () => {
    return cn(
      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs md:text-base",
      icon?.position === "start" ? "pl-12" : "pr-12",
      className,
    );
  };

  const getInputType = () => {
    return type === "password" && showPassword ? "text" : type;
  };

  const renderFormField = (field: ControllerRenderProps<T, Path<T>>) => (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
        </FormLabel>
      )}
      <FormControl className="relative mt-1.5">
        <div className="relative">
          <div className="relative">
            <Input
              {...field}
              value={field.value ?? ""}
              type={getInputType()}
              {...rest}
              className={getInputClassName()}
            />
            <Render>
              {renderPasswordToggle()}
              {renderIcon()}
            </Render>
          </div>
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );

  return (
    <FormField
      control={control}
      name={fieldName}
      rules={validateSchema}
      render={({ field }) => renderFormField(field)}
    />
  );
}