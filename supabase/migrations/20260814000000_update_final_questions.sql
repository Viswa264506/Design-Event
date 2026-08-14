-- Migration: Update 10 Final Competition Questions and Task Answers

truncate table public.task_answers cascade;
truncate table public.tasks cascade;

insert into public.tasks (id, title, instruction, reference_asset, max_points, public_config) values
('task_01', 'Logo Placement', 'Place the given logo at the top-right corner with equal 30px margins from the top and right edges. It must be at X = 690, Y = 30, with Width = 80 and Height = 80.', null, 10, '{"allowedTypes": ["image"]}'::jsonb),
('task_02', 'Typography', 'Create the heading ''DESIGN WITH PURPOSE''. Place it at X = 200, Y = 100, Width = 400, Height = 50. Typography: Size = 32px, Weight = 700, Color = #1E40AF, Font = Inter, Alignment = center.', null, 10, '{"allowedTypes": ["text"]}'::jsonb),
('task_03', 'Button Design', 'Create a ''REGISTER NOW'' button composed of a background rectangle and text label centered inside it: 1. Button base (id: button_base): X = 310, Y = 270, Width = 180, Height = 50, Color = #2563EB, Border Radius = 10px. 2. Button text (id: button_text): X = 310, Y = 280, Width = 180, Height = 30, Text = ''REGISTER NOW'', Font Size = 16px, Font Weight = 700, Color = #FFFFFF, Alignment = center.', null, 10, '{"allowedTypes": ["rectangle", "text"]}'::jsonb),
('task_04', 'Image Positioning', 'Position and resize the provided graphic image at X = 200, Y = 150, Width = 400, Height = 300. The image must preserve its aspect ratio.', null, 10, '{"allowedTypes": ["image"]}'::jsonb),
('task_05', 'Text & Spacing', 'Position and format the heading and subtitle maintaining an exact vertical spacing gap of 20px between them: 1. Heading (id: heading_elem): X = 150, Y = 180, Width = 500, Height = 50, Text = ''CREATIVE PORTFOLIO'', Font Size = 36px, Weight = 700, Color = #111827, Alignment = center. 2. Subtitle (id: subtitle_elem): X = 150, Y = 250, Width = 500, Height = 35, Text = ''Showcasing Modern Design Excellence'', Font Size = 18px, Weight = 500, Color = #4B5563, Alignment = center.', null, 10, '{"allowedTypes": ["text"]}'::jsonb),
('task_06', 'Card Alignment', 'Create three horizontal cards with equal dimensions (Width = 200px, Height = 280px), equal gap (50px), and outer margin (50px): 1. Card 1 (id: card_1): X = 50, Y = 160, Width = 200, Height = 280, Color = #EEF2FF, Border Radius = 12px. 2. Card 2 (id: card_2): X = 300, Y = 160, Width = 200, Height = 280, Color = #EEF2FF, Border Radius = 12px. 3. Card 3 (id: card_3): X = 550, Y = 160, Width = 200, Height = 280, Color = #EEF2FF, Border Radius = 12px.', null, 10, '{"allowedTypes": ["rectangle"]}'::jsonb),
('task_07', 'Colour & Layout', 'Create a promotional banner using the specified layout, colors, and typography: 1. Banner background (id: banner_bg): X = 50, Y = 100, Width = 700, Height = 220, Color = #4F46E5, Border Radius = 16px. 2. Banner title (id: banner_title): X = 80, Y = 140, Width = 640, Height = 60, Text = ''SUMMER DESIGN SALE'', Font Size = 36px, Weight = 700, Color = #FFFFFF, Alignment = center. 3. Banner subtitle (id: banner_sub): X = 80, Y = 220, Width = 640, Height = 40, Text = ''UP TO 50% OFF ALL COURSES'', Font Size = 20px, Weight = 600, Color = #FDE047, Alignment = center.', null, 10, '{"allowedTypes": ["rectangle", "text"]}'::jsonb),
('task_08', 'Profile Card Recreation', 'Recreate the profile card matching the provided reference image: Card background (id: profile_card_bg): X = 250, Y = 100, Width = 300, Height = 400, Color = #FFFFFF, Border Radius = 16px. Profile image (id: profile_img): X = 340, Y = 130, Width = 120, Height = 120. Name (id: profile_name): X = 270, Y = 270, Width = 260, Height = 35, Text = ''Alex Morgan'', Size = 22px, Weight = 700, Color = #111827. Description (id: profile_desc): X = 270, Y = 310, Width = 260, Height = 30, Text = ''Lead UI/UX Designer'', Size = 14px, Weight = 500, Color = #6B7280. Button background (id: profile_btn_bg): X = 310, Y = 370, Width = 180, Height = 45, Color = #2563EB, Radius = 8px. Button text (id: profile_btn_text): X = 310, Y = 380, Width = 180, Height = 25, Text = ''Connect'', Size = 14px, Weight = 700, Color = #FFFFFF.', '/assets/q8_profile_card_ref.png', 10, '{"allowedTypes": ["rectangle", "text", "image"]}'::jsonb),
('task_09', 'Landing Page Section Recreation', 'Recreate the landing page hero section from the reference image: Nav bar (id: nav_bg): X = 40, Y = 40, Width = 720, Height = 60, Color = #1E293B, Radius = 8px. Logo (id: nav_logo): X = 60, Y = 50, Width = 100, Height = 40. Nav menu (id: nav_menu): X = 450, Y = 55, Width = 280, Height = 30, Text = ''Home   Features   Pricing   Contact'', Size = 13px, Weight = 500, Color = #FFFFFF, Align = right. Hero title (id: hero_title): X = 40, Y = 150, Width = 380, Height = 80, Text = ''Build Better Products Faster'', Size = 30px, Weight = 700, Color = #0F172A. Hero description (id: hero_desc): X = 40, Y = 240, Width = 380, Height = 70, Text = ''Streamline your workflow with our modern design platform built for high-performing creative teams.'', Size = 14px, Weight = 400, Color = #475569. CTA base (id: hero_cta_bg): X = 40, Y = 330, Width = 160, Height = 45, Color = #2563EB, Radius = 8px. CTA text (id: hero_cta_text): X = 40, Y = 340, Width = 160, Height = 25, Text = ''Get Started'', Size = 14px, Weight = 700, Color = #FFFFFF, Align = center. Hero graphic (id: hero_graphic): X = 450, Y = 140, Width = 310, Height = 240.', '/assets/q9_landing_section_ref.png', 10, '{"allowedTypes": ["rectangle", "text", "image"]}'::jsonb),
('task_10', 'Full Design Recreation', 'Recreate the complete poster reference design: Header (id: full_header_bg): X = 40, Y = 30, Width = 720, Height = 100, Color = #0F172A, Radius = 12px. Title (id: full_title): X = 60, Y = 50, Width = 500, Height = 60, Text = ''DESIGN PRECISION CHAMPIONSHIP 2026'', Size = 24px, Weight = 700, Color = #38BDF8. Logo (id: full_logo): X = 650, Y = 45, Width = 90, Height = 70. Divider (id: full_divider): X = 40, Y = 145, Width = 720, Height = 6, Color = #F59E0B, Radius = 3px. Illustration (id: full_illustration): X = 40, Y = 170, Width = 400, Height = 260. Information box (id: full_box): X = 460, Y = 170, Width = 300, Height = 260, Color = #F1F5F9, Radius = 12px. Box title (id: full_box_title): X = 480, Y = 190, Width = 260, Height = 35, Text = ''Key Highlights'', Size = 18px, Weight = 700, Color = #0F172A. Box text (id: full_box_text): X = 480, Y = 230, Width = 260, Height = 120, Text = ''• 100% Automated Scoring\n• Live Leaderboard Updates\n• Certificate of Excellence'', Size = 14px, Weight = 500, Color = #334155. CTA base (id: full_cta_bg): X = 280, Y = 460, Width = 240, Height = 50, Color = #10B981, Radius = 25px. CTA text (id: full_cta_text): X = 280, Y = 472, Width = 240, Height = 30, Text = ''SUBMIT FINAL DESIGN'', Size = 15px, Weight = 700, Color = #FFFFFF, Align = center.', '/assets/q10_full_design_ref.png', 10, '{"allowedTypes": ["rectangle", "text", "image"]}'::jsonb);

