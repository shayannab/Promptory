const DESCRIPTION_LIMIT = 1500;

export const categorizePromptWithGroq = async (title, description) => {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert classifier that assigns a category to AI prompts. Possible categories are: writing, marketing, coding, design.",
          },
          {
            role: "user",
            content: `Assign a category to this prompt: \nTitle: "${title}"\nDescription: "${description}". \nReturn only one word: writing, marketing, coding or design.`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ GROQ API Category Error:", data);
      return "other";
    }

    const response = data?.choices?.[0]?.message?.content?.toLowerCase().trim();

    // Fallback protection
    const validCategories = ["writing", "marketing", "coding", "design"];
    return validCategories.includes(response) ? response : "other";

  } catch (err) {
    console.error("🔥 Error categorizing prompt:", err);
    return "other";
  }
};

export const fetchDescriptionFromGroq = async (title, mode = "normal", currentDescription = "") => {
  let promptType = {
    normal: `Write a short and clear description for this prompt title: "${title}". The description must be under ${DESCRIPTION_LIMIT} characters.`,
    short: `Rewrite the following description to be concise and clear, and keep it under ${DESCRIPTION_LIMIT} characters.\n\nDescription: "${currentDescription}"`,
    detailed: `Enrich the following description with more details, but keep it under ${DESCRIPTION_LIMIT} characters. Avoid unnecessary fluff or repetition.\n\nDescription: "${currentDescription}"`,
  };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are an AI assistant that writes AI prompt descriptions." },
          { role: "user", content: promptType[mode] || promptType.normal },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Groq API error:", data);
      return null;
    }

    let desc = data?.choices?.[0]?.message?.content?.trim();
    if (desc && desc.length > DESCRIPTION_LIMIT) {
      desc = desc.slice(0, DESCRIPTION_LIMIT);
    }
    return desc;
  } catch (err) {
    console.error("🔥 GROQ error:", err);
    return null;
  }
};
