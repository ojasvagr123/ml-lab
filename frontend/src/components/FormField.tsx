type Props = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  options?: string[];
  placeholder?: string;
};

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  placeholder,
}: Props) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>

      {options ? (
        <select id={name} name={name} value={value} onChange={onChange}>
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder || `Enter ${label}`}
          onChange={onChange}
        />
      )}
    </div>
  );
}