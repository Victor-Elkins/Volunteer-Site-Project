import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MultipleDatePickerProperties {
  required?: boolean;
  availability: Date[];
  setAvailability: (dates: Date[]) => void;
}

const MultipleDatePicker: React.FC<MultipleDatePickerProperties> = ({availability, setAvailability, required = false}) => {

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const alreadySelected = availability.some(selectedDate =>
          selectedDate.getTime() === date.getTime()
      );

      if (alreadySelected) {
        setAvailability(availability.filter(selectedDate =>
            selectedDate.getTime() !== date.getTime()
        ));
      } else {
        setAvailability([...availability, date]);
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
          <h3>Selected Dates: {required && <span className="text-red-500">*</span>}</h3>
          <ul>
            {availability.map((date, index) => (
                <li key={index}>{date.toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default MultipleDatePicker;
