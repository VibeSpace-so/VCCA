# Startup Course for Vibe Coders

## Audience and goal

This course is for vibe-coder founders: people who can ship code quickly but may not yet know how to turn that skill into a durable company. It covers the full founder journey from customer discovery through launch, growth, economics, fundraising, ownership, and operational readiness.

The learning path is intentionally ordered. Validation comes before building, business model before growth, unit economics before scaling, and operational readiness throughout.

## Categories owned in this pillar

- `business`
- `ops`

## Summary counts

- `business` concepts: **35**
- `ops` concepts: **15**
- New concept keys added by this course: **50**

## New concept keys

### Business (35)

`customer-interviews`, `market-sizing`, `competitive-analysis`, `business-model`, `revenue-model`, `pricing`, `pricing-strategy`, `product-market-fit`, `ideal-customer-profile`, `go-to-market`, `customer-acquisition`, `founder-led-sales`, `sales-funnel`, `traction`, `content-marketing`, `community-led-growth`, `partnerships`, `moat`, `saas-metrics`, `cac`, `ltv`, `gross-margin`, `payback-period`, `customer-success`, `net-revenue-retention`, `burn-rate`, `cash-flow`, `burn-multiple`, `fundraising`, `pitch-deck`, `safe`, `cap-table`, `term-sheet`, `option-pool`, `dilution`

### Ops (15)

`staging-environment`, `release-management`, `deployment-frequency`, `runbook`, `sre`, `incident-commander`, `status-page`, `business-continuity`, `capacity-planning`, `vendor-management`, `third-party-risk`, `data-retention`, `change-management`, `customer-support-ops`, `service-level-agreement`

## The learning graph

### 1. Customer discovery and ICP

Start by talking to real customers before writing production code, then sharpen who you can win.

- `customer-interviews` &rarr; `problem-validation` (product)
- `customer-interviews` &rarr; `ideal-customer-profile`
- Cross-pillar prereqs: `validation`, `smoke-test`
- Failure mode: building a product for a problem no one is trying to solve, or selling to everyone.
- Key apply: interview five people before writing the first API route; write a one-paragraph ICP from the best three.

### 2. Value proposition, market sizing, and competitive analysis

Turn the problem into a clear outcome, a measurable market, and a defensible wedge.

- `problem-validation` (product) &rarr; `value-proposition` (product)
- `value-proposition` (product) &rarr; `market-sizing`
- `market-sizing` &rarr; `competitive-analysis`
- `competitive-analysis` &rarr; `business-model`
- Failure mode: confusing features with value, claiming a billion-dollar market without a bottom-up number, or ignoring the status quo.
- Key apply: write a one-sentence value proposition, a TAM/SAM/SOM calculation, and a competitive battlecard.

### 3. Revenue, pricing, and freemium

Decide how the business captures value and what customers pay.

- `revenue-model` &larr; `business-model`
- `pricing` &larr; `revenue-model`, `value-proposition`
- `pricing-strategy` &larr; `pricing`
- `freemium` (product) &larr; `pricing-strategy`
- Failure mode: underpricing, no upgrade path, or giving away the whole product for free.
- Key apply: test a three-tier price and measure conversion, expansion, and churn.

### 4. Product-market fit

Prove the product is being pulled by the market before trying to grow.

- `product-market-fit` &larr; `value-proposition`, `problem-validation`
- Failure mode: scaling a product that customers tolerate but do not love.
- Key apply: measure the percentage of users who would be very disappointed if the product disappeared.

### 5. Go-to-market and traction

Build a repeatable way to turn the product into revenue.

- `go-to-market` &larr; `product-market-fit`, `business-model`, `ideal-customer-profile`
- `customer-acquisition` &larr; `go-to-market`, `ideal-customer-profile`
- `founder-led-sales` &larr; `customer-acquisition`
- `sales-funnel` &larr; `customer-acquisition`, `founder-led-sales`
- `traction` &larr; `sales-funnel`
- Failure mode: trying every channel at once, hiring sales before the founder has sold, or celebrating press instead of revenue.
- Key apply: pick one primary channel for 90 days and set a pass/fail threshold; run 5 founder discovery calls this week.

### 6. Growth channels

Layer product-led, content-led, community-led, and partner-led growth.

- `product-led-growth` (product) &larr; `go-to-market`, `product-market-fit`
- `content-marketing` &larr; `product-led-growth`, `go-to-market`
- `community-led-growth` &larr; `content-marketing`
- `partnerships` &larr; `community-led-growth`, `go-to-market`
- Failure mode: chasing channels that do not match the buyer's behavior.
- Key apply: remove clicks between signup and first value; publish one definitive content piece.

### 7. Defensibility

Build durable advantages before competitors copy the idea.

