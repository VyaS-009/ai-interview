"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  resetInterview,
  startInterview,
  setError,
} from "@/lib/redux/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IntervieweeView } from "@/components/views/interviewee-view";
import { InterviewerView } from "@/components/views/interviewer-view";

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { interviewStatus, error } = useSelector(
    (state: RootState) => state.interview
  );

  const [showResumeDialog, setShowResumeDialog] = useState(false);

  useEffect(() => {
    if (interviewStatus === "in-progress") {
      setShowResumeDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount to check for persisted state

  return (
    <Tabs defaultValue="interviewee" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="interviewee">Interviewee</TabsTrigger>
        <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
      </TabsList>

      <TabsContent value="interviewee">
        <IntervieweeView />
      </TabsContent>

      <TabsContent value="interviewer">
        <InterviewerView />
      </TabsContent>

      {/* Error Modal */}
      <Dialog open={!!error} onOpenChange={() => dispatch(setError(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => dispatch(setError(null))}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Welcome Back Modal */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
            <DialogDescription>
              You have an unfinished interview session. Would you like to resume
              where you left off?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(resetInterview());
                setShowResumeDialog(false);
              }}
            >
              Start Over
            </Button>
            <Button
              onClick={() => {
                // We don't need to pass candidate data here because the persisted state already has it
                dispatch(startInterview());
                setShowResumeDialog(false);
              }}
            >
              Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
