"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Bot, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function InterviewerView() {
  const { candidates } = useSelector((state: RootState) => state.candidates);
  const [searchTerm, setSearchTerm] = useState("");

  const getBadgeClass = (score: number) => {
    if (score > 75) return "bg-green-500 hover:bg-green-600";
    if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const filteredCandidates = useMemo(
    () =>
      candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [candidates, searchTerm]
  );

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Candidate Dashboard</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Candidate</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {candidate.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getBadgeClass(candidate.score)}>
                      {candidate.score}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-sm truncate">
                    {candidate.summary}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>
                            Interview Details: {candidate.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="h-[400px] p-4 space-y-6 overflow-y-auto rounded-lg bg-muted/50">
                          {candidate.chatHistory.map(
                            (qa: { q: string; a: string }, index: number) => (
                              <React.Fragment key={index}>
                                <div className="flex items-start gap-4">
                                  <Avatar className="w-10 h-10 border">
                                    <AvatarFallback>
                                      <Bot />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="grid gap-1">
                                    <div className="font-bold">
                                      AI Interviewer
                                    </div>
                                    <div className="p-3 rounded-lg bg-background">
                                      <p>{qa.q}</p>
                                    </div>
                                  </div>
                                </div>
                                {qa.a && (
                                  <div className="flex items-start gap-4 justify-end">
                                    <div className="grid gap-1 text-right">
                                      <div className="font-bold">You</div>
                                      <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                                        <p>{qa.a}</p>
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
                            )
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No completed interviews yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
