import React from "react";

interface props {
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<props> = ({
  type,
  placeholder,
  className,
  value,
  onChange,
  name,
}) => {
  return (
    <div className=" p-2 m-2">
      <input
        type={type}
        placeholder={placeholder}
        className={`bg-slate-900 hover:bg-slate-900 text-sm px-3 py-1 file:border-0 file:bg-transparent rounded-md h-12 w-72 tracking-wider`}
        required={true}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
