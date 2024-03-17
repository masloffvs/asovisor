module.exports = {
  apps: [
    {
      name: "ASOVizor Web",
      script: "npm",
      args: "start",
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "ASOVizor Service",
      script: "npm",
      args: "run service",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
