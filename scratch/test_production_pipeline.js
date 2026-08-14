import { tasksData } from '../src/data/tasks.js';
import { evaluateTask5Category } from './test_5category_evaluator.js';

// Target Layouts (Database task_answers target_layout.elements)
const targetAnswers = {
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
    { id: "full_box", "type": "rectangle", x: 460, y: 170, width: 300, height: 260, color: "#F1F5F9", borderRadius: 12 },
    { id: "full_box_title", type: "text", x: 480, y: 190, width: 260, height: 35, text: "Key Highlights", fontSize: 18, fontWeight: 700, color: "#0F172A", align: "left" },
    { id: "full_box_text", type: "text", x: 480, y: 230, width: 260, height: 120, text: "• 100% Automated Scoring\n• Live Leaderboard Updates\n• Certificate of Excellence", fontSize: 14, fontWeight: 500, color: "#334155", align: "left" },
    { id: "full_cta_bg", type: "rectangle", x: 280, y: 460, width: 240, height: 50, color: "#10B981", borderRadius: 25 },
    { id: "full_cta_text", type: "text", x: 280, y: 472, width: 240, height: 30, text: "SUBMIT FINAL DESIGN", fontSize: 15, fontWeight: 700, color: "#FFFFFF", align: "center" }
  ]
};

// Simulate Edge Function Request Body Parsing
function simulateEdgeFunction(bodyPayload) {
  const rawDesignJson = bodyPayload.designJson ?? bodyPayload;
  const submittedDesigns = rawDesignJson?.designs ?? rawDesignJson ?? {};
  const initialDesignsPayload = rawDesignJson?.initialDesigns ?? bodyPayload.initialDesigns ?? {};

  let totalScore = 0;
  const results = {};

  tasksData.forEach(task => {
    const taskId = task.id;
    const expectedElements = targetAnswers[taskId] || [];
    const initialElements = initialDesignsPayload[taskId] || task.public_config?.initialElements || [];
    const studentElements = submittedDesigns[taskId] || [];

    const evalRes = evaluateTask5Category(taskId, studentElements, expectedElements, initialElements);
    results[taskId] = {
      score: evalRes.score,
      studentLength: studentElements.length,
      initialLength: initialElements.length,
      attempted: evalRes.details.attempted,
      feedback: evalRes.details.feedback
    };
    totalScore += evalRes.score;
  });

  return { totalScore, results };
}

// Build initial challenge state
const initialChallengeState = {};
tasksData.forEach(t => {
  initialChallengeState[t.id] = t.public_config?.initialElements || [];
});

console.log("=== PRODUCTION PIPELINE TEST 1: UNTOUCHED SUBMISSION ===");
const p1Res = simulateEdgeFunction({
  designJson: initialChallengeState,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-1"
});
console.log(`Total Score: ${p1Res.totalScore} / 100 | Q1 attempted: ${p1Res.results.task_01.attempted} (studentLength: ${p1Res.results.task_01.studentLength})\n`);

console.log("=== PRODUCTION PIPELINE TEST 2: PERFECT Q1 ONLY ===");
const q1State = JSON.parse(JSON.stringify(initialChallengeState));
q1State.task_01 = [{ id: "logo_element", type: "image", x: 690, y: 30, width: 80, height: 80, url: "/assets/logo.png", aspectRatioLocked: true, name: "College Logo" }];

const p2Res = simulateEdgeFunction({
  designJson: q1State,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-2"
});
console.log(`Total Score: ${p2Res.totalScore} / 100`);
console.log(`Q1 Score: ${p2Res.results.task_01.score}/10 | Attempted: ${p2Res.results.task_01.attempted} | studentLength: ${p2Res.results.task_01.studentLength}`);
console.log(`Q2 Score: ${p2Res.results.task_02.score}/10 | Attempted: ${p2Res.results.task_02.attempted} | studentLength: ${p2Res.results.task_02.studentLength}\n`);

