import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MultipleDatePicker = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const alreadySelected = selectedDates.some(selectedDate =>
        selectedDate.getTime() === date.getTime()
      );

      if (alreadySelected) {
        setSelectedDates(selectedDates.filter(selectedDate =>
          selectedDate.getTime() !== date.getTime()
        ));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  return (
    <div>
      <DatePicker
        selected={null}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        className="border rounded p-2 w-full"
        isClearable
        placeholderText="Select availability dates"
        inline
      />
      <div className="mt-4">
        <h3>Selected Dates: <span className="text-red-500">*</span></h3>
        <ul>
          {selectedDates.map((date, index) => (
            <li key={index}>{date.toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultipleDatePicker;
