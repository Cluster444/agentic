---
description: Research a ticket or provide a prompt for ad-hoc research. It is best to run this command in a new session.
---

# Research Codebase

You are tasked with conducting comprehensive research across the codebase to answer user questions by spawning tasks and synthesizing their findings.

The user will provide a ticket for you to read and begin researching.

## Steps to follow after receiving the research query:

1. **Read the ticket first:**
   - **IMPORTANT**: Use the Read tool WITHOUT limit/offset parameters to read entire files
   - **CRITICAL**: Read these files yourself in the main context before spawning any sub-tasks
   - This ensures you have full context before decomposing the research

2. **Detail the steps needed to perform the research:**
    - Break down the user's ticket into composable research areas
    - Take time to think about the underlying patterns, connections, and architectural the ticket has provided
    - Identify specific components, patterns, or concepts to investigate
    - Lay out what the codebase-locator or thoughts-locator should look for
    - Specify what patterns the codebase-pattern-finder should look for
    - Be clear that locators and pattern-finders collect information for analyzers
    - Typically run a single codebase-analyzer and thoughts-analyzer (in parallel if both needed)
    - Consider which directories, files, or architectural patterns are relevant

3. **Spawn tasks for comprehensive research (follow this sequence):**
   
   **Phase 1 - Locate (Codebase & Thoughts):**
   - Identify all topics/components/areas you need to locate
   - Group related topics into coherent batches
   - Spawn **web-search-researcher** agents in parallel to gather external authorative context and capturing provenance
   - Spawn **codebase-locator** agents in parallel for each topic group to find WHERE files and components live
   - Simultaneously spawn **thoughts-locator** agents in parallel to discover relevant documents
   - **WAIT** for all locator agents to complete before proceeding

   **Phase 2 - Find Patterns (Codebase only):**
   - Based on locator results, identify patterns you need to find
   - Use **codebase-pattern-finder** agents to find examples of similar implementations
   - Run multiple pattern-finders in parallel if searching for different unique patterns
   - **WAIT** for all pattern-finder agents to complete before proceeding

   **Phase 3 - Analyze (Codebase & Thoughts):**
   - Using information from locators and pattern-finders, determine what needs deep analysis
   - Group analysis tasks by topic/component
   - Spawn **codebase-analyzer** agents in parallel for each topic group to understand HOW specific code works
   - Spawn **thoughts-analyzer** agents in parallel to extract key insights from the most relevant documents found
   - **WAIT** for all analyzer agents to complete before synthesizing

   **Important sequencing notes:**
   - Each phase builds on the previous one - locators inform pattern-finding, both inform analysis
   - Run agents of the same type in parallel within each phase
   - Never mix agent types in parallel execution
   - Each agent knows its job - just tell it what you're looking for
   - Don't write detailed prompts about HOW to search - the agents already know

4. **Wait for all sub-agents to complete and synthesize findings:**
   - IMPORTANT: Wait for ALL sub-agent tasks to complete before proceeding
   - Compile all sub-agent results (both codebase and thoughts findings)
   - Prioritize live codebase findings as primary source of truth
   - Use thoughts/ findings as supplementary historical context
   - Connect findings across different components
   - Include specific file paths and line numbers for reference
   - Highlight patterns, connections, and architectural decisions
   - Answer the user's specific questions with concrete evidence

5. **Gather metadata for the research document:**

Use the following metadata for the research document frontmatter:

**metadata for frontmatter**

!`agentic metadata`

6. **Generate research document:**
   - Filename: `thoughts/research/date_topic.md`
   - Use the metadata gathered in step 5, mapping XML tags to frontmatter fields
   - Structure the document with YAML frontmatter followed by content:
     ```markdown
     ---
     date: [Current date and time with timezone in ISO format]
     git_commit: [from metadata]
     branch: [from metadata]
     repository: [from metadata]
     topic: "[User's Question/Topic]"
     tags: [research, codebase, relevant-component-names]
     last_updated: [from metadata]
     ---

     ## Ticket Synopsis
     [Synopsis of the ticket information]

     ## Summary
     [High-level findings answering the user's question]

     ## Detailed Findings

     ### [Component/Area 1]
     - Finding with reference ([file.ext:line])
     - Connection to other components
     - Implementation details

     ### [Component/Area 2]
     - Finding with reference ([file.ext:line])
     - Connection to other components
     - Implementation details
     ...

     ## Code References
     - `path/to/file.py:123` - Description of what's there
     - `another/file.ts:45-67` - Description of the code block

     ## Architecture Insights
     [Patterns, conventions, and design decisions discovered]

     ## Historical Context (from thoughts/)
     [Relevant insights from thoughts/ directory with references]
     - `thoughts/research/something.md` - Historical decision about X
     - `thoughts/plans/build-thing.md` - Past exploration of Y
     - `thoughts/docs/YYYY-MM-DD_some-topic.md` - Past searches of Z topic

     ## Related Research
     [Links to other research documents in thoughts/shared/research/]

     ## Open Questions
     [Any areas that need further investigation]
     ```

7. **Present findings:**
   - Present a concise summary of findings to the user
   - Include key file references for easy navigation
   - Ask if they have follow-up questions or need clarification

8. **Handle follow-up questions:**
   - If the user has follow-up questions, append to the same research document
   - Update the frontmatter fields `last_updated` and `last_updated_by` to reflect the update
   - Add `last_updated_note: "Added follow-up research for [brief description]"` to frontmatter
   - Add a new section: `## Follow-up Research [timestamp]`
   - Spawn new sub-agents as needed for additional investigation
    - Continue updating the document and syncing

9. **Update ticket status** to 'researched' by editing the ticket file's frontmatter.

Use the todowrite tool to create a structured task list for the 9 steps above, marking each as pending initially.

## Important notes:
- Follow the three-phase sequence: Locate → Find Patterns → Analyze
- Use parallel Task agents OF THE SAME TYPE ONLY within each phase to maximize efficiency and minimize context usage
- Always run fresh codebase research - never rely solely on existing research documents
- The thoughts/architecture directory contains important information about the codebase details
- Focus on finding concrete file paths and line numbers for developer reference
- Research documents should be self-contained with all necessary context
- Each sub-agent prompt should be specific and focused on read-only operations
- Consider cross-component connections and architectural patterns
- Include temporal context (when the research was conducted)
- Keep the main agent focused on synthesis, not deep file reading
- Encourage sub-agents to find examples and usage patterns, not just definitions
- Explore all of thoughts/ directory, not just research subdirectory
- **File reading**: Always read mentioned files FULLY (no limit/offset) before spawning sub-tasks
- **Critical ordering**: Follow the numbered steps exactly
  - ALWAYS read mentioned files first before spawning sub-tasks (step 1)
  - ALWAYS wait for all sub-agents to complete before synthesizing (step 4)
  - ALWAYS gather metadata before writing the document (step 5 before step 6)
  - NEVER write the research document with placeholder values
- **Frontmatter consistency**:
  - Always include frontmatter at the beginning of research documents
  - Keep frontmatter fields consistent across all research documents
  - Update frontmatter when adding follow-up research
  - Use snake_case for multi-word field names (e.g., `last_updated`, `git_commit`)
  - Tags should be relevant to the research topic and components studied

**ticket**

$ARGUMENTS

