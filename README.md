# AI Agent Evaluator

A multi-agent AI evaluation application that compares responses from different LLM models with **SAMD (Software as Medical Device) compliance enforcement**.

## Features

- **Agent 1**: Generates responses using GPT-5.1-Codex and SWE 1.5 Fast models
- **Agent 2**: Evaluates and compares responses using Claude Sonnet 4.5
- Modern, responsive UI built with React and TailwindCSS
- Real-time evaluation results
- **🏥 SAMD Compliance**: Automated regulatory compliance checks via GitHub Actions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your API keys to the `.env` file:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ANTHROPIC_API_KEY`: Your Anthropic API key

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Architecture

- **Frontend**: Single-page application with React
- **Backend**: Express.js server orchestrating two AI agents
- **Agent 1**: Parallel response generation from multiple models
- **Agent 2**: Comparative evaluation using Claude Sonnet 4.5

## API Endpoints

- `GET /`: Serves the frontend application
- `POST /api/evaluate`: Accepts user input and returns evaluation results

## 🏥 SAMD Compliance

This project implements automated SAMD compliance enforcement following:
- **IEC 62304**: Medical device software lifecycle (Class B)
- **ISO 13485**: Quality management systems
- **ISO 14971**: Risk management
- **FDA Guidance**: Cybersecurity, SBOM requirements

### Compliance Features

✅ **Automated Risk Management** (ISO 14971)
- Continuous risk analysis and mitigation verification
- Risk reports generated on every commit

✅ **Requirements Traceability** (IEC 62304)
- Full traceability from requirements → design → implementation → testing
- Automated traceability matrix generation

✅ **SBOM Generation** (FDA Requirement)
- Software Bill of Materials in CycloneDX format
- Dependency tracking and vulnerability scanning

✅ **Security Scanning**
- Automated vulnerability detection (Trivy, npm audit)
- Critical/High vulnerability blocking

✅ **Documentation Validation**
- Automated checks for required documentation
- Completeness assessment

✅ **Compliance Dashboard**
- Real-time compliance scoring
- Visual HTML dashboard with metrics

### Running Compliance Checks Locally

```bash
# Run all compliance checks
python scripts/risk_analyzer.py
python scripts/verify_risk_mitigations.py
python scripts/verify_traceability.py
python scripts/validate_documentation.py
python scripts/generate_traceability_matrix.py
python scripts/generate_compliance_dashboard.py

# Check compliance gate
python scripts/compliance_gate.py --min-score 85
```

### GitHub Actions Workflows

Two automated workflows enforce compliance:

1. **Full SAMD Compliance** (`.github/workflows/samd-compliance.yml`)
   - Runs on: PR, push to main, weekly schedule
   - Includes: Classification, SBOM, vulnerabilities, risk, traceability, documentation
   - Generates: Comprehensive compliance dashboard

2. **Quick Compliance Check** (`.github/workflows/quick-compliance-check.yml`)
   - Runs on: Every PR and push
   - Fast validation of core compliance requirements
   - Comments results on PRs

### Compliance Reports

All compliance reports are stored in `compliance-reports/` directory:
- `software-classification.json` - IEC 62304 classification
- `risk-analysis.json` - ISO 14971 risk management
- `risk-mitigation-verification.json` - Risk mitigation status
- `traceability-verification.json` - Requirements traceability
- `traceability-matrix.html` - Visual traceability matrix
- `documentation-validation.json` - Documentation completeness
- `compliance-dashboard.json` - Overall compliance metrics
- `compliance-dashboard.html` - Visual compliance dashboard

### Compliance Standards Met

| Standard | Description | Status |
|----------|-------------|--------|
| IEC 62304 | Medical device software lifecycle | ✅ Class B |
| ISO 13485 | Quality management systems | ✅ Compliant |
| ISO 14971 | Risk management | ✅ Implemented |
| FDA Cybersecurity | Premarket cybersecurity guidance | ✅ SBOM + Scanning |
| 21 CFR Part 820 | Quality System Regulation | ✅ Design Controls |
