/* Sanitized engineering narratives. Evidence scope is recorded per study and in
   docs/technical-portfolio-audit.md. Employer source is intentionally unavailable. */
const section = (title, ...paragraphs) => ({title, paragraphs});
const employerEvidence = 'Implementation described by Frank from his engineering work; the employer retains the GitLab repositories. The CV corroborates the broader responsibilities. Source, current deployment state and employer test records were not available for this portfolio audit.';
const privateStatus = 'Implemented · employer-held source; deployment status unverified';
const enterprise = (summary, sections, extra = {}) => ({
 status: privateStatus, evidence: employerEvidence, summary, sections, ...extra
});

export const ADDITIONAL_PROJECTS = [
 {id:'boomerang',category:'projects',name:'Boomerang — Enterprise Service Orchestration & Zoho Desk Integration',eyebrow:'Enterprise workflow · Engineering contribution',year:'2025–2026',role:'Software / integration developer',stack:['Angular','ASP.NET Core 8','EF Core','SQL Server','Zoho Desk','IIS'],color:'#edb98c',ink:'#6b453b',challenge:'Extend cross-department participation without licensing every internal participant as a support agent.',solution:'An internal workflow layer around Zoho Desk, implemented inside the existing IntegrationGateway.Api boundary.',highlights:['Backend-governed workflow transitions','Persistent external ticket correlation','Departmental handoffs and final Support validation'],architecture:['Angular','IntegrationGateway.Api','SQL Server','Zoho Desk'],outcome:'Employer-held enterprise implementation described by the contributing developer.'},
 {id:'zoho-desk',category:'swatch',name:'Zoho Desk — Platform Administration & Extension Engineering',eyebrow:'Enterprise SaaS · Administration and integration',year:'2025–2026',role:'Platform administration / integration developer',stack:['Zoho Desk','OAuth 2.0','Angular','ASP.NET Core 8','IIS','Webhooks'],color:'#b6d0d4',ink:'#244b5b',challenge:'Make departmental routing, API access and internal participation work together across a licensed SaaS boundary.',solution:'Combined platform configuration, webhook diagnostics, OAuth access and private extension engineering.',highlights:['Departmental administration','Ticket-to-incident synchronization','Private extension packaging and installation'],architecture:['Zoho Desk','Webhook / OAuth','IntegrationGateway.Api','Boomerang'],outcome:'Implementation account with embedded authentication resolution explicitly unverified.'},
 {id:'hr-portal',category:'projects',name:'HR Portal',eyebrow:'Enterprise application · Scope awaiting evidence',year:'2025–2026',role:'Contribution scope not established',stack:['Enterprise application','Identity boundaries','Workflow design'],color:'#bedbce',ink:'#375d4c',challenge:'An HR application must expose employee workflows without exposing unrelated personnel data.',solution:'A named experience area retained for reconciliation; project-specific implementation has not been established by the available evidence.',highlights:['Confidential personnel data excluded','Implementation scope pending confirmation'],architecture:['Employee request','Authorization','HR workflow'],outcome:'No shipped HR features or project-specific stack claimed.'},
 {id:'smartolt',category:'swatch',name:'SmartOLT — Connector Investigation',eyebrow:'Integration scope · Not verified',year:'2025–2026',role:'Integration scope pending confirmation',stack:['SmartOLT','REST API design'],color:'#c4d7e1',ink:'#315263',challenge:'Network management data needs an explicit contract before it can safely enter an enterprise workflow.',solution:'A connector boundary is illustrated as a proposal, not a verified deployed integration.',highlights:['Connector status explicitly unverified','No operational network details published'],architecture:['SmartOLT','Proposed client','Normalized contract'],outcome:'No implementation or production connectivity claim.'}
];

