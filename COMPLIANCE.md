# SAMD Compliance Documentation

## Overview

This document describes the SAMD (Software as a Medical Device) compliance implementation for the AI Agent Evaluator project using automated GitHub Actions workflows.

## Regulatory Framework

### Applicable Standards

- **IEC 62304**: Medical device software - Software life cycle processes
- **ISO 13485**: Medical devices - Quality management systems
- **ISO 14971**: Medical devices - Application of risk management
- **FDA Guidance**: Premarket Cybersecurity Guidance for Medical Devices
- **21 CFR Part 820**: Quality System Regulation (QSR)

## Software Classification

**Classification**: IEC 62304 Class B (Medium Risk)

**Rationale**: The AI Agent Evaluator provides decision support for AI model evaluation and comparison. While it does not directly diagnose or treat patients, it falls under software that could influence medical decision-making processes.

**Risk Level**: Medium

## Compliance Architecture

### 1. Automated Risk Management (ISO 14971)

**Implementation**: `scripts/risk_analyzer.py`

The system automatically identifies, analyzes, and tracks risks:

- **Risk Identification**: Automated scanning of code for potential risk areas
- **Risk Analysis**: Severity, probability, and detectability assessment
- **Risk Mitigation**: Verification that mitigations are implemented
- **Residual Risk**: Tracking of remaining risks after mitigation

**Key Risks Identified**:
1. AI Model Performance (RISK-001)
2. Data Security / API Key Exposure (RISK-002)
3. System Availability (RISK-003)
4. User Input Validation (RISK-004)
5. Third-Party Dependencies (RISK-005)

### 2. Requirements Traceability (IEC 62304)

**Implementation**: `scripts/verify_traceability.py`, `scripts/generate_traceability_matrix.py`

Full bidirectional traceability maintained:

```
Requirements → Design → Implementation → Verification
```

**10 Core Requirements** traced through:
- Design documents
- Implementation files
- Verification methods

**Traceability Matrix**: Generated in both JSON and HTML formats for audit purposes.

### 3. Software Bill of Materials (SBOM)

**Implementation**: GitHub Actions workflow using CycloneDX

**FDA Requirement**: Per FDA's 2023 cybersecurity guidance, all medical device software must include an SBOM.

**Format**: CycloneDX JSON (industry standard)

**Contents**:
- All npm dependencies
- Version information
- License information
- Known vulnerabilities

### 4. Vulnerability Management

**Implementation**: Trivy scanner + npm audit

**Process**:
1. Automated scanning on every commit
2. Critical/High vulnerabilities block deployment
3. Medium/Low vulnerabilities tracked and reported
4. Vulnerability reports retained for 7 years (regulatory requirement)

**Thresholds**:
- Critical vulnerabilities: **BLOCK** (exit code 1)
- High vulnerabilities: **WARN** (manual review required)
- Medium/Low: **TRACK** (remediation plan required)

### 5. Documentation Validation

**Implementation**: `scripts/validate_documentation.py`

**Required Documentation**:
- Software Requirements Specification (SRS)
- Software Design Document (SDD)
- Risk Management File
- Verification and Validation Plan
- Traceability Matrix
- SBOM
- User Documentation

**Validation Process**:
- Presence check
- Completeness assessment
- Version control verification

### 6. Compliance Dashboard

**Implementation**: `scripts/generate_compliance_dashboard.py`

**Metrics Tracked**:
- Overall compliance score (0-100%)
- Risk management status
- Traceability percentage
- Documentation completeness
- Security vulnerability count
- SBOM generation status

**Compliance Levels**:
- 90-100%: EXCELLENT
- 80-89%: GOOD
- 70-79%: ACCEPTABLE
- 60-69%: NEEDS IMPROVEMENT
- <60%: NON-COMPLIANT

### 7. Compliance Gate

**Implementation**: `scripts/compliance_gate.py`

**Purpose**: Enforce minimum compliance before deployment

**Default Threshold**: 85%

**Gate Checks**:
- Overall compliance score
- Critical vulnerability count
- Risk mitigation status
- Documentation completeness
- Traceability coverage

**Action**: Blocks merge/deployment if gate fails

## GitHub Actions Workflows

### Workflow 1: Full SAMD Compliance

**File**: `.github/workflows/samd-compliance.yml`

**Triggers**:
- Pull requests to main/develop
- Push to main
- Weekly schedule (Monday 2 AM)
- Manual dispatch

**Jobs**:
1. Software Classification (IEC 62304)
2. SBOM Generation (FDA requirement)
3. Vulnerability Scanning (Security)
4. Code Quality Analysis (Standards)
5. Risk Management (ISO 14971)
6. Traceability Validation (IEC 62304)
7. Documentation Audit (ISO 13485)
8. Compliance Report Generation

**Artifacts Retention**: 2555 days (7 years - regulatory requirement)

### Workflow 2: Quick Compliance Check

**File**: `.github/workflows/quick-compliance-check.yml`

**Triggers**:
- Every pull request
- Every push

**Purpose**: Fast validation for rapid feedback

**Jobs**:
- Risk analysis
- Risk mitigation verification
- Documentation validation
- Traceability verification
- Compliance gate check

**PR Comments**: Automatically posts compliance summary on PRs

## Compliance Reports

### Generated Reports

