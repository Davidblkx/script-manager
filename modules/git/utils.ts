export function parseBranch(text: string) {
  const match = text.match(
    /(?:##\s|)(?<branch>.*?)(?:\.\.\.|$)(?<remote>.*?)(?:\s|$)(?:.*ahead\s(?<ahead>\d)|)(?:.*behind\s(?<behind>\d)|)/,
  );
  return {
    branch: match?.groups?.branch || '',
    remote: match?.groups?.remote || undefined,
    ahead: parseInt(match?.groups?.ahead || '0', 10),
    behind: parseInt(match?.groups?.behind || '0', 10),
  };
}
