# defiant-lp-claude-skills

A Claude Code [plugin marketplace](https://docs.claude.com/en/docs/claude-code/plugins) of skills and plugins for LPs and VCs — portfolio monitoring, diligence, and workflow automation.

## Install the marketplace

In Claude Code:

```
/plugin marketplace add camrail/defiant-lp-claude-skills
```

Then browse and install any plugin:

```
/plugin install portfolio-news-monitor@defiant-lp-claude-skills
```

Or open the picker with `/plugin` and select from the list.

## Plugins

| Plugin | What it does |
|---|---|
| [`portfolio-news-monitor`](./plugins/portfolio-news-monitor/) | Scaffolds a daily portfolio-news dashboard with valuation-sensitive items flagged, plus daily and weekly scheduled refreshes. |

## Repo layout

```
.claude-plugin/
  marketplace.json          # Marketplace manifest — lists every plugin in this repo
plugins/
  portfolio-news-monitor/
    .claude-plugin/
      plugin.json           # Plugin manifest
    skills/
      portfolio-news-setup/ # The skill that does the work
    README.md
```

## Contributing a plugin

Add a new directory under `plugins/`, drop in a `.claude-plugin/plugin.json` manifest plus any `skills/`, `commands/`, `agents/`, or `hooks/` the plugin needs, and append an entry to `.claude-plugin/marketplace.json`.

## License

MIT
