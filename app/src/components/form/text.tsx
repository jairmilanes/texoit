import * as React from 'react';
import { forwardRef } from 'react';

export interface FormTextProps extends React.ComponentPropsWithoutRef<'input'> {
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;
  loading?: boolean;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const defaultProps: Partial<FormTextProps> = {
  label: '',
  value: '',
  placeholder: '',
  loading: false,
  onChange: () => null,
  onBlur: () => null,
  onFocus: () => null,
};

const FormTextComponent = forwardRef<HTMLInputElement, FormTextProps>(
  (
    { name, label, type, placeholder, value, loading, onChange, onBlur, onFocus },
    ref?: React.LegacyRef<HTMLInputElement>,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name + `-input`}
            className="block mb-2 text-sm font-medium text-black dark:text-white"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={name}
            type={type || "text"}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className="bg-white border border-sep text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full px-2.5 py-1.5 shadow-[0_1px_3px_0_rgba(132, 132, 132, 0.75)]"
            placeholder={placeholder}
            autoComplete="off"
          />
          {loading && (
              <svg
                  className="absolute right-1 top-2 left-auto animate-spin h-5 w-5 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
              >
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
              </svg>
          )}
        </div>
      </div>
    );
  },
);

FormTextComponent.displayName = 'FormTextComponent';

FormTextComponent.defaultProps = defaultProps;

export default FormTextComponent;
