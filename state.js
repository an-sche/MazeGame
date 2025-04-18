export function showNextStep() {
    if (currentStep >= steps.length) {
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

let currentStep = 0;
const steps = ["step1-rules", "step2-game", "step3-explain"];
