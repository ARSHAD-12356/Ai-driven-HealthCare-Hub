'use server';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Chat Route - Gemini-Powered Healthcare Assistant
 * 
 * POST /api/chat - Send a message and get AI response
 * 
 * Medical Safety Rules:
 * - Only provide general health information, NOT diagnosis
 * - Recommend professional consultation for serious symptoms
 * - Always suggest visiting a doctor for persistent or severe symptoms
 */

// Medical safety system prompt
const HEALTHCARE_SYSTEM_PROMPT = `You are a compassionate and knowledgeable AI health assistant for a rural healthcare platform. Your role is to provide helpful, general health guidance and wellness information.

IMPORTANT SAFETY RULES:
1. **Never Diagnose**: You are NOT a doctor. Do NOT attempt to diagnose conditions. Use phrases like "This might suggest..." not "You have..."
2. **Recommend Professional Help**: For ANY serious symptoms (chest pain, difficulty breathing, severe bleeding, etc.), IMMEDIATELY instruct the user to visit a healthcare facility or call emergency services.
3. **Medical Advice Disclaimer**: Regularly remind users that your advice is general information only and not a substitute for professional medical consultation.
4. **Encourage Doctor Visits**: If symptoms persist beyond 48 hours or worsen, recommend consulting a health worker or visiting a clinic.
5. **Support Mental Health**: Be empathetic and supportive. If you detect concerning mental health issues, encourage seeking professional help.
6. **Avoid Medication Advice**: Do NOT recommend specific medicines, dosages, or drug combinations.
7. **Focus on Lifestyle**: Emphasize preventative care, healthy habits, hygiene, nutrition, and exercise.

COMMUNICATION STYLE:
- Be warm, supportive, and non-judgmental
- Use simple language that rural patients can understand
- Ask clarifying questions if symptoms are vague
- Provide actionable advice when possible
- Always err on the side of caution and recommend professional consultation`;

/**
 * POST /api/chat
 * 
 * Request:
 * {
 *   "message": "User's message",
 *   "conversationHistory": [ ...previous messages... ]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "AI response text"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { success: false, error: 'AI service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('✅ API Key loaded:', apiKey.substring(0, 10) + '...');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash', // Latest flash model (2.0)
    });

    // Build prompt with conversation context
    let prompt = HEALTHCARE_SYSTEM_PROMPT + '\n\n';
    
    // Add recent conversation history (last 10 messages to avoid token limit)
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      prompt += 'Previous conversation:\n';
      conversationHistory.slice(-10).forEach((msg: any) => {
        const role = msg.type === 'user' ? 'Patient' : 'Assistant';
        prompt += `${role}: ${msg.text}\n`;
      });
      prompt += '\n';
    }

    // Add current message
    prompt += `Patient: ${message.trim()}\n\nAssistant:`;

    // Call Gemini API
    console.log('📤 Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // Validate response
    if (!aiResponse || aiResponse.trim().length === 0) {
      throw new Error('Empty response from Gemini');
    }

    console.log('✅ Gemini response received');
    return NextResponse.json({
      success: true,
      message: aiResponse.trim(),
    });

  } catch (error: any) {
    console.error('❌ Chat API Error:', error);

    // Handle different error types
    let errorMessage = 'Failed to get response. Please try again.';

    if (error?.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error?.status === 429) {
      errorMessage = 'Service busy. Please wait and try again.';
    } else if (error?.status === 403 || error?.message?.includes('API key')) {
      errorMessage = 'API configuration error. Please contact support.';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
