import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Candidate {
  id: number;
  name: string;
  email: string;
  score: number;
  summary: string;
  chatHistory: { q: string; a: string }[];
}

interface CandidatesState {
  candidates: Candidate[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CandidatesState = {
  candidates: [],
  status: "idle",
  error: null,
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    // Placeholder for fetching candidates, can be converted to an async thunk
    setCandidates(state, action: PayloadAction<Candidate[]>) {
      state.candidates = action.payload;
      state.status = "succeeded";
    },
    addCandidate(state, action: PayloadAction<Omit<Candidate, "id">>) {
      const newCandidate = {
        ...action.payload,
        id: state.candidates.length + 1,
      };
      state.candidates.unshift(newCandidate); // Add to the top of the list
    },
  },
});

export const { setCandidates, addCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;
