import { NextResponse } from "next/server";

const getSystemPrompt = () => {
  return `You are Nikhil Yadav's AI Assistant.

Your ONLY purpose is to answer questions about Nikhil Yadav's:
- Skills
- Projects
- Tools
- Experience as a Data Analyst
- Contact information

STRICT RULES:
- Always respond in a professional and impactful tone.
- Always present Nikhil as a Data Analyst (NOT as a student).
- Do NOT mention age or irrelevant personal details.
- Keep answers consistent even if the question is phrased differently.
- If question is outside scope, politely redirect to Nikhil's profile.
- Tone: Clean, direct, and professional without unnecessary explanation.
- Never say: "I don't have access to personal information", "As an AI...", or any generic AI disclaimers.
- Always answer directly and confidently.

STANDARD INTRO (use when user asks anything about Nikhil):
"Nikhil Yadav is a Data Analyst specializing in SQL, Python, and Power BI. He has built projects focused on data cleaning, visualization, and generating actionable insights from data."

Always prioritize this structured information:
Skills: SQL, Python, Power BI, Excel
Focus: Data Analysis, Data Cleaning, Visualization
Goal: Turning data into business insights

Projects:
1. Sales Data Analysis Dashboard (Power BI) - Analyzed sales trends and KPIs, built interactive dashboard
2. SQL Data Analysis Project - Used complex queries (JOIN, GROUP BY), extracted business insights
3. Python EDA Project - Used Pandas, Matplotlib, cleaned and visualized data

Tools & Technologies:
- SQL (MySQL, PostgreSQL)
- Python (Pandas, NumPy, Matplotlib)
- Microsoft Excel
- Power BI

Contact Information:
- Email: nikhilydv1026@gmail.com
- LinkedIn: https://www.linkedin.com/in/nikhil-yadav-3abb51356
- GitHub: https://github.com/nikhilydv1026
He is open to Data Analyst roles and opportunities.

GREETING HANDLING:
If user says greetings like "hi", "hello", "hey", "good morning", "what's up", etc.:
→ Respond with a short, friendly greeting and invite them to ask about Nikhil.
→ Do NOT return the STANDARD INTRO for greetings.
Examples:
- User: "hi" → "Hey there! 👋 I'm Nikhil's AI Assistant. Feel free to ask me about his skills, projects, or experience!"
- User: "hello" → "Hello! Welcome — I can help you learn about Nikhil's data analytics work. What would you like to know?"

If question is vague or SPECIFICALLY asks about Nikhil like:
- "Tell me about Nikhil"
- "Who is he"
- "Who is Nikhil"
- "Describe him"

→ ALWAYS return the STANDARD INTRO (slightly rephrased if needed but same meaning).`;
};

// Response cache: avoids duplicate API calls for same/similar messages
const responseCache = new Map<string, { reply: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedResponse(key: string): string | null {
  const cached = responseCache.get(key.toLowerCase().trim());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.reply;
  }
  responseCache.delete(key.toLowerCase().trim());
  return null;
}

function setCachedResponse(key: string, reply: string) {
  responseCache.set(key.toLowerCase().trim(), { reply, timestamp: Date.now() });
}

// Helper: delay for retry
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Static fallbacks for core buttons to bypass rate limits and save quota
const fallbackResponses: Record<string, string> = {
  "🚀 Explore Nikhil's Skills": `Nikhil is a Data Analyst skilled in SQL, Python, Excel, and Power BI.

He has strong knowledge of:
- Data Cleaning and Preprocessing
- Exploratory Data Analysis (EDA)
- Writing optimized SQL queries
- Building dashboards in Power BI
- Basic statistics for data insights

He focuses on turning raw data into meaningful business insights.`,
  "📊 View Nikhil's Projects": `Nikhil has worked on several data analysis projects, including:

1. Sales Data Analysis Dashboard (Power BI)
- Analyzed sales trends and KPIs
- Built interactive dashboard

2. SQL Data Analysis Project
- Used complex queries (JOIN, GROUP BY)
- Extracted business insights

3. Python EDA Project
- Used Pandas, Matplotlib
- Cleaned and visualized data

These projects demonstrate his ability to solve real-world problems using data.`,
  "🧠 Explain a Project in Detail": `One of Nikhil's key projects is a Sales Data Analysis Dashboard.

Problem: Businesses were unable to track sales performance effectively.
Approach: Cleaned raw data using Python, used SQL for extraction, built Power BI dashboard.
Result: Identified top-performing products and improved decision-making.

This project shows his ability to convert raw data into actionable insights.`,
  "🛠️ Tools & Technologies Nikhil Uses": `Nikhil works with the following tools:

- SQL (MySQL, PostgreSQL)
- Python (Pandas, NumPy, Matplotlib)
- Microsoft Excel
- Power BI

He uses these tools to clean, analyze, and visualize data effectively.`,
  "📞 Contact Nikhil": `You can contact Nikhil through:

📧 Email: [nikhilydv1026@gmail.com](mailto:nikhilydv1026@gmail.com)
💼 LinkedIn: [nikhil-yadav-3abb51356](https://www.linkedin.com/in/nikhil-yadav-3abb51356)
💻 GitHub: [nikhilydv1026](https://github.com/nikhilydv1026)

He is open to Data Analyst roles and opportunities.`
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Immediately handle exact button clicks from backend (0 quota used, instant response)
    if (fallbackResponses[message]) {
      return NextResponse.json({ reply: fallbackResponses[message] });
    }

    // 2. Check cache first for custom messages
    const cached = getCachedResponse(message);
    if (cached) {
      return NextResponse.json({ reply: cached });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json({
        reply: "Chatbot is not configured. Please contact Nikhil.",
      });
    }

    const body = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      systemInstruction: {
        parts: [{ text: getSystemPrompt() }],
      },
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();

    if (response.ok) {
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setCachedResponse(message, reply);
      return NextResponse.json({ reply });
    }

    // Final failure
    const lastError = data.error?.message || "Unknown error";
    console.error(`Gemini Error [${response.status}]: ${lastError}`);

    if (response.status === 429) {
      return NextResponse.json({
        reply: "AI is busy right now, please try again in a few seconds.",
      });
    } else if (response.status === 403 || response.status === 401) {
      return NextResponse.json({
        reply: "API authentication issue. Please contact Nikhil.",
      });
    }

    return NextResponse.json({
      reply: "Sorry, I'm temporarily unavailable. Please try again later.",
    });

    return NextResponse.json({
      reply: "Service is busy. Please try again in a moment!",
    });
  } catch (error) {
    console.error("TRY-CATCH API ERROR:", error);
    return NextResponse.json({
      reply: "Something went wrong on the server. Please try again.",
    });
  }
}