insert into public.task_answers (task_id, target_layout, initial_layout) values
('task_01', '{
  "elements": [
    { "id": "logo_element", "type": "image", "x": 690, "y": 30, "width": 80, "height": 80 }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "logo_element", "type": "image", "x": 50, "y": 50, "width": 80, "height": 80, "url": "/assets/logo.png", "aspectRatioLocked": true, "name": "College Logo" }
  ]
}'::jsonb),

('task_02', '{
  "elements": [
    { "id": "heading_text", "type": "text", "x": 200, "y": 100, "width": 400, "height": 50, "text": "DESIGN WITH PURPOSE", "fontSize": 32, "fontWeight": 700, "color": "#1E40AF", "align": "center" }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "heading_text", "type": "text", "x": 100, "y": 300, "width": 300, "height": 50, "text": "DESIGN WITH PURPOSE", "fontSize": 24, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Heading Text" }
  ]
}'::jsonb),

('task_03', '{
  "elements": [
    { "id": "button_base", "type": "rectangle", "x": 310, "y": 270, "width": 180, "height": 50, "color": "#2563EB", "borderRadius": 10 },
    { "id": "button_text", "type": "text", "x": 310, "y": 280, "width": 180, "height": 30, "text": "REGISTER NOW", "fontSize": 16, "fontWeight": 700, "color": "#FFFFFF", "align": "center" }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "button_base", "type": "rectangle", "x": 50, "y": 400, "width": 100, "height": 30, "color": "#CCCCCC", "borderRadius": 0, "name": "Button Base" },
    { "id": "button_text", "type": "text", "x": 60, "y": 405, "width": 100, "height": 20, "text": "REGISTER NOW", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Button Text" }
  ]
}'::jsonb),

