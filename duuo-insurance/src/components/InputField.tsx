interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  min?: string;
  max?: string;
  maxLength?: number;
}

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  pattern,
  min,
  max,
  maxLength,
}: InputFieldProps) {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        min={min}
        max={max}
        maxLength={maxLength}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ford-blue focus:border-transparent transition-all duration-200 outline-none"
      />
    </div>
  );
}
