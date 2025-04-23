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
    currentStep = gameStep - 1;
    showNextStep();
}

export function isRulesStep() {
    return currentStep === rulesStep;
}

export function isGameStep() {
    return currentStep === gameStep;
}

export function isScoreStep() {
    return currentStep === scoreStep;
}

export function isExplainStep() {
    return currentStep === explainStep;
}

export function getCurrentStep() {
    return steps[currentStep];
}

let currentStep = 0;
let rulesStep = 0, gameStep = 1, scoreStep = 2, explainStep = 3;
const steps = ["step1-rules", "step2-game", "step3-score", "step4-explain"];
