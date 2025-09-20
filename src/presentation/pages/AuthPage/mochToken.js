export function generateMockToken(username) {
  const payload = {
    name: username,
    nameidentifier: username + "_id",
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
  };
  return btoa(JSON.stringify(payload));
}

export function decodeMockToken(token) {
  return JSON.parse(atob(token));
}
