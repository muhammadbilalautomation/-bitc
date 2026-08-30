# KGOSI / JARVIS
## Client Requirements for Company-System Integration

### 1. Purpose

KGOSI/JARVIS is a separate enterprise intelligence assistant for the organisation’s leadership and authorised staff. It will connect to the company’s existing systems, understand approved business information, answer questions through voice or text, prepare reports and actions, and perform authorised tasks under the company’s rules.

KGOSI/JARVIS will not replace the company’s Accounting, ERP, CRM, Procurement, HR, Project Management, Banking, Email, Document, or other systems. Those systems will remain the official owners of the company’s records. KGOSI/JARVIS will work as an intelligent layer above them.

This document explains what the client needs to provide before KGOSI/JARVIS can be connected to the company’s systems and prepared for a live environment. Prices are not included.

> **Safety principle:** KGOSI/JARVIS should begin with read-only access. Sensitive actions must be shown to an authorised person and completed only after approval.

---

## 2. Information the Client Must Provide

The client should provide a list of all systems used by the organisation and identify which system should be connected first. For every system, the client should provide its name, supplier, version, purpose, hosting location, main users, data owner, technical contact, and available connection options.

The client should also explain the main problems KGOSI/JARVIS must solve. Examples include understanding financial performance, checking budgets, monitoring state-owned enterprise performance, following procurement activity, reviewing projects, supporting investor services, preparing executive reports, tracking meetings and resolutions, identifying legislative gaps, managing fixed assets, monitoring manifesto commitments, and reviewing public-service workforce information.

The client should provide ten to twenty realistic questions that an executive may ask. These questions will help confirm the information KGOSI/JARVIS must find and the way it should present the answer.

| Client information | What is needed |
|---|---|
| First system | Name of the first system or website to connect. |
| Business purpose | Why this system is important and what KGOSI/JARVIS should do with it. |
| Users | Roles of executives, managers, analysts, and other authorised users. |
| Data owner | Person responsible for approving access to the information. |
| Technical contact | Person who understands the system and can support the connection. |
| Example questions | Real questions the organisation wants KGOSI/JARVIS to answer. |
| First tasks | Reports, searches, alerts, drafts, or actions required in the first stage. |
| Business definitions | Meaning of important terms, codes, statuses, financial fields, and internal abbreviations. |

---

## 3. Existing Company Systems That May Be Connected

The client should confirm which of the following systems exist and which ones are in scope.

| Company area | Information KGOSI/JARVIS may need |
|---|---|
| Accounting and Finance | General ledger, invoices, expenses, payables, receivables, budgets, cash flow, profitability, and financial reports. |
| ERP | Company records, suppliers, inventory, transactions, purchasing, operations, and enterprise activities. |
| CRM | Customers, contacts, leads, opportunities, complaints, sales activity, and communication history. |
| Procurement | Tenders, requests for quotation, suppliers, bids, purchase orders, approvals, delivery status, and auctions. |
| Projects | Projects, contracts, budgets, tasks, milestones, risks, deadlines, resources, and costs. |
| Human Resources | Employees, recruitment, deployment, performance, vacancies, leave, skills, and workforce shortages. |
| Email and Documents | Approved mailboxes, shared drives, contracts, policies, reports, forms, minutes, and correspondence. |
| Banking | Approved account balances and transaction information. Transfers must remain separately controlled and human-approved. |
| Fixed Assets | Acquisition, maintenance, location, transfers, condition, disposal, and ownership records. |
| Meetings and Resolutions | Calendar entries, meeting documents, minutes, decisions, resolutions, action owners, and deadlines. |
| Investor Services | Investor enquiries, applications, communication, opportunities, orientation information, and follow-up. |
| Public Websites | Approved pages, announcements, tenders, regulatory information, and public service information. |

The client does not need to connect every system at the beginning. A staged approach is safer and easier to test.

---

## 4. Connection Methods

The final method depends on the software used by the client. The preferred option is an official and documented connection provided by the software supplier.

### 4.1 Official API

An API allows KGOSI/JARVIS to request approved information or submit approved actions through the existing system. The client should provide the API guide, test address, available fields, permitted actions, user roles, limits, and a test account.

### 4.2 Read-Only Database or Reporting Database

