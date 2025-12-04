import {
  demoCompanyTasks,
  demoSubmissionsQueue,
  demoAvailableTasks,
  demoTaskSubmissions,
  demoPostedTasks,
  demoMyWork
} from "./demoData";

/* ---------------------------------------------------
   🔥 UPDATE TASK PROGRESS (AFTER APPROVAL)
--------------------------------------------------- */
function updateTaskProgress(taskTitle, itemsAdded) {
  let t =
    demoCompanyTasks.find((x) => x.title === taskTitle) ||
    demoPostedTasks.find((x) => x.title === taskTitle);

  if (t) {
    t.completed += itemsAdded;

    if (t.completed >= t.items) {
      t.status = "Completed";
    }
  }
}

/* ---------------------------------------------------
   ✔ APPROVE SUBMISSION
--------------------------------------------------- */
export function approveSubmission(id) {
  let sub = demoSubmissionsQueue.find((s) => s.id === id);

  if (sub) {
    sub.status = "Approved";

    // Add progress to the linked company task
    updateTaskProgress(sub.task, sub.items);
  }
}

/* ---------------------------------------------------
   ✔ REJECT SUBMISSION (REVISION ASSIGNMENT)
--------------------------------------------------- */
export function rejectSubmission(id) {
  let sub = demoSubmissionsQueue.find((s) => s.id === id);

  if (sub) {
    sub.status = "Rejected";

    // Return task to freelancer for revision
    demoMyWork.push({
      id: "rev_" + Date.now(),
      task: sub.task,
      itemsLabeled: 0,
      status: "Revision Needed",
      earning: "₹0",
    });
  }
}

/* ---------------------------------------------------
   ✔ CREATE TASK (COMPANY CREATES NEW TASK)
--------------------------------------------------- */
export function createTask(task) {
  const newId = "task_" + Date.now();

  const formattedTask = {
    id: newId,
    title: task.title,
    description: task.description,
    items: task.items,
    payout: task.payoutPerItem,     // FIX: number only
    completed: 0,
    status: "Open",
    type: task.type,
    category: task.category,
    difficulty: task.difficulty,
    deadline: task.deadline || "Not set",
    sampleFile: task.sampleFile || "",
  };

  // Add into company task list
  demoPostedTasks.push(formattedTask);
  demoCompanyTasks.push(formattedTask);

  // Add to available tasks for freelancers
  demoAvailableTasks.push({
    id: newId,
    title: formattedTask.title,
    description: formattedTask.description,
    company: "Your Company",
    payoutPerItem: task.payoutPerItem,
    estItems: task.items,
    time: "Few hours",

    // Required for TaskDetailsPage
    items: task.items,
    completed: 0,
    status: "Open",
  });
}

/* ---------------------------------------------------
   ✔ FREELANCER ACCEPTS TASK
--------------------------------------------------- */
export function acceptTask(id) {
  const task = demoAvailableTasks.find((t) => t.id === id);
  if (!task) return;

  // Add to My Work section
  demoMyWork.push({
    id: id,
    task: task.title,
    itemsLabeled: 0,
    status: "Working",
    earning: "₹0",
  });

  // Remove from "Available" list
  const idx = demoAvailableTasks.findIndex((t) => t.id === id);
  if (idx !== -1) demoAvailableTasks.splice(idx, 1);
}

/* ---------------------------------------------------
   ✔ FREELANCER SUBMITS WORK
--------------------------------------------------- */
export function submitWork(sub) {
  const submissionId = "sb_" + Date.now();

  const formatted = {
    id: submissionId,
    taskId: sub.taskId,      // FIXED: ID added
    task: sub.task,          // title
    itemsDone: sub.itemsDone,
    notes: sub.notes,
    submittedAt: "Just now",
    status: "Pending review",
  };

  // Add to freelancer's submission history
  demoTaskSubmissions.push(formatted);

  // Add to company review queue
  demoSubmissionsQueue.push({
    id: submissionId,
    task: sub.task,
    freelancer: "Freelancer User",
    items: sub.itemsDone,
    submittedAt: "Just now",
    status: "Pending review",
  });

  // Update freelancer MyWork progress
  const mw = demoMyWork.find((t) => t.id === sub.taskId);
  if (mw) {
    mw.itemsLabeled = sub.itemsDone;
    mw.status = "Submitted";
  }
}
