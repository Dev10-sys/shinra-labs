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
