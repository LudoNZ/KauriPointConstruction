export default function FormSelect({ options, updateText, onUpdate }) {
  const handleSelect = (option) => {
    updateText(option);
    onUpdate();
  };

  return (
    <div className="flex">
      {options.map((option, key) => (
        <div key={key} className="btn" onClick={() => handleSelect(option)}>
          {option}
        </div>
      ))}
    </div>
  );
}
