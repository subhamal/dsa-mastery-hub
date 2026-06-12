import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Helper function to call Gemini API
async function callGemini(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser request:\n${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error?.message || 'Gemini API call failed');
    }

    const data = (await response.json()) as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// 1. AI DSA Tutor Chatbot
export const chatTutor = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const systemPrompt = `You are a world-class Data Structures and Algorithms (DSA) tutor. 
    Explain complex topics in a simple, friendly, and structured manner. Use Markdown, diagrams, and time/space complexity matrices when appropriate. 
    Never write code for the user directly if they are solving a question; guide them step-by-step instead.`;

    let reply = '';
    const hasApiKey = !!process.env.GEMINI_API_KEY;

    if (hasApiKey) {
      reply = await callGemini(message, systemPrompt);
    } else {
      // Mock Response Generator
      const msgLower = message.toLowerCase();
      if (msgLower.includes('dynamic programming') || msgLower.includes('dp')) {
        reply = `### 💡 DSA Tutor: Understanding Dynamic Programming (DP)

Dynamic Programming is simply **optimized recursion**. It is used when we have **overlapping subproblems** and **optimal substructure**.

Here are the two core approaches:
1. **Memoization (Top-Down)**: Solve recursively and cache the results of state calculations in an array/map.
2. **Tabulation (Bottom-Up)**: Solve iteratively by building up results from the base cases in a table.

**Example: Fibonacci sequence**
- *Recursive (Naive)*: $O(2^N)$ time
- *DP (Tabulated)*: $O(N)$ time, $O(1)$ auxiliary space

What specific DP problem (e.g., Knapsack, Longest Common Subsequence) would you like to explore?`;
      } else if (msgLower.includes('binary search')) {
        reply = `### 🔍 DSA Tutor: Binary Search Guide

Binary Search is an $O(\\log N)$ search algorithm that works by repeatedly dividing in half the search space that could contain the target. It **requires the collection to be sorted**.

**Template in JavaScript:**
\`\`\`javascript
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid; // Found!
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
\`\`\`

Would you like to try applying this to a specific problem?`;
      } else {
        reply = `### 🤖 Hello from your AI DSA Tutor!

I'm ready to help you master algorithms and structures. You can ask me to:
- Explain complex concepts (like Graphs, Trees, Recursion, or Sliding Windows).
- Break down time and space complexity ($O(N), O(\\log N)$).
- Guide you through solutions step-by-step.

*(Note: Connect your Google Gemini API Key in the backend \`.env\` file for full interactive capability!)*`;
      }
    }

    if (userId) {
      // Log chat to history
      await prisma.chatHistory.create({
        data: { userId, role: 'user', message }
      });
      await prisma.chatHistory.create({
        data: { userId, role: 'assistant', message: reply }
      });
    }

    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: 'Error processing tutor request', error: error.message });
  }
};

// 2. AI Hint Generator
export const generateHint = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, currentCode } = req.body;
    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const systemPrompt = `You are a DSA Coach. Given a coding problem statement, hints, and the student's current incomplete code, provide a single, highly constructive clue. 
    DO NOT give the full code or solution. Lead the student to think about the next logical step.`;

    const prompt = `Problem: ${question.title}
Problem Statement: ${question.problemStatement}
Student Current Code:
\`\`\`
${currentCode || '// No code written yet'}
\`\`\``;

    let hintText = '';
    if (process.env.GEMINI_API_KEY) {
      hintText = await callGemini(prompt, systemPrompt);
    } else {
      const hints = JSON.parse(question.hints);
      hintText = `💡 **AI Coach Hint**: ${hints[0] || 'Try thinking about the properties of the input. Can sorting help you simplify it?'}`;
    }

    res.json({ hint: hintText });
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating hint', error: error.message });
  }
};

// 3. AI Code Reviewer
export const reviewCode = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, code, language } = req.body;

    if (!questionId || !code) {
      return res.status(400).json({ message: 'Question ID and code are required' });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const systemPrompt = `You are a Senior Software Engineer code reviewer. 
    Examine the submitted code for the DSA problem. Provide a detailed code review detailing:
    1. Time Complexity & Space Complexity comparison (Current vs Optimal)
    2. Readability and syntax optimization
    3. Potential edge case failures (e.g., negative numbers, empty arrays)
    Format your output cleanly using markdown tables.`;

    const prompt = `Problem: ${question.title}
Statement: ${question.problemStatement}
Submitted Code (${language}):
\`\`\`
${code}
\`\`\``;

    let review = '';
    if (process.env.GEMINI_API_KEY) {
      review = await callGemini(prompt, systemPrompt);
    } else {
      review = `### 🛠️ AI Code Review
Here is a quick structural review of your solution for **${question.title}**.

#### 📊 Complexity Analysis
| Metric | Your Code | Optimal |
|:---|:---|:---|
| **Time Complexity** | O(N) | O(log N) |
| **Space Complexity** | O(1) | O(1) |

#### 🔍 Feedback & Optimizations
1. **Time Bounds**: Your search method uses linear checks. Since the search space is segmented, you can optimize this to binary search to achieve $O(\\log N)$.
2. **Edge Cases**: Make sure to check if the input array is empty (\`nums.length === 0\`) before accessing index bounds, as this could throw runtime reference issues.
3. **Naming**: Variables \`low\` and \`high\` are descriptive. Ensure index division matches integer floor rules in all languages.`;
    }

    res.json({ review });
  } catch (error: any) {
    res.status(500).json({ message: 'Error reviewing code', error: error.message });
  }
};

