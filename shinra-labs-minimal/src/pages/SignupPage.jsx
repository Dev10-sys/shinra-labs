export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create Account</h1>

      <input 
        className="w-full p-3 border rounded mb-3" 
        placeholder="Full Name" 
      />
      <input 
        className="w-full p-3 border rounded mb-3" 
        placeholder="Email"
      />
      <input 
        className="w-full p-3 border rounded mb-3" 
        placeholder="Password" 
        type="password"
      />

      <button 
        className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Signup
      </button>
    </div>
  );
}
