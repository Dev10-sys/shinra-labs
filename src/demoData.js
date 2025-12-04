/* ---------------- FREELANCER STATS ---------------- */
export const demoFreelancerStats = {
  totalEarnings: "₹12,850",
  tasksCompleted: 28,
  rank: 142,
};

/* ---------------- COMPANY STATS ---------------- */
export const demoCompanyStats = {
  totalSpend: "₹48,200",
  activeTasks: 4,
  completedTasks: 21,
  pendingSubmissions: 3,
};

/* ---------------- COMPANY POSTED TASKS ---------------- */
export const demoCompanyTasks = [
  {
    id: "company_task_1",
    title: "Hindi Sentiment Classification",
    description: "Label each sentence as positive, negative, or neutral.",
    payout: 1,               // FIXED: number only
    items: 500,
    completed: 120,
    status: "Open",
    type: "Text",
    category: "Sentiment Analysis",
    difficulty: "Easy",
    deadline: "2025-12-15",
    sampleFile: "",
  },
  {
    id: "company_task_2",
    title: "Image OCR – Street Signs",
    description: "Extract text from Indian street signboards.",
    payout: 2,              // FIXED: number only
    items: 300,
    completed: 75,
    status: "Open",
    type: "Image",
    category: "OCR",
    difficulty: "Medium",
    deadline: "2025-12-20",
    sampleFile: "",
  },
];

/* ---------------- AVAILABLE TASKS FOR FREELANCERS ---------------- */
export const demoAvailableTasks = [
  {
    id: "avail_task_1",       // FIXED unique
    title: "Hindi Sentiment Classification",
    company: "DataCode AI",
    payoutPerItem: 1,
    estItems: 500,
    time: "Few hours",

    // FIXED — for TaskDetailsPage
    items: 500,
    completed: 120,
    status: "Open",
  },
  {
    id: "avail_task_2",      // FIXED unique
    title: "Image OCR – Street Signs",
    company: "VisionPro",
    payoutPerItem: 2,
    estItems: 300,
    time: "2–3 hours",

    // FIXED
    items: 300,
    completed: 75,
    status: "Open",
  },
];

/* ---------------- MY WORK (FREELANCER ACCEPTED) ---------------- */
export const demoMyWork = [
  // Added when freelancer accepts task
];

/* ---------------- POSTED TASKS (COMPANY CREATED) ---------------- */
export const demoPostedTasks = [
  // Added through createTask()
];

/* ---------------- FREELANCER SUBMISSIONS ---------------- */
export const demoTaskSubmissions = [
  // Added in submitWork()
];

/* ---------------- COMPANY REVIEW QUEUE ---------------- */
export const demoSubmissionsQueue = [
  {
    id: "sub_1",
    task: "Hindi Sentiment Classification",
    freelancer: "Freelancer User",
    items: 25,
    submittedAt: "1 hour ago",
    status: "Pending review",
  },
  {
    id: "sub_2",
    task: "Image OCR – Street Signs",
    freelancer: "Freelancer User",
    items: 12,
    submittedAt: "2 hours ago",
    status: "Pending review",
  },
];
