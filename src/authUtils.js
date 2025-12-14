/* Save user to localStorage */
export function storeUser(user) {
  localStorage.setItem("shinra_user", JSON.stringify(user));
}

/* Get stored user */
export function getStoredUser() {
  const data = localStorage.getItem("shinra_user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

/* Remove user */
export function logoutUser() {
  localStorage.removeItem("shinra_user");
}

/* Login user (Simulation) */
export const loginUser = async (role) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = {
    id: role === "company" ? "550e8400-e29b-41d4-a716-446655440000" : "660e8400-e29b-41d4-a716-446655440000",
    role: role,
    name: role === "company" ? "Shinra Electric Power Company" : "Cloud Strife",
    email: role === "company" ? "admin@shinra.com" : "cloud@avalanche.net",
  };

  storeUser(user);
  return true;
};
