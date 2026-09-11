import { tasksData } from '../src/data/tasks.js';
import { evaluateTask5Category } from './test_5category_evaluator.js';

// Target Layouts
const expectedAnswers = {
  task_01: [{ id: "logo_element", type: "image", x: 690, y: 30, width: 80, height: 80 }],
  task_02: [{ id: "heading_text", type: "text", x: 200, y: 100, width: 400, height: 50, text: "DESIGN WITH PURPOSE", fontSize: 32, fontWeight: 700, color: "#1E40AF", align: "center" }],
  task_03: [
    { id: "button_base", type: "rectangle", x: 310, y: 270, width: 180, height: 50, color: "#2563EB", borderRadius: 10 },
    { id: "button_text", type: "text", x: 310, y: 280, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, color: "#FFFFFF", align: "center" }
  ],
  task_04: [{ id: "hero_image", type: "image", x: 200, y: 150, width: 400, height: 300 }],
  task_05: [
    { id: "heading_elem", type: "text", x: 150, y: 180, width: 500, height: 50, text: "CREATIVE PORTFOLIO", fontSize: 36, fontWeight: 700, color: "#111827", align: "center" },
    { id: "subtitle_elem", type: "text", x: 150, y: 250, width: 500, height: 35, text: "Showcasing Modern Design Excellence", fontSize: 18, fontWeight: 500, color: "#4B5563", align: "center" }
  ],
  task_06: [
    { id: "card_1", type: "rectangle", x: 50, y: 160, width: 200, height: 280, color: "#EEF2FF", borderRadius: 12 },
    { id: "card_2", type: "rectangle", x: 300, y: 160, width: 200, height: 280, color: "#EEF2FF", borderRadius: 12 },
    { id: "card_3", type: "rectangle", x: 550, y: 160, width: 200, height: 280, color: "#EEF2FF", borderRadius: 12 }
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
  ],
  task_09: [
    { id: "nav_bg", type: "rectangle", x: 40, y: 40, width: 720, height: 60, color: "#1E293B", borderRadius: 8 },
    { id: "nav_logo", type: "image", x: 60, y: 50, width: 100, height: 40 },
    { id: "nav_menu", type: "text", x: 450, y: 55, width: 280, height: 30, text: "Home   Features   Pricing   Contact", fontSize: 13, fontWeight: 500, color: "#FFFFFF", align: "right" },
    { id: "hero_title", type: "text", x: 40, y: 150, width: 380, height: 80, text: "Build Better Products Faster", fontSize: 30, fontWeight: 700, color: "#0F172A", align: "left" },
    { id: "hero_desc", type: "text", x: 40, y: 240, width: 380, height: 70, text: "Streamline your workflow with our modern design platform built for high-performing creative teams.", fontSize: 14, fontWeight: 400, color: "#475569", align: "left" },
    { id: "hero_cta_bg", type: "rectangle", x: 40, y: 330, width: 160, height: 45, color: "#2563EB", borderRadius: 8 },
    { id: "hero_cta_text", type: "text", x: 40, y: 340, width: 160, height: 25, text: "Get Started", fontSize: 14, fontWeight: 700, color: "#FFFFFF", align: "center" },
    { id: "hero_graphic", type: "image", x: 450, y: 140, width: 310, height: 240 }
  ],
  task_10: [
    { id: "full_header_bg", type: "rectangle", x: 40, y: 30, width: 720, height: 100, color: "#0F172A", borderRadius: 12 },
    { id: "full_title", type: "text", x: 60, y: 50, width: 500, height: 60, text: "DESIGN PRECISION CHAMPIONSHIP 2026", fontSize: 24, fontWeight: 700, color: "#38BDF8", align: "left" },
    { id: "full_logo", type: "image", x: 650, y: 45, width: 90, height: 70 },
    { id: "full_divider", type: "rectangle", x: 40, y: 145, width: 720, height: 6, color: "#F59E0B", borderRadius: 3 },
    { id: "full_illustration", type: "image", x: 40, y: 170, width: 400, height: 260 },
    { id: "full_box", type: "rectangle", x: 460, y: 170, width: 300, height: 260, color: "#F1F5F9", borderRadius: 12 },
    { id: "full_box_title", type: "text", x: 480, y: 190, width: 260, height: 35, text: "Key Highlights", fontSize: 18, fontWeight: 700, color: "#0F172A", align: "left" },
    { id: "full_box_text", type: "text", x: 480, y: 230, width: 260, height: 120, text: "• 100% Automated Scoring\n• Live Leaderboard Updates\n• Certificate of Excellence", fontSize: 14, fontWeight: 500, color: "#334155", align: "left" },
    { id: "full_cta_bg", type: "rectangle", x: 280, y: 460, width: 240, height: 50, color: "#10B981", borderRadius: 25 },
    { id: "full_cta_text", type: "text", x: 280, y: 472, width: 240, height: 30, text: "SUBMIT FINAL DESIGN", fontSize: 15, fontWeight: 700, color: "#FFFFFF", align: "center" }
  ]
};

