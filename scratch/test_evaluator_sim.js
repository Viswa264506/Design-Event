import { tasksData } from '../src/data/tasks.js';

function evaluateTask(studentElements, expectedElements) {
  if (!expectedElements || expectedElements.length === 0) {
    return { score: 10, details: { feedback: 'No elements expected for this task.' } };
  }

  let totalTaskScore = 0;
  const elementFeedbacks = [];
  let matchedCount = 0;

  const targetElementWeight = 10 / expectedElements.length;

  for (const expected of expectedElements) {
    const student = studentElements.find(el => el.id === expected.id);
    
    if (!student) {
      elementFeedbacks.push(`Missing element: ${expected.id}`);
      continue;
    }

    matchedCount++;
    let posScore = 0;

    // 1. Position evaluation (Max 4.0 pts)
    const posXWeight = 2.0;
    const posYWeight = 2.0;

    const diffX = Math.abs(student.x - expected.x);
    if (diffX <= 3) posScore += posXWeight;
    else if (diffX <= 10) posScore += posXWeight * 0.5;

    const diffY = Math.abs(student.y - expected.y);
    if (diffY <= 3) posScore += posYWeight;
    else if (diffY <= 10) posScore += posYWeight * 0.5;

    // 2. Dimensions evaluation (Max 3.0 pts)
    const widthWeight = 1.5;
    const heightWeight = 1.5;
    let dimScore = 0;

    const diffW = Math.abs(student.width - expected.width);
    if (diffW <= 3) dimScore += widthWeight;
    else if (diffW <= 10) dimScore += widthWeight * 0.5;

    const diffH = Math.abs(student.height - expected.height);
    if (diffH <= 3) dimScore += heightWeight;
    else if (diffH <= 10) dimScore += heightWeight * 0.5;

    // 3. Styling & Content evaluation (Max 3.0 pts)
    let styleScore = 0;

    const getStudentColor = (el) => el.color || el.backgroundColor || '';
    const getExpectedColor = (el) => el.color || el.backgroundColor || '';

    if (expected.type === 'text') {
      // Text content check (0.6 pts)
      if (expected.text && student.text) {
        if (student.text.trim().toLowerCase() === expected.text.trim().toLowerCase()) styleScore += 0.6;
        else if (student.text.trim().toLowerCase().includes(expected.text.trim().toLowerCase())) styleScore += 0.3;
      } else styleScore += 0.6;

      // Color check (0.6 pts)
      const expCol = getExpectedColor(expected);
      const stuCol = getStudentColor(student);
      if (expCol && stuCol) {
        if (expCol.toUpperCase() === stuCol.toUpperCase()) styleScore += 0.6;
      } else styleScore += 0.6;

      // FontSize check (0.6 pts)
      if (expected.fontSize && student.fontSize) {
        if (Math.abs(student.fontSize - expected.fontSize) <= 2) styleScore += 0.6;
      } else styleScore += 0.6;

      // FontWeight check (0.6 pts)
      if (expected.fontWeight && student.fontWeight) {
        if (Number(student.fontWeight) === Number(expected.fontWeight)) styleScore += 0.6;
      } else styleScore += 0.6;

      // Alignment check (0.6 pts)
      if (expected.align && student.align) {
        if (student.align === expected.align) styleScore += 0.6;
      } else styleScore += 0.6;

    } else if (expected.type === 'rectangle') {
      // Color (1.5 pts)
      const expCol = getExpectedColor(expected);
      const stuCol = getStudentColor(student);
      if (expCol && stuCol) {
        if (expCol.toUpperCase() === stuCol.toUpperCase()) styleScore += 1.5;
      } else styleScore += 1.5;

      // Border radius (1.5 pts)
      if (expected.borderRadius !== undefined && student.borderRadius !== undefined) {
        if (Math.abs(student.borderRadius - expected.borderRadius) <= 3) styleScore += 1.5;
      } else styleScore += 1.5;

    } else if (expected.type === 'circle') {
      const expCol = getExpectedColor(expected);
      const stuCol = getStudentColor(student);
      if (expCol && stuCol) {
        if (expCol.toUpperCase() === stuCol.toUpperCase()) styleScore += 3.0;
      } else styleScore += 3.0;

    } else {
      styleScore = 3.0; // Image types inherit full style marks
    }

    const elementScore = posScore + dimScore + styleScore; // Max 10.0 per element
    totalTaskScore += (elementScore / 10) * targetElementWeight;
  }

  // Extra element penalty (0.25 per extra element, max 2.0)
  const extraCount = Math.max(0, studentElements.length - expectedElements.length);
  const penalty = Math.min(2.0, extraCount * 0.25);
  totalTaskScore = Math.max(0, totalTaskScore - penalty);

  return {
    score: parseFloat(totalTaskScore.toFixed(2)),
    details: {
      elementsFound: matchedCount,
      elementsExpected: expectedElements.length,
      penaltyApplied: penalty,
      breakdown: elementFeedbacks
    }
  };
}