export const TECHNICAL_CASES = {
 'boomerang': enterprise(
  'An Angular and ASP.NET Core 8 enterprise workflow platform extending Zoho Desk participation beyond licensed support users. Zoho Desk remains the customer-facing ticket system; Boomerang coordinates internal departmental work through IntegrationGateway.Api and SQL Server.',
  [
   section('Business problem and system context',
    'A customer ticket may need Accounts or Operations input even when those colleagues are not licensed support agents. Giving every participant a support seat couples internal collaboration to SaaS licensing. Boomerang provides a departmental participation layer while Support retains the customer-facing ticket relationship in Zoho Desk.',
    'This is an extension of an existing enterprise system. IntegrationGateway.Api is the backend application boundary, not a newly invented gateway appliance or a separate microservice estate. The Angular interface presents internal work; application services own workflow decisions and EF Core persists internal state in SQL Server.'),
   section('My engineering contribution',
    'My contribution covered Angular/API workflow behaviour, departmental handoffs, ticket-to-incident integration and operational consistency within the wider enterprise platform. This case study describes the system context needed to understand that work; it does not claim sole authorship of all platform components.'),
   section('Core implementation: controlled departmental work',
    'Frontend actions represent requests to application services rather than permission to update a status directly. The backend checks the acting user, department, current workflow stage and required checklist evidence before permitting a transition. A successful button interaction is therefore not itself evidence that work has been accepted or completed.',
    'Support Border Control acts as the intake and final validation boundary. Work routes into Accounts and Operations handoffs, where acceptance establishes responsibility and checklist validation precedes completion. Recall and correction reopen work that requires changes; resubmission sends corrected work through validation again. Return-to-Support brings departmental results back for final checks and eligible closure.',
    'SLA tracking and operational dashboards must interpret the same persisted workflow records. A handoff should not appear complete on one screen while remaining actionable in another. Incident attachments belong to the incident context and need their linkage preserved through correction, recall and resubmission.'),
   section('Data model and persistence: two state models',
    'Zoho ticket state and Boomerang workflow state serve different purposes. A customer ticket can remain open while an internal department accepts or completes a task. Departmental completion is not automatically external ticket closure; Support validation determines when closure is eligible.',
    'Persistent external ticket identifiers link internal incident records to the SaaS ticket. That linkage supports incident correlation, duplicate detection and later synchronization without relying on mutable subjects or display text. Internal workflow, SLA, audit and attachment context must remain associated with the incident when ownership or external department changes.',
    'EF Core and SQL Server provide the internal persistence boundary. The narrative intentionally avoids invented entity names, schema constraints or transaction guarantees that cannot be checked against employer-held code.'),
   section('Security, identity and integration contracts',
    'A department-aware interface is only one access boundary. Application services validate transition authority and checklist requirements on the server. External Zoho access uses a separate OAuth-backed service identity; possession of that integration credential must not become end-user authority to perform arbitrary workflow transitions.',
    'Webhook payloads and ticket API responses describe the external ticket. They need normalization into the incident model while preserving the external identifier. Department mappings and external statuses inform routing; they do not replace internal acceptance, completion or validation rules.'),
   section('Engineering challenge: reconciliation and guarded repair',
    'Webhook processing alone cannot establish cross-system consistency. A missed event, retry, configuration change or department transfer can leave a persisted incident behind the current SaaS ticket. An incoming event may also refer to a ticket already represented internally. Persistent linkage and duplicate detection are necessary even when the webhook endpoint succeeds.',
    'The reconciliation work described for this project compares the current external queue with internal records using bounded ticket retrieval and normalized department/status values. It identifies missing or inconsistent linkage before considering a repair. Event-driven synchronization handles changes promptly; reconciliation provides a separate consistency check against the currently visible source.',
    'The safe mutation policy is deliberately conservative: dry-run by default, administrative authorization for repair, guarded changes tied to persistent identifiers, repeatable handling of the same ticket and audit records for mutation. Incomplete scans must not be interpreted as proof that unobserved tickets were deleted or closed. A bounded scan offers controlled cost and scope; it cannot establish global completeness.',
    'Staging remains read-only by default for external reconciliation. Any write-based lifecycle checks must be explicitly isolated to designated test tickets. These controls are part of the supplied engineering account; exact guard implementation, rate-limit behaviour and test results are not independently verified here. No assertion of exactly-once delivery or a cross-system distributed transaction is made.'),
   section('DevOps and deployment',
    'The delivery context is GitLab CI/CD, Angular validation, ASP.NET Core publish output, EF Core migrations and Windows IIS hosting. Application configuration, service credentials and database changes need to travel through controlled environment boundaries. The broader delivery study explains implemented staging automation and manual production controls; it does not imply unattended Boomerang production release.'),
   section('Testing and validation',
    'The employer retains the implementation and lifecycle suites. This portfolio does not reproduce their source or assert a verified test count. Reviewable validation concerns include denied transitions, checklist failure, recall/resubmit paths, duplicate ticket events, incomplete reconciliation scans and consistency between incident detail and operational dashboards. These concerns explain the engineering boundary rather than claim that this audit executed the employer tests.'),
   section('Engineering decisions, outcomes and implementation status',
    'Extending the existing API boundary keeps internal workflow orchestration close to application services and persistence. Keeping Zoho and Boomerang states distinct avoids forcing customer support statuses to encode every departmental action. Conservative repair trades automatic correction coverage for reviewability and protection against partial external reads.',
    'The implementation enables internal participation without requiring every department member to act as a licensed Zoho support agent. No seat count, financial saving, throughput, uptime or performance improvement is asserted. Implementation is described by the contributing engineer; current production deployment and exact lifecycle evidence remain unverified.')
  ],
  {description:'Angular and .NET workflow orchestration around Zoho Desk: backend-governed departmental handoffs, persistent incident linkage and guarded reconciliation.',
   diagrams:['boomerang-workflow','reconciliation'], evidence:employerEvidence, diagramCaption:'Sanitized application boundaries from the implementation account. External ticket state and internal workflow state remain distinct.'}
 ),
 'zoho-desk': enterprise(
  'Platform administration and custom engineering across departmental Zoho Desk configuration, OAuth API access, webhooks and a private extension for internal workflow participation.',
  [
   section('Business problem and system context',
    'Zoho Desk owns the customer-facing support queue. Cross-department work needs ticket context, routing and a reliable link to internal incidents without giving every colleague a support-agent licence. The integration joins administrative configuration with application behaviour rather than treating a webhook URL as the entire solution.'),
   section('My engineering contribution',
    'My work included multi-department administration, investigating ticket ownership and assignment, departmental status mappings, ticket-update webhook configuration and parsing native webhook payloads. Integration diagnostics helped distinguish incorrect platform configuration from payload or application handling failures.',
    'I worked on persistent ticket-to-incident synchronization, duplicate incident protection, cross-system routing and administrative reconciliation in the Boomerang/IntegrationGateway context.'),
   section('Core implementation and integration contracts',
    'Department and status values must be interpreted in the originating Zoho context before being normalized for internal routing. A ticket ownership change, a department transfer and an internal workflow handoff are related events with different meanings. The persistent ticket identifier is the correlation anchor across those changes.',
    'OAuth 2.0 Self Client configuration establishes the integration access path. Authorization scopes determine permitted API operations; refresh-token-based access avoids requiring an interactive user sign-in for each backend call. API connectivity validation checks the actual service boundary. Secret rotation requires updating the configured credential without exposing it in logs or diagnostics.'),
   section('Private extension engineering',
    'The extension work covered manifest validation, packaging, publication and installation, alongside hosting the Angular application through IIS. The embedded context introduced iframe compatibility investigation and authentication redirection challenges.',
    'A page working directly in a browser does not establish that its sign-in flow will work inside a Zoho Desk iframe. Navigation and authentication redirects must remain compatible with the embedding context. Publication or installation of the package is therefore separate from acceptance of embedded authentication. The available account does not establish that this flow was fully resolved.'),
   section('Failure modes, security and trade-offs',
    'Misaligned department mappings can send correct ticket data into the wrong internal workflow. Duplicate webhook deliveries can create duplicate incidents unless correlation is checked. Expired access tokens, insufficient scopes and rotated secrets are different operational failure domains and need separate diagnostics.',
    'The business value is an engineered participation layer around the licensed SaaS platform. This preserves Zoho as the support system while allowing internal workflow capabilities to evolve independently. No commercial savings or resolved embedded sign-in outcome is claimed.'),
   section('Validation and implementation status',
    'Administration, integration and extension packaging work are described by the contributing engineer. The employer holds the source and platform records. Current installation state, production connector coverage and complete embedded authentication acceptance have not been independently checked.')
  ],
  {description:'Multi-department administration, OAuth access, native ticket webhooks and private extension packaging, with embedded authentication limitations made explicit.',
   diagrams:['zoho-lifecycle'],diagramCaption:'Ticket events cross a normalization boundary before they become internal incident updates; the extension has a separate embedded-authentication acceptance boundary.'}
 ),
 'gateway': enterprise(
  'IntegrationGateway.Api — Enterprise Systems Integration & Orchestration. An ASP.NET Core 8 application boundary for internal services, external API clients and persisted workflow coordination.',
  [
   section('Business problem and system context',
    'Enterprise applications need to exchange data across SaaS, ERP, collaboration, telephony and monitoring systems with different contracts and identities. An internal application API can centralize those integration responsibilities without being a commercial API management product or a generic reverse proxy.',
    'IntegrationGateway.Api contains REST boundaries, application services and external service clients. Dependency injection connects those responsibilities. DTOs and normalization keep vendor payload shapes from becoming the internal workflow contract; SQL Server and EF Core support the persistence needed by application behaviour.'),
   section('My engineering contribution',
    'My work covered backend integration endpoints and application contracts, external API authentication, persistence, configuration and operational diagnostics. The CV independently supports enterprise integration work involving Zoho Desk, Acumatica, Microsoft Graph, Microsoft 365 and SharePoint. Boomerang supplies a concrete orchestration example inside this API boundary.'),
   section('Core implementation and integration contracts',
    'REST requests enter validation and authorization before application services coordinate internal work and external clients. OAuth token acquisition and refresh belong to the external access boundary. Enterprise user identity and service-to-service vendor credentials have separate responsibilities.',
    'Zoho Desk supports ticket ingestion and workflow synchronization. Acumatica adds ERP integration context; Microsoft Graph provides the Microsoft 365 and SharePoint access surface. The supplied account also identifies 3CX and Zabbix integration work. This portfolio does not invent endpoint inventories, synchronization schedules or bidirectional guarantees for those connectors.',
    'Connector coverage is not a production matrix: Zoho, ERP and Microsoft collaboration integration experience is supported by the CV; 3CX and Zabbix details rely on the implementation account and existing portfolio. Per-connector deployed versus proof-of-concept status is unverified. SmartOLT remains a separately labelled proposed/unverified connector rather than a completed service.'),
   section('Data model, security and failure boundaries',
    'Internal incident identifiers and persistent external ticket linkage support normalization and duplicate detection. EF Core migrations evolve the SQL Server schema alongside API contracts. Exact table definitions and database constraints are not published or inferred.',
    'External API success and internal transaction success are different outcomes. An accepted vendor update must not be confused with an accepted internal transition. Diagnostics need enough context to locate token, contract, mapping or persistence failures while excluding credentials and private operational payloads.'),
   section('Reconciliation and state consistency',
    'A current-queue reconciliation complements webhook-driven ingestion. Bounded retrieval and status/department normalization compare external tickets with internal incident linkage. Missing or inconsistent records become repair candidates rather than unconditional writes.',
    'Dry-run defaults, administrative authority, persistent correlation, repeatable duplicate handling, audit records and incomplete-scan protection constrain repair. Staging reads remain the default and lifecycle writes are isolated to designated test tickets. These are described engineering controls; exact implementation evidence and rate-limit handling are unavailable. See the Boomerang study for the full trade-off.'),
   section('DevOps and deployment',
    'The delivery context combines GitLab CI/CD, .NET build/publish, database migration handling and Windows IIS. Environment-specific settings configure identity, vendor services and persistence. Credentials and private environment addresses are intentionally absent from the public architecture.',
    'Application publishing and deployment troubleshooting sit alongside API engineering: publish output needs required configuration, runner selection must match the target platform, and environment variables must resolve in the deployment context. The CV establishes staging-first delivery; no automatic production deployment is claimed.'),
   section('Testing, decisions and outcomes',
    'Service boundaries make vendor contract changes and internal workflow decisions easier to reason about separately. The integration application remains an enterprise application with orchestration responsibilities; the evidence does not establish a microservices topology.',
    'Employer-held source and CI records were unavailable. No connector is labelled production solely because its name appears in the stack, and no test total or business metric is published. My integration and delivery responsibilities are distinguished from the full platform capabilities.')
  ],
  {name:'IntegrationGateway.Api — Enterprise Systems Integration & Orchestration',description:'ASP.NET Core 8 application services, external API clients and EF Core persistence for enterprise integration and workflow orchestration.',stack:['ASP.NET Core 8','Dependency injection','REST / DTOs','EF Core','SQL Server','OAuth 2.0','GitLab CI/CD','IIS'],diagrams:['reconciliation'],diagramCaption:'Logical application responsibilities, not separate microservices. Connector deployment coverage is not independently verified.'}
 ),
 'workspace': enterprise(
  'Enterprise Governance, Work Management & PMO Platform. Angular and ASP.NET Core 8 application engineering across departmental work, identity-backed access and SQL Server persistence.',
  [
   section('Business problem and system context',
    'Departments need requests, assignments and projects to carry explicit ownership and authorization. A shared work-management interface is insufficient when departmental boundaries, approval states and PMO oversight have different access needs.',
    'The wider Workspace platform combines Angular, ASP.NET Core 8, EF Core, SQL Server and Microsoft Entra ID. Authentication establishes identity; application authorization groups, roles and department rules determine what work that identity may see or change.'),
   section('My engineering contribution',
    'My implementation work covered backend and frontend contract alignment, departmental governance and authorization groups, project/request workflows, assignments, tasks and subtasks. I also worked on approval-state behaviour, the PMO workbench and project ownership reassignment within the team-developed platform.',
    'Calendar and export behaviour, database reference-data consistency, migrations and staging deployments formed part of the delivery work. These are contribution areas, not a claim that I independently built the entire Workspace product.'),
   section('Core implementation and persistence',
    'Project ownership, assignments and approval states are business data; Entra ID sign-in does not define them. Backend contracts must represent permitted actions and required fields consistently with Angular screens. Reassignment must preserve a meaningful owner rather than merely change a display label.',
    'Department and authorization reference data need to agree with persisted records and API expectations. A missing reference row or mismatched identifier can break a valid-looking frontend workflow. EF Core migrations and release coordination make that consistency a database and deployment concern as well as a UI concern.'),
   section('Security and identity',
    'Department membership and authorization groups constrain resource access. PMO visibility and departmental participation serve different purposes and must not collapse into a single logged-in-user permission. UI visibility supports usability; API authorization remains the enforcement boundary.',
    'Identity redirect URI mismatches are a deployment configuration failure mode: the application address, Entra registration and environment-specific configuration need to agree. No tenant, group identifiers or private deployment addresses are exposed.'),
   section('Engineering challenges and trade-offs',
    'Calendar and export views need to preserve the same ownership, state and department meaning as the primary workbench. Frontend/backend contract changes and reference-data migrations must ship coherently to avoid a screen offering operations that the API cannot accept.',
    'The enterprise platform carries broader capabilities than any single contribution. This case study emphasizes the parts I worked on and the boundaries they depend on; it avoids invented approval graphs, concurrency strategies or audit schemas.'),
   section('DevOps, validation and implementation status',
    'Delivery used GitLab CI/CD, application builds, EF Core migration handling and IIS staging. Production promotion remained controlled rather than being represented as unattended deployment.',
    'Implementation areas are described by the contributing engineer; the CV corroborates the .NET/Angular, identity, database and staging responsibilities. Employer source, PMO acceptance records, project-specific test totals and current production state are unavailable.')
  ],
  {name:'Workspace — Enterprise Governance, Work Management & PMO Platform',description:'Department-aware Angular/.NET work management: authorization groups, request/project workflows, PMO operations and coordinated persistence.',stack:['Angular','ASP.NET Core 8','SQL Server','EF Core','Microsoft Entra ID','GitLab CI/CD'],diagramCaption:'Authentication, resource authorization and business ownership are separate boundaries; group-to-department mappings are sanitized.'}
 ),
 'frankacademy': {
  status:'Merged implementation and recorded tests · private product · production launch blocked',
  eyebrow:'Independent product · Full-stack LMS engineering',
  name:'FrankAcademy — Full-Stack Learning Management & EdTech SaaS Platform',
  description:'Next.js and ASP.NET learning platform with PostgreSQL-backed progress, immutable course revisions, instructor rosters and layered regression gates.',
  stack:['Next.js','ASP.NET Core 8 → .NET 10','PostgreSQL','EF Core','Identity / JWT','OpenAPI','Azure DevOps','Playwright'],
  summary:'A full-stack LMS with ASP.NET owning business persistence and Next.js using typed HTTP contracts. Originally implemented with ASP.NET Core 8; the newer local repository contains a merged .NET 10 migration. Merged code and recorded disposable-environment acceptance are distinct from production launch readiness.',
  evidence:'Local source and documentation inspected in FrankAcademy and the newer FrankAcademy-local checkout. Recorded history at 836ed24 includes merges for course revisions, revision-aware rosters, instructor administration, .NET 10 migration and readiness work. Historical test records were inspected, not rerun during this portfolio change.',
  diagrams:['course-revisions'],
  diagramCaption:'Next.js talks to the API through typed HTTP; ASP.NET/EF Core is the authoritative business persistence boundary. Original .NET 8 implementation later migrated to .NET 10.',
  sections:[
   section('Business problem and system context',
    'A learner journey must survive content changes and process restarts. Replacing a lesson or changing a quiz threshold in place can reinterpret historical completion and assessment results. The platform needs a stable meaning for the curriculum a learner actually enrolled in.',
    'Next.js Server Components and Server Actions use typed HTTP to call ASP.NET controllers and application handlers. EF Core owns PostgreSQL persistence and migrations. Next.js does not directly query the database or calculate authoritative completion.'),
   section('My engineering contribution',
    'My full-stack product work spans learning delivery, persistent enrolment/progress/resume, server-side assessments, instructor authoring and revision-aware rosters. It also includes API contracts, database migrations, access rules and Azure DevOps validation. This independent product is separate from the employer-held enterprise platforms.'),
   section('Core implementation: revisioning without rewriting history',
    'Course remains the revision-specific aggregate. LogicalCourseId groups revisions under the original course; RevisionNumber and SourceRevisionId preserve version and clone lineage. A canonical public slug resolves the current publication, while an enrolled learner resolves their retained revision.',
    'Creating a revision clones the content graph with independent module, lesson, quiz, question and option identifiers. It does not clone or move learner evidence. Published content freezes; editing happens in a working draft. Repeated clone requests return the existing family draft, with PostgreSQL indexes backing the single-draft/current-publication rules.',
    'New enrolments select the current publication. Existing non-dropped enrolments remain attached to their historical course revision, preserving progress and attempts when a newer version changes questions, pass thresholds or required lessons. Supersession retains learning access; explicit withdrawal preserves stored history but suspends access. No automatic learner-upgrade policy is claimed.'),
   section('Data model and persistence',
    'Course → Module → Lesson → Quiz → Question → Option defines the content graph. Enrollment links a student to a revision; LessonProgress links an enrolment and lesson; QuizAttempt and QuizAnswer retain assessment evidence. The additive course-revision migration preserves existing identifiers and historical joins.',
    'Publication and authoring use transactions and a PostgreSQL advisory lock, with optimistic authoring hashes checked inside that boundary. This conservative lock favours consistency at the current scale and constrains authoring/enrolment throughput; it is not presented as a high-scale distributed locking framework.',
    'Revision-aware instructor rosters scope queries to a selected course revision, enforce ownership/Admin access and paginate enrolments and attempt history. A learner’s same-revision attempts can predate re-enrolment; the projection preserves that distinction rather than inventing an enrolment-level attempt association.'),
   section('Security, identity and integration contracts',
    'ASP.NET Identity and JWT establish the account/API boundary. Next.js keeps access and refresh credentials in an authenticated encrypted HttpOnly session cookie and sends access tokens server-to-server. Public registration assigns Student; staff content operations enforce Instructor ownership or Admin authorization.',
    'Refresh credentials are hashed, rotated and revoked. Generated OpenAPI and TypeScript contracts align frontend calls with the backend surface. Guided-practice runners remain educational participation; deterministic language simulations are not arbitrary remote code execution or accredited assessment.'),
   section('Failure modes and engineering trade-offs',
    'In-place content editing can corrupt historical meaning. Immutable revisions avoid that at the cost of extra content rows and explicit publication rules. Current public previews and historical enrolled access use different resolution paths; cross-version lesson or quiz IDs must not bypass enrolment checks.',
    'Development reseeding is another writer: it must not reopen retired content or reset a learner’s history. The versioning work added history-aware seeding protection and PostgreSQL-backed HTTP regression. Schema downgrade is guarded once cloned revisions exist; coordinated application/schema changes and restore/roll-forward decisions remain necessary.'),
   section('DevOps, testing and validation',
    'Azure DevOps YAML runs frontend lint/type/test/build, backend builds/tests, real PostgreSQL suites, EF model/SQL checks, generated-contract drift checks and Chromium end-to-end journeys. Result verification distinguishes opt-in relational cases from default tests, avoiding a false green when PostgreSQL coverage is skipped.',
    'Repository records include course-versioning migration/concurrency/rollback checks, PostgreSQL-backed HTTP preservation across reseeding, revision-aware roster access checks and browser resume/restart journeys. These are historical records for identified source revisions, not tests executed during this portfolio update. No overlapping suite totals are added into a synthetic unique-test count.',
    'Local recorded merge history includes course versioning (#40), revision-aware roster (#41), instructor administration (#42), .NET 10 migration (#44) and readiness work (#46). Source presence and merge history support implementation claims; they do not establish a live deployment or enforced branch governance.'),
   section('Outcomes, evidence and implementation status',
    'The implementation preserves historical learner state as course definitions evolve and supplies instructor visibility into revision-specific enrolments and attempts. This is a concrete data-integrity outcome, not a claim of accredited assessment or commercial usage.',
    'The newer release-readiness report still says NO-GO for public launch. Approved hosting, real email delivery, production curriculum, privacy/operations decisions and final release authorization remain open. Production configuration guards and disposable recovery rehearsals do not establish production operation. No QCTO accreditation or compliance certification is claimed.')
  ]
 },
 'pipelines': enterprise(
  'Delivery engineering for .NET APIs and Angular frontends: GitLab CI/CD build, test, packaging, migration bundles and IIS staging, alongside Azure DevOps quality gates for FrankAcademy.',
  [
   section('Business problem and system context',
    'A successful compile is not a deployable release. API binaries, frontend output, configuration and database changes need a coherent artifact and a target-compatible deployment path. Staging provides a controlled place to verify that combination before production approval.'),
   section('My engineering contribution',
    'I developed and maintained GitLab YAML workflows for .NET 8 APIs and Angular applications, including builds, automated tests, publish artifacts, EF Core migration bundles and staging-first deployment. I worked with Linux Docker runners and Windows runners, PowerShell automation and Windows Server/IIS operations.',
    'FrankAcademy supplies inspectable Azure DevOps source for frontend/backend validation, PostgreSQL regressions, OpenAPI drift and browser journeys. Enterprise GitLab implementation details rely on my account and CV; the two evidence levels are kept separate.'),
   section('Core implementation and deployment boundaries',
    'Runner selection is a capability decision. Containerized Linux jobs suit repeatable build/test work; Windows-targeted staging tasks need the appropriate runner, filesystem and IIS tooling. An artifact boundary separates compiled/published application output from target deployment.',
    'EF Core migration bundles make schema evolution an explicit release input. Environment-specific configuration and deployment variables select the target without embedding secrets in source. PowerShell deployment automation and IIS application bindings connect the published output to the intended application.',
    'Staging automation was implemented; production promotion remained manually controlled. This study does not convert a staging pipeline into a claim of fully automated production delivery. Rollback design, approval improvements and infrastructure-as-code expansion are separate proposals unless supported by project evidence.'),
   section('Troubleshooting and failure modes',
    'The implementation account includes missing configuration files in publish artifacts, runner selection and deployment-variable problems. These failures occur after source compilation: the fix needs to address artifact contents or execution context rather than merely retry a build.',
    'Identity redirect URI mismatches require alignment between deployed application addresses, environment settings and the Entra registration. IIS bindings, file placement and configuration availability are distinct diagnostic checks. Logs and pipeline output must help identify that boundary without printing credentials.'),
   section('Security, trade-offs and operational controls',
    'Configuration and secrets follow environment boundaries. Production approval is a control with an accountable operator, not an accidental gap to conceal. Migration execution also needs to respect which application version can use the new schema.',
    'Automation reduces repeated deployment work but raises the importance of artifact completeness and runner permissions. A passing pipeline proves only the checks it ran for its recorded input; it does not establish independent approval, staging health or production safety.'),
   section('Validation, outcomes and status',
    'The CV explicitly supports Linux/Docker and Windows/IIS runners, migration bundles, PowerShell and staging-first release workflows. Local FrankAcademy YAML and result-verification scripts substantiate the Azure quality-gate design. Employer pipeline logs were unavailable and no deployment was performed for this portfolio task.')
  ],
  {description:'GitLab build/test/publish and EF migration bundles, Linux/Windows runners, PowerShell IIS staging and manually controlled production promotion.',stack:['GitLab CI/CD','Azure DevOps','Linux / Docker runners','Windows runners','PowerShell','EF Core bundles','IIS'],status:'Implemented staging workflows · manual production controls',diagramCaption:'Representative delivery boundaries from the CV and implementation account. Azure DevOps quality gates are source-backed; employer staging details are owner-described.'}
 ),
 'azure': {
  status:'Lab implementation · wider environment topology proposed',
  summary:'Azure resource-management and identity experience with a small inspectable ARM storage template. A wider development/test/UAT/production topology is proposed architecture, not a deployed estate.',
  description:'Azure resource and identity work, a source-backed storage lab and a clearly separated proposal for environment isolation and promotion.',
  evidence:'CV cloud responsibilities plus local azure-labs/arm-template/azuredeploy.json. The template declares a StorageV2 account with Standard_LRS; no deployment evidence was available.',
  diagramCaption:'Proposed environment topology. Dashed environment boundaries are planning, not proof of provisioned infrastructure.',
  sections:[
   section('Problem, context and my contribution','Application delivery needs environment isolation, access controls and configuration discipline. My CV supports Azure resource management, Azure CLI, resource groups, networking and Entra application registrations. The local lab adds an ARM resource-definition example.'),
   section('Implementation and architecture','The inspected ARM template defines a StorageV2 account using locally redundant storage and the resource-group location. Template presence establishes an implementation artifact, not a successful provision or operational workload. Resource names and account details are omitted from the diagram.','Development, test, UAT and production isolation, promotion paths, monitoring and cost controls are wider design work. The diagram labels these boundaries as proposed; it does not add VMs, private endpoints, Key Vault or a production network that the evidence does not establish.'),
   section('Identity, delivery and trade-offs','Least-privilege environment access and separated configuration are architectural requirements. ARM/Bicep is exposure; Terraform remains in progress. The portfolio makes no infrastructure-as-code production claim or managed-service availability guarantee.'),
   section('Validation and implementation status','The template was inspected without provisioning resources. No cloud spend, throughput, uptime or deployed four-environment estate is asserted. Cloud skills are supported by the CV; the wider topology remains a proposal.')
  ]
 },
 'taskboard': {
  status:'SPFx workflow concept · implementation extent unverified',
  summary:'A SharePoint service-request/task-board design for departmental queues, ownership and SLA visibility, in the context of supported Microsoft 365 and SPFx experience.',
  description:'SharePoint/SPFx service-request workflow design with department queues, ownership and escalation; completion status remains explicitly unverified.',
  evidence:'Original portfolio identifies a TaskBoard concept; the CV supports SharePoint Online/SPFx, Microsoft 365, Graph and Power Automate experience. Project-specific source is unavailable.',
  diagramCaption:'Conceptual request-routing model; no specific SharePoint list schema or deployed automation is asserted.',
  sections:[
   section('Business problem and system context','Operational requests need an accountable queue, owner and response expectation across departments. SharePoint offers a collaboration context; an SPFx interface can present department-oriented work. The existing evidence describes this TaskBoard as a concept.'),
   section('My contribution and core design','My documented Microsoft 365/SPFx experience provides the implementation context. The TaskBoard account covers modelling department queues, triage, service-level routing and escalation expectations. It does not establish a completed production service or an exact Microsoft Graph endpoint set.'),
   section('Contracts, identity and failure modes','Request state, queue ownership and SLA interpretation need to agree between the interface and persisted collaboration data. SharePoint permissions and any backend/service identity are separate boundaries. A visible item must not imply permission to route or update another department’s work.','These are design concerns for the concept; no permission enforcement tests, list schema, Power Automate flow or retention policy is invented.'),
   section('Delivery, validation and status','SharePoint service management and SPFx experience are supported by the CV. The TaskBoard implementation/deployment extent remains unverified, with sanitized proposed flow only.')
  ]
 },
 'identity': enterprise(
  'Identity and authorization work across enterprise applications: Entra ID/MSAL sign-in, OAuth/OIDC configuration and role/group-aware backend resource access.',
  [
   section('Problem, context and my contribution','Authentication identifies a user; it does not establish department ownership, PMO authority or permission to change a workflow. My work included Entra application registrations, MSAL integration, OAuth/OIDC, role/group controls and sign-in redirect troubleshooting, supported by the CV.'),
   section('Architecture and security boundary','Workspace is the concrete application context: Angular sign-in feeds an authenticated API boundary, while backend policies and application rules authorize resources. IntegrationGateway vendor OAuth credentials serve external API access and must remain separate from end-user authority.','Group mapping supports application permissions; department membership and business ownership still need application data. Tenant and group identifiers are intentionally omitted.'),
   section('Failure modes and engineering decisions','Redirect URI mismatches can make a valid application fail only after environment promotion. Diagnosis needs to compare the environment’s application URL, registration and configuration. A hidden action in the frontend is not sufficient access control; the API must reject unauthorized resource operations.'),
   section('Validation and implementation status','The CV and implementation account support this work; employer policy code and negative-access results are not available. This case study does not assert a tenant-wide identity architecture, certified security review or complete zero-trust programme.')
  ],
  {description:'Entra ID/MSAL, OAuth/OIDC and backend role/group controls, with department ownership kept distinct from sign-in identity.',diagramCaption:'Logical authentication and authorization flow in the Workspace context; no tenant configuration is exposed.'}
 ),
 'monitoring': enterprise(
  'Infrastructure and operational monitoring with Zabbix, SNMP and Dell iDRAC, supported by Linux/IIS diagnostics and exposure to Grafana and Prometheus.',
  [
   section('Business problem and my contribution','Application symptoms can originate in hosting, network or physical server health. I implemented and extended Zabbix monitoring to hardware signals using SNMP and Dell iDRAC, alongside service monitoring and operational troubleshooting. These responsibilities are explicitly described in the CV.'),
   section('Architecture and implementation','Hardware/service signals feed the monitoring boundary; alert interpretation and logs guide investigation. Physical-server visibility complements HTTP/service availability rather than substituting for application diagnostics. Grafana and Prometheus are exposure and troubleshooting context, not a claim of an independently built observability platform.'),
   section('Failure modes, security and trade-offs','A healthy host does not prove a healthy workflow, and a failed HTTP check does not by itself identify hardware failure. Correlating service errors, IIS/Linux state and hardware signals narrows the failure domain. Monitoring configuration and SNMP credentials must remain private.','IntegrationGateway/Zabbix connectivity is described in the implementation account; exact event contracts, alert rules and automated remediation were not available for inspection.'),
   section('Delivery, validation and outcomes','The CV supports Linux/Windows hosting, SNMP/iDRAC extension and operational diagnostics. No SLO, uptime, incident reduction, telemetry volume or verified mean-time-to-recovery is claimed. Project-specific alert acceptance and current deployment coverage remain unverified.')
  ],
  {name:'Zabbix — Monitoring & Operational Reliability',description:'Zabbix hardware/service visibility through SNMP and Dell iDRAC, with Linux/IIS diagnostics and clearly labelled observability exposure.',stack:['Zabbix','SNMP','Dell iDRAC','Linux','IIS','Grafana / Prometheus exposure'],diagramCaption:'Signal-to-investigation flow; not an automated remediation loop or evidence of a measured SLO.'}
 ),
 'telephony': enterprise(
  '3CX, handset and CRM integration work focused on contact/phonebook data contracts and interoperability troubleshooting.',
  [
   section('Business problem and my contribution','Disconnected communication and customer records make context difficult to retrieve. My integration account covers 3CX, Yealink and Zoho phonebook/CRM workflows, data mapping and configuration troubleshooting. The original portfolio supports this scope; project source is held by the employer.'),
   section('Architecture and integration contracts','The flow links handset/telephony context with an integration boundary and customer records. API/XML contracts require field mapping rather than assuming a handset, PBX and CRM share the same model. The illustration is logical; it does not assert that IntegrationGateway sits in the call-signalling path.'),
   section('Failure modes and trade-offs','Malformed contact data and incompatible integration configuration can fail independently of core calling. Diagnostics should validate the relevant contract and endpoint rather than infer CRM connectivity from a working handset. Private phone numbers, customer records and PBX configuration are excluded.'),
   section('Validation and implementation status','Integration work is described by the contributing engineer. Specific deployed connectors, call events, synchronization direction and acceptance results remain unverified. No call-routing, recording, availability or cost-reduction claim is added.')
  ],
  {description:'3CX/Yealink and CRM phonebook integration work: API/XML mapping, interoperability diagnosis and explicit separation from call signalling.',diagramCaption:'Logical contact/context exchange. Arrows do not represent SIP signalling or prove bidirectional production synchronization.'}
 ),
 'hr-portal': {
  status:'Named experience area · implementation not established',
  summary:'HR Portal is retained as an evidence gap, with no project-specific features, technology stack or completed contribution invented.',
  description:'HR application experience awaiting project-specific scope; personnel workflows and deployed capabilities are not asserted.',
  evidence:'Named in the Phase 4 request; no corresponding repository, source-backed original case study or CV project detail was available.',
  diagramCaption:'Requirements-only boundary illustration, not an implemented HR architecture.',
  sections:[
   section('Problem and system context','HR workflows handle sensitive personnel records. An implementation needs explicit access and process boundaries, but those requirements do not establish that a particular feature was built.'),
   section('Contribution, architecture and evidence limits','The available CV supports internal application development broadly. It does not establish which HR Portal screens, backend, persistence layer or authorization policies I personally implemented. The diagram identifies a review boundary only; no employee data or internal interface is reproduced.'),
   section('Implementation status','Project-specific contribution, stack, deployment and testing remain unverified. Leave/payroll/recruitment integrations and employee self-service are not claimed. This entry is an honest mapping gap rather than an implemented capability endorsement.')
  ]
 },
 'smartolt': {
  status:'Proposed connector · implementation unverified',
  summary:'A possible SmartOLT integration boundary, separated from the supported enterprise integrations until project evidence establishes implementation.',
  description:'Proposed SmartOLT connector boundary; no verified client implementation, operational data exchange or production deployment claimed.',
  evidence:'Named conditionally in the Phase 4 request. No SmartOLT-specific implementation was found in the inspected portfolio, CV or available relevant source.',
  diagramCaption:'Proposed contract boundary only. No network inventory, credentials or production topology is shown.',
  sections:[
   section('Problem and proposed system context','A network platform connector needs a defined external contract and authorization boundary before its data can drive an enterprise workflow. This is an architecture consideration, not evidence of an existing SmartOLT service.'),
   section('Contribution and implementation boundaries','No SmartOLT-specific code, API connectivity validation or personal implementation scope was established. A proposed external client would normalize permitted data at an application boundary; exact endpoints, data fields, polling and write behaviour are intentionally unspecified.'),
   section('Failure modes, validation and status','Credentials, rate limits, source freshness and mutation authority would require validation before delivery. No such validation is claimed. SmartOLT is excluded from the implemented/production IntegrationGateway connector inventory.')
  ]
 },
 'compliance': {
  status:'Concept · proposed architecture',
  summary:'SA Compliance Hub is product research into a self-service South African business-compliance journey, not an accredited service or verified agency integration.',
  description:'Concept for a business-profile and rules-led compliance journey, with provider access and submission authority still unresolved.',
  evidence:'Original portfolio concept and owner-supplied direction; no implemented connector or deployed product evidence.',
  diagramCaption:'Proposed user journey. Provider access and official submission arrangements are unresolved.',
  sections:[
   section('Business problem and my contribution','Business owners face multiple registration and compliance processes. My work is product/architecture exploration: mapping a business profile to relevant requirements and identifying integration, identity and regulatory constraints.'),
   section('Proposed architecture and persistence','A business profile would feed requirement rules, guidance and progress tracking. Official submissions depend on provider agreements and validated identity. No API partnership, rules-engine implementation, database schema or automated filing is claimed.'),
   section('Engineering trade-offs and status','A rules-led interface would need maintained requirements and provenance; stale guidance is a material product failure. This remains a concept. Legal accuracy, provider access, security, tests and release operations are unresolved, with no compliance certification asserted.')
  ]
 },
 'game': {
  status:'Concept · no playable release established',
  summary:'Code Quest explores a Godot/C# learning loop joining coding challenges, immediate feedback and progression.',
  description:'Godot/C# learning-game concept focused on challenge feedback and progression; no shipped runtime or trusted assessment claim.',
  evidence:'Original portfolio and supplied concept direction; no inspected playable build or source-backed implementation.',
  diagramCaption:'Proposed gameplay loop, not an implemented assessment system.',
  sections:[
   section('Problem and my contribution','Coding exercises need feedback that helps learners understand an error and attempt a correction. My contribution is the learning-game direction and exploration of Godot/C# as a possible implementation environment.'),
   section('Proposed implementation and architecture','A challenge, evaluation/feedback and progression loop defines the concept. A future implementation needs to separate game-state changes from trusted assessment evidence. No sandbox, remote code runner, persistent progression schema or backend API is asserted.'),
   section('Trade-offs, validation and status','Game feedback can encourage practice without proving mastery. Runtime safety, curriculum validation, progression persistence and delivery remain design questions. Concept only; no playable build, user outcomes or deployment is claimed.')
  ]
 },
 'lmsfuture': {
  status:'Roadmap · proposed product direction',
  summary:'A longer-term education-platform direction extending the implemented FrankAcademy foundation toward configurable programmes, evidence and administrative reporting.',
  description:'Roadmap for configurable training and traceable assessment evidence, separate from merged FrankAcademy features and accreditation.',
  evidence:'Original portfolio direction, reconciled against FrankAcademy source and release-readiness documentation.',
  diagramCaption:'Proposed product capabilities; implementation evidence belongs to the separate FrankAcademy study.',
  sections:[
   section('Problem and my contribution','Training providers need to understand participation, assessment evidence and curriculum changes. My product direction explores configurable programmes and reporting; the implemented foundation is described separately in FrankAcademy.'),
   section('Architecture and persistence direction','Course revisioning provides a useful basis for traceability, but a programme model, evidence policy and provider administration need their own requirements and contracts. No additional deployed service or compliant reporting engine is inferred from the LMS code.'),
   section('Engineering decisions and implementation status','Do not treat assessment records as accreditation. Local training requirements need research and formal acceptance before product promises. Configurable programmes, compliance-aware reporting and associated integrations remain roadmap work. No QCTO accreditation or compliance certification is claimed.')
  ]
 }
};

