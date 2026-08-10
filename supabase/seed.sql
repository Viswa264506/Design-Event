-- Clear old tasks
truncate table public.task_answers cascade;
truncate table public.tasks cascade;

-- Seed Tasks table
insert into public.tasks (id, title, instruction, reference_asset, max_points, public_config) values
('task_01', 'Logo Placement', 'Place the college logo element at the top-right corner of the canvas. It must be at X = 700, Y = 20, with width = 80 and height = 80.', null, 10, '{"allowedTypes": ["image"]}'::jsonb),
('task_02', 'Headline Styling', 'Locate or create the main title. Place it at X = 200, Y = 100, width = 400, height = 60. Set Typography: Size = 36px, Weight = 700, Color = #2563EB, Font = Inter, Alignment = center, Text = ''DESIGN FEST 2026''.', null, 10, '{"allowedTypes": ["text"]}'::jsonb),
('task_03', 'Accent Divider Bar', 'Create a horizontal divider bar (rectangle) directly below the headline. It must be at X = 325, Y = 170, width = 150, height = 8, color = #EF4444 (Red), and border radius = 4px.', null, 10, '{"allowedTypes": ["rectangle"]}'::jsonb),
('task_04', 'Sub-headline Positioning', 'Align the sub-headline below the divider bar at X = 200, Y = 190, width = 400, height = 40. Font size = 18px, weight = 500, color = #4B5563 (Gray), alignment = center, Text = ''CREATIVITY UNLEASHED''.', null, 10, '{"allowedTypes": ["text"]}'::jsonb),
('task_05', 'Hero Banner Graphic', 'Import or position the central Hero Banner (image). Put it at X = 100, Y = 250, width = 600, height = 200.', null, 10, '{"allowedTypes": ["image"]}'::jsonb),
('task_06', 'Call to Action Button', 'Create a rounded button background (rectangle) at X = 325, Y = 470, width = 150, height = 45, color = #4F46E5 (Indigo), and border radius = 8px.', null, 10, '{"allowedTypes": ["rectangle"]}'::jsonb),
('task_07', 'Button Label Text', 'Place the CTA text label ''REGISTER NOW'' centered exactly on top of the Indigo CTA button. Place it at X = 325, Y = 480, width = 150, height = 30. Size = 14px, Weight = 700 (bold), Color = #FFFFFF (White), align = center.', null, 10, '{"allowedTypes": ["text"]}'::jsonb),
('task_08', 'Badge Detail Indicator', 'Draw an Emerald-colored circle (representing a price/date badge) at X = 620, Y = 220, width = 60, height = 60, color = #10B981.', null, 10, '{"allowedTypes": ["circle"]}'::jsonb),
('task_09', 'Event Date details', 'Create a details text block at X = 100, Y = 530, width = 250, height = 40. Text = ''MARCH 15-16, 2026'', size = 16px, weight = 600, color = #1F2937, align = left.', null, 10, '{"allowedTypes": ["text"]}'::jsonb),
('task_10', 'Event Venue details', 'Create another text block for venue at X = 450, Y = 530, width = 250, height = 40. Text = ''MAIN AUDITORIUM'', size = 16px, weight = 600, color = #1F2937, align = right.', null, 10, '{"allowedTypes": ["text"]}'::jsonb);

-- Seed Task Answers table (Expected target configurations)
insert into public.task_answers (task_id, target_layout) values
('task_01', '{
  "elements": [
    {
      "id": "college_logo",
      "type": "image",
      "x": 700,
      "y": 20,
      "width": 80,
      "height": 80
    }
  ]
}'::jsonb),

('task_02', '{
  "elements": [
    {
      "id": "main_title",
      "type": "text",
      "x": 200,
      "y": 100,
      "width": 400,
      "height": 60,
      "text": "DESIGN FEST 2026",
      "fontSize": 36,
      "fontWeight": 700,
      "color": "#2563EB",
      "align": "center"
    }
  ]
}'::jsonb),

('task_03', '{
  "elements": [
    {
      "id": "accent_divider",
      "type": "rectangle",
      "x": 325,
      "y": 170,
      "width": 150,
      "height": 8,
      "color": "#EF4444",
      "borderRadius": 4
    }
  ]
}'::jsonb),

('task_04', '{
  "elements": [
    {
      "id": "sub_headline",
      "type": "text",
      "x": 200,
      "y": 190,
      "width": 400,
      "height": 40,
      "text": "CREATIVITY UNLEASHED",
      "fontSize": 18,
      "fontWeight": 500,
      "color": "#4B5563",
      "align": "center"
    }
  ]
}'::jsonb),

('task_05', '{
  "elements": [
    {
      "id": "hero_banner",
      "type": "image",
      "x": 100,
      "y": 250,
      "width": 600,
      "height": 200
    }
  ]
}'::jsonb),

('task_06', '{
  "elements": [
    {
      "id": "cta_button",
      "type": "rectangle",
      "x": 325,
      "y": 470,
      "width": 150,
      "height": 45,
      "color": "#4F46E5",
      "borderRadius": 8
    }
  ]
}'::jsonb),

('task_07', '{
  "elements": [
    {
      "id": "cta_label",
      "type": "text",
      "x": 325,
      "y": 480,
      "width": 150,
      "height": 30,
      "text": "REGISTER NOW",
      "fontSize": 14,
      "fontWeight": 700,
      "color": "#FFFFFF",
      "align": "center"
    }
  ]
}'::jsonb),

('task_08', '{
  "elements": [
    {
      "id": "badge_bg",
      "type": "circle",
      "x": 620,
      "y": 220,
      "width": 60,
      "height": 60,
      "color": "#10B981"
    }
  ]
}'::jsonb),

('task_09', '{
  "elements": [
    {
      "id": "date_details",
      "type": "text",
      "x": 100,
      "y": 530,
      "width": 250,
      "height": 40,
      "text": "MARCH 15-16, 2026",
      "fontSize": 16,
      "fontWeight": 600,
      "color": "#1F2937",
      "align": "left"
    }
  ]
}'::jsonb),

('task_10', '{
  "elements": [
    {
      "id": "venue_details",
      "type": "text",
      "x": 450,
      "y": 530,
      "width": 250,
      "height": 40,
      "text": "MAIN AUDITORIUM",
      "fontSize": 16,
      "fontWeight": 600,
      "color": "#1F2937",
      "align": "right"
    }
  ]
}'::jsonb);