// 4. AI Interview Simulator
export const interviewSim = async (req: AuthRequest, res: Response) => {
  try {
    const { chatHistory, currentMessage } = req.body;

    if (!currentMessage) {
      return res.status(400).json({ message: 'Current message is required' });
    }

    const systemPrompt = `You are a FAANG coding interviewer. 
    Simulate a technical screen. The student will explain their approach, ask questions, and write code.
    Respond as a realistic interviewer: be helpful but critical, probe their complexity estimates, and push them to dry-run edge cases. 
    Keep your responses relatively brief (1-2 paragraphs) to mimic chat format.`;

    let reply = '';
    if (process.env.GEMINI_API_KEY) {
      const historyPrompt = chatHistory
        ? chatHistory.map((ch: any) => `${ch.role === 'user' ? 'Candidate' : 'Interviewer'}: ${ch.message}`).join('\n')
        : '';
      const prompt = `${historyPrompt}\nCandidate: ${currentMessage}\nInterviewer:`;
      reply = await callGemini(prompt, systemPrompt);
    } else {
      const msg = currentMessage.toLowerCase();
      if (msg.includes('hello') || msg.includes('start')) {
        reply = `Hello! Thanks for coming in today. Let's start with a classic coding challenge. 
        I'd like you to design a function that finds the longest subsegment in an array where all elements are consecutive integers. How would you approach this?`;
      } else if (msg.includes('sort') || msg.includes('n log n')) {
        reply = `Sorting the array is a solid initial approach. That would take $O(N \\log N)$ time. 
        Could we do better? Is there a way to solve this in $O(N)$ linear time using a hash structure? How would you handle duplicates?`;
      } else {
        reply = `That's an interesting approach. Let's think about the complexity. 
        What is the worst-case space complexity of this strategy? How would this perform if the inputs contain all identical values?`;
      }
    }

    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: 'Error running interview simulation', error: error.message });
  }
};

// 5. AI Custom Roadmap Generator
export const generateCustomRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const { experience, timeCommitment, goals } = req.body;

    const systemPrompt = `You are a senior tech training coordinator. Generate a custom learning roadmap based on the user's input.
    Input details:
    - Experience level: ${experience || 'Beginner'}
    - Time Commitment: ${timeCommitment || '5 hours/week'}
    - Key Goals: ${goals || 'Get a software engineering job in 3 months'}
    Generate a detailed markdown-formatted roadmap dividing topics into weekly timelines, listing specific concepts and recommended coding exercises.`;

    let roadmap = '';
    if (process.env.GEMINI_API_KEY) {
      roadmap = await callGemini('Generate custom roadmap', systemPrompt);
    } else {
      roadmap = `# 🗺️ Your Personalized DSA Roadmap
Based on your parameters (**Level**: ${experience}, **Commitment**: ${timeCommitment}, **Goals**: ${goals}), here is your custom pathway:

## 📅 Weeks 1-2: Core Elements & Search Optimization
- **Goal**: Master basic search patterns and pointers.
- **Topics**: Arrays, Two Pointers, and Binary Search.
- **XP Milestone**: Earn 100 XP from Array Challenges.

## 📅 Weeks 3-4: Node Structures
- **Goal**: Handle cyclic and dynamic memory structures.
- **Topics**: Singly & Doubly Linked Lists, Cycle Detection.
- **XP Milestone**: Solve LRU Cache and Reverse Linked List problems.

## 📅 Weeks 5-6: Tree Hierarchies & DFS/BFS
- **Goal**: Recursion state traversals and tree balancers.
- **Topics**: Binary Trees, BSTs, and traversals.
- **XP Milestone**: Solve LCA and Tree depth challenges.

## 📅 Weeks 7-8: DP & Graphs
- **Goal**: Complex state transitions and routing.
- **Topics**: Dynamic Programming (Knapsack, LCS) and Dijkstra's graph routing.
- **XP Milestone**: Solve Dijkstra pathing and 0/1 Knapsack.`;
    }

    res.json({ roadmap });
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating custom roadmap', error: error.message });
  }
};
