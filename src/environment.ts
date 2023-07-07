export const environment = {
  edgeConfig: {
    apiUrl: process.env.EDGE_CONFIG_API ?? "",
    apiToken: process.env.EDGE_CONFIG_API_TOKEN ?? "",
  },
  websiteUrl: process.env.WEBSITE_URL ?? "",
  adminToken: process.env.ADMIN_TOKEN ?? "",
};
