import React from 'react';
import { Controller } from 'react-hook-form';

const VerificationCode = ({ control, errors, handleChange, handleBackspace }) => {
  return (
    <div className="flex space-x-2">
      {/* Create 6 separate input fields for each digit */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <Controller
            name={`verificationCode[${index}]`}
            control={control}
            rules={{
              required: "Code is required",
              pattern: {
                value: /^[0-9]{1}$/,
                message: "Only digits allowed",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                id={`verificationCode-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                placeholder="—"
                onChange={(e) => {
                  field.onChange(e);
                  handleChange(e, index);
                }}
                onKeyDown={(e) => handleBackspace(e, index)}
              />
            )}
          />
          {errors?.verificationCode?.[index] && (
            <span className="text-red-500 text-sm">
              {errors.verificationCode[index].message}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default VerificationCode;
