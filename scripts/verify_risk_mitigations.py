#!/usr/bin/env python3
"""
Risk Mitigation Verification Script
Verifies that identified risks have appropriate mitigations in code
"""

import json
import os
from pathlib import Path

class RiskMitigationVerifier:
    def __init__(self):
        self.compliance_dir = Path("compliance-reports")
        self.src_dir = Path(".")
        
    def verify_mitigations(self):
        """Verify risk mitigations are implemented"""
        print("=== Risk Mitigation Verification ===")
        
        risk_file = self.compliance_dir / "risk-analysis.json"
        if not risk_file.exists():
            print("⚠ Risk analysis file not found. Run risk_analyzer.py first.")
            return
        
        with open(risk_file, 'r') as f:
            risk_data = json.load(f)
        
        verification_results = []
        
        for risk in risk_data.get('risks', []):
            result = self.verify_risk(risk)
            verification_results.append(result)
            
            status_icon = "✓" if result['verified'] else "✗"
            print(f"{status_icon} {risk['id']}: {risk['description']}")
        
        report = {
            "verificationDate": risk_data['reportDate'],
            "totalRisks": len(verification_results),
            "verified": len([r for r in verification_results if r['verified']]),
            "results": verification_results
        }
        
        output_file = self.compliance_dir / "risk-mitigation-verification.json"
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n✓ Verification complete: {output_file}")
        return report
    
    def verify_risk(self, risk):
        """Verify individual risk mitigation"""
        risk_id = risk['id']
        
        verification_map = {
            "RISK-001": self.verify_ai_validation(),
            "RISK-002": self.verify_api_key_security(),
            "RISK-003": self.verify_error_handling(),
            "RISK-004": self.verify_input_validation(),
            "RISK-005": self.verify_dependency_management()
        }
        
        verified = verification_map.get(risk_id, False)
        
        return {
            "riskId": risk_id,
            "description": risk['description'],
            "verified": verified,
            "mitigationStatus": risk['status']
        }
    
    def verify_ai_validation(self):
        """Verify AI validation checks exist"""
        agent_files = [
            "agents/agent1.js",
            "agents/agent2.js"
        ]
        
        for file in agent_files:
            if Path(file).exists():
                with open(file, 'r') as f:
                    content = f.read()
                    if 'error' in content.lower() and 'catch' in content.lower():
                        return True
        return False
    
    def verify_api_key_security(self):
        """Verify API keys are properly secured"""
        env_example = Path(".env.example").exists()
        gitignore = Path(".gitignore").exists()
        
        if gitignore:
            with open(".gitignore", 'r') as f:
                gitignore_content = f.read()
                if '.env' in gitignore_content:
                    return True
        
        return False
    
    def verify_error_handling(self):
        """Verify error handling implementation"""
        server_file = Path("server.js")
        if server_file.exists():
            with open(server_file, 'r') as f:
                content = f.read()
                has_try_catch = 'try' in content and 'catch' in content
                has_error_response = 'error' in content.lower()
                return has_try_catch and has_error_response
        return False
    
    def verify_input_validation(self):
        """Verify input validation exists"""
        server_file = Path("server.js")
        if server_file.exists():
            with open(server_file, 'r') as f:
                content = f.read()
                if 'userInput' in content and ('trim' in content or 'validation' in content.lower()):
                    return True
        return False
    
    def verify_dependency_management(self):
        """Verify dependency management"""
        package_json = Path("package.json").exists()
        package_lock = Path("package-lock.json").exists()
        return package_json

if __name__ == "__main__":
    verifier = RiskMitigationVerifier()
    verifier.verify_mitigations()
