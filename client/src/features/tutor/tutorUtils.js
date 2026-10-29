
export function makeTutorHistory(messages) {
  return messages.map(({ role, content }) => ({ role, content }));
}
