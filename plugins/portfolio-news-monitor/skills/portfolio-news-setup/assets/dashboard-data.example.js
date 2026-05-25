// Example dashboard data — design preview, populated from real recent items.
//
// The firm and companies are real. The items below were gathered via web
// search on May 25, 2026 and are real events at their real dates, with
// links to the primary or earliest reporting source. They are used here
// for design preview only: dates, tier classifications, and the "why it
// matters" framing reflect a single moment-in-time read and are not
// independent investment recommendations.
//
// The `is_example: true` flag triggers the on-page "Sample data" banner so
// the preview can't be confused with a real refresh.
//
// This file is loaded first and sets DASHBOARD_DATA only if undefined,
// so the real dashboard-data.js written by the daily refresh wins when
// present in the user's workspace.

window.DASHBOARD_DATA = window.DASHBOARD_DATA || {
  as_of: "Mon, May 25, 2026",
  is_example: true,

  // Timestamp of the previous daily refresh. The renderer uses this to
  // populate the "New since last refresh" section by scanning every item
  // in companies[].items and picking those whose date is on or after
  // last_refresh. Deliberately set to a week ago here so the preview
  // shows the "you've been away" / accumulated-items state.
  last_refresh: "Mon, May 18, 2026",

  settings: {
    firm_name: "Ferd",
    firm_domain: "ferd.no",
    accent_color: "#2563eb"
  },

  flagged: [
    {
      company: "Dust",
      url: "https://tech.eu/2026/05/18/dust-raises-40m-series-b-to-build-the-multiplayer-operating-system-for-enterprise-ai/",
      title: "Dust raises $40M Series B led by Abstract and Sequoia",
      why: "Material funding round; round size + lead syndicate cement Dust as a leading European enterprise-AI bet.",
      is_new: false
    },
    {
      company: "n8n",
      url: "https://www.bloomberg.com/news/articles/2026-05-12/sap-invests-in-ai-automation-startup-n8n-at-5-2-billion-value",
      title: "SAP invests in n8n at $5.2B valuation; embeds n8n inside Joule Studio",
      why: "Strategic investor + multi-year distribution deal embedding n8n in SAP's agent builder. Doubles valuation, opens enterprise channel.",
      is_new: false
    }
  ],

  companies: [
    {
      name: "n8n",
      website: "https://n8n.io/",
      domain: "n8n.io",
      category: "Workflow Automation / AI Agents",
      summary: "Open-source workflow + AI agent platform. Berlin HQ; PLG via developers, large open-source community.",
      items: [
        {
          tier: "material",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/sap-invests-in-ai-automation-startup-n8n-at-5-2-billion-value",
          title: "SAP invests in n8n at $5.2B valuation; multi-year deal embeds n8n in SAP Joule Studio",
          source: "Bloomberg",
          date: "May 12, 2026",
          context: "Strategic + commercial; valuation roughly doubles"
        },
        {
          tier: "context",
          url: "https://sequoiacap.com/podcast/training-data-jan-oberhauser/",
          title: "Training Data: How n8n became the universal AI automation layer",
          source: "Sequoia Training Data",
          date: "August 2025",
          tldr: "Jan Oberhauser walks through how n8n's revenue 4x'd in eight months once they re-positioned from workflow automation to the orchestration layer for AI applications. The wedge: letting non-Python developers build full AI agents end-to-end without bolting AI on top of legacy automation primitives.",
          read_through: "Reinforces the orchestration-layer thesis — the durable enterprise value in AI seems to sit at the runtime / agent-coordination layer, not the model or framework layer. Relevant for how we read Dust's and Granola's positioning."
        }
      ]
    },

    {
      name: "Weaviate",
      website: "https://weaviate.io/",
      domain: "weaviate.io",
      category: "Data Infrastructure / Vector DB",
      summary: "Open-source vector database for AI / RAG applications. Amsterdam HQ; commercial via Weaviate Cloud + partner clouds.",
      items: [
        {
          tier: "context",
          url: "https://newsletter.weaviate.io/p/managed-weaviate-on-digitalocean-search-agents-and-the-future-of-retrieval",
          title: "Managed Weaviate on DigitalOcean enters private preview (unveiled at DO Deploy)",
          source: "Weaviate Newsletter",
          date: "May 7, 2026",
          context: "Distribution partnership; expands hosted footprint beyond Weaviate Cloud + GCP marketplace"
        },
        {
          tier: "context",
          url: "https://weaviate.io/blog/weaviate-1-37-release",
          title: "Weaviate 1.37 ships MCP Server, Diversity Search (MMR), Query Profiling (all in preview)",
          source: "Weaviate Blog",
          date: "April 23, 2026",
          context: "Aimed squarely at the AI-agent runtime use-case Weaviate is now positioned around"
        }
      ]
    },

    {
      name: "Granola",
      website: "https://granola.ai/",
      domain: "granola.ai",
      category: "Productivity / AI Meeting Notes",
      summary: "Native AI notepad for back-to-back meetings. London-based; PLG via knowledge workers; Series C at $1.5B (Mar 2026).",
      items: [
        {
          tier: "context",
          url: "https://www.granola.ai/updates",
          title: "Briefs ship: meeting context + participant info delivered on join",
          source: "Granola updates",
          date: "May 20, 2026",
          context: "Pre-meeting prep layer; pushes Granola further into structured workflow vs ad-hoc note-taking"
        },
        {
          tier: "context",
          url: "https://www.granola.ai/updates",
          title: "Granola Chat rebuilt — faster performance, inline citations, Recipes across shared notes",
          source: "Granola updates",
          date: "April 21, 2026",
          context: "Strengthens the case for Granola as a knowledge-retrieval surface, not just a notepad"
        },
        {
          tier: "context",
          url: "https://techcrunch.com/2026/03/25/granola-raises-125m-hits-1-5b-valuation-as-it-expands-from-meeting-notetaker-to-enterprise-ai-app/",
          title: "Granola raises $125M Series C led by Index; valuation hits $1.5B",
          source: "TechCrunch",
          date: "March 25, 2026",
          context: "Series C; pivots company narrative from prosumer notepad to enterprise context layer"
        }
      ]
    },

    {
      name: "Dust",
      website: "https://dust.tt/",
      domain: "dust.tt",
      category: "Enterprise AI / Agents Platform",
      summary: "Multiplayer AI for human-agent collaboration in the enterprise. Paris HQ; 3,000+ orgs, 51k MAU, 300k agents deployed.",
      items: [
        {
          tier: "material",
          url: "https://tech.eu/2026/05/18/dust-raises-40m-series-b-to-build-the-multiplayer-operating-system-for-enterprise-ai/",
          title: "Dust raises $40M Series B led by Abstract and Sequoia (Snowflake Ventures, Datadog follow)",
          source: "Tech.eu",
          date: "May 18, 2026",
          context: "Round + lead syndicate cement Dust as a top-tier European enterprise-AI bet"
        },
        {
          tier: "context",
          url: "https://siliconangle.com/2026/05/18/multiplayer-ai-startup-dust-swipes-40m-funding-help-enterprises-move-beyond-isolated-ai-assistants/",
          title: "Dust traction: 3k organisations, 51k MAU, 300k agents deployed, zero churn 2025",
          source: "SiliconANGLE",
          date: "May 18, 2026",
          context: "Disclosed alongside the raise; underlines the customer-density narrative"
        }
      ]
    },

    {
      name: "Genie AI",
      website: "https://genieai.co/",
      domain: "genieai.co",
      category: "LegalTech / AI Drafting",
      summary: "Agentic AI for contract drafting + negotiation. London HQ; GV/Khosla-backed; 200k+ users on platform.",
      items: [
        {
          tier: "context",
          url: "https://www.verdict.co.uk/genieai-rolls-out-genie-3-0/",
          title: "Genie 3.0 launches — Eidetic Intelligence architecture, autonomous contract agents",
          source: "Verdict",
          date: "May 1, 2026",
          context: "Headline platform release; shifts positioning from draft-assist to agentic contract management"
        }
      ]
    }
  ]
};