console.log("=== TEST A: COMPLETELY UNATTEMPTED SUBMISSION ===");
let testATotal = 0;
tasksData.forEach(t => {
  const initial = t.public_config.initialElements;
  const res = evaluateTask5Category(t.id, initial, expectedAnswers[t.id], initial);
  testATotal += res.score;
  console.log(`${t.id} score: ${res.score} / 10 | Attempted: ${res.details.attempted} | Feedback: ${res.details.feedback}`);
});
console.log(`Test A Total Score: ${testATotal} / 100 (Expected: 0 / 100)\n`);

console.log("=== TEST B: PERFECT Q1 ONLY ===");
const q1Student = [{ id: "logo_element", type: "image", x: 690, y: 30, width: 80, height: 80, url: "/assets/logo.png", aspectRatioLocked: true, name: "College Logo" }];
const q1Init = tasksData.find(t => t.id === 'task_01').public_config.initialElements;
const resQ1B = evaluateTask5Category('task_01', q1Student, expectedAnswers.task_01, q1Init);
console.log(`Q1 Score: ${resQ1B.score} / 10 | Categories:`, resQ1B.details.categories);

console.log("\n=== TEST C: PERFECT Q3 ONLY ===");
const q3Student = [
  { id: "button_base", type: "rectangle", x: 310, y: 270, width: 180, height: 50, color: "#2563EB", backgroundColor: "#2563EB", borderRadius: 10, name: "Button Base" },
  { id: "button_text", type: "text", x: 310, y: 280, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, fontFamily: "Inter", color: "#FFFFFF", align: "center", name: "Button Text" }
];
const q3Init = tasksData.find(t => t.id === 'task_03').public_config.initialElements;
const resQ3C = evaluateTask5Category('task_03', q3Student, expectedAnswers.task_03, q3Init);
console.log(`Q3 Score: ${resQ3C.score} / 10 | Categories:`, resQ3C.details.categories);

console.log("\n=== TEST D: PARTIAL Q3 ===");
// Partial Q3: wrong position (x=100, y=100), but correct structure, dimensions, appearance, text
const q3Partial = [
  { id: "button_base", type: "rectangle", x: 100, y: 100, width: 180, height: 50, color: "#2563EB", backgroundColor: "#2563EB", borderRadius: 10 },
  { id: "button_text", type: "text", x: 100, y: 110, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, color: "#FFFFFF", align: "center" }
];
const resQ3D = evaluateTask5Category('task_03', q3Partial, expectedAnswers.task_03, q3Init);
console.log(`Partial Q3 Score: ${resQ3D.score} / 10 | Categories:`, resQ3D.details.categories);

console.log("\n=== TEST E: PERFECT Q7 ===");
const q7Student = expectedAnswers.task_07;
const q7Init = tasksData.find(t => t.id === 'task_07').public_config.initialElements;
const resQ7E = evaluateTask5Category('task_07', q7Student, expectedAnswers.task_07, q7Init);
console.log(`Q7 Score: ${resQ7E.score} / 10 | Categories:`, resQ7E.details.categories);

console.log("\n=== TEST F: MULTI-ELEMENT Q8 PERFECT ===");
const q8Student = expectedAnswers.task_08;
const q8Init = tasksData.find(t => t.id === 'task_08').public_config.initialElements;
const resQ8F = evaluateTask5Category('task_08', q8Student, expectedAnswers.task_08, q8Init);
console.log(`Q8 Score: ${resQ8F.score} / 10 | Categories:`, resQ8F.details.categories);

console.log("\n=== TEST G: WRONG SUBMISSION (Q1 x=100, y=100) ===");
const q1Wrong = [{ id: "logo_element", type: "image", x: 100, y: 100, width: 80, height: 80 }];
const resQ1G = evaluateTask5Category('task_01', q1Wrong, expectedAnswers.task_01, q1Init);
console.log(`Wrong Q1 Score: ${resQ1G.score} / 10 | Categories:`, resQ1G.details.categories);