- `network-effects` (product) &larr; `partnerships`, `product-market-fit`
- `moat` &larr; `network-effects`, `partnerships`
- Failure mode: relying on first-mover advantage or a few features as defensibility.
- Key apply: map one feature that gets better as more users join and one switching-cost lever.

### 8. SaaS metrics and unit economics

Measure whether growth is healthy or merely expensive.

- `saas-metrics` &larr; `product-market-fit`, `traction`
- `cac` &larr; `saas-metrics`, `customer-acquisition`
- `ltv` &larr; `cac`, `gross-margin`
- `gross-margin` &larr; `revenue-model`, `saas-metrics`
- `customer-success` &larr; `ltv`, `churn`
- `payback-period` &larr; `cac`, `ltv`
- `net-revenue-retention` &larr; `customer-success`, `ltv`, `churn`
- Failure mode: tracking MRR without CAC, LTV, gross margin, payback period, or customer success.
- Key apply: build a weekly dashboard with CAC, LTV, gross margin, churn, payback period, and NRR.

### 9. Burn, cash, and capital efficiency

Make sure growth does not outrun the bank account.

- `burn-rate` &larr; `revenue-model`
- `cash-flow` &larr; `revenue-model`, `burn-rate`
- `burn-multiple` &larr; `burn-rate`, `net-revenue-retention`
- Failure mode: confusing revenue with cash or ignoring capital efficiency.
- Key apply: calculate net burn, runway, and burn multiple every month.

### 10. Fundraising, pitch, and ownership

Raise capital on clean terms and understand the ownership math.

- `fundraising` &larr; `burn-multiple`, `cash-flow`, `runway`
- `pitch-deck` &larr; `fundraising`
- `safe` &larr; `pitch-deck`
- `cap-table` &larr; `safe`
- `term-sheet` &larr; `cap-table`
- `option-pool` &larr; `cap-table`, `term-sheet`
- `dilution` &larr; `cap-table`, `option-pool`, `fundraising`
- Failure mode: raising without a milestone, over-optimizing valuation, ignoring term-sheet clauses, or accepting an option pool blindly.
- Key apply: model ownership after SAFE conversion, option pool, and priced round.

### 11. Operational readiness

Ship fast without breaking trust or waking everyone up at 3am.

- `staging-environment` &larr; `ci-cd`, `testing-pyramid`
- `release-management` &larr; `staging-environment`, `ci-cd`
- `deployment-frequency` &larr; `release-management`, `ci-cd`
- `runbook` &larr; `deployment-frequency`, `incident-response`
- `sre` &larr; `runbook`, `observability`, `slos`
- `incident-commander` &larr; `sre`, `incident-response`
- `status-page` &larr; `incident-commander`, `sre`
- `business-continuity` &larr; `disaster-recovery`, `incident-commander`
- `capacity-planning` &larr; `business-continuity`, `slos`, `autoscaling`
- `vendor-management` &larr; `capacity-planning`
- `third-party-risk` &larr; `vendor-management`, `input-validation`
- `data-retention` &larr; `third-party-risk`, `gdpr`
- `change-management` &larr; `data-retention`, `release-management`
- `customer-support-ops` &larr; `change-management`, `status-page`
- `service-level-agreement` &larr; `customer-support-ops`, `slos`
- Failure mode: shipping without rollback, incident command, customer communication, or vendor oversight.
- Key apply: write one runbook, one rollback plan, and one SLA for your core service.

## Cross-pillar references used

These existing catalog keys are referenced in the `prereqs` and `next` arrays of this course:

- `validation` (product)
- `smoke-test` (product)
- `problem-validation` (product)
- `value-proposition` (product)
- `freemium` (product)
- `product-led-growth` (product)
- `network-effects` (product)
- `churn` (product)
- `runway` (business)
- `ci-cd` (engineering)
- `testing-pyramid` (engineering)
- `incident-response` (ops)
- `observability` (ops)
- `slos` (reliability)
- `disaster-recovery` (ops)
- `autoscaling` (scaling)
- `input-validation` (security)
- `gdpr` (business)

## Verified resources used in this course

