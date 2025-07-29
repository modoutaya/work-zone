# Troubleshooting Guide

## GitHub Pages Deployment Issues

### Environment Protection Rules Error

**Error**: `Tag "v1.0.0" is not allowed to deploy to github-pages due to environment protection rules.`

**Solution**: 
1. **Simplified Workflow**: The current workflow removes the `environment` configuration to avoid protection rules
2. **Alternative**: If you need environment protection, configure it in GitHub repository settings

### Steps to Fix Environment Issues

1. **Go to Repository Settings**:
   - Navigate to your repository on GitHub
   - Go to Settings → Environments
   - Check if `github-pages` environment exists

2. **Configure Environment Protection** (if needed):
   - Create or edit the `github-pages` environment
   - Set deployment branch rules
   - Configure required reviewers (optional)

3. **Alternative: Use Simple Workflow**:
   - The current workflow bypasses environment protection
   - This is suitable for most projects

### Common Issues and Solutions

#### Issue 1: Build Fails
```bash
# Check locally first
npm run deploy:check
```

#### Issue 2: Tests Fail
```bash
# Run tests locally
npm run test
```

#### Issue 3: Linting Errors
```bash
# Fix auto-fixable issues
npm run lint:fix
```

#### Issue 4: TypeScript Errors
```bash
# Check types
npm run type-check
```

### Manual Deployment

If automatic deployment fails, you can deploy manually:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Push to gh-pages branch**:
   ```bash
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

### GitHub Pages Configuration

1. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` or `main` (with `/docs` folder)

2. **Custom Domain** (optional):
   - Add your domain in Settings → Pages
   - Create a `CNAME` file in your repository

### Workflow Debugging

#### Check Workflow Logs
1. Go to Actions tab in your repository
2. Click on the failed workflow
3. Check the specific step that failed

#### Common Workflow Issues
- **Node.js version**: Ensure compatibility
- **Dependencies**: Check if all packages are available
- **Build output**: Verify `dist` folder is created
- **Permissions**: Ensure workflow has proper permissions

### Performance Optimization

#### Build Optimization
- Use `npm ci` instead of `npm install`
- Enable npm cache in workflow
- Optimize bundle size with code splitting

#### Deployment Speed
- Use concurrent jobs where possible
- Optimize build steps
- Use caching for dependencies

### Security Considerations

#### Secrets Management
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly

#### Permissions
- Use minimal required permissions
- Review workflow permissions regularly
- Follow principle of least privilege

### Monitoring and Alerts

#### Set up Notifications
1. Go to repository Settings → Notifications
2. Configure email/webhook notifications
3. Set up deployment status alerts

#### Health Checks
- Monitor deployment success rate
- Track build times
- Monitor bundle sizes

### Rollback Strategy

#### Quick Rollback
1. Revert to previous commit
2. Create new tag
3. Trigger new deployment

#### Emergency Rollback
1. Manually deploy previous version
2. Update DNS if using custom domain
3. Communicate to users

### Best Practices

1. **Always test locally** before pushing
2. **Use semantic versioning** for tags
3. **Keep workflows simple** and maintainable
4. **Monitor deployments** regularly
5. **Document changes** in releases
6. **Backup important data** before major changes

### Getting Help

If you encounter issues not covered here:

1. **Check GitHub Actions documentation**
2. **Review workflow logs** for specific errors
3. **Search GitHub Issues** for similar problems
4. **Ask in GitHub Community** forums 