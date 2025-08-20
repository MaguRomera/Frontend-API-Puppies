import { useState } from "react";

const ToggleSwitch = ({ checked = false, onChange }) => {
  const [isOn, setIsOn] = useState(checked);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onChange) onChange(newState); 
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300
        ${isOn ? "bg-[var(--color-green)]" : "bg-[var(--color-verydarkgrey)]"}
      `}
    >
      <span
        className={`inline-flex h-5 w-5 rounded-full bg-[var(--color-white)] shadow-md transform transition-transform duration-300
          ${isOn ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
};
export default ToggleSwitch;