('task_04', '{
  "elements": [
    { "id": "hero_image", "type": "image", "x": 200, "y": 150, "width": 400, "height": 300 }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "hero_image", "type": "image", "x": 50, "y": 50, "width": 200, "height": 150, "url": "/assets/hero_graphic.png", "aspectRatioLocked": true, "name": "Hero Graphic Image" }
  ]
}'::jsonb),

('task_05', '{
  "elements": [
    { "id": "heading_elem", "type": "text", "x": 150, "y": 180, "width": 500, "height": 50, "text": "CREATIVE PORTFOLIO", "fontSize": 36, "fontWeight": 700, "color": "#111827", "align": "center" },
    { "id": "subtitle_elem", "type": "text", "x": 150, "y": 250, "width": 500, "height": 35, "text": "Showcasing Modern Design Excellence", "fontSize": 18, "fontWeight": 500, "color": "#4B5563", "align": "center" }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "heading_elem", "type": "text", "x": 100, "y": 100, "width": 400, "height": 40, "text": "CREATIVE PORTFOLIO", "fontSize": 24, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Heading Element" },
    { "id": "subtitle_elem", "type": "text", "x": 100, "y": 400, "width": 400, "height": 30, "text": "Showcasing Modern Design Excellence", "fontSize": 14, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Subtitle Element" }
  ]
}'::jsonb),

('task_06', '{
  "elements": [
    { "id": "card_1", "type": "rectangle", "x": 50, "y": 160, "width": 200, "height": 280, "color": "#EEF2FF", "borderRadius": 12 },
    { "id": "card_2", "type": "rectangle", "x": 300, "y": 160, "width": 200, "height": 280, "color": "#EEF2FF", "borderRadius": 12 },
    { "id": "card_3", "type": "rectangle", "x": 550, "y": 160, "width": 200, "height": 280, "color": "#EEF2FF", "borderRadius": 12 }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "card_1", "type": "rectangle", "x": 50, "y": 50, "width": 150, "height": 200, "color": "#CCCCCC", "borderRadius": 0, "name": "Card 1" },
    { "id": "card_2", "type": "rectangle", "x": 250, "y": 300, "width": 150, "height": 200, "color": "#CCCCCC", "borderRadius": 0, "name": "Card 2" },
    { "id": "card_3", "type": "rectangle", "x": 450, "y": 100, "width": 150, "height": 200, "color": "#CCCCCC", "borderRadius": 0, "name": "Card 3" }
  ]
}'::jsonb),

