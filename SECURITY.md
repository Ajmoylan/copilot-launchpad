# Security policy

Please report vulnerabilities privately through
[private vulnerability reporting](https://github.com/Ajmoylan/copilot-launchpad/security/advisories/new),
not in a public issue.

Design: a static, client-side app. No backend, accounts, tokens, cookies, analytics or external
requests; a Content-Security-Policy allows only the site's own files. Inputs are parsed and
range-checked before any calculation.
