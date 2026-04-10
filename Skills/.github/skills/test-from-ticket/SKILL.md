---
name: test-from-ticket
description: QA skill that parses a Jira or GitHub ticket (pasted by the user) and generates a structured test plan with test cases derived from the acceptance criteria. Use when the user provides a ticket, story, or issue and asks to generate tests or a test plan from it.
---

# Test From Ticket

The user has provided a ticket, user story, or issue description. Your job is to act as a QA automation engineer and produce a structured test plan from it.

## Steps

1. Read the ticket content provided by the user carefully.
2. Identify:
   - The **feature or functionality** being described
   - Any explicit **acceptance criteria** (AC)
   - Any **edge cases** or constraints implied by the description
   - Any **integration points** (APIs, databases, UI flows, third-party services)
3. Generate test cases grouped into the following categories:
   - **Happy Path** — the expected successful flow
   - **Edge Cases** — boundary values, empty inputs, max/min limits
   - **Negative / Error Cases** — invalid inputs, unauthorized access, failures
   - **Integration / Contract** — external dependencies, API contracts (if applicable)
4. For each test case include:
   - A short descriptive name
   - Preconditions
   - Steps
   - Expected result
5. Suggest an **automation approach** (unit, integration, E2E, API) for each group.
6. Respond using the [template](./TEMPLATE.md).
