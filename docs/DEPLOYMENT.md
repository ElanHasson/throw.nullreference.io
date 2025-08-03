# Deployment Guide

## PR Preview Deployments

This repository is configured to automatically deploy preview environments for every pull request using DigitalOcean App Platform.

### How it works

1. **When a PR is opened/updated**: A new DigitalOcean App is created with the name pattern `throw-nullreference-io-pr-{PR_NUMBER}`
2. **Deployment URL**: The preview URL is automatically commented on the PR
3. **When PR is closed**: The preview app is automatically deleted

### Prerequisites

You need to set up the following GitHub secret:

- `DIGITALOCEAN_ACCESS_TOKEN`: Your DigitalOcean API token with App Platform permissions

### Features

- 🚀 Automatic deployments on PR creation/update
- 💬 PR comments with preview URLs
- 🧹 Automatic cleanup when PR is closed
- 🔄 Updates on subsequent commits
- 📱 Full static site deployment

### DigitalOcean App Configuration

The app is configured as a static site with:
- **Build Command**: `yarn install --frozen-lockfile && yarn build`
- **Output Directory**: `out`
- **Environment**: Node.js
- **Region**: NYC

### Manual Deployment

To manually deploy using doctl:

```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Deploy using app spec
doctl apps create --spec .do/app.yaml
```

### Monitoring Deployments

You can monitor your deployments in the [DigitalOcean App Platform dashboard](https://cloud.digitalocean.com/apps).

### Cost Optimization

To minimize costs:
- PR apps are automatically deleted when PRs are closed
- Consider setting spending alerts in your DigitalOcean account
- Review and clean up any orphaned apps regularly

### Troubleshooting

If a deployment fails:
1. Check the GitHub Actions logs
2. Verify your DigitalOcean token has the correct permissions
3. Check the DigitalOcean App Platform logs
4. Ensure the build command succeeds locally