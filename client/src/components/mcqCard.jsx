import React from "react";
import { Circle } from "lucide-react";

export const MCQResult = ({ options }) => {
  return (
    <div className="space-y-2">
      {options?.length > 0 ? (
        options.map((option, index) => (
          <div key={option.id || index} className="flex items-start gap-3 py-1">
            <Circle
              className={`${
                option.isCorrectAnswer ? "text-green-500" : "text-red-500"
              } h-2 w-2 mt-2`}
            />
            <span className="text-sm">{option.text}</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No options available</p>
      )}
    </div>
  );
};