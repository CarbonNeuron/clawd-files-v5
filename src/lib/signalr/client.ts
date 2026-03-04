export async function createFileHub(baseUrl: string) {
  const signalR = await import("@microsoft/signalr");
  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hub/files`)
    .withAutomaticReconnect()
    .build();
}
