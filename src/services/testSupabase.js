import { supabase, getTasks, getLeaderboard, getDatasets } from './supabase'

export const testSupabaseConnection = async () => {
  const results = {
    connection: false,
    tasks: false,
    leaderboard: false,
    datasets: false,
    errors: []
  }

  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) throw new Error(`Connection test failed: ${error.message}`)
    results.connection = true
    console.log('✅ Supabase connection successful')
  } catch (error) {
    results.errors.push(`Connection: ${error.message}`)
    console.error('❌ Supabase connection failed:', error.message)
  }

  try {
    const tasks = await getTasks()
    results.tasks = true
    console.log(`✅ Tasks API working - Found ${tasks?.length || 0} tasks`)
  } catch (error) {
    results.errors.push(`Tasks: ${error.message}`)
    console.error('❌ Tasks API failed:', error.message)
  }

  try {
    const leaderboard = await getLeaderboard(10)
    results.leaderboard = true
    console.log(`✅ Leaderboard API working - Found ${leaderboard?.length || 0} entries`)
  } catch (error) {
    results.errors.push(`Leaderboard: ${error.message}`)
    console.error('❌ Leaderboard API failed:', error.message)
  }

  try {
    const datasets = await getDatasets()
    results.datasets = true
    console.log(`✅ Datasets API working - Found ${datasets?.length || 0} datasets`)
  } catch (error) {
    results.errors.push(`Datasets: ${error.message}`)
    console.error('❌ Datasets API failed:', error.message)
  }

  console.log('\n📊 Test Summary:')
  console.log('Connection:', results.connection ? '✅' : '❌')
  console.log('Tasks API:', results.tasks ? '✅' : '❌')
  console.log('Leaderboard API:', results.leaderboard ? '✅' : '❌')
  console.log('Datasets API:', results.datasets ? '✅' : '❌')
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(err => console.log(`  - ${err}`))
  }

  return results
}

export const quickTest = async () => {
  console.log('🧪 Running Supabase Integration Test...\n')
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️  Supabase credentials not configured')
    console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
    return false
  }

  const results = await testSupabaseConnection()
  const allPassed = results.connection && results.tasks && results.leaderboard && results.datasets
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Supabase integration is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.')
  }
  
  return allPassed
}
