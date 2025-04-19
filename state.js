export function showNextStep() {
    if (currentStep == steps.length - 1) {
        console.log("All steps completed...");
        return;
    }
    currentStep++;

    steps.forEach((id, i) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle("active", i === currentStep);
        }
    });
}

export function goToGameStep() {
    currentStep = 0;
    showNextStep();
}

export function isRulesStep() {
    return currentStep === 0;
}

export function isGameStep() {
    return currentStep === 1;
}

export function isScoreStep() {
    return currentStep === 2;
}

export function isExplainStep() {
    return currentStep === 3;
}

export function getCurrentStep() {
    return steps[currentStep];
}

let currentStep = 0;
const steps = ["step1-rules", "step2-game", "step3-score", "step4-explain"];