- Customer discovery and YC advice: https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice
- YC pitching guide: https://www.ycombinator.com/library/4b-how-to-pitch-your-company
- YC SAFE: https://www.ycombinator.com/safe
- Strategyzer Value Proposition Canvas: https://www.strategyzer.com/library/the-value-proposition-canvas
- Strategyzer Business Model Canvas: https://www.strategyzer.com/library/the-business-model-canvas
- TAM/SAM/SOM market sizing: https://wise.com/gb/blog/tam-sam-vs-som
- Stack Matix competitive analysis: https://www.stackmatix.com/blog/startup-competitive-analysis
- Stack Matix ideal customer profile: https://www.stackmatix.com/blog/ideal-customer-profile-for-startups
- Stack Matix customer acquisition: https://www.stackmatix.com/blog/startup-customer-acquisition
- Stack Matix founder-led sales: https://www.stackmatix.com/blog/founder-led-sales-early-stage-startups
- Kalzumeus SaaS pricing: https://training.kalzumeus.com/newsletters/archive/saas_pricing
- Kalzumeus doubling SaaS revenue: https://www.kalzumeus.com/2012/08/13/doubling-saas-revenue/
- Stripe freemium model: https://stripe.com/en-gi/resources/more/freemium-business-model
- First Round / Superhuman PMF: https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/
- Tom Tunguz sales funnel: https://tomtunguz.com/matching-marketing-tactics-to-the-sales-funnel/
- Traction book: https://www.penguinrandomhouse.com/books/319121/traction-by-gabriel-weinberg-and-justin-mares/
- OpenView product-led growth: https://www.openviewpartners.com/product-led-growth/
- HubSpot content marketing: https://blog.hubspot.com/marketing/content-marketing
- Shopify community-led growth: https://www.shopify.com/blog/community-led-growth
- NFX network effects: https://www.nfx.com/post/network-effects-bible/
- NFX defensibility: https://www.nfx.com/post/defensibility-most-value-for-founders
- David Skok CAC/business model: https://www.forentrepreneurs.com/startup-killer/
- David Skok SaaS metrics: https://www.forentrepreneurs.com/saas-metrics-2/
- CloudZero CLV/LTV: https://www.cloudzero.com/blog/customer-lifetime-value/
- CloudZero gross margin: https://www.cloudzero.com/blog/saas-gross-margin-benchmarks/
- Amplitude churn: https://amplitude.com/explore/analytics/what-is-churn
- First Round customer success: https://review.firstround.com/founders-guide-building-customer-success/
- Stripe NRR: https://stripe.com/resources/more/net-revenue-retention
- ValueAdd burn rate/runway: https://valueaddvc.com/blog/burn-rate-and-runway-explained-how-to-model-it-with-worked-examples
- David Sacks burn multiple: https://medium.com/craft-ventures/the-burn-multiple-51a7e43cb200
- Sequoia business plan/pitch: https://www.sequoiacap.com/article/writing-a-business-plan/
- Startup Lawyer term sheet guide: https://startuplawyer.com/venture-capital/venture-capital-term-sheet-survival-guide
- Stripe equity guide: https://stripe.com/en-gi/guides/atlas/equity
- LegalClarity option pool guide: https://legalclarity.org/option-pools-structure-sizing-and-dilution-impact/
- Ramp dilution: https://ramp.com/blog/what-is-dilution
- Harness staging: https://www.harness.io/harness-devops-academy/what-is-a-staging-environment
- Harness release management: https://www.harness.io/blog/software-release-management
- Google DORA / Four Keys: https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance
- AWS runbooks: https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html
- SRE book: https://sre.google/sre-book/
- PagerDuty incident response glossary: https://response.pagerduty.com/training/glossary/
- Atlassian Statuspage: https://www.atlassian.com/software/statuspage
- LeadingIT business continuity: https://goleadingit.com/blog/business-continuity-plan-and-template/
- Pragmatic SRE capacity management: https://www.pragmaticsre.com/psre-guide/2-reliability-engineering/capacity-management
- Josys vendor management: https://www.josys.com/article/it-vendor-management-guide
- CISA third-party risk: https://www.cisa.gov/information-and-communications-technology-supply-chain-risk-management
- GDPR storage limitation: https://gdpr.eu/article-5-how-to-process-personal-data/
- Atlassian change management: https://www.atlassian.com/itsm/change-management/
- Front customer operations guide: https://front.com/guides/customer-operations-guide
- Google SRE fundamentals: https://cloud.google.com/blog/products/devops-sre/sre-fundamentals-sli-vs-slo-vs-sla

## Notes for the coordinator

- No changes were made to `agent/lib/concept-catalog.ts`, `agent/courses/index.ts`, or `agent/courses/types.ts`.
- The 6 keys that overlapped with `agent/courses/product.ts` (`problem-validation`, `value-proposition`, `freemium`, `product-led-growth`, `network-effects`, `churn`) were removed from `startup.ts`.
- Six new business concepts (`competitive-analysis`, `ideal-customer-profile`, `founder-led-sales`, `customer-success`, `term-sheet`, `option-pool`) were added to restore the pillar to 50 unique keys and fill founder-level gaps.
- All 50 Startup keys are unique across all course pillars and the base catalog.
- All `prereqs` and `next` references resolve to the merged `ALL_CONCEPTS` set.
- `npx tsc --noEmit`, `npx tsc -p tsconfig.mcp.json --noEmit`, and `npm run build` were run and passed.
- No changes were committed.
