import React from "react";
import { Circle } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export const MCQCard = ({ options }) => {
  return (
    <CardContent>
      {options?.length > 0 ? (
        <ul
          role="list"
          className="space-y-2"
          aria-label="Multiple choice options"
        >
          {options.map((option, index) => (
            <li
              key={option.id || index}
              className="flex items-start gap-2 py-1"
            >
              <Circle
                className={`${
                  option.isCorrectAnswer ? "text-green-500" : "text-red-500"
                } h-2.5 w-2.5 flex-shrink-0 mt-1.5`}
              />
              <span className="text-sm">{option.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No options available</p>
      )}
    </CardContent>
  );
};
