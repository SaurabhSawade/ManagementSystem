-- CreateIndex
CREATE INDEX "AttendanceRecord_classRoomId_idx" ON "AttendanceRecord"("classRoomId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_subjectId_idx" ON "AttendanceRecord"("subjectId");

-- CreateIndex
CREATE INDEX "BookIssue_bookId_idx" ON "BookIssue"("bookId");

-- CreateIndex
CREATE INDEX "BookIssue_userId_idx" ON "BookIssue"("userId");

-- CreateIndex
CREATE INDEX "Mark_classRoomId_idx" ON "Mark"("classRoomId");

-- CreateIndex
CREATE INDEX "Mark_subjectId_idx" ON "Mark"("subjectId");

-- CreateIndex
CREATE INDEX "Result_classRoomId_idx" ON "Result"("classRoomId");
