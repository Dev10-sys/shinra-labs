import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getTasks,
  getSubmissions,
  getTransactions,
  getDatasets,
  getLeaderboard,
  getNotifications,
  getUserStats,
  getCompanyStats,
  getAdminStats,
  getAllUsers,
  getUserAchievements
} from '../services/supabase'

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks(filters)
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [JSON.stringify(filters)])

  return { tasks, loading, error, refetch: fetchTasks }
}

export const useUserStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getUserStats(user.id)
        setStats(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  return { stats, loading, error }
}

export const useCompanyStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.id || user?.user_metadata?.role !== 'company') return

    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getCompanyStats(user.id)
        setStats(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id, user?.user_metadata?.role])

  return { stats, loading, error }
}

export const useTransactions = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const data = await getTransactions(user.id)
        setTransactions(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user?.id])

  return { transactions, loading, error }
}

export const useDatasets = (filters = {}) => {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true)
        const data = await getDatasets(filters)
        setDatasets(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [JSON.stringify(filters)])

  return { datasets, loading, error }
}

export const useLeaderboard = (limit = 100) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const data = await getLeaderboard(limit)
        setLeaderboard(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [limit])

  return { leaderboard, loading, error }
}

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const data = await getNotifications(user.id)
        setNotifications(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user?.id])

  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, unreadCount, loading, error }
}

export const useSubmissions = (filters = {}) => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const data = await getSubmissions(filters)
      setSubmissions(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [JSON.stringify(filters)])

  return { submissions, loading, error, refetch: fetchSubmissions }
}

export const useAdminStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await getAdminStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}

export const useAllUsers = (filters = {}) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers(filters)
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [JSON.stringify(filters)])

  return { users, loading, error, refetch: fetchUsers }
}

export const useUserAchievements = (userId) => {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const data = await getUserAchievements(userId)
        setAchievements(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [userId])

  return { achievements, loading, error }
}
