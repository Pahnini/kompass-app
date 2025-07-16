import React from "react";

type ProgressProps = {
    value: number;
    className?: string;
};

export const Progress = ({ value, className = "" }: ProgressProps) => {
    return (
        <div className={`relative bg-gray-200 rounded h-2 ${className}`}>
            <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${value}%` }}
            />
        </div>
    );
};
