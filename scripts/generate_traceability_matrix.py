#!/usr/bin/env python3
"""
Generate Requirements Traceability Matrix
Creates visual traceability matrix for documentation
"""

import json
from pathlib import Path
from datetime import datetime

class TraceabilityMatrixGenerator:
    def __init__(self):
        self.compliance_dir = Path("compliance-reports")
        self.compliance_dir.mkdir(exist_ok=True)
        
    def generate_matrix(self):
        """Generate traceability matrix"""
        print("=== Generating Traceability Matrix ===")
        
        verification_file = self.compliance_dir / "traceability-verification.json"
        
        if not verification_file.exists():
            print("[WARN] Traceability verification file not found. Run verify_traceability.py first.")
            return
        
        with open(verification_file, 'r') as f:
            traceability_data = json.load(f)
        
        matrix = self.create_matrix(traceability_data)
        
        output_file = self.compliance_dir / "traceability-matrix.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(matrix, f, indent=2)
        
        html_output = self.compliance_dir / "traceability-matrix.html"
        self.generate_html_matrix(matrix, html_output)
        
        print(f"[OK] Traceability matrix generated:")
        print(f"  - JSON: {output_file}")
        print(f"  - HTML: {html_output}")
        
        return matrix
    
    def create_matrix(self, traceability_data):
        """Create structured traceability matrix"""
        matrix = {
            "documentInfo": {
                "title": "Requirements Traceability Matrix",
                "project": "AI Agent Evaluator",
                "version": "1.0",
                "date": datetime.utcnow().isoformat() + "Z",
                "standard": "IEC 62304, ISO 13485"
            },
            "summary": {
                "totalRequirements": traceability_data["totalRequirements"],
                "traced": traceability_data["traced"],
                "untraced": traceability_data["untraced"],
                "traceabilityPercentage": traceability_data["traceabilityPercentage"]
            },
            "matrix": traceability_data["traceability"]
        }
        
        return matrix
    
    def generate_html_matrix(self, matrix, output_file):
        """Generate HTML visualization of traceability matrix"""
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Requirements Traceability Matrix</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .summary {{
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .summary-item {{
            display: inline-block;
            margin-right: 30px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        th {{
            background-color: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }}
        td {{
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }}
        tr:hover {{
            background-color: #f5f5f5;
        }}
        .status-traced {{
            color: #27ae60;
            font-weight: bold;
        }}
        .status-untraced {{
            color: #e74c3c;
            font-weight: bold;
        }}
        .priority-critical {{
            background-color: #e74c3c;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.9em;
        }}
        .priority-high {{
            background-color: #f39c12;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.9em;
        }}
        .priority-medium {{
            background-color: #3498db;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.9em;
        }}
        .file-list {{
            font-size: 0.9em;
            color: #555;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Requirements Traceability Matrix</h1>
        <p><strong>Project:</strong> {matrix['documentInfo']['project']}</p>
        <p><strong>Version:</strong> {matrix['documentInfo']['version']}</p>
        <p><strong>Date:</strong> {matrix['documentInfo']['date']}</p>
        <p><strong>Standards:</strong> {matrix['documentInfo']['standard']}</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <div class="summary-item">
            <strong>Total Requirements:</strong> {matrix['summary']['totalRequirements']}
        </div>
        <div class="summary-item">
            <strong>Traced:</strong> <span style="color: #27ae60;">{matrix['summary']['traced']}</span>
        </div>
        <div class="summary-item">
            <strong>Untraced:</strong> <span style="color: #e74c3c;">{matrix['summary']['untraced']}</span>
        </div>
        <div class="summary-item">
            <strong>Traceability:</strong> <span style="color: #3498db;">{matrix['summary']['traceabilityPercentage']}%</span>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Req ID</th>
                <th>Description</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Design</th>
                <th>Implementation</th>
                <th>Verification</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
"""
        
        for item in matrix['matrix']:
            priority_class = f"priority-{item['priority'].lower()}"
            status_class = "status-traced" if item['traced'] else "status-untraced"
            
            design_files = "<br>".join(item['designDocuments']) if item['designDocuments'] else "N/A"
            impl_files = "<br>".join(item['implementationFiles']) if item['implementationFiles'] else "N/A"
            verif_methods = "<br>".join(item['verificationMethods']) if item['verificationMethods'] else "N/A"
            
            html += f"""
            <tr>
                <td><strong>{item['requirementId']}</strong></td>
                <td>{item['description']}</td>
                <td>{item['type']}</td>
                <td><span class="{priority_class}">{item['priority']}</span></td>
                <td class="file-list">{design_files}</td>
                <td class="file-list">{impl_files}</td>
                <td class="file-list">{verif_methods}</td>
                <td class="{status_class}">{item['status']}</td>
            </tr>
"""
        
        html += """
        </tbody>
    </table>
</body>
</html>
"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html)

if __name__ == "__main__":
    generator = TraceabilityMatrixGenerator()
    generator.generate_matrix()