All reports stored in `compliance-reports/` directory:

1. **software-classification.json**
   - IEC 62304 classification
   - Safety class determination
   - Applicable requirements

2. **risk-analysis.json**
   - ISO 14971 risk assessment
   - Risk priority numbers
   - Mitigation strategies
   - Residual risk levels

3. **risk-mitigation-verification.json**
   - Verification of implemented mitigations
   - Code-level validation
   - Mitigation effectiveness

4. **traceability-verification.json**
   - Requirements traceability status
   - Traced vs. untraced requirements
   - Traceability percentage

5. **traceability-matrix.html**
   - Visual traceability matrix
   - Requirements → Design → Implementation → Verification
   - Audit-ready format

6. **documentation-validation.json**
   - Documentation presence check
   - Completeness assessment
   - Last modified timestamps

7. **compliance-dashboard.json**
   - Overall compliance metrics
   - Section-by-section scores
   - Compliance level determination

8. **compliance-dashboard.html**
   - Visual compliance dashboard
   - Real-time metrics
   - Color-coded status indicators

### Report Retention

**Regulatory Requirement**: 7 years minimum

**Implementation**: GitHub Actions artifacts retained for 2555 days (7 years)

## Audit Trail

### Version Control

All changes tracked via Git:
- Commit messages
- Author information
- Timestamps
- Code diffs

### Change Control

Automated change control via GitHub:
- Pull request reviews
- Compliance checks before merge
- Automated documentation updates
- Traceability updates

### Audit Logs

Compliance workflow logs provide:
- Who triggered the workflow
- When it was triggered
- What was checked
- Results of each check
- Pass/fail status

## Quality Management System (QMS) Integration

### Design Controls

Following 21 CFR Part 820:
- Design Planning: Documented in README and workflows
- Design Input: Requirements in traceability system
- Design Output: Implementation files
- Design Review: PR review process
- Design Verification: Automated testing
- Design Validation: Compliance checks
- Design Transfer: Deployment workflows
- Design Changes: Git version control

### CAPA (Corrective and Preventive Action)

Automated CAPA triggers:
- Failed compliance checks → Corrective action required
- Vulnerability detection → Preventive action required
- Risk identification → Mitigation action required

## Post-Market Surveillance

### Continuous Monitoring

- Weekly compliance audits (scheduled workflow)
- Continuous vulnerability scanning
- Dependency update monitoring
- Risk reassessment on changes

### Incident Response

Process for handling compliance failures:
1. Automated detection via workflow
2. Notification to development team
3. Root cause analysis
4. Corrective action implementation
5. Verification of effectiveness
6. Documentation update

## Regulatory Submission Support

### Documentation Package

The compliance system generates all required documentation for regulatory submissions:

- Software Requirements Specification
- Software Design Document
- Risk Management File (ISO 14971)
- Verification and Validation Report
- Traceability Matrix
- SBOM (FDA requirement)
- Cybersecurity Documentation
- Quality Management System Records

### Audit Readiness

System is continuously audit-ready:
- All documentation current
- Full traceability maintained
- Risk management up-to-date
- Change control documented
- Test records available

## Maintenance and Updates

### Workflow Updates

Compliance workflows should be reviewed:
- Quarterly: Review risk analysis
- Annually: Update standards compliance
- As needed: Regulatory changes

### Script Maintenance

Python scripts located in `scripts/`:
- Regularly updated for new requirements
- Version controlled
- Documented with inline comments

### Standards Updates

Monitor for updates to:
- IEC 62304 (current: 2015 + AMD1:2015)
- ISO 13485 (current: 2016)
- ISO 14971 (current: 2019)
- FDA Guidance documents

## Running Compliance Checks

### Local Execution

```bash
# Full compliance check
python scripts/risk_analyzer.py
python scripts/verify_risk_mitigations.py
python scripts/verify_traceability.py
python scripts/validate_documentation.py
python scripts/generate_traceability_matrix.py
python scripts/generate_compliance_dashboard.py
python scripts/compliance_gate.py --min-score 85
```

### CI/CD Execution

Automatically runs on:
- Every pull request
- Every push to main
- Weekly schedule
- Manual trigger

### Viewing Results

1. **GitHub Actions**: View workflow runs in Actions tab
2. **Artifacts**: Download compliance reports from workflow artifacts
3. **Dashboard**: Open `compliance-reports/compliance-dashboard.html`
4. **Traceability**: Open `compliance-reports/traceability-matrix.html`

## Compliance Checklist

Before each release, verify:

- [ ] All compliance workflows pass
- [ ] Overall compliance score ≥ 85%
- [ ] No critical vulnerabilities
- [ ] All requirements traced
- [ ] Risk management file updated
- [ ] SBOM generated
- [ ] Documentation complete
- [ ] Change control records updated
- [ ] Traceability matrix current
- [ ] Compliance dashboard reviewed

## Contact and Support

For compliance-related questions:
- Review this documentation
- Check workflow logs in GitHub Actions
- Review generated compliance reports
- Consult regulatory affairs team for interpretation

## Version History

- **v1.0** (2026-03-09): Initial SAMD compliance implementation
  - IEC 62304 Class B classification
  - Automated risk management
  - Requirements traceability
  - SBOM generation
  - Vulnerability scanning
  - Compliance dashboard
  - GitHub Actions workflows
