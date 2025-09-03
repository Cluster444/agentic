---
description: Research the codebase and create documentation in the folder name passed with the subagents available.
---

# Research Codebase

You are tasked with generating comprehensive documentation for the current codebase in a user specified folder

The user will provide the folder and any specific documentation which needs to be created.

Read the <folder> to know the folder and any specific documentation requirements

## Standard Documents to Generate

Unless the user specifies only to generate specific documentation, generate the following documents, but not limited to them

   - ARCHITECTURE.md: High-level system architecture with diagrams.
   - FOLDER-STRUCTURE.md: Repository folder structure and rationale.
   - FRAMEWORK.md: Frameworks and tools used.
   - SETUP.md: Setup and installation instructions.
   - ENTRY-POINTS.md: Application entry points (e.g., main scripts, API endpoints).
   - CRONS-DAEMONS.md: Scheduled tasks and background services.
   - CODE-FLOW.md: Code and data flow with sequence diagrams.
   - API.md: API endpoint documentation (if applicable).
   - CONTRIBUTING.md: Contribution guidelines.
   - TESTING.md: Testing guide.
   - DEPLOYMENT.md: Deployment instructions.
   - README.md: Overview of the codebase
   - TOC.md: Table of contents
   - INTEGRATIONS.md: External integrations

If you find any other documents that need to be created apart from these, prompt the user ONLY after finishing all the steps.
If any of the files are becoming too large, divide them into multiple files and put them in a folder with the same name
For e.g.,
   FRAMEWORK.md can have a high level overview of the framework, and framework folder contains the findings further into their respective files, like CODING-PATTERNS.md, DEPENDENCIES.md, etc 

## Steps to follow after receiving the research query:

1. **Understand the codebase folder structure and files first:**
   - **IMPORTANT**: For each document, identify components patterns and concepts to investigate
   - **CRITICAL**: Understand the folder structure in the main context before spawning any sub-tasks
   - This ensures you have full context before decomposing the research
   - Ignore any folders that might have redundant data, like staging, testing, etc. 

2. **Analyze and decompose the findings:**
   - Take time to think about the underlying patterns, connections, and components
   - Identify specific components, patterns, or concepts to investigate
   - Create a research plan using TodoWrite to track all subtasks
   - Consider which directories, files, or architectural patterns are relevant to each document

3. **Spawn tasks for comprehensive research (follow this sequence):**
   
   **Phase 1 - Locate (Codebase & Thoughts):**
   - Identify all topics/components/areas you need to locate per document
   - Group related topics into coherent batches
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

5. **Generate documentation:**
   - Create each document in the folder name provided in <folder> (e.g., docs/ARCHITECTURE.md)

6. **Present findings:**
   - Present a concise summary of findings to the user
   - Include key file references for easy navigation
   - Ask if they have follow-up questions or need clarification

7. **Handle follow-up questions:**
   - If the user has follow-up questions, analyze the question and do more research if required and add newly found information to the relevant documents. 
   - Spawn new sub-agents as needed for additional investigation
   - Continue updating the documents and syncing

## Important notes:
- Follow the three-phase sequence: Locate → Find Patterns → Analyze → Document
- Use parallel Task agents OF THE SAME TYPE ONLY within each phase to maximize efficiency and minimize context usage
- Always run fresh codebase research - never rely solely on existing research documents
- The thoughts/architecture directory contains important information about the codebase details
- Focus on finding concrete file paths and line numbers for developer reference
- Include diagrams(e.g., Mermaid/UML) for architecture.md and code-flow.md. And any other documents where it seems necessary for clarity
- Each sub-agent prompt should be specific and focused on read-only operations
- If <folder> mentions files explicitly, FULLY read those files(with no offset/limit).
- Consider cross-component connections and architectural patterns
- Include temporal context (when the research was conducted)
- Keep the main agent focused on synthesis, not deep file reading
- Encourage sub-agents to find examples and usage patterns, not just definitions
- **Critical ordering**: Follow the numbered steps exactly
  - ALWAYS read mentioned files first before spawning sub-tasks (step 1)
  - ALWAYS wait for all sub-agents to complete before synthesizing (step 4)
  - ALWAYS gather metadata before writing the document (step 5 before step 6)
  - NEVER write the research document with placeholder values
- Documentation best practicies:
  - Use Markdown for all files
  - Keep documents concise and make them developer-focused

<folder>$ARGUMENTS</folder>