('task_07', '{
  "elements": [
    { "id": "banner_bg", "type": "rectangle", "x": 50, "y": 100, "width": 700, "height": 220, "color": "#4F46E5", "borderRadius": 16 },
    { "id": "banner_title", "type": "text", "x": 80, "y": 140, "width": 640, "height": 60, "text": "SUMMER DESIGN SALE", "fontSize": 36, "fontWeight": 700, "color": "#FFFFFF", "align": "center" },
    { "id": "banner_sub", "type": "text", "x": 80, "y": 220, "width": 640, "height": 40, "text": "UP TO 50% OFF ALL COURSES", "fontSize": 20, "fontWeight": 600, "color": "#FDE047", "align": "center" }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "banner_bg", "type": "rectangle", "x": 100, "y": 50, "width": 600, "height": 150, "color": "#CCCCCC", "borderRadius": 0, "name": "Banner Background" },
    { "id": "banner_title", "type": "text", "x": 120, "y": 70, "width": 400, "height": 40, "text": "SUMMER DESIGN SALE", "fontSize": 20, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Banner Title" },
    { "id": "banner_sub", "type": "text", "x": 120, "y": 120, "width": 400, "height": 30, "text": "UP TO 50% OFF ALL COURSES", "fontSize": 14, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Banner Subtitle" }
  ]
}'::jsonb),

('task_08', '{
  "elements": [
    { "id": "profile_card_bg", "type": "rectangle", "x": 250, "y": 100, "width": 300, "height": 400, "color": "#FFFFFF", "borderRadius": 16 },
    { "id": "profile_img", "type": "image", "x": 340, "y": 130, "width": 120, "height": 120 },
    { "id": "profile_name", "type": "text", "x": 270, "y": 270, "width": 260, "height": 35, "text": "Alex Morgan", "fontSize": 22, "fontWeight": 700, "color": "#111827", "align": "center" },
    { "id": "profile_desc", "type": "text", "x": 270, "y": 310, "width": 260, "height": 30, "text": "Lead UI/UX Designer", "fontSize": 14, "fontWeight": 500, "color": "#6B7280", "align": "center" },
    { "id": "profile_btn_bg", "type": "rectangle", "x": 310, "y": 370, "width": 180, "height": 45, "color": "#2563EB", "borderRadius": 8 },
    { "id": "profile_btn_text", "type": "text", "x": 310, "y": 380, "width": 180, "height": 25, "text": "Connect", "fontSize": 14, "fontWeight": 700, "color": "#FFFFFF", "align": "center" }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "profile_card_bg", "type": "rectangle", "x": 50, "y": 50, "width": 200, "height": 300, "color": "#E5E7EB", "borderRadius": 0, "name": "Card Base" },
    { "id": "profile_img", "type": "image", "x": 80, "y": 70, "width": 80, "height": 80, "url": "/assets/avatar.png", "aspectRatioLocked": true, "name": "Profile Avatar" },
    { "id": "profile_name", "type": "text", "x": 60, "y": 170, "width": 180, "height": 30, "text": "Alex Morgan", "fontSize": 16, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Profile Name" },
    { "id": "profile_desc", "type": "text", "x": 60, "y": 205, "width": 180, "height": 25, "text": "Lead UI/UX Designer", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Profile Desc" },
    { "id": "profile_btn_bg", "type": "rectangle", "x": 80, "y": 240, "width": 120, "height": 35, "color": "#CCCCCC", "borderRadius": 0, "name": "Button Base" },
    { "id": "profile_btn_text", "type": "text", "x": 90, "y": 248, "width": 100, "height": 20, "text": "Connect", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Button Label" }
  ]
}'::jsonb),

('task_09', '{
  "elements": [
    { "id": "nav_bg", "type": "rectangle", "x": 40, "y": 40, "width": 720, "height": 60, "color": "#1E293B", "borderRadius": 8 },
    { "id": "nav_logo", "type": "image", "x": 60, "y": 50, "width": 100, "height": 40 },
    { "id": "nav_menu", "type": "text", "x": 450, "y": 55, "width": 280, "height": 30, "text": "Home   Features   Pricing   Contact", "fontSize": 13, "fontWeight": 500, "color": "#FFFFFF", "align": "right" },
    { "id": "hero_title", "type": "text", "x": 40, "y": 150, "width": 380, "height": 80, "text": "Build Better Products Faster", "fontSize": 30, "fontWeight": 700, "color": "#0F172A", "align": "left" },
    { "id": "hero_desc", "type": "text", "x": 40, "y": 240, "width": 380, "height": 70, "text": "Streamline your workflow with our modern design platform built for high-performing creative teams.", "fontSize": 14, "fontWeight": 400, "color": "#475569", "align": "left" },
    { "id": "hero_cta_bg", "type": "rectangle", "x": 40, "y": 330, "width": 160, "height": 45, "color": "#2563EB", "borderRadius": 8 },
    { "id": "hero_cta_text", "type": "text", "x": 40, "y": 340, "width": 160, "height": 25, "text": "Get Started", "fontSize": 14, "fontWeight": 700, "color": "#FFFFFF", "align": "center" },
    { "id": "hero_graphic", "type": "image", "x": 450, "y": 140, "width": 310, "height": 240 }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "nav_bg", "type": "rectangle", "x": 20, "y": 20, "width": 500, "height": 40, "color": "#CCCCCC", "borderRadius": 0, "name": "Nav Bar" },
    { "id": "nav_logo", "type": "image", "x": 30, "y": 25, "width": 60, "height": 30, "url": "/assets/logo.png", "aspectRatioLocked": true, "name": "Nav Logo" },
    { "id": "nav_menu", "type": "text", "x": 200, "y": 30, "width": 250, "height": 25, "text": "Home   Features   Pricing   Contact", "fontSize": 11, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Nav Links" },
    { "id": "hero_title", "type": "text", "x": 20, "y": 100, "width": 300, "height": 50, "text": "Build Better Products Faster", "fontSize": 20, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Hero Title" },
    { "id": "hero_desc", "type": "text", "x": 20, "y": 170, "width": 300, "height": 50, "text": "Streamline your workflow with our modern design platform built for high-performing creative teams.", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Hero Desc" },
    { "id": "hero_cta_bg", "type": "rectangle", "x": 20, "y": 240, "width": 120, "height": 35, "color": "#CCCCCC", "borderRadius": 0, "name": "CTA Base" },
    { "id": "hero_cta_text", "type": "text", "x": 30, "y": 248, "width": 100, "height": 20, "text": "Get Started", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "CTA Text" },
    { "id": "hero_graphic", "type": "image", "x": 350, "y": 100, "width": 200, "height": 150, "url": "/assets/hero_graphic.png", "aspectRatioLocked": false, "name": "Hero Graphic" }
  ]
}'::jsonb),

('task_10', '{
  "elements": [
    { "id": "full_header_bg", "type": "rectangle", "x": 40, "y": 30, "width": 720, "height": 100, "color": "#0F172A", "borderRadius": 12 },
    { "id": "full_title", "type": "text", "x": 60, "y": 50, "width": 500, "height": 60, "text": "DESIGN PRECISION CHAMPIONSHIP 2026", "fontSize": 24, "fontWeight": 700, "color": "#38BDF8", "align": "left" },
    { "id": "full_logo", "type": "image", "x": 650, "y": 45, "width": 90, "height": 70 },
    { "id": "full_divider", "type": "rectangle", "x": 40, "y": 145, "width": 720, "height": 6, "color": "#F59E0B", "borderRadius": 3 },
    { "id": "full_illustration", "type": "image", "x": 40, "y": 170, "width": 400, "height": 260 },
    { "id": "full_box", "type": "rectangle", "x": 460, "y": 170, "width": 300, "height": 260, "color": "#F1F5F9", "borderRadius": 12 },
    { "id": "full_box_title", "type": "text", "x": 480, "y": 190, "width": 260, "height": 35, "text": "Key Highlights", "fontSize": 18, "fontWeight": 700, "color": "#0F172A", "align": "left" },
    { "id": "full_box_text", "type": "text", "x": 480, "y": 230, "width": 260, "height": 120, "text": "• 100% Automated Scoring\n• Live Leaderboard Updates\n• Certificate of Excellence", "fontSize": 14, "fontWeight": 500, "color": "#334155", "align": "left" },
    { "id": "full_cta_bg", "type": "rectangle", "x": 280, "y": 460, "width": 240, "height": 50, "color": "#10B981", "borderRadius": 25 },
    { "id": "full_cta_text", "type": "text", "x": 280, "y": 472, "width": 240, "height": 30, "text": "SUBMIT FINAL DESIGN", "fontSize": 15, "fontWeight": 700, "color": "#FFFFFF", "align": "center" }
  ]
}'::jsonb, '{
  "elements": [
    { "id": "full_header_bg", "type": "rectangle", "x": 20, "y": 20, "width": 500, "height": 60, "color": "#CCCCCC", "borderRadius": 0, "name": "Header Banner" },
    { "id": "full_title", "type": "text", "x": 30, "y": 35, "width": 350, "height": 40, "text": "DESIGN PRECISION CHAMPIONSHIP 2026", "fontSize": 16, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Event Title" },
    { "id": "full_logo", "type": "image", "x": 450, "y": 30, "width": 60, "height": 40, "url": "/assets/logo.png", "aspectRatioLocked": true, "name": "Header Logo" },
    { "id": "full_divider", "type": "rectangle", "x": 20, "y": 90, "width": 500, "height": 4, "color": "#CCCCCC", "borderRadius": 0, "name": "Divider Line" },
    { "id": "full_illustration", "type": "image", "x": 20, "y": 110, "width": 250, "height": 180, "url": "/assets/hero_graphic.png", "aspectRatioLocked": false, "name": "Illustration" },
    { "id": "full_box", "type": "rectangle", "x": 300, "y": 110, "width": 200, "height": 180, "color": "#E5E7EB", "borderRadius": 0, "name": "Info Box Base" },
    { "id": "full_box_title", "type": "text", "x": 310, "y": 120, "width": 180, "height": 25, "text": "Key Highlights", "fontSize": 14, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Box Title" },
    { "id": "full_box_text", "type": "text", "x": 310, "y": 150, "width": 180, "height": 80, "text": "• 100% Automated Scoring\n• Live Leaderboard Updates\n• Certificate of Excellence", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "Box Text" },
    { "id": "full_cta_bg", "type": "rectangle", "x": 150, "y": 320, "width": 180, "height": 40, "color": "#CCCCCC", "borderRadius": 0, "name": "CTA Base" },
    { "id": "full_cta_text", "type": "text", "x": 160, "y": 330, "width": 160, "height": 20, "text": "SUBMIT FINAL DESIGN", "fontSize": 12, "fontWeight": 400, "fontFamily": "Inter", "color": "#000000", "align": "left", "name": "CTA Label" }
  ]
}'::jsonb);
