#!/usr/bin/env python3
"""
Compliance Gate Check
Enforces minimum compliance score before allowing deployment
"""

import json
import sys
import argparse
from pathlib import Path

class ComplianceGate:
    def __init__(self, min_score=85):
        self.min_score = min_score
        self.compliance_dir = Path("compliance-reports")
        
    def check_gate(self):
        """Check if compliance gate passes"""
        print("=== Compliance Gate Check ===")
        print(f"Minimum required score: {self.min_score}%")
        
        dashboard_file = self.compliance_dir / "compliance-dashboard.json"
        
        if not dashboard_file.exists():
            print("❌ GATE FAILED: Compliance dashboard not found")
            print("Run generate_compliance_dashboard.py first")
            return False
        
        with open(dashboard_file, 'r') as f:
            dashboard = json.load(f)
        
        overall_score = dashboard.get("overallCompliance", 0)
        compliance_level = dashboard.get("complianceLevel", "UNKNOWN")
        
        print(f"\nOverall Compliance Score: {overall_score}%")
        print(f"Compliance Level: {compliance_level}")
        
        gate_passed = overall_score >= self.min_score
        
        if gate_passed:
            print(f"\n✅ GATE PASSED: Compliance score ({overall_score}%) meets minimum requirement ({self.min_score}%)")
            self.print_summary(dashboard)
            return True
        else:
            print(f"\n❌ GATE FAILED: Compliance score ({overall_score}%) below minimum requirement ({self.min_score}%)")
            self.print_gaps(dashboard)
            return False
    
    def print_summary(self, dashboard):
        """Print compliance summary"""
        print("\n=== Compliance Summary ===")
        sections = dashboard.get("sections", {})
        
        if "riskManagement" in sections:
            rm = sections["riskManagement"]
            print(f"✓ Risk Management: {rm.get('overallRiskLevel', 'N/A')}")
        
        if "traceability" in sections:
            tr = sections["traceability"]
            print(f"✓ Traceability: {tr.get('traceabilityPercentage', 'N/A')}%")
        
        if "documentation" in sections:
            doc = sections["documentation"]
            print(f"✓ Documentation: {doc.get('completeness', 'N/A')}%")
        
        if "vulnerabilities" in sections:
            vuln = sections["vulnerabilities"]
            critical = vuln.get('critical', 0)
            high = vuln.get('high', 0)
            print(f"✓ Security: {critical} critical, {high} high vulnerabilities")
    
    def print_gaps(self, dashboard):
        """Print compliance gaps"""
        print("\n=== Compliance Gaps ===")
        sections = dashboard.get("sections", {})
        
        gaps = []
        
        for section_name, section_data in sections.items():
            if isinstance(section_data, dict) and "score" in section_data:
                score = section_data["score"]
                if score < self.min_score:
                    gaps.append(f"- {section_name}: {score}% (needs improvement)")
        
        if gaps:
            for gap in gaps:
                print(gap)
        else:
            print("No specific gaps identified, but overall score is below threshold")
        
        print("\nRecommendations:")
        print("1. Review and address identified gaps")
        print("2. Ensure all documentation is complete")
        print("3. Verify all requirements are traced")
        print("4. Address any security vulnerabilities")
        print("5. Update risk management file if needed")

def main():
    parser = argparse.ArgumentParser(description='SAMD Compliance Gate Check')
    parser.add_argument('--min-score', type=int, default=85,
                       help='Minimum compliance score required (default: 85)')
    
    args = parser.parse_args()
    
    gate = ComplianceGate(min_score=args.min_score)
    passed = gate.check_gate()
    
    sys.exit(0 if passed else 1)

if __name__ == "__main__":
    main()