export const COMPETENCIES = [
 {title:'Application engineering',items:['C# / ASP.NET Core · Boomerang, Workspace, IntegrationGateway','Angular / TypeScript · enterprise workflow interfaces','Next.js · FrankAcademy and public sites','Python / Django / Flask · CV-backed application and automation experience']},
 {title:'Enterprise integration',items:['REST contracts / DTO normalization · IntegrationGateway','Zoho Desk webhooks / OAuth · Boomerang and Zoho Desk','Acumatica / Microsoft Graph / Microsoft 365 · CV-backed integration work','3CX / XML contracts · implementation account; deployment unverified']},
 {title:'Cloud and infrastructure',items:['Azure CLI / resource groups / networking · CV-backed responsibilities','ARM storage template · inspected lab; wider topology proposed','Windows Server / IIS / Linux / Nginx · hosting and diagnostics','Terraform · in progress']},
 {title:'DevOps and platform engineering',items:['GitLab CI/CD · .NET / Angular and staging workflows','Linux Docker / Windows runners · Delivery Pipelines','PowerShell / migration bundles / publish artifacts · CV-backed delivery','Azure DevOps / OpenAPI drift / PostgreSQL / Chromium gates · FrankAcademy']},
 {title:'Databases and persistence',items:['SQL Server / EF Core · Workspace and Boomerang account','PostgreSQL / EF Core migrations · FrankAcademy source','Immutable course revisions / historical progress · FrankAcademy','MySQL / Redis · CV-listed experience']},
 {title:'Identity and security',items:['Entra ID / MSAL / OAuth 2.0 / OIDC · enterprise applications','Backend role / group / department authorization · Workspace account','Identity / JWT / refresh rotation / ownership · FrankAcademy source','LDAP / MFA / Vault / Sentinel / Wazuh · CV-listed responsibilities or exposure']},
 {title:'Enterprise administration',items:['Zoho Desk departments / status mapping / OAuth scopes · implementation account','Private extension packaging / IIS hosting · embedded authentication unverified','SharePoint Online / SPFx / Microsoft 365 · CV-backed experience','GitLab / Vault / SonarQube administration · CV-backed responsibilities']},
 {title:'Monitoring and operational reliability',items:['Zabbix / SNMP / Dell iDRAC · CV-backed implementation','Linux / IIS / TLS / DNS troubleshooting · operational work','Grafana / Prometheus · exposure and investigation','Webhook correlation / reconciliation safeguards · Boomerang implementation account']}
];

