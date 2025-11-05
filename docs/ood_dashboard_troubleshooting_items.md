# Open OnDemand Dashboard Troubleshooting Item Backlog

This backlog lists candidate troubleshooting scenarios for the Open OnDemand (OOD) dashboard. Use it to prioritize which situations deserve full runbooks for the operations team.

## Index

- [Access & Authentication](#access--authentication)
- [Dashboard Navigation](#dashboard-navigation)
- [Files App](#files-app)
- [Job Composer & Scheduler Integration](#job-composer--scheduler-integration)
- [Interactive Apps](#interactive-apps)
- [Clusters App](#clusters-app)
- [Data Transfers](#data-transfers)
- [Resource Quotas & Usage](#resource-quotas--usage)
- [Browser & Environment Issues](#browser--environment-issues)
- [Account & Profile Management](#account--profile-management)
- [System Health & Notifications](#system-health--notifications)
- [Support Escalation](#support-escalation)

## Access & Authentication

- Login fails with `Invalid user or password` despite valid credentials (check LDAP/Kerberos status, multi-factor requirements, locked accounts).
- CAS/SAML authentication redirects in a loop or returns `unauthorized` (verify IdP metadata, clock skew, attribute release).
- Duo or other MFA prompt never appears when logging in from the dashboard (confirm per-app MFA enforcement and device enrollment).
- Session expires immediately after login or returns to login screen (investigate cookie domain, reverse proxy headers, time skew).
- User sees `Forbidden` or `403` when reaching `/pun/sys/dashboard` (check nginx stage per-user directory permissions and group allow lists).

## Dashboard Navigation

- Missing dashboard tiles (Interactive Apps, Clusters, Jobs) after login (validate user mapping config and per-app role restrictions).
- Navigation sidebar links return 404 errors (confirm Passenger app deployment paths and nginx stage symlinks).
- Dashboard fails to load with a blank page or infinite spinner (review browser console errors, check `/var/log/ondemand-nginx/<user>/error.log`).
- Favorite links or custom tiles disappear between sessions (check `~/.config/ood/dashboard/*.yml` persistence and quota).

## Files App

- Files app reports `Unable to stat home directory` (confirm home directory exists and permissions are correct).
- Upload button missing or disabled (check `file_upload` whitelist, disk quotas, SELinux/AppArmor policies).
- Drag-and-drop upload stalls at 0% (review nginx upload temp directory, proxy buffer sizes, browser compatibility).
- File downloads start but complete with zero-byte files (validate nginx proxy buffering and storage mount health).
- File editor cannot save changes due to `Permission denied` (confirm POSIX perms, ACLs, root-squash on NFS).

## Job Composer & Scheduler Integration

- Job Composer template list empty (verify template repository clone and git permissions).
- Job submission fails with `sbatch: command not found` (check scheduler module availability, PATH initialization scripts).
- Jobs stay in `Queued` state indefinitely (inspect scheduler queue status, fair-share limits, user priority).
- Job details page missing output/error logs (confirm cluster config `stderr_path`/`stdout_path`, check shared filesystem sync).
- Job Composer cannot copy workflows due to readonly templates (verify file permissions on `~/ondemand/data/job_composer/`).

## Interactive Apps

- App launch form never displays available clusters (confirm `clusters.d` config and per-cluster allow lists).
- Launch button greyed out due to validation errors that are not visible (inspect form field defaults, JavaScript errors).
- Session stuck in `Queued` (investigate cluster scheduler backlog, QoS/partition limits, `min_cpu` request).
- Session transitions to `Failed` immediately (check app manifests, module loads, `before.sh` scripts, container images).
- VNC/novnc window launches but shows `Failed to connect to server` (confirm reverse proxy websocket configuration, firewall).
- Jupyter or RStudio sessions prompt for password unexpectedly (review app authentication configuration and token generation scripts).
- Interactive App cards missing from dashboard (check `apps/` symlinks, `manifest.yml` visibility flags, cluster allow lists).

## Clusters App

- Cluster shell access fails with `SSH authentication failed` (check authorized_keys deployment, Kerberos ticket forwarding).
- Shell opens but command prompt never appears (investigate shell init scripts, quota issues on `/tmp`).
- View Jobs tab fails with scheduler API error (validate `squeue`/`qstat` command paths and cluster config `job_cmd`).
- Connection closes immediately after open (review MaxStartups in sshd, reverse proxy timeout settings).

## Data Transfers

- scp/rsync batch transfers fail in Files app (check `sshcmd` wrappers, firewall rules, remote host key changes).
- Globus link missing from dashboard (ensure `ood_portal.yml` `navbar_links` configuration).
- Transfer progress meter frozen (inspect browser console, confirm websockets or SSE endpoints not blocked).
- External SFTP tab throws certificate warnings (verify TLS cert chain, client trust store).

## Resource Quotas & Usage

- Dashboard banner reports `Home directory quota exceeded` (check `quota` integration scripts, escalate to storage team).
- User receives `Disk quota exceeded` during job or file upload (confirm quota enforcement, instruct user on cleanup).
- GPU or node allocation limits prevent job launch (review scheduler QoS, per-user usage policies).
- Accounting data in Usage app missing or outdated (verify cron ingest jobs, database connectivity).

## Browser & Environment Issues

- Dashboard unsupported browser warning appears (document supported versions, update feature detection scripts).
- Cached credentials causing login loops (instruct clearing cookies, using private window).
- Pop-up blockers preventing VNC window (advise allowing pop-ups for `*.institution.edu`).
- Accessibility issues with screen readers (ensure ARIA roles, escalate to UI team).
- Mixed-content warnings when embedding HTTP iframes (enforce HTTPS endpoints).

## Account & Profile Management

- User cannot locate `Change Password` link (point to institution identity portal; verify `navbar_links`).
- OOD shell does not load environment modules (confirm `.bashrc` guard to skip non-interactive behavior).
- Default shell differs from cluster shell (update `/etc/ood/config/nginx_stage.yml` `user_shell` setting).
- User wants to reset dashboard settings (delete `~/.config/ood/dashboard/` or use provided reset script).

## System Health & Notifications

- MOTD banner outdated or missing (check `/etc/ood/config/apps/dashboard/env` and template overrides).
- System status widget stuck loading (verify status API endpoint, caching layer).
- Broadcast notifications do not appear for specific groups (review `announcement.yml` audience filters).
- Dashboard timeouts during maintenance windows (coordinate maintenance mode messaging and reverse proxy config).

## Support Escalation

- Determine when to escalate to OOD core team vs. local cluster admins.
- Collect required log bundles (`/var/log/ondemand-nginx/<user>/`, `/var/log/httpd/`, cluster scheduler logs).
- Outline data privacy considerations before requesting user home directory snapshots.
- Track recurring incidents to identify platform bugs requiring upstream patches.
