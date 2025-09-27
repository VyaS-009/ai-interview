'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileUp, X, CheckCircle, Clock, Mic } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const [interviewState, setInterviewState] = useState('not-started');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const startInterview = () => setInterviewState('in-progress');
  const endInterview = () => setInterviewState('completed');
  const resetInterview = () => {
    setInterviewState('not-started');
    setFileName('');
  };

  return (
    <Tabs defaultValue="interviewee" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="interviewee">Interviewee</TabsTrigger>
        <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
      </TabsList>
      <TabsContent value="interviewee">
        {interviewState === 'not-started' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Prepare for your interview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
              <FileUp className="w-16 h-16 text-primary" />
              <p>Upload your resume to get started (PDF or DOCX)</p>
              <div className="flex items-center space-x-2">
                <Input type="file" id="resume-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Button asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                {fileName && <p>{fileName}</p>}
              </div>
              <Button onClick={startInterview} disabled={!fileName}>Start Interview</Button>
            </CardContent>
          </Card>
        )}
        {interviewState === 'in-progress' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Interview in Progress - Question 1 of 10</CardTitle>
              <Progress value={10} className="w-full mt-2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 h-[400px] overflow-y-auto">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <p>Tell me about a time you faced a challenge at work.</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>5:00</span>
                <Textarea placeholder="Type your answer here..." className="flex-1" />
                <Button>Submit Answer</Button>
                <Button variant="outline" size="icon">
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {interviewState === 'completed' && (
          <Card className="mt-4">
            <CardHeader className="items-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <CardTitle>Interview Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg">Your final score is</p>
              <p className="text-5xl font-bold">88/100</p>
              <p className="text-muted-foreground">You did great! Here is a summary of your performance and some feedback for improvement.</p>
              <Button onClick={resetInterview}>Take New Interview</Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="interviewer">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Candidate Dashboard</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search candidates..." />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell><Badge className="bg-green-500">92</Badge></TableCell>
                  <TableCell>Excellent problem-solving skills...</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>John Doe - Interview Details</DialogTitle>
                        </DialogHeader>
                        <div className="h-[400px] overflow-y-auto">
                          {/* Chat history would go here */}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