console.log("=== PRODUCTION PIPELINE TEST 3: PERFECT Q3 ONLY ===");
const q3State = JSON.parse(JSON.stringify(initialChallengeState));
q3State.task_03 = [
  { id: "button_base", type: "rectangle", x: 310, y: 270, width: 180, height: 50, color: "#2563EB", backgroundColor: "#2563EB", borderRadius: 10, name: "Button Base" },
  { id: "button_text", type: "text", x: 310, y: 280, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, fontFamily: "Inter", color: "#FFFFFF", align: "center", name: "Button Text" }
];
const p3Res = simulateEdgeFunction({
  designJson: q3State,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-3"
});
console.log(`Total Score: ${p3Res.totalScore} / 100`);
console.log(`Q3 Score: ${p3Res.results.task_03.score}/10 | Attempted: ${p3Res.results.task_03.attempted} | studentLength: ${p3Res.results.task_03.studentLength}\n`);

console.log("=== PRODUCTION PIPELINE TEST 4: PARTIAL Q3 ===");
const q3PartialState = JSON.parse(JSON.stringify(initialChallengeState));
q3PartialState.task_03 = [
  { id: "button_base", type: "rectangle", x: 100, y: 100, width: 180, height: 50, color: "#2563EB", backgroundColor: "#2563EB", borderRadius: 10 },
  { id: "button_text", type: "text", x: 100, y: 110, width: 180, height: 30, text: "REGISTER NOW", fontSize: 16, fontWeight: 700, color: "#FFFFFF", align: "center" }
];
const p4Res = simulateEdgeFunction({
  designJson: q3PartialState,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-4"
});
console.log(`Total Score: ${p4Res.totalScore} / 100`);
console.log(`Partial Q3 Score: ${p4Res.results.task_03.score}/10 | Attempted: ${p4Res.results.task_03.attempted}\n`);

console.log("=== PRODUCTION PIPELINE TEST 5: PERFECT Q7 ONLY ===");
const q7State = JSON.parse(JSON.stringify(initialChallengeState));
q7State.task_07 = targetAnswers.task_07;
const p5Res = simulateEdgeFunction({
  designJson: q7State,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-5"
});
console.log(`Total Score: ${p5Res.totalScore} / 100`);
console.log(`Q7 Score: ${p5Res.results.task_07.score}/10 | Attempted: ${p5Res.results.task_07.attempted}\n`);

console.log("=== PRODUCTION PIPELINE TEST 6: PERFECT Q8 MULTI-ELEMENT ===");
const q8State = JSON.parse(JSON.stringify(initialChallengeState));
q8State.task_08 = targetAnswers.task_08;
const p6Res = simulateEdgeFunction({
  designJson: q8State,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-6"
});
console.log(`Total Score: ${p6Res.totalScore} / 100`);
console.log(`Q8 Score: ${p6Res.results.task_08.score}/10 | Attempted: ${p6Res.results.task_08.attempted} | studentLength: ${p6Res.results.task_08.studentLength}\n`);

console.log("=== PRODUCTION PIPELINE TEST 7: WRONG Q1 POSITION (x=100, y=100) ===");
const q1WrongState = JSON.parse(JSON.stringify(initialChallengeState));
q1WrongState.task_01 = [{ id: "logo_element", type: "image", x: 100, y: 100, width: 80, height: 80 }];
const p7Res = simulateEdgeFunction({
  designJson: q1WrongState,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-7"
});
console.log(`Total Score: ${p7Res.totalScore} / 100`);
console.log(`Wrong Q1 Score: ${p7Res.results.task_01.score}/10 | Attempted: ${p7Res.results.task_01.attempted}\n`);

console.log("=== PRODUCTION PIPELINE TEST 8: MIXED SUBMISSION (Q1 Perfect, Q3 Partial, Q7 Perfect) ===");
const mixedState = JSON.parse(JSON.stringify(initialChallengeState));
mixedState.task_01 = q1State.task_01;
mixedState.task_03 = q3PartialState.task_03;
mixedState.task_07 = q7State.task_07;
const p8Res = simulateEdgeFunction({
  designJson: mixedState,
  initialDesigns: initialChallengeState,
  sessionId: "test-session-8"
});
console.log(`Mixed Submission Total Score: ${p8Res.totalScore} / 100`);
console.log(`Q1: ${p8Res.results.task_01.score}/10, Q2: ${p8Res.results.task_02.score}/10, Q3: ${p8Res.results.task_03.score}/10, Q7: ${p8Res.results.task_07.score}/10`);