const expectedAnswers = {
  task_01: [
    { id: "logo_element", type: "image", x: 690, y: 30, width: 80, height: 80 }
  ],
  task_02: [
    { id: "heading_text", type: "text", x: 200, y: 100, width: 400, height: 50, text: "DESIGN WITH PURPOSE", fontSize: 32, fontWeight: 700, color: "#1E40AF", align: "center" }
  ],
  task_03: [
    { id: "button_base", type: "rectangle", x: 310, y: 270, width: 180, height: 50, color: "#2563EB", borderRadius: 10 },
    { id: "button_text", type: "text", x: 310, y: 280, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, color: "#FFFFFF", align: "center" }
  ],
  task_07: [
    { id: "banner_bg", type: "rectangle", x: 50, y: 100, width: 700, height: 220, color: "#4F46E5", borderRadius: 16 },
    { id: "banner_title", type: "text", x: 80, y: 140, width: 640, height: 60, text: "SUMMER DESIGN SALE", fontSize: 36, fontWeight: 700, color: "#FFFFFF", align: "center" },
    { id: "banner_sub", type: "text", x: 80, y: 220, width: 640, height: 40, text: "UP TO 50% OFF ALL COURSES", fontSize: 20, fontWeight: 600, color: "#FDE047", align: "center" }
  ],
  task_08: [
    { id: "profile_card_bg", type: "rectangle", x: 250, y: 100, width: 300, height: 400, color: "#FFFFFF", borderRadius: 16 },
    { id: "profile_img", type: "image", x: 340, y: 130, width: 120, height: 120 },
    { id: "profile_name", type: "text", x: 270, y: 270, width: 260, height: 35, text: "Alex Morgan", fontSize: 22, fontWeight: 700, color: "#111827", align: "center" },
    { id: "profile_desc", type: "text", x: 270, y: 310, width: 260, height: 30, text: "Lead UI/UX Designer", fontSize: 14, fontWeight: 500, color: "#6B7280", align: "center" },
    { id: "profile_btn_bg", type: "rectangle", x: 310, y: 370, width: 180, height: 45, color: "#2563EB", borderRadius: 8 },
    { id: "profile_btn_text", type: "text", x: 310, y: 380, width: 180, height: 25, text: "Connect", fontSize: 14, fontWeight: 700, color: "#FFFFFF", align: "center" }
  ]
};

console.log("=== PERFECT SUBMISSION EVALUATIONS ===");
const q1Perf = [{ id: "logo_element", type: "image", x: 690, y: 30, width: 80, height: 80 }];
console.log("Q1 Perfect Score:", evaluateTask(q1Perf, expectedAnswers.task_01).score, "/ 10");

const q3Perf = [
  { id: "button_base", type: "rectangle", x: 310, y: 270, width: 180, height: 50, color: "#2563EB", borderRadius: 10 },
  { id: "button_text", type: "text", x: 310, y: 280, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, color: "#FFFFFF", align: "center" }
];
console.log("Q3 Perfect Score:", evaluateTask(q3Perf, expectedAnswers.task_03).score, "/ 10");

const q7Perf = [
  { id: "banner_bg", type: "rectangle", x: 50, y: 100, width: 700, height: 220, color: "#4F46E5", borderRadius: 16 },
  { id: "banner_title", type: "text", x: 80, y: 140, width: 640, height: 60, text: "SUMMER DESIGN SALE", fontSize: 36, fontWeight: 700, color: "#FFFFFF", align: "center" },
  { id: "banner_sub", type: "text", x: 80, y: 220, width: 640, height: 40, text: "UP TO 50% OFF ALL COURSES", fontSize: 20, fontWeight: 600, color: "#FDE047", align: "center" }
];
console.log("Q7 Perfect Score:", evaluateTask(q7Perf, expectedAnswers.task_07).score, "/ 10");

const q8Perf = expectedAnswers.task_08;
console.log("Q8 Multi-Element Perfect Score:", evaluateTask(q8Perf, expectedAnswers.task_08).score, "/ 10");

console.log("\n=== INCORRECT SUBMISSION EVALUATIONS ===");
const q1Wrong = [{ id: "logo_element", type: "image", x: 100, y: 100, width: 80, height: 80 }];
console.log("Q1 Incorrect Position (x=100, y=100) Score:", evaluateTask(q1Wrong, expectedAnswers.task_01).score, "/ 10");

const q3Wrong = [
  { id: "button_base", type: "rectangle", x: 50, y: 50, width: 100, height: 30, color: "#CCCCCC", borderRadius: 0 },
  { id: "button_text", type: "text", x: 50, y: 50, width: 100, height: 20, text: "CLICK HERE", fontSize: 12, fontWeight: 400, color: "#000000", align: "left" }
];
console.log("Q3 Incorrect Color & Position Score:", evaluateTask(q3Wrong, expectedAnswers.task_03).score, "/ 10");
