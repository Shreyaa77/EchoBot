import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { message, weather, messages = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Debug: Log the data
    console.log("Chat data received:", {
      message,
      weather: weather?.name,
      messageCount: messages.length,
    });

    // Weather context for the prompt
    const weatherContext =
      weather && weather.weather && weather.weather[0] && weather.main
        ? `Current weather: ${weather.weather[0].description}, ${Math.round(
            weather.main.temp
          )}°C, humidity ${weather.main.humidity}%, wind ${
            weather.wind?.speed || "unknown"
          } m/s in ${weather.name || "your location"}.`
        : "Weather data not available.";

    // Build conversation history
    const conversationHistory =
      messages.length > 0
        ? (messages as Message[])
            .map(
              (msg) =>
                `${msg.sender === "user" ? "User" : "Echo"}: ${msg.content}`
            )
            .join("\n")
        : "";

    // Determine if this is the first interaction
    const isFirstMessage = messages.length <= 1;

    // Echo persona prompt
    const prompt = `You are "Echo", a friendly well-being companion chatbot that provides weather-based well-being support. 

PERSONALITY:
- Warm, empathetic, encouraging, conversational (like a caring friend)
- Friendly, supportive, never judgmental
- Listen more than talk, like a listening ear
- Keep responses short, gentle, and positive (1-2 sentences max)
- Not a therapist, but a supportive companion
- Don't diagnose or give medical advice
- Vary your responses - don't repeat the same phrases

CURRENT CONTEXT:
${weatherContext}

${
  conversationHistory
    ? `CONVERSATION HISTORY:
${conversationHistory}

`
    : ""
}CURRENT USER MESSAGE: "${message}"

${
  isFirstMessage
    ? `
FIRST INTERACTION GUIDELINES:
- This is the user's first message, so respond warmly and acknowledge their feeling
- Reference the weather naturally if available
- Ask a gentle follow-up question to continue the conversation
- Keep it brief and welcoming
`
    : `
ONGOING CONVERSATION GUIDELINES:
- Continue the conversation naturally based on what they've shared
- Build on previous messages - don't repeat yourself
- Show you're listening by referencing what they said before
- Provide varied, contextual responses
- Ask different follow-up questions
- Remind user that you are there to keep them company 
- If the user says that they are going outdoors give them proctective clothing suggestions according to the weather
`
}

YOUR ROLE:
1. Acknowledge their current feeling/message
2. Connect weather to mood when relevant (but don't force it)
3. Suggest weather-appropriate activities for well-being
4. Provide gentle emotional support
5. Ask thoughtful follow-up questions to keep conversation flowing
6. You are a listening ear and an encouraging friend
7. Don't always end the response with questions, help user with suggestion or decision when they can't decide

RESPONSE GUIDELINES:
- Keep responses to 1-2 sentences maximum
- Be conversational and natural
- Don't always mention weather - only when it's relevant
- Vary your language and avoid repetitive phrases
- For sunny/warm weather: Suggest outdoor activities
- For rainy/cold weather: Recommend cozy indoor activities
- Suggest mindfulness exercises to make them feel calm
- Match the user's energy level in your response
- Don't always end the response with questions 
- Sometimes respond with a encouraging or cheerful thought

EXAMPLE RESPONSES:
- "That's wonderful to hear! The sunny weather seems perfect for your good mood. What's been making you feel so positive?"
- "I understand - rainy days can definitely affect how we feel. Maybe some warm tea and a good book could help?"
- "It sounds like you're going through a tough time. Would you like me to share something calming with you—a breathing exercise, a grounding thought, or maybe a simple encouragement?"
- "I hear you 💙. Feeling unmotivated can be so heavy it's like your energy and willpower just don't want to line up with what you wish you could do. And that's completely human."

Keep your response natural, brief, and focused on being a caring friend who listens and offers gentle support.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      {
        error:
          "I'm having trouble connecting right now. Remember to take care of yourself today! 💙",
      },
      { status: 500 }
    );
  }
}
