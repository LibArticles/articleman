export default function getSettings() {
  return {
    document: PropertiesService.getDocumentProperties().getProperties(),
    user: PropertiesService.getUserProperties().getProperties(),
    global: PropertiesService.getScriptProperties().getProperties(),
  };
}