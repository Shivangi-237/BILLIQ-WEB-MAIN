import { FaCloudUploadAlt, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function Stepper({ step }) {
  const steps = [
    { num: 1, label: "Upload", icon: FaCloudUploadAlt },
    { num: 2, label: "Processing", icon: FaSpinner },
    { num: 3, label: "Result", icon: FaCheckCircle },
  ];

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((s, idx) => {
        const Icon = s.icon;
        const isActive = step === s.num;
        const isCompleted = step > s.num;
        
        return (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Circle with icon */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg scale-110"
                    : isCompleted
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon className={`text-2xl ${isActive && s.num === 2 ? 'animate-spin' : ''}`} />
                
                {/* Pulse effect for active step */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20" />
                )}
              </div>
              
              {/* Label */}
              <span
                className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                  isActive ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              
              {/* Step number badge */}
              <span
                className={`mt-1 text-xs px-2 py-0.5 rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : isCompleted
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                Step {s.num}
              </span>
            </div>
            
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="relative mx-4">
                <div className="w-24 h-1 bg-gray-200 rounded-full" />
                <div
                  className={`absolute top-0 left-0 h-1 rounded-full transition-all duration-500 ${
                    step > s.num ? "w-full bg-gradient-to-r from-green-500 to-green-600" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}