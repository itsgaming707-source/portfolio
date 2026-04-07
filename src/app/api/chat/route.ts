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
1. Blinkit Sales Analysis (Python EDA) - Performed end-to-end data cleaning & analysis on Blinkit sales data. Identified pricing vs visibility impact on sales. Found Tier 1 & 2 outlets outperform Tier 3. Used Python, Pandas, Matplotlib.
2. Spam Detection System (Built from Scratch) - Built a Naive Bayes classifier without using ML libraries. Implemented probability calculations, Laplace smoothing & log-space computation from scratch. Classifies messages as spam/ham with confidence score. Used Python.
3. Customer Shopping Behavior Analysis - End-to-end project using Python, SQL & Power BI. Identified high-value customers & buying patterns. Built interactive dashboard for business insights.
4. Zepto Inventory Analysis (SQL) - Analyzed e-commerce inventory dataset using advanced SQL queries. Found top discounts, revenue trends & stock issues. Performed complex joins, aggregations and window functions for insights. Used PostgreSQL.

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
- Machine Learning fundamentals (Naive Bayes, classification)
- Basic statistics for data insights

He focuses on turning raw data into meaningful business insights.`,
  "📊 View Nikhil's Projects": `📊 Nikhil has worked on multiple real-world data analysis projects:

🛒 1. Blinkit Sales Analysis (Python EDA)
- Performed end-to-end data cleaning & analysis
- Identified pricing vs visibility impact on sales
- Found Tier 1 & 2 outlets outperform Tier 3

🚀 2. Spam Detection System (From Scratch)
- Built Naive Bayes model without ML libraries
- Implemented probability, Laplace smoothing & log-space computation
- Classifies messages with confidence score

🛍️ 3. Customer Shopping Behavior Analysis
- End-to-end project using Python, SQL & Power BI
- Identified high-value customers & buying patterns
- Built interactive dashboard for business insights

🛒 4. Zepto Inventory Analysis (SQL)
- Analyzed e-commerce inventory dataset
- Found top discounts, revenue trends & stock issues
- Performed advanced SQL queries for insights

💡 These projects showcase strong skills in:
Python • SQL • Power BI • Data Analysis • Business Insights`,
  "🧠 Explain a Project in Detail": `Let me walk you through Nikhil's most impactful projects:

🛒 Blinkit Sales Analysis:
→ Problem: Understanding what drives sales across different outlet types
→ Approach: Cleaned raw sales data using Python (Pandas), performed EDA with Matplotlib
→ Key Finding: Tier 1 & 2 city outlets significantly outperform Tier 3. Pricing & product visibility directly impact sales volume.

🚀 Spam Detection System (Built from Scratch):
→ Problem: Classify messages as spam or ham without relying on ML libraries
→ Approach: Implemented Naive Bayes algorithm from scratch — probability calculations, Laplace smoothing, and log-space computation
→ Result: Successfully classifies messages with a confidence score, demonstrating deep understanding of ML fundamentals

🛍️ Customer Shopping Behavior:
→ End-to-end pipeline using Python + SQL + Power BI
→ Segmented high-value customers and uncovered buying patterns
→ Built an interactive dashboard for business decision-making

🛒 Zepto Inventory Analysis:
→ Used advanced SQL (JOINs, Window Functions, CTEs) on e-commerce inventory data
→ Identified top discount categories, revenue trends, and stock management issues`,
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
