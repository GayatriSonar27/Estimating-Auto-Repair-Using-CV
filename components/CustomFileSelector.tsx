import classNames from "classnames";
import React, { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"input">;

const CustomFileSelector = (props: Props) => {
  return (
    <input
      {...props}
      type="file"
      multiple
      className={classNames({
        "file:bg-sky-50 file:text-sky-500 hover:file:bg-sky-100": true,
        "file:rounded-lg file:rounded-tr-none file:rounded-br-none": true,
        "file:px-4 file:py-2 file:mr-4 file:border-none": true,
        "hover:cursor-pointer border rounded-lg text-gray-400": true,
      })}
    />
  );
};

export default CustomFileSelector;
