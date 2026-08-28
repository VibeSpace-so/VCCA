import type { ConceptSeed } from "./types.js";

export const STARTUP_SEEDS: Record<string, ConceptSeed> = {
  "customer-interviews": {
    category: "business",
    question: "How do you learn what customers actually need before you build?",
    explanation:
      "Customer interviews are structured conversations with real people in your target market. They help you move from guesses about the problem to specific evidence about pain, current behavior, and willingness to switch. Done badly, they become pitches in disguise; done well, they expose the gap between what people say and what they do.",
    apply:
      "Find five people who match your ideal customer and ask them to walk you through the last time they felt the problem. Do not mention your solution until the end.",
    why:
      "Vibe coders love building, but the most common startup failure is solving a problem no one cares enough about to pay for. Interviews protect you from that trap.",
    misconception:
      "If people say the idea is interesting, they will definitely buy it.",
    example:
      "A founder building habit tracking for freelancers asks freelancers to describe how they currently bill time and what goes wrong at month-end.",
    case_study:
      "Airbnb founders interviewed hosts in person in New York, discovered that professional photography was the real pain, and used that insight to redesign their offering.",
    resources: [
      "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice",
    ],
    prereqs: ["validation", "smoke-test"],
    next: ["problem-validation", "ideal-customer-profile"],
    example_answer:
      "Customer interviews are structured conversations with real target customers that focus on their actual behavior and pain before the founder pitches any solution.",
    anti_patterns: [
      "asking leading questions",
      "treating interviews as sales calls",
      "only talking to friends",
    ],
  },
  "market-sizing": {
    category: "business",
    question: "Is the market large enough to justify a venture-scale business?",
    explanation:
      "Market sizing estimates the total addressable, serviceable addressable, and serviceable obtainable market for your product. It helps you decide if the opportunity is venture-backable, bootstrappable, or too small.",
    apply:
      "Calculate TAM, SAM, and SOM using both top-down and bottom-up methods. Compare your bottom-up SOM to the revenue you need in five years.",
    why:
      "Investors and founders need to know whether the prize is worth the effort. A tiny market limits your exit and growth options.",
    misconception:
      "A large TAM means you can capture 1% of it easily.",
    example:
      "A niche legal-tech tool has a $2 billion global TAM, a $200 million SAM in English-speaking markets, and a $5 million SOM in its first three years.",
    case_study:
      "Many food delivery startups sized the total market of all restaurant spending but underestimated the serviceable obtainable share and burned out competing for thin margins.",
    resources: ["https://wise.com/gb/blog/tam-sam-vs-som"],
    prereqs: ["value-proposition"],
    next: ["competitive-analysis"],
    example_answer:
      "Market sizing is estimating the total, serviceable, and obtainable market for your product to decide if the opportunity is large enough.",
    anti_patterns: [
      "using top-down numbers without bottom-up validation",
      "claiming 1% of a giant market",
      "ignoring geographic or segment limits",
    ],
  },
  "business-model": {
    category: "business",
    question: "How does your startup create, deliver, and capture value?",
    explanation:
      "A business model describes who your customer is, what value you provide, how you reach them, how you make money, and what key activities and costs are required. It is the operating blueprint that turns an idea into a sustainable company.",
    apply:
      "Sketch your business model on a canvas and identify the riskiest part. Test that part before building the rest.",
    why:
      "Founders who cannot articulate the full model often build products that no one can sell or support profitably.",
    misconception:
      "A business model is just your pricing plan.",
    example:
      "A SaaS business model includes self-serve onboarding, usage-based billing, and a low-touch support model aimed at developers.",
    case_study:
      "Amazon started with an online bookstore but built a business model around selection, price, and logistics that scaled far beyond books.",
    resources: [
      "https://www.strategyzer.com/library/the-business-model-canvas",
      "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice",
    ],
    prereqs: ["competitive-analysis"],
    next: ["revenue-model", "go-to-market", "pricing"],
    example_answer:
      "A business model describes how a company creates, delivers, and captures value, including customers, channels, costs, and revenue.",
    anti_patterns: [
      "confusing business model with pricing",
      "assuming the model will figure itself out later",
      "copying a model without matching customer behavior",
    ],
  },
  "revenue-model": {
    category: "business",
    question: "How exactly will you get paid?",
    explanation:
      "A revenue model is the mechanism by which your business converts customer value into cash. It includes pricing structure, billing frequency, usage tiers, and what customers are actually paying for.",
    apply:
      "List the pricing levers you can pull: subscription, usage, seats, transactions, or hybrid. Pick one to test with your first ten customers.",
    why:
      "The same product with the wrong revenue model can fail. Your model determines cash flow, churn, and how customers think about value.",
    misconception:
      "You should keep the product free until you have millions of users.",
    example:
      "A design tool charges per user per month because the value scales with team adoption.",
    case_study:
      "Adobe moved from perpetual software licenses to a subscription revenue model, which stabilized cash flow and grew recurring revenue dramatically.",
    resources: [
      "https://www.strategyzer.com/library/the-business-model-canvas",
    ],
    prereqs: ["business-model"],
    next: ["pricing"],
    example_answer:
      "A revenue model is the way a business turns customer value into cash through pricing, billing, and payment mechanics.",
    anti_patterns: [
      "deferring monetization indefinitely",
      "choosing the model based on competitor headlines",
      "ignoring customer willingness to pay",
    ],
  },
  "pricing": {
    category: "business",
    question: "What price sends the right signal and captures the value you create?",
    explanation:
      "Pricing is the amount you charge and the structure around it. It affects perceived value, sales cycle length, unit economics, and who your customer is.",
    apply:
      "Run a pricing experiment with three tiers. Measure not just signups but revenue, conversion rate, and payback period.",
    why:
      "Most founders underprice. The right price funds growth, signals quality, and keeps unprofitable customers out.",
    misconception:
      "Lower price always means more customers and more revenue.",
    example:
      "A SaaS tool raises prices by 30% and finds that enterprise customers convert faster because the price signals seriousness.",
    case_study:
      "Kalzumeus found that doubling SaaS prices often increased revenue without losing material volume because price signals quality.",
    resources: [
      "https://training.kalzumeus.com/newsletters/archive/saas_pricing",
    ],
    prereqs: ["revenue-model", "value-proposition"],
    next: ["pricing-strategy"],
    example_answer:
      "Pricing is the amount and structure you charge customers, and it must reflect the value they receive and the market you want to serve.",
    anti_patterns: [
      "pricing based on your costs",
      "underpricing to get users",
      "never changing the first price you set",
    ],
  },
  "pricing-strategy": {
    category: "business",
    question: "What is your long-term plan for how price changes as you grow?",
    explanation:
      "A pricing strategy is the deliberate framework for setting and adjusting prices across customer segments, product tiers, and lifecycle stages. It connects value, cost, and competitive positioning.",
    apply:
      "Choose a strategy: cost-plus, value-based, penetration, or premium. Document when you will raise prices or add tiers.",
    why:
      "Without a strategy, pricing becomes reactive and leaves money on the table. A clear strategy makes raises and packaging decisions easier.",
    misconception:
      "You should set one price and never change it.",
    example:
      "A startup uses value-based pricing and increases price as new integrations save customers more time.",
    case_study:
      "Twilio's usage-based pricing aligned cost with value, and their pricing strategy evolved as large customers needed committed-use discounts.",
    resources: [
      "https://training.kalzumeus.com/newsletters/archive/saas_pricing",
      "https://www.kalzumeus.com/2012/08/13/doubling-saas-revenue/",
    ],
    prereqs: ["pricing"],
    next: ["freemium", "product-market-fit"],
    example_answer:
      "A pricing strategy is a deliberate framework for setting, packaging, and adjusting prices as the product and market evolve.",
    anti_patterns: [
      "undercutting competitors without a cost advantage",
      "changing price without explaining value",
      "ignoring segment willingness to pay",
    ],
  },
  "product-market-fit": {
    category: "business",
    question: "How do you know customers really want what you have built?",
    explanation:
      "Product-market fit is the state where demand pulls product out of your company faster than you can push it. It shows up in retention, organic growth, and customers who are disappointed if your product goes away.",
    apply:
      "Measure retention, usage frequency, and the percentage of users who would be very disappointed if your product disappeared. Pick one leading indicator and improve it.",
    why:
      "Premature scaling before product-market fit burns cash and kills startups. Fit is the signal that it is time to grow.",
    misconception:
      "Product-market fit is a single moment you can announce.",
    example:
      "A B2B SaaS reaches product-market fit when new customers activate without founder demos and expansion revenue exceeds churn.",
    case_study:
      "Superhuman built an engine to measure and improve product-market fit using a survey that asked how users would feel if the product disappeared.",
    resources: [
      "https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/",
    ],
    prereqs: ["value-proposition", "problem-validation"],
    next: ["go-to-market", "saas-metrics"],
    example_answer:
      "Product-market fit is when demand for your product is strong enough that customers pull it from you, shown by retention, usage, and organic growth.",
    anti_patterns: [
      "claiming PMF based on launch buzz",
      "scaling before retention is healthy",
      "ignoring churn and calling it growth",
    ],
  },
  "go-to-market": {
    category: "business",
    question: "How do you turn a product into repeatable revenue?",
    explanation:
      "A go-to-market strategy is the cross-functional plan for reaching target customers, communicating value, and converting them into paying users. It covers ideal customer profile, channels, pricing, and metrics.",
    apply:
      "Define your ICP, choose one primary channel, and set a 90-day pass-or-fail threshold. Do not add a second channel until the first works.",
    why:
      "A great product with no distribution is invisible. GTM is the bridge between product and revenue.",
    misconception:
      "A go-to-market strategy is just a marketing plan.",
    example:
      "A devtools startup chooses developer content and free tiers as its GTM instead of outbound sales because its buyers prefer self-serve.",
    case_study:
      "Atlassian grew to billions with a low-touch, product-led GTM that relied on free trials, transparent pricing, and strong word of mouth.",
    resources: ["https://www.stackmatix.com/blog/startup-customer-acquisition"],
    prereqs: ["product-market-fit", "business-model", "ideal-customer-profile"],
    next: ["customer-acquisition", "product-led-growth", "content-marketing", "partnerships"],
    example_answer:
      "A go-to-market strategy is the plan that connects your product to target customers, channels, messaging, pricing, and revenue.",
    anti_patterns: [
      "trying every channel at once",
      "copying a competitor's GTM without matching ICP",
      "launching without a distribution plan",
    ],
  },
  "customer-acquisition": {
    category: "business",
    question: "How do you find and convert your first paying customers?",
    explanation:
      "Customer acquisition is the system of identifying, attracting, and converting strangers into paying customers through a repeatable process. It is the constraint that determines whether a startup survives its first year.",
    apply:
      "Map the five cheapest channels for your ICP. Pick one, run a small test for two weeks, and measure cost per qualified lead or cost per customer.",
    why:
      "Many founders build first and hope customers come later. Acquisition is not an afterthought; it is the business.",
    misconception:
      "Running ads is the fastest and cheapest way to get first customers.",
    example:
      "A founder gets the first fifty customers through direct outreach in a niche community before spending on paid ads.",
    case_study:
      "Salesforce's early team acquired customers through free seminars and guerrilla events before building a scalable sales machine.",
    resources: ["https://www.stackmatix.com/blog/startup-customer-acquisition"],
    prereqs: ["go-to-market", "ideal-customer-profile"],
    next: ["founder-led-sales"],
    example_answer:
      "Customer acquisition is the repeatable system of finding, attracting, and converting target customers into paying users.",
    anti_patterns: [
      "spraying tactics across every channel",
      "buying ads before validating messaging",
      "counting likes as acquisition",
    ],
  },
  "sales-funnel": {
    category: "business",
    question: "What are the stages a prospect moves through before becoming a customer?",
    explanation:
      "A sales funnel is the sequence of steps from awareness to conversion. It helps you measure where prospects drop off and what actions move them forward.",
    apply:
      "Draw the funnel for your primary channel and label conversion rates at each stage. Improve the biggest drop-off first.",
    why:
      "A funnel turns vague growth activity into a measurable machine. Without it, you cannot diagnose why growth stalls.",
    misconception:
      "A bigger top-of-funnel always fixes a broken funnel.",
    example:
      "A SaaS funnel moves from landing page visit to free signup to activation to paid upgrade, with a 10% activation and 5% upgrade rate.",
    case_study:
      "HubSpot optimized each stage of its marketing and sales funnel to move from inbound content to free CRM signup to paid marketing hub upgrades.",
    resources: [
      "https://tomtunguz.com/matching-marketing-tactics-to-the-sales-funnel/",
    ],
    prereqs: ["customer-acquisition", "founder-led-sales"],
    next: ["traction"],
    example_answer:
      "A sales funnel is the set of stages a prospect passes through from first awareness to becoming a paying customer.",
    anti_patterns: [
      "only measuring top-of-funnel",
      "fixing the wrong stage",
      "ignoring drop-offs between stages",
    ],
  },
  traction: {
    category: "business",
    question: "What repeatable evidence shows your startup is working?",
    explanation:
      "Traction is measurable progress that makes the next phase easier, whether that is fundraising, hiring, or scaling. It is not buzz; it is a growth line with supporting unit economics.",
    apply:
      "Choose one traction metric that matters for your stage. Track it weekly and be able to explain what drives it and what limits it.",
    why:
      "Investors, hires, and partners judge you by traction. Clear traction turns conversations from skepticism to momentum.",
    misconception:
      "Traction is the same as press coverage or a big launch.",
    example:
      "A pre-seed startup's traction is 'we have 20 paying customers and 5% weekly revenue growth', not 'we were featured in TechCrunch.'",
    case_study:
      "DuckDuckGo focused on consistent user growth and privacy positioning for years before the market caught up, turning traction into a durable brand.",
    resources: [
      "https://www.penguinrandomhouse.com/books/319121/traction-by-gabriel-weinberg-and-justin-mares/",
    ],
    prereqs: ["sales-funnel"],
    next: ["product-led-growth", "content-marketing"],
    example_answer:
      "Traction is the repeatable, measurable evidence that your startup is making progress and can scale.",
    anti_patterns: [
      "using vanity metrics",
      "celebrating launches as traction",
      "changing the metric every month",
    ],
  },
  "content-marketing": {
    category: "business",
    question: "How do you earn customer attention without paying for every click?",
    explanation:
      "Content marketing is creating useful, relevant content that attracts and educates your target audience. It compounds over time and lowers blended customer acquisition cost.",
    apply:
      "Identify the top three questions your ICP searches for. Publish one piece of content that answers each better than the current search results.",
    why:
      "Paid channels get more expensive as you scale. Content is a durable asset that keeps working while you sleep.",
    misconception:
      "Content marketing is just blogging about your product.",
    example:
      "A security startup writes about how to conduct a basic security audit and earns organic traffic from developers searching for audit templates.",
    case_study:
      "HubSpot built an inbound marketing empire by creating free templates, guides, and certifications that educated its target market.",
    resources: ["https://blog.hubspot.com/marketing/content-marketing"],
    prereqs: ["product-led-growth", "go-to-market"],
    next: ["community-led-growth"],
    example_answer:
      "Content marketing is creating useful, relevant content that attracts, educates, and converts your target audience over time.",
    anti_patterns: [
      "writing only about your product",
      "chasing viral topics that do not attract buyers",
      "stopping after one post",
    ],
  },
  "community-led-growth": {
    category: "business",
    question: "How do you turn your most engaged customers into a growth channel?",
    explanation:
      "Community-led growth is the motion where engaged customers drive acquisition, retention, and product development through peer interaction. It builds identity and loyalty beyond transactions.",
    apply:
      "Start a small community space for power users. Ask them questions, reward contributions, and use their language in your marketing.",
    why:
      "A healthy community lowers support costs, creates advocates, and produces feedback that no survey can replicate.",
    misconception:
      "A community is just a Slack or Discord channel you announce things in.",
    example:
      "A design tool hosts weekly community critiques where users share work, which creates content and attracts new members.",
    case_study:
      "Actively Black built an audience first on social channels, then launched products co-created with the community, generating $2 million in its first year.",
    resources: ["https://www.shopify.com/blog/community-led-growth"],
    prereqs: ["content-marketing"],
    next: ["partnerships", "network-effects"],
    example_answer:
      "Community-led growth is a strategy where engaged customers drive acquisition, retention, and product direction through peer interaction.",
    anti_patterns: [
      "treating community as a broadcast channel",
      "launching a community before having engaged users",
      "not measuring community health",
    ],
  },
  partnerships: {
    category: "business",
    question: "How do you grow by working with companies that already reach your customers?",
    explanation:
      "Strategic partnerships are agreements with other organizations that create mutual value, such as co-marketing, integrations, or channel sales. They can lower acquisition cost and build credibility.",
    apply:
      "List ten companies your customers already use. Reach out to one with a concrete pilot proposal that moves a metric on both sides.",
    why:
      "Partnerships let you borrow trust and distribution, which is especially valuable before your brand is known.",
    misconception:
      "A partnership is valuable just because a big logo agreed to it.",
    example:
      "A small CRM integrates with a popular email tool and gets listed in the email tool's marketplace.",
    case_study:
      "Shopify grew its app ecosystem through partnerships with developers and service providers, turning integrations into a durable distribution moat.",
    resources: ["https://www.stackmatix.com/blog/startup-customer-acquisition"],
    prereqs: ["community-led-growth", "go-to-market"],
    next: ["network-effects", "moat"],
    example_answer:
      "Partnerships are agreements with other organizations to create mutual value, often through distribution, integrations, or co-marketing.",
    anti_patterns: [
      "chasing logos without measurable outcomes",
      "giving exclusivity without guarantees",
      "treating partnerships as free marketing",
    ],
  },
  moat: {
    category: "business",
    question: "What will stop competitors from copying you once you prove the idea works?",
    explanation:
      "A moat is a durable competitive advantage that makes it hard for rivals to win your customers. Network effects, brand, switching costs, and economies of scale are common moats.",
    apply:
      "Write down the four defensibility types that apply to your business. Pick one to strengthen deliberately over the next quarter.",
    why:
      "If you have no moat, a better-funded competitor can copy your product and outspend you on customer acquisition.",
    misconception:
      "First-mover advantage is a moat.",
    example:
      "A workflow tool builds integrations with every app its customers use, raising switching costs as teams adopt more integrations.",
    case_study:
      "Amazon built a moat through economies of scale, logistics, and customer reviews, making it expensive for rivals to match selection and price.",
    resources: ["https://www.nfx.com/post/defensibility-most-value-for-founders"],
    prereqs: ["network-effects", "partnerships"],
    next: ["saas-metrics"],
    example_answer:
      "A moat is a durable advantage, such as network effects, brand, or switching costs, that protects a business from competition.",
    anti_patterns: [
      "relying on being first",
      "confusing features with defensibility",
      "ignoring moat until after scaling",
    ],
  },
  "saas-metrics": {
    category: "business",
    question: "What numbers tell you if a SaaS business is healthy?",
    explanation:
      "SaaS metrics are the financial and operational measures that describe the health of a recurring-revenue business. The core set includes MRR, ARR, churn, CAC, LTV, gross margin, and payback period.",
    apply:
      "Create a dashboard with MRR, active customers, churn, and CAC. Update it weekly and use it to decide where to invest.",
    why:
      "Recurring-revenue businesses look healthy by revenue but can collapse if unit economics are broken. Metrics keep you honest.",
    misconception:
      "MRR growth alone means the business is healthy.",
    example:
      "A SaaS startup tracks MRR, logo churn, expansion revenue, and gross margin in one weekly dashboard.",
    case_study:
      "HubSpot's focus on SaaS metrics allowed it to spot funnel issues early and become a public company with strong unit economics.",
    resources: [
      "https://www.forentrepreneurs.com/saas-metrics-2/",
    ],
    prereqs: ["product-market-fit", "traction"],
    next: ["cac", "ltv", "gross-margin"],
    example_answer:
      "SaaS metrics are the recurring-revenue measures, such as MRR, ARR, churn, CAC, and LTV, that describe business health.",
    anti_patterns: [
      "only tracking top-line revenue",
      "using vanity metrics",
      "comparing metrics to companies in different segments",
    ],
  },
  cac: {
    category: "business",
    question: "How much does it cost to win one paying customer?",
    explanation:
      "Customer acquisition cost, or CAC, is the fully loaded cost to acquire a new customer. It includes marketing spend, sales salaries, tools, and any other costs tied to acquisition.",
    apply:
      "Calculate your blended CAC for the last three months. Include salaries, tools, and ad spend. Compare it to your LTV.",
    why:
      "CAC is the ultimate constraint on growth. If it exceeds LTV, every new customer loses money.",
    misconception:
      "CAC is just ad spend divided by customers.",
    example:
      "A startup spends $3,000 on ads and $2,000 of founder sales time to acquire ten customers, so CAC is $500.",
    case_study:
      "David Skok identified that high CAC relative to LTV is the second biggest cause of startup failure, even when product-market fit exists.",
    resources: ["https://www.forentrepreneurs.com/startup-killer/"],
    prereqs: ["saas-metrics", "customer-acquisition"],
    next: ["ltv", "payback-period"],
    example_answer:
      "CAC is the total cost to acquire one paying customer, including marketing, sales, tools, and labor.",
    anti_patterns: [
      "ignoring salaries and overhead",
      "blending organic and paid channels blindly",
      "optimizing CAC without looking at LTV",
    ],
  },
  ltv: {
    category: "business",
    question: "How much profit will a customer generate over their entire relationship with you?",
    explanation:
      "Lifetime value, or LTV, is the total gross profit you expect to earn from one customer. In SaaS, it is usually calculated as ARPU times gross margin divided by monthly churn.",
    apply:
      "Calculate LTV for your most common customer segment. Then check whether it is at least three times your CAC.",
    why:
      "LTV tells you how much you can afford to spend acquiring a customer and whether your business model is viable.",
    misconception:
      "LTV is the same as total revenue a customer will pay.",
    example:
      "A customer pays $100 per month, gross margin is 80%, and monthly churn is 2%, so LTV is roughly $4,000.",
    case_study:
      "Companies with strong LTV can invest in acquisition channels that competitors cannot afford, widening their moat over time.",
    resources: ["https://www.cloudzero.com/blog/customer-lifetime-value/"],
    prereqs: ["cac", "gross-margin"],
    next: ["payback-period", "customer-success"],
    example_answer:
      "LTV is the total gross profit a business expects to earn from one customer over their entire relationship.",
    anti_patterns: [
      "ignoring gross margin",
      "using revenue instead of profit",
      "assuming churn will not change",
    ],
  },
  "gross-margin": {
    category: "business",
    question: "How much of each revenue dollar is left after delivering the product?",
    explanation:
      "Gross margin is revenue minus the direct costs of delivering the product, divided by revenue. It measures how efficiently the product itself scales before sales and overhead costs.",
    apply:
      "List your COGS for the last month: hosting, support, payment fees, and third-party APIs. Calculate gross margin and identify the biggest cost driver.",
    why:
      "Low gross margin means growth makes you poorer, not richer. It is one of the first numbers investors ask about.",
    misconception:
      "Gross margin is the same as profit margin.",
    example:
      "A SaaS company with $20,000 MRR and $4,000 in hosting and support costs has an 80% gross margin.",
    case_study:
      "AI-native startups have found that LLM inference costs can push gross margins below 60%, forcing them to redesign pricing or architecture.",
    resources: ["https://www.cloudzero.com/blog/saas-gross-margin-benchmarks/"],
    prereqs: ["revenue-model", "saas-metrics"],
    next: ["churn"],
    example_answer:
      "Gross margin is the percentage of revenue left after direct delivery costs such as hosting, support, and payment fees.",
    anti_patterns: [
      "excluding customer support from COGS",
      "confusing gross margin with net margin",
      "ignoring margin when pricing",
    ],
  },
  "payback-period": {
    category: "business",
    question: "How long does it take to recover what you spent to acquire a customer?",
    explanation:
      "The payback period is the time it takes for gross profit from a customer to equal the CAC. A shorter payback period improves cash flow and reduces the capital required to grow.",
    apply:
      "Calculate payback period as CAC divided by monthly gross profit per customer. If it is longer than 12 months, prioritize reducing CAC or increasing price.",
    why:
      "Even a great LTV does not help if you run out of cash before customers pay you back. Payback period drives fundraising needs.",
    misconception:
      "A long payback period is fine if LTV is high.",
    example:
      "A company with a $600 CAC and $100 monthly gross profit has a six-month payback period.",
    case_study:
      "SaaS Capital's benchmarks show that companies with sub-12-month payback periods can grow faster with less outside capital.",
    resources: ["https://www.forentrepreneurs.com/startup-killer/"],
    prereqs: ["cac", "ltv"],
    next: ["burn-multiple"],
    example_answer:
      "Payback period is the time it takes for a customer's gross profit to repay the cost of acquiring them.",
    anti_patterns: [
      "ignoring cash flow timing",
      "using gross revenue instead of gross profit",
      "accepting payback periods longer than runway",
    ],
  },
  "net-revenue-retention": {
    category: "business",
    question: "Does your existing customer base grow even if you add no new customers?",
    explanation:
      "Net revenue retention, or NRR, measures the revenue retained from existing customers over a period, including expansion and churn. Above 100% means your installed base is growing on its own.",
    apply:
      "Calculate NRR as starting recurring revenue plus expansion minus churn and downgrades, divided by starting revenue. Set a target above 100%.",
    why:
      "High NRR means growth is efficient and customers are deepening their relationship with you. It is a strong signal of product-market fit.",
    misconception:
      "NRR above 100% means you can stop acquiring new customers.",
    example:
      "A company starts the year with $100,000 MRR, loses $10,000 to churn, but grows $25,000 from expansions, giving 115% NRR.",
    case_study:
      "Snowflake achieved extremely high NRR by usage-based pricing that grew as customers used more compute.",
    resources: ["https://stripe.com/resources/more/net-revenue-retention"],
    prereqs: ["customer-success", "ltv", "churn"],
    next: ["burn-multiple"],
    example_answer:
      "Net revenue retention is the percentage of recurring revenue retained from existing customers after accounting for churn and expansion.",
    anti_patterns: [
      "confusing NRR with logo retention",
      "celebrating NRR while ignoring acquisition",
      "using revenue instead of recurring revenue",
    ],
  },
  "burn-rate": {
    category: "business",
    question: "How fast is your bank balance shrinking?",
    explanation:
      "Burn rate is the speed at which a startup spends cash. Net burn is monthly expenses minus monthly revenue. It is the number that determines runway.",
    apply:
      "Calculate your trailing three-month average net burn. Set a monthly budget and review it before every major hire or campaign.",
    why:
      "Running out of cash is still one of the top causes of startup death. Knowing burn rate lets you act before it is too late.",
    misconception:
      "Burn rate is the same as net loss on the income statement.",
    example:
      "A startup spends $50,000 per month and earns $10,000, so net burn is $40,000 per month.",
    case_study:
      "Paul Graham's 'default alive or default dead' question forces founders to compare burn and growth to see if they can reach profitability on current cash.",
    resources: [
      "https://valueaddvc.com/blog/burn-rate-and-runway-explained-how-to-model-it-with-worked-examples",
    ],
    prereqs: ["revenue-model"],
    next: ["cash-flow", "burn-multiple"],
    example_answer:
      "Burn rate is the speed at which a startup uses cash, usually measured as net burn per month.",
    anti_patterns: [
      "counting signed contracts as cash",
      "ignoring one-time expenses",
      "not updating burn after every hire",
    ],
  },
  "cash-flow": {
    category: "business",
    question: "When does money actually move in and out of your company?",
    explanation:
      "Cash flow is the movement of actual money into and out of the business. It is different from revenue or profit because it reflects timing, such as prepaid annual plans or delayed customer payments.",
    apply:
      "Map your cash inflows and outflows by week for the next 12 weeks. Identify any week where cash could go negative.",
    why:
      "A profitable business can still go bankrupt if cash timing is wrong. Cash flow is the oxygen of a startup.",
    misconception:
      "Revenue on paper is the same as cash in the bank.",
    example:
      "An annual plan paid upfront creates positive cash flow even if revenue is recognized monthly.",
    case_study:
      "Many startups with strong bookings have failed because they spent cash before customers actually paid.",
    resources: [
      "https://valueaddvc.com/blog/burn-rate-and-runway-explained-how-to-model-it-with-worked-examples",
    ],
    prereqs: ["revenue-model", "burn-rate"],
    next: ["burn-multiple"],
    example_answer:
      "Cash flow is the actual movement of money into and out of a business, which can differ from accounting revenue and profit.",
    anti_patterns: [
      "confusing revenue with cash",
      "ignoring payment terms",
      "spending based on projected collections",
    ],
  },
  "burn-multiple": {
    category: "business",
    question: "How much cash are you burning for each dollar of new recurring revenue?",
    explanation:
      "Burn multiple is net burn divided by net new ARR. It measures capital efficiency. A lower multiple means the business generates growth without excessive cash consumption.",
    apply:
      "Calculate burn multiple for the last quarter. If it is above 3x, investigate whether burn is too high or new ARR is too low.",
    why:
      "Investors increasingly value capital efficiency. A high burn multiple can make fundraising difficult even if growth looks good.",
    misconception:
      "High growth justifies any burn multiple.",
    example:
      "A company burns $2 million in a quarter and adds $1 million in net new ARR, giving a 2x burn multiple.",
    case_study:
      "David Sacks introduced the burn multiple to help startups see that growth without efficiency is a signal of weak product-market fit.",
    resources: [
      "https://medium.com/craft-ventures/the-burn-multiple-51a7e43cb200",
    ],
    prereqs: ["burn-rate", "net-revenue-retention"],
    next: ["fundraising"],
    example_answer:
      "Burn multiple is net burn divided by net new ARR and measures how much cash is spent to generate growth.",
    anti_patterns: [
      "ignoring capital efficiency",
      "comparing to companies at different stages",
      "focusing only on growth rate",
    ],
  },
  fundraising: {
    category: "business",
    question: "When and how should you raise money to grow the business?",
    explanation:
      "Fundraising is the process of bringing outside capital into the company to extend runway, accelerate growth, or build a team. It is a means to an end, not a goal.",
    apply:
      "Decide the minimum amount you need to reach the next milestone with 18 to 24 months of runway. Prepare a one-page plan before any investor meeting.",
    why:
      "The right amount of capital at the right time lets you take measured risks. The wrong timing can force bad decisions.",
    misconception:
      "Raising more money always increases your chance of success.",
    example:
      "A founder raises enough to hire two engineers and reach $100,000 MRR, not to cover open-ended experiments.",
    case_study:
      "YC's standard advice is to raise the amount that gets you to a meaningful milestone plus a buffer, rather than the largest check available.",
    resources: ["https://www.ycombinator.com/library/4b-how-to-pitch-your-company"],
    prereqs: ["burn-multiple", "cash-flow", "runway"],
    next: ["pitch-deck", "safe"],
    example_answer:
      "Fundraising is bringing outside capital into the company to reach a milestone, extend runway, or accelerate growth.",
    anti_patterns: [
      "raising without a clear milestone",
      "optimizing valuation over terms",
      "treating fundraising as validation",
    ],
  },
  "pitch-deck": {
    category: "business",
    question: "What story should you tell investors to make them believe?",
    explanation:
      "A pitch deck is a short presentation that explains the problem, solution, market, business model, traction, team, and ask. It is a tool for conversation, not a document that should answer every question.",
    apply:
      "Build a 10 to 12 slide deck. Lead with the problem and traction, and keep each slide to one idea.",
    why:
      "A clear pitch deck makes investors and employees understand the business quickly. A confusing deck wastes your most valuable resource: their attention.",
    misconception:
      "A pitch deck should be a long, exhaustive business plan.",
    example:
      "A deck opens with the size of the missed appointments problem and a single case study before describing the product.",
    case_study:
      "Airbnb's original pitch deck was simple and direct, which helped them raise early capital when the business model was still unproven.",
    resources: ["https://www.sequoiacap.com/article/writing-a-business-plan/"],
    prereqs: ["fundraising"],
    next: ["safe"],
    example_answer:
      "A pitch deck is a concise investor presentation that tells the story of the problem, solution, market, traction, and team.",
    anti_patterns: [
      "leading with technology instead of the problem",
      "adding every detail",
      "using jargon instead of customer language",
    ],
  },
  safe: {
    category: "business",
    question: "How do early-stage startups raise money without a priced round?",
    explanation:
      "A SAFE, or Simple Agreement for Future Equity, is a short contract that lets investors put money in now in exchange for equity at a future priced round. It has no interest, no maturity date, and usually only a valuation cap to negotiate.",
    apply:
      "Download the standard post-money SAFE from Y Combinator. Model how different valuation caps affect your dilution.",
    why:
      "SAFEs reduce legal cost and negotiation friction, so founders can raise quickly and get back to building.",
    misconception:
      "A SAFE is a loan.",
    example:
      "An angel invests $100,000 on a post-money SAFE with a $4 million cap. If the company later prices at $8 million, the investor's note converts at the $4 million cap.",
    case_study:
      "Y Combinator created the SAFE in 2013 and it has become the standard for early-stage startup fundraising.",
    resources: ["https://www.ycombinator.com/safe"],
    prereqs: ["fundraising"],
    next: ["cap-table"],
    example_answer:
      "A SAFE is an agreement that gives investors the right to equity in a future priced round, with a valuation cap.",
    anti_patterns: [
      "stacking too many uncapped SAFEs",
      "not modeling dilution",
      "treating it as debt with repayment",
    ],
  },
  "cap-table": {
    category: "business",
    question: "Who owns what percentage of your company right now?",
    explanation:
      "A cap table is a ledger of all the equity ownership in a company. It tracks founders, investors, employees, advisors, options, and convertible securities like SAFEs.",
    apply:
      "Create a simple cap table with all current shareholders and any outstanding SAFEs or options. Update it after every financing or grant.",
    why:
      "A messy cap table can derail fundraising, create founder disputes, and surprise everyone at an exit. Clean ownership records are table stakes.",
    misconception:
      "The cap table only matters when you raise a priced round.",
    example:
      "A cap table shows two founders with 80%, an option pool with 15%, and an angel with 5% after a SAFE conversion.",
    case_study:
      "Many first-time founders discover at their Series A that they have given away more ownership than they thought because they never maintained a pro forma cap table.",
    resources: ["https://stripe.com/en-gi/guides/atlas/equity"],
    prereqs: ["safe"],
    next: ["term-sheet"],
    example_answer:
      "A cap table is the record of who owns equity in a company, including shares, options, and convertible instruments.",
    anti_patterns: [
      "tracking ownership in a spreadsheet no one updates",
      "ignoring option pool dilution",
      "not modeling SAFE conversion",
    ],
  },
  dilution: {
    category: "business",
    question: "How does raising money change your ownership percentage?",
    explanation:
      "Dilution is the reduction in an existing shareholder's ownership percentage when a company issues new shares. It is normal and can be healthy if the new capital grows the total value of the company.",
    apply:
      "Model your ownership after a seed round, option pool refresh, and Series A. Make sure you still own enough to stay motivated.",
    why:
      "Founders who do not understand dilution can end up with a much smaller stake than they expected after several funding rounds.",
    misconception:
      "Dilution means your shares are worth less.",
    example:
      "A founder owns 50% of a company with 100 shares. After issuing 100 new shares to an investor, the founder owns 25% but the company may be more valuable.",
    case_study:
      "Mark Zuckerberg maintained meaningful ownership through multiple rounds because Facebook's valuation grew faster than his stake diluted.",
    resources: ["https://ramp.com/blog/what-is-dilution"],
    prereqs: ["cap-table", "option-pool", "fundraising"],
    next: ["vendor-management"],
    example_answer:
      "Dilution is the decrease in a shareholder's ownership percentage when a company issues new shares.",
    anti_patterns: [
      "focusing only on percentage, not value",
      "raising at inflated valuations to avoid dilution",
      "not modeling cumulative dilution",
    ],
  },
  "staging-environment": {
    category: "ops",
    question: "Where do you rehearse code before it meets real users?",
    explanation:
      "A staging environment is a pre-production environment that mirrors production closely enough to catch integration, data, and performance problems before release.",
    apply:
      "Create a staging environment using the same infrastructure-as-code as production. Deploy every release there and run smoke tests before promoting to production.",
    why:
      "Skipping staging is how bugs that passed unit tests corrupt production data or break customer workflows. It is the final safety net.",
    misconception:
      "A staging environment is just another dev box.",
    example:
      "A team deploys a candidate release to staging, runs end-to-end tests with sanitized production data, and only then promotes the same artifact to production.",
    case_study:
      "Heroku pipelines made staging promotion a first-class part of deployment, reducing production incidents by ensuring what was tested is what shipped.",
    resources: [
      "https://www.harness.io/harness-devops-academy/what-is-a-staging-environment",
    ],
    prereqs: ["ci-cd", "testing-pyramid"],
    next: ["release-management"],
    example_answer:
      "A staging environment is a pre-production environment that closely mirrors production and is used to validate releases before they reach users.",
    anti_patterns: [
      "staging that does not match production configuration",
      "skipping staging for urgent fixes",
      "using production data without anonymization",
    ],
  },
  "release-management": {
    category: "ops",
    question: "How do you move code from commit to customer safely?",
    explanation:
      "Release management is the set of practices that plan, coordinate, test, approve, and deploy software changes. It includes versioning, rollback plans, and communication.",
    apply:
      "Define the release process for your team: what gets tested, who approves, and how to roll back. Document it in a runbook.",
    why:
      "Without release discipline, hotfixes become new incidents and launches happen without a recovery plan.",
    misconception:
      "Release management is only for large companies with formal change boards.",
    example:
      "A team schedules releases on Tuesdays, requires two approvals, and keeps the previous version warm for instant rollback.",
    case_study:
      "Etsy moved from quarterly deploys to tens of deploys per day by building release management around CI/CD, feature flags, and rollback automation.",
    resources: ["https://www.harness.io/blog/software-release-management"],
    prereqs: ["staging-environment", "ci-cd"],
    next: ["deployment-frequency"],
    example_answer:
      "Release management is the process of planning, testing, approving, and deploying software changes with rollback and communication plans.",
    anti_patterns: [
      "deploying on Friday afternoon",
      "no rollback plan",
      "skipping staging for speed",
    ],
  },
  "deployment-frequency": {
    category: "ops",
    question: "How often can your team confidently release to production?",
    explanation:
      "Deployment frequency is how often an organization successfully releases to production. Higher frequency usually means smaller, safer changes and faster feedback.",
    apply:
      "Count how many times you deployed to production last month. Pick the biggest bottleneck that keeps you from deploying more often and remove it.",
    why:
      "Frequent deployments reduce batch size, which reduces risk and speeds up learning. DORA research ties elite performance to high deployment frequency.",
    misconception:
      "Deploying more often makes outages more likely.",
    example:
      "A team moves from weekly releases to daily releases by automating tests and using feature flags to decouple deploy from release.",
    case_study:
      "Amazon deploys thousands of times per day. The high frequency is only possible because each change is small, tested, and observable.",
    resources: [
      "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
    ],
    prereqs: ["release-management", "ci-cd"],
    next: ["runbook", "sre"],
    example_answer:
      "Deployment frequency is how often an organization successfully releases to production.",
    anti_patterns: [
      "big-bang releases with many changes",
      "deploying only when someone remembers",
      "rewarding heroics instead of automation",
    ],
  },
  runbook: {
    category: "ops",
    question: "What do you do at 3am when the alert fires?",
    explanation:
      "A runbook is a documented, step-by-step procedure for performing a task or resolving a specific incident. It turns institutional knowledge into repeatable action.",
    apply:
      "Write a runbook for your top three failure modes. Include symptoms, steps, validation, rollback, and escalation. Test it during business hours.",
    why:
      "At 3am, no one can remember tribal knowledge. Runbooks let any trained person respond correctly under pressure.",
    misconception:
      "A runbook is a generic wiki article.",
    example:
      "A database runbook lists how to identify a slow query, how to add a temporary index, and when to page the database owner.",
    case_study:
      "AWS Well-Architected guidance uses runbooks for operational procedures, reducing human error and improving consistency across shifts.",
    resources: [
      "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html",
    ],
    prereqs: ["deployment-frequency", "incident-response"],
    next: ["sre"],
    example_answer:
      "A runbook is a step-by-step guide for performing a procedure or resolving a specific operational issue.",
    anti_patterns: [
      "steps that only make sense to the author",
      "no rollback or validation section",
      "runbooks that never get updated",
    ],
  },
  sre: {
    category: "ops",
    question: "How do you run production systems without relying on heroics?",
    explanation:
      "Site Reliability Engineering is the discipline of applying software engineering to operations problems. SREs design systems, automate toil, define SLOs, and respond to incidents.",
    apply:
      "Pick one manual operational task and automate or document it this week. Define one SLO for your core user journey.",
    why:
      "Vibe coders often become accidental SREs. Formal SRE practice prevents burnout and keeps the site up as the product grows.",
    misconception:
      "SRE is just DevOps with a different title.",
    example:
      "An SRE team writes a script to automatically restart an unhealthy service, alert on error budget burn, and page the on-call only for user-facing issues.",
    case_study:
      "Google created SRE to keep massive services reliable while letting engineers spend at least half their time on engineering instead of operational firefighting.",
    resources: ["https://sre.google/sre-book/"],
    prereqs: ["runbook", "observability", "slos"],
    next: ["incident-commander", "status-page"],
    example_answer:
      "SRE is the application of software engineering principles to operations, focusing on reliability, automation, and error budgets.",
    anti_patterns: [
      "keeping the same person on-call forever",
      "responding to every alert manually",
      "treating reliability as someone else's job",
    ],
  },
  "incident-commander": {
    category: "ops",
    question: "Who takes charge when everything is breaking at once?",
    explanation:
      "An incident commander is the single person responsible for coordinating response during a major incident. They make decisions, communicate status, and delegate restoration.",
    apply:
      "Designate an incident commander rotation and run a tabletop drill. Document the communication channel and escalation path.",
    why:
      "Major incidents become chaotic when everyone tries to fix and communicate at once. A clear commander keeps the team focused and customers informed.",
    misconception:
      "The incident commander is always the most senior engineer.",
    example:
      "During an outage, the incident commander coordinates engineers, decides whether to roll back, and approves external status updates.",
    case_study:
      "PagerDuty's incident response training uses the incident commander role to keep calls focused and ensure someone owns communication and decision making.",
    resources: ["https://response.pagerduty.com/training/glossary/"],
    prereqs: ["sre", "incident-response"],
    next: ["status-page", "business-continuity"],
    example_answer:
      "An incident commander is the person responsible for leading and coordinating the response to a major incident.",
    anti_patterns: [
      "everyone trying to fix and talk at once",
      "commander acting as the sole resolver",
      "no clear escalation path",
    ],
  },
  "status-page": {
    category: "ops",
    question: "How do you keep customers informed while you are fixing an outage?",
    explanation:
      "A status page is a public or private page that communicates the real-time status of a service and ongoing incidents. It reduces support tickets and builds trust.",
    apply:
      "Create a simple status page for your product. Define what components to show and who is responsible for updating it during an incident.",
    why:
      "When service is down, customers want to know someone is aware and working on it. Silence creates panic and duplicate support tickets.",
    misconception:
      "A status page is only for large companies.",
    example:
      "A SaaS company updates its status page during a payment outage so customers know not to retry transactions repeatedly.",
    case_study:
      "DigitalOcean and Dropbox use status pages to communicate transparently during incidents, which lowers support load and preserves customer trust.",
    resources: ["https://www.atlassian.com/software/statuspage"],
    prereqs: ["incident-commander", "sre"],
    next: ["business-continuity", "customer-support-ops"],
    example_answer:
      "A status page is a public or private page that shows the current status of services and ongoing incidents.",
    anti_patterns: [
      "updating social media but not the status page",
      "marking incidents resolved before verification",
      "hiding problems until they are fixed",
    ],
  },
  "business-continuity": {
    category: "ops",
    question: "How does the business keep running when critical systems fail?",
    explanation:
      "Business continuity is the planning that keeps essential operations running during and after a disruption. It covers people, processes, vendors, data, and communication.",
    apply:
      "Identify the three processes that would kill the business if down for 24 hours. Write a one-page continuity plan for each.",
    why:
      "Disruptions are not just technical. If you cannot pay vendors, contact customers, or access data, the business stops regardless of uptime.",
    misconception:
      "Business continuity is the same as IT disaster recovery.",
    example:
      "A plan includes offsite backups, a secondary payment processor, a customer communication template, and a backup decision maker.",
    case_study:
      "Small businesses with documented business continuity plans are far more likely to reopen after a major disaster than those without.",
    resources: [
      "https://goleadingit.com/blog/business-continuity-plan-and-template/",
    ],
    prereqs: ["disaster-recovery", "incident-commander"],
    next: ["capacity-planning"],
    example_answer:
      "Business continuity is the planning that keeps critical business operations running during and after disruptions.",
    anti_patterns: [
      "only planning for IT failures",
      "putting the plan in a binder no one reads",
      "not testing the plan",
    ],
  },
  "capacity-planning": {
    category: "ops",
    question: "Will your infrastructure handle the next traffic wave?",
    explanation:
      "Capacity planning is the process of forecasting and provisioning enough resources to meet current and future demand while maintaining reliability and cost efficiency.",
    apply:
      "Plot CPU, memory, and database utilization over the last 90 days. Add a growth forecast and identify the first resource that will hit a limit.",
    why:
      "Running out of capacity during a launch or viral moment turns success into an outage. Over-provisioning wastes cash.",
    misconception:
      "Capacity planning is just buying bigger servers.",
    example:
      "A team forecasts 3x traffic for a launch and pre-scales queues, databases, and web workers instead of scaling reactively.",
    case_study:
      "Pragmatic SRE guidance uses historical utilization, headroom, and redundancy to balance reliability and cost.",
    resources: [
      "https://www.pragmaticsre.com/psre-guide/2-reliability-engineering/capacity-management",
    ],
    prereqs: ["business-continuity", "slos", "autoscaling"],
    next: ["vendor-management"],
    example_answer:
      "Capacity planning is forecasting and provisioning enough infrastructure to meet demand without over-provisioning.",
    anti_patterns: [
      "scaling only after an outage",
      "ignoring headroom",
      "treating peak traffic as average traffic",
    ],
  },
  "vendor-management": {
    category: "ops",
    question: "How do you keep control of the tools and services your business depends on?",
    explanation:
      "Vendor management is the end-to-end process of selecting, onboarding, monitoring, and offboarding third-party providers. It controls cost, access, and risk.",
    apply:
      "Inventory every SaaS, cloud, and service vendor you pay. Note who owns the relationship, when the contract renews, and what data they access.",
    why:
      "Vendor sprawl quietly drains cash, expands your attack surface, and creates single points of failure no one owns.",
    misconception:
      "Vendor management is procurement's job.",
    example:
      "A startup tracks SaaS licenses and discovers 20% are unused, then cancels or downgrades them.",
    case_study:
      "Josys reports that 66% of SaaS licenses sit unused or underutilized and 48% of breaches involve a third party, making vendor management a security priority.",
    resources: ["https://www.josys.com/article/it-vendor-management-guide"],
    prereqs: ["capacity-planning"],
    next: ["third-party-risk"],
    example_answer:
      "Vendor management is the process of selecting, onboarding, monitoring, and offboarding the third-party providers the business uses.",
    anti_patterns: [
      "renewing without checking usage",
      "no owner for vendor relationships",
      "ignoring offboarding when a tool is replaced",
    ],
  },
  "third-party-risk": {
    category: "ops",
    question: "What happens to your security and operations when a vendor you trust is compromised?",
    explanation:
      "Third-party risk is the risk that a vendor, supplier, or service provider introduces to your business through access, data handling, or dependency on their availability.",
    apply:
      "List your top five vendors by criticality. For each, document what they access and what your fallback is if they fail or are breached.",
    why:
      "Your security is only as strong as the weakest vendor with access to your systems or data.",
    misconception:
      "Third-party risk is only a concern for enterprise companies.",
    example:
      "A startup's identity provider is down, so the team cannot log in. A fallback process lets them continue operations.",
    case_study:
      "The 2020 SolarWinds breach showed how a single compromised vendor can cascade through thousands of customer environments.",
    resources: [
      "https://www.cisa.gov/information-and-communications-technology-supply-chain-risk-management",
    ],
    prereqs: ["vendor-management", "input-validation"],
    next: ["data-retention"],
    example_answer:
      "Third-party risk is the operational and security exposure created by depending on external vendors, suppliers, or services.",
    anti_patterns: [
      "trusting a vendor because they are big",
      "no fallback for critical vendors",
      "ignoring vendor security assessments",
    ],
  },
  "data-retention": {
    category: "ops",
    question: "How long should you keep user data, and how do you delete it safely?",
    explanation:
      "Data retention is the policy for how long data is kept and when it must be deleted. It balances business needs, legal requirements, and user privacy.",
    apply:
      "Write a data retention policy for each data type you collect. Define storage, backup, and deletion procedures.",
    why:
      "Keeping data too long increases breach impact, compliance risk, and storage cost. Deleting too early can hurt business operations.",
    misconception:
      "You should keep all data forever because it might be useful later.",
    example:
      "A company deletes user logs after 90 days, keeps invoices for seven years, and anonymizes analytics data after one year.",
    case_study:
      "GDPR enforcement actions have targeted companies that kept personal data indefinitely or did not delete it when requested.",
    resources: ["https://gdpr.eu/article-5-how-to-process-personal-data/"],
    prereqs: ["third-party-risk", "gdpr"],
    next: ["change-management"],
    example_answer:
      "Data retention is the policy and practice of keeping data for a defined period and securely deleting it when no longer needed.",
    anti_patterns: [
      "storing everything forever",
      "not honoring deletion requests",
      "mixing retention rules across data types",
    ],
  },
  "change-management": {
    category: "ops",
    question: "How do you make changes to production without breaking what works?",
    explanation:
      "Change management is the process of planning, reviewing, approving, and tracking changes to systems, code, and processes. It reduces unplanned outages and keeps stakeholders aligned.",
    apply:
      "Create a lightweight change process. Every production change needs a rollback plan and a list of affected services.",
    why:
      "Most outages are caused by changes. A little process prevents the kind of 3am panic that destroys sleep and customer trust.",
    misconception:
      "Change management means bureaucracy and slow approvals.",
    example:
      "A team adds a database migration to a release checklist and tests the rollback script before deploying.",
    case_study:
      "Knight Capital lost hundreds of millions because a manual deploy reused an old code path, a failure of both testing and change control.",
    resources: ["https://www.atlassian.com/itsm/change-management/"],
    prereqs: ["data-retention", "release-management"],
    next: ["customer-support-ops"],
    example_answer:
      "Change management is the process of planning, reviewing, and tracking changes to systems to reduce risk and outages.",
    anti_patterns: [
      "making production changes without rollback",
      "not telling the team about changes",
      "using the same process for every change size",
    ],
  },
  "customer-support-ops": {
    category: "ops",
    question: "How do you scale support without drowning in tickets?",
    explanation:
      "Customer support operations is the behind-the-scenes function that equips front-line support teams with tools, processes, workflows, and metrics to deliver consistent help at scale.",
    apply:
      "Map your support workflow from intake to resolution. Identify one repetitive ticket type and automate or document a self-serve answer.",
    why:
      "Fast, helpful support is a retention and growth advantage. Without support ops, the team drowns and customers churn.",
    misconception:
      "Customer support is just hiring more agents.",
    example:
      "A support ops team builds a knowledge base, routing rules, and a quality rubric so new agents can solve common issues quickly.",
    case_study:
      "Intercom saved $400,000 by automating repetitive support work and letting humans focus on complex issues.",
    resources: ["https://front.com/guides/customer-operations-guide"],
    prereqs: ["change-management", "status-page"],
    next: ["service-level-agreement"],
    example_answer:
      "Customer support operations is the function that provides support teams with tools, processes, and metrics to resolve customer issues at scale.",
    anti_patterns: [
      "hiring agents before fixing workflows",
      "ignoring ticket deflection",
      "no clear escalation rules",
    ],
  },
  "service-level-agreement": {
    category: "ops",
    question: "What do you promise customers about uptime, response time, and support?",
    explanation:
      "A service level agreement, or SLA, is a formal or informal commitment to a customer about service performance. It usually includes targets and consequences for missing them.",
    apply:
      "Define one internal SLO for your core service and one customer-facing SLA for support response time. Track them weekly.",
    why:
      "Clear SLAs set expectations, prioritize work, and protect trust. They are also often required by enterprise customers.",
    misconception:
      "An SLA is just a promise to keep the site up.",
    example:
      "A SaaS company promises 99.9% monthly uptime, with support responses within 4 hours for paid plans and 24 hours for free plans.",
    case_study:
      "Google Cloud uses SLAs with service credits for missed availability, which makes the commitment meaningful and measurable.",
    resources: [
      "https://cloud.google.com/blog/products/devops-sre/sre-fundamentals-sli-vs-slo-vs-sla",
    ],
    prereqs: ["customer-support-ops", "slos"],
    next: ["runway"],
    example_answer:
      "A service level agreement is a commitment to customers about service performance, including targets and consequences for missing them.",
    anti_patterns: [
      "promising 100% uptime",
      "setting SLAs without monitoring",
      "using the same SLA for every customer tier",
    ],
  },
  "competitive-analysis": {
    category: "business",
    question: "Who are you really competing with, and where is your wedge?",
    explanation:
      "Competitive analysis maps direct competitors, indirect alternatives, internal workarounds, and the status quo. It is not a feature matrix; it is a tool for finding the one buyer and claim where you can win.",
    apply:
      "List 5-8 alternatives including spreadsheets and do-nothing. For each, write who they win with, their core claim, their weakness for your target buyer, and the exact sentence your team should say when a prospect mentions them.",
    why:
      "Startups lose deals to do-nothing more often than to rivals. A clear competitive wedge keeps product, pricing, and messaging focused.",
    misconception:
      "Competitive analysis is just a feature comparison.",
    example:
      "A new calendar tool finds that large competitors are too complex for freelancers and too cheap for teams; it targets agencies with shared booking pages and simple integrations.",
    case_study:
      "HubSpot entered a crowded marketing-automation market by targeting small businesses that Salesforce ignored, using inbound content and transparent freemium.",
    resources: [
      "https://www.stackmatix.com/blog/startup-competitive-analysis",
    ],
    prereqs: ["value-proposition", "market-sizing"],
    next: ["business-model"],
    example_answer:
      "Competitive analysis is the ongoing mapping of direct competitors, indirect alternatives, and the status quo to find a clear positioning wedge.",
    anti_patterns: [
      "only listing direct competitors",
      "copying competitor features",
      "trashing competitors instead of showing your edge",
      "creating a static deck no one updates",
    ],
  },
  "ideal-customer-profile": {
    category: "business",
    question: "What is the exact company profile you can win?",
    explanation:
      "An ideal customer profile, or ICP, is a data-backed, falsifiable description of the company that gets the most value from your product. It includes firmographics, technographics, behaviors, and the pain signal that makes you the obvious choice.",
    apply:
      "From your last 10 discovery calls, identify the 3 best-fit prospects. Write a one-paragraph ICP and score every new lead against it before spending sales time.",
    why:
      "A vague target market wastes scarce founder energy. An ICP focuses sales, marketing, and product on the accounts most likely to close, stay, and expand.",
    misconception:
      "An ICP is the same as a buyer persona.",
    example:
      "A vertical SaaS ICP: 'US-based e-commerce brands with $2-10M revenue, using Shopify, struggling with returns and refunds.'",
    case_study:
      "Early-stage founders who build their ICP from closed-won data stop chasing every interested prospect and close faster by speaking the buyer's language.",
    resources: [
      "https://www.stackmatix.com/blog/ideal-customer-profile-for-startups",
    ],
    prereqs: ["customer-interviews"],
    next: ["go-to-market"],
    example_answer:
      "An ideal customer profile is a company-level description of the account that gets the most value from your product and delivers the best unit economics.",
    anti_patterns: [
      "making it aspirational",
      "targeting multiple ICPs at once",
      "building it without customer data",
      "confusing it with a buyer persona",
    ],
  },
  "founder-led-sales": {
    category: "business",
    question: "Why should the founder be the first salesperson?",
    explanation:
      "Founder-led sales is the motion where the founder personally sources, qualifies, demos, and closes early deals. It is a learning engine, not a cost-saving measure.",
    apply:
      "Run 5 discovery calls this week. Spend 70% listening, quote a price out loud, and log every objection. Build a one-page playbook before hiring a rep.",
    why:
      "A hired rep cannot sell what has not been sold before. Founder-led sales captures the exact language, objections, and value that later hires can repeat.",
    misconception:
      "Founder-led sales is just a temporary step until you can hire salespeople.",
    example:
      "A founder closes the first 20 customers through warm intros and niche communities, writing down the exact pitch and objection responses that become the first sales playbook.",
    case_study:
      "Most successful B2B SaaS companies had a founder close the first 20-50 customers to learn the buyer's language before building a sales team.",
    resources: [
      "https://www.stackmatix.com/blog/founder-led-sales-early-stage-startups",
    ],
    prereqs: ["customer-acquisition"],
    next: ["sales-funnel"],
    example_answer:
      "Founder-led sales is the founder personally running the full sales process to learn what buyers want, what they will pay, and how to sell before hiring a team.",
    anti_patterns: [
      "hiring a rep before the motion is repeatable",
      "pitching before discovery",
      "avoiding price discussions",
      "treating early sales as pure revenue not research",
    ],
  },
  "customer-success": {
    category: "business",
    question: "How do you turn customers into retained, expanding advocates?",
    explanation:
      "Customer success is the proactive function that helps customers reach the outcomes they bought your product for, then drives renewals, expansion, and advocacy. It is not a support ticket queue.",
    apply:
      "Define the customer's first 30-60-90 day milestones. Track time-to-value, health score, and NRR. Intervene before a customer is at risk.",
    why:
      "It is far cheaper to keep and expand an existing customer than to acquire a new one. Customer success is the engine behind NRR and efficient growth.",
    misconception:
      "Customer success is just reactive support.",
    example:
      "A B2B SaaS assigns every new customer a check-in at day 14, 30, and 60 to remove blockers and surface expansion opportunities.",
    case_study:
      "Atlassian's customer success org helped scale the company by ensuring teams adopted products quickly and became advocates inside their organizations.",
    resources: [
      "https://review.firstround.com/founders-guide-building-customer-success/",
    ],
    prereqs: ["ltv", "churn"],
    next: ["net-revenue-retention"],
    example_answer:
      "Customer success is the proactive function that ensures customers achieve their desired outcomes, leading to retention, expansion, and advocacy.",
    anti_patterns: [
      "treating CS as a cost center",
      "waiting for customers to ask for help",
      "measuring CS by tickets closed",
      "hiring CS before onboarding is defined",
    ],
  },
  "term-sheet": {
    category: "business",
    question: "What are the real terms behind a fundraising offer?",
    explanation:
      "A term sheet is a mostly non-binding document that outlines the key economics and control terms of an investment. It becomes the blueprint for the final legal documents and often locks in the deal before lawyers draft the fine print.",
    apply:
      "Read a sample Series A term sheet. Identify the pre-money valuation, option pool, liquidation preference, board composition, and protective provisions. Model how each changes your ownership and control.",
    why:
      "Founders often fixate on valuation while ignoring control and downside terms that can cost millions at exit.",
    misconception:
      "A term sheet is just a valuation and an amount.",
    example:
      "A term sheet offers $2M on an $8M pre-money valuation with a 1x non-participating liquidation preference, one board seat, and a 10% pre-money option pool.",
    case_study:
      "Bad term-sheet terms have cost founders control or exit proceeds; understanding the clauses before signing is as important as the headline valuation.",
    resources: [
      "https://startuplawyer.com/venture-capital/venture-capital-term-sheet-survival-guide",
    ],
    prereqs: ["cap-table"],
    next: ["option-pool"],
    example_answer:
      "A term sheet is a short, mostly non-binding document that outlines the key economics and control terms of an investment before final legal documents are drafted.",
    anti_patterns: [
      "signing without modeling dilution",
      "ignoring liquidation preference",
      "negotiating only on valuation",
      "skipping legal review",
    ],
  },
  "option-pool": {
    category: "business",
    question: "How much equity should you reserve for future hires?",
    explanation:
      "An option pool, or employee stock option pool, is the block of shares set aside for employee stock options. The size, timing, and structure of the pool have a major impact on founder dilution.",
    apply:
      "Build a 12-month hiring plan. Size the pool based on required grants, then model the pool pre-money and post-money to see how founder ownership changes.",
    why:
      "Equity is essential for recruiting, but a pool carved out of the pre-money valuation can shift founder ownership by 5-10 points in a single round.",
    misconception:
      "The option pool is free equity that does not dilute founders.",
    example:
      "A founder creates a 15% pre-money option pool before a Series A. The new investor's ownership is unchanged, but the founders absorb the dilution.",
    case_study:
      "The 'option pool shuffle' often surprises first-time founders: they think they sold 20% but discover they gave up 30% when the pool is included.",
    resources: [
      "https://legalclarity.org/option-pools-structure-sizing-and-dilution-impact/",
    ],
    prereqs: ["cap-table", "term-sheet"],
    next: ["dilution"],
    example_answer:
      "An option pool is a reserved block of company equity used to grant stock options to employees, advisors, and consultants.",
    anti_patterns: [
      "sizing the pool without a hiring plan",
      "accepting pre-money pool blindly",
      "ignoring refresh grants",
      "skipping 409A valuations",
    ],
  },
};