If there is no suitable API, KGOSI/JARVIS may connect to a reporting database or a separate read-only database account. It should not have unrestricted permission to change or delete live records. The client should provide the database type, approved connection route, selected tables or reports, field explanations, refresh schedule, and read-only account.

### 4.3 Webhooks and Event Notifications

A webhook can notify KGOSI/JARVIS when something important happens, such as a new invoice, overdue project, tender submission, customer complaint, or pending approval. The client should provide the available events, information included, security method, and retry rules.

### 4.4 Secure File Exchange

Some systems can export CSV, Excel, PDF, XML, or JSON files. These files can be placed in an approved secure folder or transferred through a secure file-transfer service. The client should define the file format, schedule, owner, naming rules, and confirmation process.

### 4.5 Email, Drive, and Document Connection

KGOSI/JARVIS may connect to approved Gmail, Microsoft 365, Google Drive, SharePoint, or document-management folders. Initial access should normally be limited to reading and searching selected folders or mailboxes. Sending, deleting, or filing documents should require separate permission.

### 4.6 Secure Internal Connector

If the company’s systems are inside a private network, a small approved connector may be installed inside that network. It can communicate with KGOSI/JARVIS through an encrypted connection without exposing the internal database directly to the public internet.

### 4.7 Screen Automation as a Last Option

If an old system has no API, database access, export, or connector, limited screen automation may be considered after a security review. It is less reliable and should not be used for high-risk financial, legal, destructive, or irreversible actions. KGOSI/JARVIS is not intended to control the whole computer like a human user.

---

## 5. Access and Technical Details Required for Each System

For every system selected for integration, the client should provide the following:

| Required item | Client should provide |
|---|---|
| System details | Name, supplier, version, purpose, and hosting location. |
| Documentation | API guide, database guide, export guide, or supplier integration information. |
| Test access | Sandbox, demo account, reporting copy, or non-sensitive test data. |
| Service account | A separate KGOSI/JARVIS account with limited permissions. |
| Permission scope | Exact data, folders, departments, fields, and actions allowed. |
| Network requirements | VPN, firewall rule, IP allow-list, private route, or internal connector requirements. |
| Data definitions | Explanation of fields, codes, currencies, dates, statuses, and business terms. |
| Limits | Request limits, available hours, maintenance windows, and service restrictions. |
| Support contacts | Technical contact, data owner, security contact, and emergency contact. |

The client should not send ordinary passwords through chat. Access should be created through a secure process, limited to the required purpose, and capable of being revoked.

---

## 6. External APIs and Services Outside the Company Systems

KGOSI/JARVIS may need additional services for language understanding, voice, research, notifications, documents, and monitoring. These services are separate from the client’s existing systems and should be approved before production use.

| Requirement | Possible external service |
|---|---|
| Language understanding and analysis | Google Gemini, OpenAI, Azure AI, or another approved language-model service. |
| Speech recognition | An approved speech-to-text service for converting voice commands into text. |
| Spoken responses | ElevenLabs or another approved text-to-speech service. |
| Speaking avatar | LiveAvatar or another approved avatar service, only if required by the client. |
| Public research | SerpApi or another approved search service with source links. |
| Email and calendar | Google Workspace or Microsoft 365 services. |
| Alerts and approvals | Email, Microsoft Teams, Slack, SMS, or another approved notification service. |
| Business messaging | WhatsApp Business, Twilio, or another approved messaging service if required. |
| Document processing | Secure file storage, document extraction, text recognition, and document search. |
| Identity and sign-in | Single sign-on, multi-factor authentication, company directory, or another approved identity service. |
| Monitoring and backups | Uptime monitoring, error alerts, security logs, backups, and recovery services. |

The client does not need to provide every external service at the start. The first integration can use one approved language service, one voice service if voice is required, one selected website or internal system, and one safe approval example.

---

## 7. Human Approval and Action Permissions

The client must provide a written approval plan. It should explain which tasks KGOSI/JARVIS may complete automatically, which tasks it may only prepare, and which tasks always require human approval.

Low-risk tasks may include preparing a report, summarising a document, identifying a delayed project, drafting an email, or preparing a meeting brief. Sensitive tasks may include sending external communication, changing financial records, approving a purchase, changing supplier information, transferring funds, deleting records, or making a legal commitment.

For each sensitive action, the client should identify the approver, financial or operational limit, second-approval requirement, emergency process, and information that must be recorded. KGOSI/JARVIS should display the planned action before execution and record the final result.