// Small public sites use a shorter engineering structure.
const publicStudies = {
 'maximo-security': {
  summary:'A static multipage security-services website with shared JavaScript behaviour, responsive navigation, service dialogs and a local enquiry-review/download workflow.',
  contribution:'I implemented the public pages and shared UI behaviour in HTML, CSS and vanilla JavaScript. The inspected source uses a services data structure and native dialogs; the enquiry form prepares text for local review and a Blob download rather than submitting to a backend.',
  architecture:'Six HTML pages share CSS, JavaScript and local assets. GitHub Pages serves static files. There is no application database or server-side contact API in the inspected project.',
  challenge:'The engineering boundary is honest enquiry handling: service/property query values are validated against available form options, and local text generation must not be described as successful delivery to the company. Mobile navigation and dialog close/focus behaviour need to remain usable across pages.',
  evidence:'Local Maximo source and AGENTS.md inspected; the original public source link is retained. Source inspection confirms the local enquiry/download flow. Public URL reachability is recorded separately from functional acceptance.',
  status:'Implemented static site · local enquiry preparation; no submission backend',
  diagramCaption:'Static page delivery and local enquiry export. No server-side submission is represented.'
 },
 'fatu': {
  summary:'A Next.js/TypeScript business website with reusable routes and layout, SCSS styling and static export for GitHub Pages.',
  contribution:'I built the public business journeys across story, trading, designs, academy and contact content. Shared components separate repeated navigation/layout from route-specific information.',
  architecture:'Next.js generates a static site for GitHub Pages. The local configuration enables export, sets the Pages base path and uses unoptimized images. Static output is the deployment artifact, not a running Next.js server.',
  challenge:'A repository subpath affects asset and navigation URLs; export-compatible routes and image configuration must agree with hosting. The academy area is business-direction content and must not be confused with the implemented FrankAcademy LMS.',
  evidence:'Existing portfolio, local fatu-ed package/configuration and public source destination. Static hosting configuration inspected; current remote functional behaviour was not acceptance-tested.',
  status:'Implemented static-export website · public destination retained',
  diagramCaption:'Build-time Next.js export and static hosting; no runtime application API is asserted.'
 },
 'ubuntu-quest': {
  summary:'A public consultancy website, formerly Northbound, using Next.js App Router, React, TypeScript and native CSS with a GitHub Pages export workflow.',
  contribution:'I translated the approved design into reusable routes and typed service/team content for services, approach, insights and contact journeys. This is one renamed project rather than two independent deliveries.',
  architecture:'The frontend produces a static export. The existing project record documents GitHub Actions type checks, build and Pages delivery. A static site does not imply a backend enquiry service.',
  challenge:'The implementation balances a cinematic visual direction with reusable content, responsive reading order and export-compatible navigation. An unset enquiry address remains a configuration limitation rather than evidence of delivered messages.',
  evidence:'Original source-reviewed portfolio record plus locally available consultancy source. No customer analytics, conversion metric or contact-delivery result is claimed.',
  status:'Implemented public frontend · contact destination configuration limited',
  diagramCaption:'Typed route content to static export. Contact is a frontend boundary, not a verified delivery service.'
 },
 'nomanova': {
  summary:'A template-based Bootstrap training website customized with course/service sections, brochures, responsive navigation and business contact information.',
  contribution:'My work was frontend customization and website implementation. The existing source-reviewed record identifies template-origin metadata; it is not presented as an original framework or a from-scratch visual system.',
  architecture:'HTML, CSS, JavaScript and Bootstrap form a static frontend served at an owner-provided Vercel address. No database, learner account system or course-delivery API is established for this website.',
  challenge:'The training offer needs navigable content and clear brochure/contact journeys across viewport sizes. Training marketing content must remain separate from claims of learning-state persistence, accreditation or payment processing.',
  evidence:'Existing portfolio/GitHub inventory records the source review and owner-provided deployment. No new repository inspection or remote functional acceptance is asserted for Nomanova.',
  status:'Implemented website customization · owner-provided public destination',
  diagramCaption:'Static training content and brochure/contact journeys; this is not an LMS architecture.'
 }
};
for (const [id, p] of Object.entries(publicStudies)) {
 TECHNICAL_CASES[id] = {
  ...p,
  sections:[
   section('Business problem and system context',p.summary),
   section('My engineering contribution',p.contribution),
   section('Architecture and core implementation',p.architecture),
   section('Engineering challenges and trade-offs',p.challenge),
   section('Delivery, validation and implementation status',p.evidence,p.status)
  ]
 };
}
