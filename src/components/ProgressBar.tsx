interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`text-sm font-medium ${
              index + 1 <= currentStep ? 'text-ford-blue' : 'text-gray-400'
            }`}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              index + 1 <= currentStep ? 'bg-ford-blue' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="mt-2 text-center text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
