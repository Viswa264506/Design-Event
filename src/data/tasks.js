export const tasksData = [
  {
    id: "task_01",
    title: "Logo Placement",
    instruction: "Place the college logo element at the top-right corner of the canvas. It must be at X = 700, Y = 20, with width = 80 and height = 80.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["image"],
      initialElements: [
        {
          id: "college_logo",
          type: "image",
          x: 50,
          y: 50,
          width: 80,
          height: 80,
          url: "https://placehold.co/80x80/2563EB/ffffff?text=LOGO",
          aspectRatioLocked: true,
          name: "College Logo"
        }
      ]
    }
  },
  {
    id: "task_02",
    title: "Headline Styling",
    instruction: "Locate or create the main title. Place it at X = 200, Y = 100, width = 400, height = 60. Set Typography: Size = 36px, Weight = 700, Color = #2563EB, Font = Inter, Alignment = center, Text = 'DESIGN FEST 2026'.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["text"],
      initialElements: [
        {
          id: "main_title",
          type: "text",
          x: 100,
          y: 200,
          width: 300,
          height: 50,
          text: "DESIGN FEST 2026",
          fontSize: 24,
          fontWeight: 400,
          fontFamily: "Inter",
          color: "#000000",
          align: "left",
          name: "Main Title"
        }
      ]
    }
  },
  {
    id: "task_03",
    title: "Accent Divider Bar",
    instruction: "Create a horizontal divider bar (rectangle) directly below the headline. It must be at X = 325, Y = 170, width = 150, height = 8, color = #EF4444 (Red), and border radius = 4px.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["rectangle"],
      initialElements: [
        {
          id: "accent_divider",
          type: "rectangle",
          x: 50,
          y: 400,
          width: 100,
          height: 10,
          color: "#E5E7EB",
          borderRadius: 0,
          name: "Divider Bar"
        }
      ]
    }
  },
  {
    id: "task_04",
    title: "Sub-headline Positioning",
    instruction: "Align the sub-headline below the divider bar at X = 200, Y = 190, width = 400, height = 40. Font size = 18px, weight = 500, color = #4B5563 (Gray), alignment = center, Text = 'CREATIVITY UNLEASHED'.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["text"],
      initialElements: [
        {
          id: "sub_headline",
          type: "text",
          x: 100,
          y: 300,
          width: 300,
          height: 30,
          text: "CREATIVITY UNLEASHED",
          fontSize: 14,
          fontWeight: 400,
          fontFamily: "Inter",
          color: "#000000",
          align: "left",
          name: "Subheadline"
        }
      ]
    }
  },
  {
    id: "task_05",
    title: "Hero Banner Graphic",
    instruction: "Import or position the central Hero Banner (image). Put it at X = 100, Y = 250, width = 600, height = 200.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["image"],
      initialElements: [
        {
          id: "hero_banner",
          type: "image",
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          url: "https://placehold.co/600x200/4F46E5/ffffff?text=HERO+BANNER",
          aspectRatioLocked: false,
          name: "Hero Banner"
        }
      ]
    }
  },
  {
    id: "task_06",
    title: "Call to Action Button",
    instruction: "Create a rounded button background (rectangle) at X = 325, Y = 470, width = 150, height = 45, color = #4F46E5 (Indigo), and border radius = 8px.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["rectangle"],
      initialElements: [
        {
          id: "cta_button",
          type: "rectangle",
          x: 50,
          y: 500,
          width: 100,
          height: 30,
          color: "#CCCCCC",
          borderRadius: 2,
          name: "Button Base"
        }
      ]
    }
  },
  {
    id: "task_07",
    title: "Button Label Text",
    instruction: "Place the CTA text label 'REGISTER NOW' centered exactly on top of the Indigo CTA button. Place it at X = 325, Y = 480, width = 150, height = 30. Size = 14px, Weight = 700 (bold), Color = #FFFFFF (White), align = center.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["text"],
      initialElements: [
        {
          id: "cta_label",
          type: "text",
          x: 60,
          y: 510,
          width: 100,
          height: 20,
          text: "REGISTER NOW",
          fontSize: 12,
          fontWeight: 400,
          fontFamily: "Inter",
          color: "#000000",
          align: "left",
          name: "Button Label"
        }
      ]
    }
  },
  {
    id: "task_08",
    title: "Badge Detail Indicator",
    instruction: "Draw an Emerald-colored circle (representing a price/date badge) at X = 620, Y = 220, width = 60, height = 60, color = #10B981.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["circle"],
      initialElements: [
        {
          id: "badge_bg",
          type: "circle",
          x: 700,
          y: 400,
          width: 50,
          height: 50,
          color: "#CCCCCC",
          name: "Badge Circle"
        }
      ]
    }
  },
  {
    id: "task_09",
    title: "Event Date details",
    instruction: "Create a details text block at X = 100, Y = 530, width = 250, height = 40. Text = 'MARCH 15-16, 2026', size = 16px, weight = 600, color = #1F2937, align = left.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["text"],
      initialElements: [
        {
          id: "date_details",
          type: "text",
          x: 100,
          y: 560,
          width: 200,
          height: 25,
          text: "DATE HERE",
          fontSize: 12,
          fontWeight: 400,
          fontFamily: "Inter",
          color: "#000000",
          align: "left",
          name: "Date Details"
        }
      ]
    }
  },
  {
    id: "task_10",
    title: "Event Venue details",
    instruction: "Create another text block for venue at X = 450, Y = 530, width = 250, height = 40. Text = 'MAIN AUDITORIUM', size = 16px, weight = 600, color = #1F2937, align = right.",
    reference_asset: null,
    max_points: 10,
    public_config: {
      allowedTypes: ["text"],
      initialElements: [
        {
          id: "venue_details",
          type: "text",
          x: 450,
          y: 560,
          width: 200,
          height: 25,
          text: "VENUE HERE",
          fontSize: 12,
          fontWeight: 400,
          fontFamily: "Inter",
          color: "#000000",
          align: "left",
          name: "Venue Details"
        }
      ]
    }
  }
];
