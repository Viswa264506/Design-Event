import { tasksData } from '../src/data/tasks.js';

// Comprehensive 5-Category Evaluator for 10 Competition Tasks
export function evaluateTask5Category(taskId, studentElements, expectedElements, initialElements = []) {
  const student = studentElements || [];
  const expected = expectedElements || [];
  const initial = initialElements || [];

  // Attempt detection: Compare student state to initial elements state
  const isModified = JSON.stringify(student) !== JSON.stringify(initial) || student.length !== initial.length;

  if (!isModified) {
    return {
      score: 0.0,
      details: {
        attempted: false,
        feedback: 'Not attempted.',
        categories: []
      }
    };
  }

  const categoryScores = [];
  let totalScore = 0;

  const getStudentColor = (el) => (el?.color || el?.backgroundColor || '').toUpperCase();
  const getExpectedColor = (el) => (el?.color || el?.backgroundColor || '').toUpperCase();

  // Task-specific 5-Category Evaluation Logic
  switch (taskId) {
    case 'task_01': {
      // Logo Placement: 1. Identity, 2. Position, 3. Size, 4. Aspect Ratio, 5. Margins
      const logoEl = student.find(e => e.id === 'logo_element');
      const expLogo = expected.find(e => e.id === 'logo_element') || { x: 690, y: 30, width: 80, height: 80 };

      // Cat 1: Logo Identity
      const cat1 = logoEl && logoEl.type === 'image' ? 2.0 : 0.0;
      categoryScores.push({ name: 'Logo Identity', score: cat1 });

      // Cat 2: Position
      let cat2 = 0.0;
      if (logoEl) {
        const diffX = Math.abs(logoEl.x - expLogo.x);
        const diffY = Math.abs(logoEl.y - expLogo.y);
        if (diffX <= 3 && diffY <= 3) cat2 = 2.0;
        else if (diffX <= 10 && diffY <= 10) cat2 = 1.0;
        else if (diffX <= 20 || diffY <= 20) cat2 = 0.5;
      }
      categoryScores.push({ name: 'Position', score: cat2 });

      // Cat 3: Size
      let cat3 = 0.0;
      if (logoEl) {
        const diffW = Math.abs(logoEl.width - expLogo.width);
        const diffH = Math.abs(logoEl.height - expLogo.height);
        if (diffW <= 3 && diffH <= 3) cat3 = 2.0;
        else if (diffW <= 10 && diffH <= 10) cat3 = 1.0;
        else if (diffW <= 20 || diffH <= 20) cat3 = 0.5;
      }
      categoryScores.push({ name: 'Size', score: cat3 });

      // Cat 4: Aspect Ratio
      let cat4 = 0.0;
      if (logoEl && logoEl.height > 0) {
        const ratio = logoEl.width / logoEl.height;
        if (Math.abs(ratio - 1.0) <= 0.05) cat4 = 2.0;
        else if (Math.abs(ratio - 1.0) <= 0.2) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Aspect Ratio', score: cat4 });

      // Cat 5: Margin Precision (Top = 30px, Right = 30px -> X = 690, Y = 30 on 800x600 canvas)
      let cat5 = 0.0;
      if (logoEl) {
        const rightMargin = 800 - (logoEl.x + logoEl.width);
        const topMargin = logoEl.y;
        if (Math.abs(rightMargin - 30) <= 3 && Math.abs(topMargin - 30) <= 3) cat5 = 2.0;
        else if (Math.abs(rightMargin - 30) <= 10 && Math.abs(topMargin - 30) <= 10) cat5 = 1.0;
      }
      categoryScores.push({ name: 'Margin Precision', score: cat5 });
      break;
    }

    case 'task_02': {
      // Typography: 1. Content, 2. Font Family, 3. Font Size, 4. Font Weight, 5. Alignment & Position
      const txt = student.find(e => e.id === 'heading_text');
      const expTxt = expected.find(e => e.id === 'heading_text') || { x: 200, y: 100, width: 400, height: 50, text: 'DESIGN WITH PURPOSE', fontSize: 32, fontWeight: 700, color: '#1E40AF', align: 'center' };

      // Cat 1: Text Content
      let cat1 = 0.0;
      if (txt && txt.text) {
        if (txt.text.trim().toLowerCase() === expTxt.text.toLowerCase()) cat1 = 2.0;
        else if (txt.text.trim().toLowerCase().includes(expTxt.text.toLowerCase())) cat1 = 1.0;
      }
      categoryScores.push({ name: 'Text Content', score: cat1 });

      // Cat 2: Font Family
      let cat2 = 0.0;
      if (txt && (txt.fontFamily || 'Inter').toLowerCase().includes('inter')) cat2 = 2.0;
      categoryScores.push({ name: 'Font Family', score: cat2 });

      // Cat 3: Font Size
      let cat3 = 0.0;
      if (txt && txt.fontSize) {
        if (Math.abs(txt.fontSize - expTxt.fontSize) <= 2) cat3 = 2.0;
        else if (Math.abs(txt.fontSize - expTxt.fontSize) <= 6) cat3 = 1.0;
      }
      categoryScores.push({ name: 'Font Size', score: cat3 });

      // Cat 4: Font Weight
      let cat4 = 0.0;
      if (txt && Number(txt.fontWeight) === Number(expTxt.fontWeight)) cat4 = 2.0;
      else if (txt && Number(txt.fontWeight) >= 600) cat4 = 1.0;
      categoryScores.push({ name: 'Font Weight', score: cat4 });

      // Cat 5: Alignment & Position
      let cat5 = 0.0;
      if (txt) {
        const alignMatch = txt.align === expTxt.align;
        const posMatch = Math.abs(txt.x - expTxt.x) <= 10 && Math.abs(txt.y - expTxt.y) <= 10;
        if (alignMatch && posMatch) cat5 = 2.0;
        else if (alignMatch || posMatch) cat5 = 1.0;
      }
      categoryScores.push({ name: 'Alignment & Position', score: cat5 });
      break;
    }

    case 'task_03': {
      // Button Design: 1. Structure, 2. Position, 3. Dimensions, 4. Appearance, 5. Button Text
      const base = student.find(e => e.id === 'button_base');
      const text = student.find(e => e.id === 'button_text');

      // Cat 1: Button Structure
      const cat1 = base && text && base.type === 'rectangle' && text.type === 'text' ? 2.0 : (base || text ? 1.0 : 0.0);
      categoryScores.push({ name: 'Button Structure', score: cat1 });

      // Cat 2: Position
      let cat2 = 0.0;
      if (base) {
        if (Math.abs(base.x - 310) <= 5 && Math.abs(base.y - 270) <= 5) cat2 = 2.0;
        else if (Math.abs(base.x - 310) <= 15 && Math.abs(base.y - 270) <= 15) cat2 = 1.0;
      }
      categoryScores.push({ name: 'Position', score: cat2 });

      // Cat 3: Dimensions
      let cat3 = 0.0;
      if (base) {
        if (Math.abs(base.width - 180) <= 5 && Math.abs(base.height - 50) <= 5) cat3 = 2.0;
        else if (Math.abs(base.width - 180) <= 15 && Math.abs(base.height - 50) <= 15) cat3 = 1.0;
      }
      categoryScores.push({ name: 'Dimensions', score: cat3 });

      // Cat 4: Appearance (Fill Color #2563EB, Border Radius 10)
      let cat4 = 0.0;
      if (base) {
        const colMatch = getStudentColor(base) === '#2563EB';
        const radMatch = Math.abs((base.borderRadius || 0) - 10) <= 2;
        if (colMatch && radMatch) cat4 = 2.0;
        else if (colMatch || radMatch) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Appearance', score: cat4 });

      // Cat 5: Button Text ("REGISTER NOW")
      let cat5 = 0.0;
      if (text) {
        const textMatch = (text.text || '').trim().toUpperCase() === 'REGISTER NOW';
        const textCol = getStudentColor(text) === '#FFFFFF';
        if (textMatch && textCol) cat5 = 2.0;
        else if (textMatch) cat5 = 1.0;
      }
      categoryScores.push({ name: 'Button Text', score: cat5 });
      break;
    }

    case 'task_04': {
      // Image Positioning: 1. Identity, 2. Position, 3. Dimensions, 4. Aspect Ratio, 5. Alignment
      const img = student.find(e => e.id === 'hero_image');

      const cat1 = img && img.type === 'image' ? 2.0 : 0.0;
      categoryScores.push({ name: 'Image Identity', score: cat1 });

      let cat2 = 0.0;
      if (img) {
        if (Math.abs(img.x - 200) <= 5 && Math.abs(img.y - 150) <= 5) cat2 = 2.0;
        else if (Math.abs(img.x - 200) <= 15 && Math.abs(img.y - 150) <= 15) cat2 = 1.0;
      }
      categoryScores.push({ name: 'Position', score: cat2 });

      let cat3 = 0.0;
      if (img) {
        if (Math.abs(img.width - 400) <= 5 && Math.abs(img.height - 300) <= 5) cat3 = 2.0;
        else if (Math.abs(img.width - 400) <= 15 && Math.abs(img.height - 300) <= 15) cat3 = 1.0;
      }
      categoryScores.push({ name: 'Dimensions', score: cat3 });

      let cat4 = 0.0;
      if (img && img.height > 0) {
        const ratio = img.width / img.height;
        if (Math.abs(ratio - (400 / 300)) <= 0.05) cat4 = 2.0;
        else if (Math.abs(ratio - (400 / 300)) <= 0.2) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Aspect Ratio', score: cat4 });

      let cat5 = 0.0;
      if (img) {
        const centerX = img.x + img.width / 2;
        if (Math.abs(centerX - 400) <= 10) cat5 = 2.0;
        else if (Math.abs(centerX - 400) <= 30) cat5 = 1.0;
      }
      categoryScores.push({ name: 'Alignment', score: cat5 });
      break;
    }

    case 'task_05': {
      // Text & Spacing: 1. Heading, 2. Subtitle, 3. Typography, 4. Spacing, 5. Alignment
      const head = student.find(e => e.id === 'heading_elem');
      const sub = student.find(e => e.id === 'subtitle_elem');

      let cat1 = head && (head.text || '').trim().toUpperCase() === 'CREATIVE PORTFOLIO' ? 2.0 : (head ? 1.0 : 0.0);
      categoryScores.push({ name: 'Heading', score: cat1 });

      let cat2 = sub && (sub.text || '').trim().toUpperCase() === 'SHOWCASING MODERN DESIGN EXCELLENCE' ? 2.0 : (sub ? 1.0 : 0.0);
      categoryScores.push({ name: 'Subtitle', score: cat2 });

      let cat3 = 0.0;
      if (head && sub) {
        const headSize = Math.abs((head.fontSize || 0) - 36) <= 2;
        const subSize = Math.abs((sub.fontSize || 0) - 18) <= 2;
        if (headSize && subSize) cat3 = 2.0;
        else if (headSize || subSize) cat3 = 1.0;
      }
      categoryScores.push({ name: 'Typography', score: cat3 });

      // Spacing (Y gap between bottom of heading Y=180+50=230 and Y of subtitle Y=250 -> 20px gap)
      let cat4 = 0.0;
      if (head && sub) {
        const gap = sub.y - (head.y + head.height);
        if (Math.abs(gap - 20) <= 4) cat4 = 2.0;
        else if (Math.abs(gap - 20) <= 10) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Spacing', score: cat4 });

      let cat5 = 0.0;
      if (head && sub) {
        if (head.align === 'center' && sub.align === 'center') cat5 = 2.0;
        else if (head.align === 'center' || sub.align === 'center') cat5 = 1.0;
      }
      categoryScores.push({ name: 'Alignment', score: cat5 });
      break;
    }

    case 'task_06': {
      // Card Alignment: 1. Card Count, 2. Equal Dimensions, 3. Horizontal Layout, 4. Equal Spacing, 5. Alignment & Consistency
      const c1 = student.find(e => e.id === 'card_1');
      const c2 = student.find(e => e.id === 'card_2');
      const c3 = student.find(e => e.id === 'card_3');

      const count = [c1, c2, c3].filter(Boolean).length;
      const cat1 = count === 3 ? 2.0 : (count * 0.6);
      categoryScores.push({ name: 'Card Count', score: cat1 });

      let cat2 = 0.0;
      if (c1 && c2 && c3) {
        const sameW = Math.abs(c1.width - c2.width) <= 2 && Math.abs(c2.width - c3.width) <= 2;
        const sameH = Math.abs(c1.height - c2.height) <= 2 && Math.abs(c2.height - c3.height) <= 2;
        if (sameW && sameH) cat2 = 2.0;
        else if (sameW || sameH) cat2 = 1.0;
      }
      categoryScores.push({ name: 'Equal Dimensions', score: cat2 });

      let cat3 = 0.0;
      if (c1 && c2 && c3) {
        if (c1.x < c2.x && c2.x < c3.x) cat3 = 2.0;
      }
      categoryScores.push({ name: 'Horizontal Layout', score: cat3 });

      let cat4 = 0.0;
      if (c1 && c2 && c3) {
        const gap1 = c2.x - (c1.x + c1.width);
        const gap2 = c3.x - (c2.x + c2.width);
        if (Math.abs(gap1 - 50) <= 5 && Math.abs(gap2 - 50) <= 5) cat4 = 2.0;
        else if (Math.abs(gap1 - gap2) <= 8) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Equal Spacing', score: cat4 });

      let cat5 = 0.0;
      if (c1 && c2 && c3) {
        const sameY = Math.abs(c1.y - c2.y) <= 3 && Math.abs(c2.y - c3.y) <= 3;
        if (sameY) cat5 = 2.0;
        else if (Math.abs(c1.y - c2.y) <= 10) cat5 = 1.0;
      }
      categoryScores.push({ name: 'Alignment & Consistency', score: cat5 });
      break;
    }

    case 'task_07': {
      // Colour & Layout: 1. Banner Structure, 2. Position & Dimensions, 3. Background Colour, 4. Text & Text Colour, 5. Alignment & Spacing
      const bg = student.find(e => e.id === 'banner_bg');
      const title = student.find(e => e.id === 'banner_title');
      const sub = student.find(e => e.id === 'banner_sub');

      const count = [bg, title, sub].filter(Boolean).length;
      const cat1 = count === 3 ? 2.0 : (count * 0.6);
      categoryScores.push({ name: 'Banner Structure', score: cat1 });

      let cat2 = 0.0;
      if (bg) {
        const posMatch = Math.abs(bg.x - 50) <= 5 && Math.abs(bg.y - 100) <= 5;
        const dimMatch = Math.abs(bg.width - 700) <= 5 && Math.abs(bg.height - 220) <= 5;
        if (posMatch && dimMatch) cat2 = 2.0;
        else if (posMatch || dimMatch) cat2 = 1.0;
      }
      categoryScores.push({ name: 'Position & Dimensions', score: cat2 });

      let cat3 = 0.0;
      if (bg) {
        if (getStudentColor(bg) === '#4F46E5') cat3 = 2.0;
        else if (getStudentColor(bg).length > 0) cat3 = 1.0;
      }
      categoryScores.push({ name: 'Background Colour', score: cat3 });

      let cat4 = 0.0;
      if (title && sub) {
        const titleMatch = (title.text || '').trim().toUpperCase() === 'SUMMER DESIGN SALE' && getStudentColor(title) === '#FFFFFF';
        const subMatch = (sub.text || '').trim().toUpperCase() === 'UP TO 50% OFF ALL COURSES' && getStudentColor(sub) === '#FDE047';
        if (titleMatch && subMatch) cat4 = 2.0;
        else if (titleMatch || subMatch) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Text & Text Colour', score: cat4 });

      let cat5 = 0.0;
      if (title && sub) {
        if (title.align === 'center' && sub.align === 'center') cat5 = 2.0;
        else if (title.align === 'center' || sub.align === 'center') cat5 = 1.0;
      }
      categoryScores.push({ name: 'Alignment & Spacing', score: cat5 });
      break;
    }

    case 'task_08': {
      // Profile Card: 1. Card Structure, 2. Image, 3. Text, 4. Button, 5. Spacing & Alignment
      const bg = student.find(e => e.id === 'profile_card_bg');
      const img = student.find(e => e.id === 'profile_img');
      const name = student.find(e => e.id === 'profile_name');
      const desc = student.find(e => e.id === 'profile_desc');
      const btnBg = student.find(e => e.id === 'profile_btn_bg');
      const btnTxt = student.find(e => e.id === 'profile_btn_text');

      const cat1 = bg && bg.type === 'rectangle' ? 2.0 : 0.0;
      categoryScores.push({ name: 'Card Structure', score: cat1 });

      let cat2 = 0.0;
      if (img && img.type === 'image') {
        if (Math.abs(img.x - 340) <= 10 && Math.abs(img.y - 130) <= 10) cat2 = 2.0;
        else cat2 = 1.0;
      }
      categoryScores.push({ name: 'Image', score: cat2 });

      let cat3 = 0.0;
      if (name && desc) {
        const nameOk = (name.text || '').includes('Alex Morgan');
        const descOk = (desc.text || '').includes('Lead UI/UX Designer');
        if (nameOk && descOk) cat3 = 2.0;
        else if (nameOk || descOk) cat3 = 1.0;
      }
      categoryScores.push({ name: 'Text', score: cat3 });

      let cat4 = 0.0;
      if (btnBg && btnTxt) {
        const btnCol = getStudentColor(btnBg) === '#2563EB';
        const txtOk = (btnTxt.text || '').trim().toUpperCase() === 'CONNECT';
        if (btnCol && txtOk) cat4 = 2.0;
        else if (btnCol || txtOk) cat4 = 1.0;
      }
      categoryScores.push({ name: 'Button', score: cat4 });

      let cat5 = 0.0;
      if (bg && img && name) {
        const centered = Math.abs((img.x + img.width / 2) - (bg.x + bg.width / 2)) <= 10;
        if (centered) cat5 = 2.0;
        else cat5 = 1.0;
      }
      categoryScores.push({ name: 'Spacing & Alignment', score: cat5 });
      break;
    }

    case 'task_09': {
      // Landing Page: 1. Overall Structure, 2. Header / Nav, 3. Typography / Content, 4. Image & CTA, 5. Layout & Spacing
      const navBg = student.find(e => e.id === 'nav_bg');
      const logo = student.find(e => e.id === 'nav_logo');
      const title = student.find(e => e.id === 'hero_title');
      const desc = student.find(e => e.id === 'hero_desc');
      const ctaBg = student.find(e => e.id === 'hero_cta_bg');
      const graphic = student.find(e => e.id === 'hero_graphic');

      const count = [navBg, logo, title, desc, ctaBg, graphic].filter(Boolean).length;
      const cat1 = count >= 5 ? 2.0 : (count * 0.4);
      categoryScores.push({ name: 'Overall Structure', score: cat1 });

      let cat2 = 0.0;
      if (navBg && logo) {
        if (getStudentColor(navBg) === '#1E293B' && logo.type === 'image') cat2 = 2.0;
        else cat2 = 1.0;
      }
      categoryScores.push({ name: 'Header / Navigation', score: cat2 });

      let cat3 = 0.0;
      if (title && desc) {
        const titleMatch = (title.text || '').toLowerCase().includes('build better products');
        if (titleMatch) cat3 = 2.0;
        else cat3 = 1.0;
      }
      categoryScores.push({ name: 'Typography / Content', score: cat3 });

      let cat4 = 0.0;
      if (graphic && ctaBg) {
        if (graphic.type === 'image' && getStudentColor(ctaBg) === '#2563EB') cat4 = 2.0;
        else cat4 = 1.0;
      }
      categoryScores.push({ name: 'Image & CTA', score: cat4 });

      let cat5 = 0.0;
      if (navBg && title && graphic) {
        if (navBg.y < title.y && title.x < graphic.x) cat5 = 2.0;
        else cat5 = 1.0;
      }
      categoryScores.push({ name: 'Layout & Spacing', score: cat5 });
      break;
    }

    case 'task_10': {
      // Pixel-Perfect Poster: 1. Element Presence, 2. Position, 3. Dimensions & Proportions, 4. Typography, 5. Visual Appearance
      const header = student.find(e => e.id === 'full_header_bg');
      const title = student.find(e => e.id === 'full_title');
      const logo = student.find(e => e.id === 'full_logo');
      const divider = student.find(e => e.id === 'full_divider');
      const illus = student.find(e => e.id === 'full_illustration');
      const box = student.find(e => e.id === 'full_box');
      const ctaBg = student.find(e => e.id === 'full_cta_bg');

      const count = [header, title, logo, divider, illus, box, ctaBg].filter(Boolean).length;
      const cat1 = count >= 6 ? 2.0 : (count * 0.3);
      categoryScores.push({ name: 'Element Presence', score: cat1 });

      let cat2 = 0.0;
      if (header) {
        if (Math.abs(header.x - 40) <= 10 && Math.abs(header.y - 30) <= 10) cat2 = 2.0;
        else cat2 = 1.0;
      }
      categoryScores.push({ name: 'Position', score: cat2 });

      let cat3 = 0.0;
      if (header && divider) {
        if (Math.abs(header.width - 720) <= 10 && Math.abs(divider.width - 720) <= 10) cat3 = 2.0;
        else cat3 = 1.0;
      }
      categoryScores.push({ name: 'Dimensions & Proportions', score: cat3 });

      let cat4 = 0.0;
      if (title) {
        if ((title.text || '').toUpperCase().includes('DESIGN PRECISION CHAMPIONSHIP')) cat4 = 2.0;
        else cat4 = 1.0;
      }
      categoryScores.push({ name: 'Typography', score: cat4 });

      let cat5 = 0.0;
      if (header && ctaBg) {
        if (getStudentColor(header) === '#0F172A' && getStudentColor(ctaBg) === '#10B981') cat5 = 2.0;
        else cat5 = 1.0;
      }
      categoryScores.push({ name: 'Visual Appearance', score: cat5 });
      break;
    }

    default: {
      return { score: 0.0, details: { attempted: false, feedback: 'Unknown task ID.', categories: [] } };
    }
  }

  totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);

  return {
    score: parseFloat(totalScore.toFixed(2)),
    details: {
      attempted: true,
      feedback: totalScore >= 9.9 ? 'Matches expected layout guidelines.' : 'Evaluated successfully.',
      categories: categoryScores
    }
  };
}
