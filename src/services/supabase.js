import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')

// Database table names
export const TABLES = {
  USERS: 'users',
  TASKS: 'tasks',
  DATASETS: 'datasets',
  SUBMISSIONS: 'submissions',
  PURCHASES: 'purchases',
  TRANSACTIONS: 'transactions',
  LEADERBOARD: 'leaderboard',
  NOTIFICATIONS: 'notifications',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
}

// ============================================
// USER OPERATIONS
// ============================================

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================
// TASKS OPERATIONS
// ============================================

export const getTasks = async (filters = {}) => {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      company:company_id(name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.task_type) query = query.eq('task_type', filters.task_type)
  if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
  if (filters.company_id) query = query.eq('company_id', filters.company_id)
  if (filters.freelancer_id) query = query.eq('freelancer_id', filters.freelancer_id)
  if (filters.limit) query = query.limit(filters.limit)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const getTaskById = async (taskId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      company:company_id(name, email)
    `)
    .eq('id', taskId)
    .single()
  if (error) throw error
  return data
}

export const createTask = async (task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================
// SUBMISSIONS OPERATIONS
// ============================================

export const createSubmission = async (submission) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getSubmissions = async (filters = {}) => {
  let query = supabase
    .from('submissions')
    .select(`
      *,
      task:task_id(title, payout),
      freelancer:freelancer_id(name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (filters.task_id) query = query.eq('task_id', filters.task_id)
  if (filters.freelancer_id) query = query.eq('freelancer_id', filters.freelancer_id)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.limit) query = query.limit(filters.limit)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================
// TRANSACTIONS & WALLET
// ============================================

export const getTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================
// DATASETS & MARKETPLACE
// ============================================

export const getDatasets = async (filters = {}) => {
  let query = supabase
    .from('datasets')
    .select(`
      *,
      creator:creator_id(name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (filters.data_type) query = query.eq('data_type', filters.data_type)
  if (filters.price_filter === 'free') query = query.eq('price', 0)
  if (filters.price_filter === 'paid') query = query.gt('price', 0)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================
// LEADERBOARD
// ============================================

export const getLeaderboard = async (limit = 100) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit)
  if (error) throw error
  return data
}

// ============================================
// NOTIFICATIONS
// ============================================

export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

export const markNotificationRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  if (error) throw error
  return data
}

// ============================================
// ADMIN OPERATIONS
// ============================================

export const getAllUsers = async (filters = {}) => {
  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters.role) query = query.eq('role', filters.role)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const approveSubmission = async (submissionId) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status: 'approved', verified: true })
    .eq('id', submissionId)
    .select()
    .single()
  if (error) throw error
  return data
}

export const rejectSubmission = async (submissionId) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status: 'rejected' })
    .eq('id', submissionId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================
// DATASET PURCHASES
// ============================================

export const purchaseDataset = async (buyerId, datasetId, amount) => {
  const { data, error } = await supabase
    .from('purchases')
    .insert({
      buyer_id: buyerId,
      dataset_id: datasetId,
      amount_paid: amount
    })
    .select()
    .single()
  if (error) throw error
  
  await supabase.rpc('increment_downloads', { dataset_id: datasetId })
  
  return data
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export const createNotification = async (userId, type, title, message, actionUrl = null) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================
// TASK PROGRESS
// ============================================

export const updateTaskProgress = async (taskId, progress) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ progress })
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================
// USER & COMPANY STATS
// ============================================

export const getUserStats = async (userId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data: monthlyEarnings } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'earning')
    .gte('created_at', startOfMonth.toISOString())
  
  const monthTotal = monthlyEarnings?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
  
  return {
    ...user,
    monthlyEarnings: monthTotal
  }
}

export const getCompanyStats = async (companyId) => {
  const { count: activeProjects } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .in('status', ['open', 'in_progress'])
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('payout')
    .eq('company_id', companyId)
  
  const totalSpent = tasks?.reduce((sum, t) => sum + parseFloat(t.payout), 0) || 0
  
  const { count: labelsCompleted } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true)
  
  return {
    activeProjects: activeProjects || 0,
    totalSpent,
    labelsCompleted: labelsCompleted || 0
  }
}

// ============================================
// ADMIN STATS
// ============================================

export const getAdminStats = async () => {
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
  
  const { count: activeTasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'in_progress'])
  
  const { data: pendingSubmissions } = await supabase
    .from('submissions')
    .select(`
      *,
      task:task_id(payout)
    `)
    .eq('status', 'pending')
  
  const payoutQueue = pendingSubmissions?.reduce((sum, s) => sum + parseFloat(s.task?.payout || 0), 0) || 0
  
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'platform_fee')
    .gte('created_at', startOfMonth.toISOString())
  
  const platformRevenue = monthlyTransactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
  
  return {
    totalUsers: totalUsers || 0,
    activeTasks: activeTasks || 0,
    payoutQueue,
    pendingSubmissionsCount: pendingSubmissions?.length || 0,
    platformRevenue
  }
}

// ============================================
// USER ACHIEVEMENTS
// ============================================

export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievement_id(*)
    `)
    .eq('user_id', userId)
  if (error) throw error
  return data
}

// ============================================
// AVATAR UPLOAD
// ============================================

export const uploadAvatar = async (userId, file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)
  
  if (uploadError) throw uploadError
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
  
  await updateUserProfile(userId, { avatar_url: publicUrl })
  
  return publicUrl
}

// ============================================
// SECURE RPC FUNCTIONS
// ============================================

export const secureWithdrawal = async (userId, amount, description) => {
  const { data, error } = await supabase.rpc('secure_withdrawal', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description
  })
  if (error) throw error
  return data
}

// Secure purchase - NO client-provided amount
export const securePurchase = async (userId, datasetId) => {
  const { data, error } = await supabase.rpc('secure_purchase', {
    p_user_id: userId,
    p_dataset_id: datasetId
  })
  if (error) throw error
  return data
}

// Secure approval - NO admin_id needed (uses auth.uid())
export const secureApproveSubmission = async (submissionId) => {
  const { data, error } = await supabase.rpc('secure_approve_submission', {
    p_submission_id: submissionId
  })
  if (error) throw error
  return data
}
