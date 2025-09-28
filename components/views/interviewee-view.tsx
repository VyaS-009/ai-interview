"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useTimer } from "react-timer-hook";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  setFile,
  resetInterview,
  setError,
  handleAnswerSubmission,
  fetchQuestion,
  setCandidateInfo,
  submitCollectedInfo,
} from "@/lib/redux/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileUp,
  CheckCircle,
  Bot,
  User,
  CircleArrowRight,
  BrainCircuit,
} from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function IntervieweeView() {
  const dispatch: AppDispatch = useDispatch();
  const {
    interviewStatus,
    file,
    questionsAndAnswers,
    currentQuestionIndex,
    loading,
    score,
    summary,
    missingInfo,
    currentMissingInfoIndex,
  } = useSelector((state: RootState) => state.interview);

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [infoInputValue, setInfoInputValue] = useState("");

  // Effect to fetch the first question when the interview starts
  useEffect(() => {
    if (interviewStatus === "in-progress" && questionsAndAnswers.length === 0) {
      dispatch(fetchQuestion("Easy"));
    }
  }, [interviewStatus, questionsAndAnswers.length, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        dispatch(setFile({ name: selectedFile.name, type: selectedFile.type }));
        setResumeFile(selectedFile);
      } else {
        dispatch(
          setError("Invalid file type. Please upload a PDF or DOCX file.")
        );
        setResumeFile(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const mockEvent = { target: { files: [droppedFile] } } as any;
      handleFileChange(mockEvent);
    }
  };

  const handleStartInterview = async () => {
    if (!resumeFile) {
      dispatch(setError("Please select a resume file first."));
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const response = await fetch("http://localhost:8001/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume. Please try again.");
      }

      const candidateData = await response.json();
      dispatch(setCandidateInfo(candidateData));
    } catch (error: any) {
      dispatch(setError(error.message || "An unknown error occurred."));
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (infoInputValue.trim()) {
      dispatch(submitCollectedInfo(infoInputValue));
      setInfoInputValue("");
    }
  };

  const currentQuestion = questionsAndAnswers[currentQuestionIndex];

  const triggerSubmission = () => {
    if (loading) return;
    dispatch(handleAnswerSubmission(currentAnswer));
  };

  const handleAnswerSubmit = () => {
    if (currentAnswer.trim() === "") return;
    triggerSubmission();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  const expiryTimestamp = useMemo(() => {
    const time = new Date();
    if (interviewStatus === "in-progress" && currentQuestion) {
      time.setSeconds(time.getSeconds() + currentQuestion.time);
    }
    return time;
  }, [interviewStatus, currentQuestionIndex, currentQuestion?.time]);

  const { seconds, minutes, totalSeconds, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (interviewStatus === "in-progress" && !loading) {
        triggerSubmission();
      }
    },
  });

  useEffect(() => {
    if (interviewStatus === "in-progress") {
      restart(expiryTimestamp);
      setCurrentAnswer("");
    }
  }, [currentQuestionIndex, interviewStatus, restart, expiryTimestamp]);

  if (interviewStatus === "not-started") {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">
            Full-Stack Developer Interview
          </CardTitle>
          <CardDescription>
            Upload your resume to begin. The interview consists of 6 timed
            questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF or DOCX (MAX. 5MB)
              </p>
            </div>
            <Input
              id="resume-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx"
            />
          </label>
          {file && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Selected file: {file.name}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleStartInterview}
            disabled={!file || loading}
          >
            Start Interview
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (interviewStatus === "collecting-info") {
    const currentField = missingInfo?.[currentMissingInfoIndex];
    const prompt = `Thanks for uploading your resume. I couldn\'t find a valid ${currentField}. What is your ${currentField}?`;

    return (
      <div className="mt-4 flex flex-col h-[70vh]">
        <div className="flex-grow p-4 space-y-6 overflow-y-auto rounded-lg bg-muted/50">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 border">
              <AvatarFallback>
                <Bot />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-bold">AI Assistant</div>
              <div className="p-3 rounded-lg bg-background">
                <p>{prompt}</p>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleInfoSubmit} className="flex items-center p-4 mt-4 border-t">
          <Input
            placeholder={`Type your ${currentField} here...`}
            className="mx-4 flex-1"
            value={infoInputValue}
            onChange={(e) => setInfoInputValue(e.target.value)}
            autoFocus
          />
          <Button type="submit" size="icon">
            <CircleArrowRight className="w-5 h-5" />
            <span className="sr-only">Submit</span>
          </Button>
        </form>
      </div>
    );
  }

  if (interviewStatus === "in-progress") {
    return (
      <div className="mt-4 flex flex-col h-[70vh]">
        <div className="mb-4 text-sm font-medium text-center text-muted-foreground">
          Question {currentQuestionIndex + 1}/{6}
        </div>
        <div className="flex-grow p-4 space-y-6 overflow-y-auto rounded-lg bg-muted/50">
          {questionsAndAnswers
            .slice(0, currentQuestionIndex + 1)
            .map((qa, index) => (
              <React.Fragment key={index}>
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-bold">AI Interviewer</div>
                    <div className="p-3 rounded-lg bg-background">
                      <p>{qa.question}</p>
                    </div>
                  </div>
                </div>
                {qa.answer && (
                  <div className="flex items-start gap-4 justify-end">
                    <div className="grid gap-1 text-right">
                      <div className="font-bold">You</div>
                      <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                        <p>{qa.answer}</p>
                      </div>
                    </div>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
        <div className="flex items-center p-4 mt-4 border-t">
          <div className="relative">
            <CircularProgress
              value={(totalSeconds / (currentQuestion?.time || 1)) * 100}
              size={50}
              strokeWidth={5}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">{`${minutes}:${seconds
              .toString()
              .padStart(2, "0")}`}</span>
          </div>
          <Textarea
            placeholder="Type your answer here..."
            className="mx-4 flex-1"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={handleAnswerSubmit}
            disabled={loading}
          >
            <CircleArrowRight className="w-5 h-5" />
            <span className="sr-only">Submit Answer</span>
          </Button>
        </div>
      </div>
    );
  }

  if (interviewStatus === "completed") {
    return (
      <Card className="mt-4">
        <CardHeader className="items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
          <CardTitle className="text-2xl">Interview Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-lg text-muted-foreground">
              Your final score is
            </p>
            <p className="text-6xl font-bold text-primary">{score}/100</p>
          </div>
          <div className="p-4 text-left border rounded-lg bg-muted/50">
            <div className="flex items-center mb-2">
              <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
              <h3 className="font-semibold">AI-Generated Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => dispatch(resetInterview())}>
            Take New Interview
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}