---

## 8. Security and Privacy Requirements

The client should provide its security and privacy rules before production access is enabled. This includes data classification, retention, backup, recovery, privacy, regulatory requirements, incident reporting, and restrictions on storing information outside the company’s approved environment.

The client should confirm whether KGOSI/JARVIS must use single sign-on, multi-factor authentication, department-level access, session time limits, approval by role, restricted downloads, or additional security checks.

Credentials and API keys must be stored securely and must not be placed in application code. Access should be limited to the smallest amount of information and the fewest actions required for each feature. An audit record should show who gave the instruction, what information was used, what KGOSI/JARVIS recommended, who approved it, what was executed, and whether it succeeded.

---

## 9. Live Deployment Requirements

For a live version, the client must choose whether KGOSI/JARVIS will run in an approved managed cloud environment, the client’s cloud account, or the client’s own infrastructure. The selected environment should support continuous availability, secure access, backups, monitoring, automatic recovery, controlled updates, and log storage.

The client should provide or approve the production web address, sign-in method, network routes, firewall rules, support contacts, backup expectations, recovery process, and incident-reporting procedure.

Before launch, each connection should be tested for correct data, correct permissions, approval stopping points, service failures, duplicate actions, and audit records. A staged launch is recommended: read-only access, reports, recommendations, prepared actions, approval-based execution, and only then limited automation for explicitly approved low-risk tasks.

If an internal company system is offline, KGOSI/JARVIS should clearly show the last available information and wait for the connection to return. Turning on a powered-off office computer is a separate hardware and network project, not a core integration requirement.

---

## 10. First Information the Client Should Send

To begin the integration discovery, the client should send the first system or website to connect, its supplier and version, the technical contact, the data owner, the preferred connection method, the first three features to demonstrate, example executive questions, approval rules, and a sandbox account or approved test data.

The client should also identify which external services are acceptable for language understanding, voice, email, calendar, notifications, identity, document processing, and monitoring. The final API list will be confirmed after the actual client software and its available integration methods have been reviewed.

### Client Confirmation

| Item | Client response |
|---|---|
| First system or website | ______________________________ |
| System supplier and version | ______________________________ |
| Preferred connection method | API / read-only database / webhook / file exchange / internal connector / other |
| Technical contact | ______________________________ |
| Data owner | ______________________________ |
| First authorised users | ______________________________ |
| First three features | ______________________________ |
| Actions that always require approval | ______________________________ |
| Preferred security method | ______________________________ |
| Preferred deployment environment | ______________________________ |
| Approved external services | ______________________________ |
| Date for test access | ______________________________ |

**Document status:** Client discovery and integration requirements for KGOSI/JARVIS. Final access details will be completed after the client confirms its actual systems and selects the first integration.


## 11. Additional Interface and Reporting Scope Confirmed by Client

After login, KGOSI/JARVIS should provide a role-based left navigation menu for the organisation’s business-intelligence areas. The requested areas are: Briefing Reports; Minutes and Meetings; E-Procurement; Finance; Accounting; Projects; Budgets; Inventory; Assets; Payments; Human Capital; Operations; Property; Vehicles; Plant and Machinery; Loans and Equity; Cash Flows; Marketing; Sales; Contracts; Compliance; and Documents.

Reports should be filterable by Group, Department, Year, and Unit. The first briefing area is expected to include the voice agent with avatar, business intelligence, minutes and meetings, personal calendar, personal to-do list, alerts, approvals, Head of Department reports, media feed, pipeline, mails and notices, registry, requests, actions, decisions, and projects with optional GIS.

The client supplied business-intelligence dashboard examples as visual and functional references. KGOSI/JARVIS should use the same general idea of executive dashboards, charts, summary figures, tables, filters, trend views, customer or stakeholder analysis, financial performance, project status, and document or workflow tracking, without copying unrelated branding or using unverified sample figures as real company data.

GIS location pins are optional. If reliable project or tender coordinates are available and the connection is practical, they may be included in Tender Management and Project Management. Otherwise, GIS should remain a later phase rather than delaying the core demo.

The interface must not depend on a tab bar. The current active priority is the conversation and command experience: an authorised user asks KGOSI/JARVIS a question or gives a command, the system investigates approved information, explains the result, recommends options, prepares a report or action, requests approval where required, and returns the verified outcome.
