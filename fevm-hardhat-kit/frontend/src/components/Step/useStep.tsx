import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

export interface Helpers {
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  setStep: Dispatch<SetStateAction<number>>;
}

export interface UseStepProps {
  maxStep: number;
  initialStep?: number;
}

export const useStep = ({ maxStep, initialStep = 0 }: UseStepProps): [number, boolean, Helpers] => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const canGoToNextStep = useMemo(() => currentStep + 1 <= maxStep, [currentStep, maxStep]);
  const canGoToPrevStep = useMemo(() => currentStep - 1 >= 0, [currentStep]);

  const setStep = useCallback(
    (step: unknown) => {
      const newStep = step instanceof Function ? step(currentStep) : step;
      if (newStep >= 0 && newStep <= maxStep) {
        setCurrentStep(newStep);
        return;
      }
      throw new Error("Step not valid");
    },
    [maxStep, currentStep]
  );

  const [isProcessing, setIsProcessing] = useState(false);

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep((step) => step + 1);
    }
  }, [canGoToNextStep]);

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep((step) => step - 1);
    }
  }, [canGoToPrevStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  return [
    currentStep,
    isProcessing,
    {
      setIsProcessing,
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ];
};
