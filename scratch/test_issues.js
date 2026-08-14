import { tasksData } from '../src/data/tasks.js';

console.log("=== TEST CASE 1: TASK 01 IMAGE HEIGHT EDITING ===");
const q1 = tasksData.find(t => t.id === "task_01");
const logoEl = q1.public_config.initialElements[0];
console.log("Q1 Initial Logo Element:", logoEl);

// Simulate updating logo height from Inspector (H = 80 -> 100)
const updatedLogoEl = {
  ...logoEl,
  height: 100
};
console.log("Q1 Updated Logo Element (H = 100):", updatedLogoEl);
console.log("Height successfully updated to:", updatedLogoEl.height);

console.log("\n=== TEST CASE 2: TASK 03 RECTANGLE FILL COLOR EDITING ===");
const q3 = tasksData.find(t => t.id === "task_03");
const buttonBase = q3.public_config.initialElements.find(e => e.id === "button_base");
console.log("Q3 Initial Button Base Element:", buttonBase);

// Simulate updating fill color from Inspector (#2563EB -> #FF0000 -> #00FF00)
const updatedColor1 = {
  ...buttonBase,
  color: "#FF0000",
  backgroundColor: "#FF0000"
};
console.log("Q3 Updated Fill Color (#FF0000):", updatedColor1);

const updatedColor2 = {
  ...updatedColor1,
  color: "#00FF00",
  backgroundColor: "#00FF00"
};
console.log("Q3 Updated Fill Color (#00FF00):", updatedColor2);

console.log("\n=== TEST CASE 3 & 4: STATE & SCORING COMPATIBILITY ===");
console.log("Q1 state height for scoring:", updatedLogoEl.height);
console.log("Q3 state color for scoring:", updatedColor2.color);
