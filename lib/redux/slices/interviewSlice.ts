import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addCandidate } from "./candidatesSlice";
import { RootState } from "../store";

// --- TYPE DEFINITIONS ---
type InterviewStatus =
  | "not-started"
  | "collecting-info"
  | "in-progress"
  | "completed";
type QuestionDifficulty = "Easy" | "Medium" | "Hard";

interface QuestionAndAnswer {
  question: string;
  answer: string;
  difficulty: QuestionDifficulty;
  time: number;
  score?: number;
  justification?: string;
}

interface CandidateInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface InterviewState {
  interviewStatus: InterviewStatus;
  file: { name: string; type: string } | null;
  candidateInfo: CandidateInfo | null;
  missingInfo: (keyof CandidateInfo)[] | null;
  currentMissingInfoIndex: number;
  questionsAndAnswers: QuestionAndAnswer[];
  currentQuestionIndex: number;
  score: number;
  summary: string;
  error: string | null;
  loading: boolean;
}

// --- INITIAL STATE ---
const initialState: InterviewState = {
  interviewStatus: "not-started",
  file: null,
  candidateInfo: null,
  missingInfo: null,
  currentMissingInfoIndex: 0,
  questionsAndAnswers: [],
  currentQuestionIndex: 0,
  score: 0,
  summary: "",
  error: null,
  loading: false,
};

// --- ASYNC THUNKS ---

export const fetchQuestion = createAsyncThunk(
  "interview/fetchQuestion",
  async (difficulty: QuestionDifficulty, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8001/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });
      if (!response.ok) throw new Error("Failed to fetch question.");
      const data = await response.json();
      const time =
        difficulty === "Easy" ? 20 : difficulty === "Medium" ? 60 : 120;
      return { ...data, difficulty, time, answer: "" };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const evaluateAnswer = createAsyncThunk(
  "interview/evaluateAnswer",
  async (payload: { index: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const qa = state.interview.questionsAndAnswers[payload.index];
    try {
      const response = await fetch("http://localhost:8001/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: qa.question,
          answer: qa.answer,
          difficulty: qa.difficulty,
        }),
      });
      if (!response.ok) throw new Error("Failed to evaluate answer.");
      const data = await response.json();
      return { ...data, index: payload.index };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const generateSummary = createAsyncThunk(
  "interview/generateSummary",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { questionsAndAnswers, candidateInfo } = state.interview;
    try {
      const chatHistory = questionsAndAnswers.map((qa) => ({
        q: qa.question,
        a: qa.answer,
      }));
      const response = await fetch("http://localhost:8001/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory }),
      });
      if (!response.ok) throw new Error("Failed to generate summary.");
      const summaryData = await response.json();

      if (candidateInfo?.name && candidateInfo?.email) {
        dispatch(
          addCandidate({
            id: Date.now().toString(),
            name: candidateInfo.name,
            email: candidateInfo.email,
            score: summaryData.finalScore,
            summary: summaryData.finalSummary,
            chatHistory: chatHistory,
          })
        );
      }
      return summaryData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setFile(
      state,
      action: PayloadAction<{ name: string; type: string } | null>
    ) {
      state.file = action.payload;
      state.error = null;
    },
    setCandidateInfo(state, action: PayloadAction<CandidateInfo>) {
      state.candidateInfo = action.payload;
      const missing = (
        Object.keys(action.payload) as (keyof CandidateInfo)[]
      ).filter((key) => !action.payload[key]);
      if (missing.length > 0) {
        state.missingInfo = missing;
        state.currentMissingInfoIndex = 0;
        state.interviewStatus = "collecting-info";
      } else {
        state.interviewStatus = "in-progress";
        state.questionsAndAnswers = [];
        state.currentQuestionIndex = 0;
      }
    },
    submitCollectedInfo(state, action: PayloadAction<string>) {
      if (state.missingInfo && state.candidateInfo) {
        const key = state.missingInfo[state.currentMissingInfoIndex];
        (state.candidateInfo as any)[key] = action.payload;
        state.currentMissingInfoIndex++;
        if (state.currentMissingInfoIndex >= state.missingInfo.length) {
          state.interviewStatus = "in-progress";
          state.missingInfo = null;
          state.questionsAndAnswers = [];
          state.currentQuestionIndex = 0;
        }
      }
    },
    startInterview(state) {
      if (state.candidateInfo) state.interviewStatus = "in-progress";
    },
    submitAnswer(state, action: PayloadAction<string>) {
      if (state.questionsAndAnswers[state.currentQuestionIndex]) {
        state.questionsAndAnswers[state.currentQuestionIndex].answer =
          action.payload;
      }
    },
    resetInterview: () => initialState,
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      if (action.payload) state.file = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // fetchQuestion
    builder.addCase(fetchQuestion.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchQuestion.fulfilled,
      (state, action: PayloadAction<QuestionAndAnswer>) => {
        state.loading = false;
        state.questionsAndAnswers.push(action.payload);
        if (state.questionsAndAnswers.length > 1) {
          state.currentQuestionIndex++;
        }
      }
    );
    builder.addCase(fetchQuestion.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    // evaluateAnswer
    builder.addCase(evaluateAnswer.fulfilled, (state, action) => {
      const { index, score, justification } = action.payload;
      state.questionsAndAnswers[index].score = score;
      state.questionsAndAnswers[index].justification = justification;
    });
    builder.addCase(evaluateAnswer.rejected, (state, action) => {
      state.error = `Failed to evaluate answer: ${action.payload}`;
    });

    // generateSummary
    builder.addCase(generateSummary.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(generateSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.interviewStatus = "completed";
      state.score = action.payload.finalScore;
      state.summary = action.payload.finalSummary;
    });
    builder.addCase(generateSummary.rejected, (state, action) => {
      state.error = `Failed to generate summary: ${action.payload}`;
      state.loading = false;
    });
  },
});

// --- COORDINATOR THUNK ---
export const handleAnswerSubmission =
  (answer: string): any =>
  async (dispatch: any, getState: any) => {
    // Immediately update UI with the answer
    dispatch(interviewSlice.actions.submitAnswer(answer));

    const state = getState().interview;
    const currentIndex = state.currentQuestionIndex;

    // Evaluate the answer in the background
    await dispatch(evaluateAnswer({ index: currentIndex }));

    // Decide the next step
    if (state.questionsAndAnswers.length < 6) {
      const nextIndex = state.questionsAndAnswers.length;
      let difficulty: QuestionDifficulty = "Easy";
      if (nextIndex >= 4) difficulty = "Hard";
      else if (nextIndex >= 2) difficulty = "Medium";
      dispatch(fetchQuestion(difficulty));
    } else {
      // All questions answered, generate the final summary
      dispatch(generateSummary());
    }
  };

export const {
  setFile,
  setCandidateInfo,
  submitCollectedInfo,
  startInterview,
  resetInterview,
  setError,
  submitAnswer,
} = interviewSlice.actions;

export default interviewSlice.reducer;
