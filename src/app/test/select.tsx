import React, { useState } from 'react';

const TwoColumnSelect = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    { id: 1, label: 'Option 1', column: 1 },
    { id: 2, label: 'Option 2', column: 1 },
    { id: 3, label: 'Option 3', column: 1 },
    { id: 4, label: 'Option 4', column: 2 },
    { id: 5, label: 'Option 5', column: 2 },
    { id: 6, label: 'Option 6', column: 2 },
  ];

  const handleOptionChange = (e:any) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            {options
              .filter((option) => option.column === 1)
              .map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
          </div>
          <div style={{ flex: 1 }}>
            {options
              .filter((option) => option.column === 2)
              .map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
          </div>
        </div>
      </select>
      <p>Selected option: {selectedOption}</p>
    </div>
  );
};

export default TwoColumnSelect;
