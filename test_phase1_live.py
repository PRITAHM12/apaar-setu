import urllib.request
import urllib.error
import json

def test_endpoint(name, url, method="GET", headers=None, body=None, expected_status=200):
    headers = headers or {}
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            result = json.loads(content) if content else {}
            passed = (status == expected_status)
            print(f"[{'PASS' if passed else 'FAIL'}] {name} -> Status: {status} (Expected: {expected_status})")
            return passed, result
    except urllib.error.HTTPError as e:
        status = e.code
        content = e.read().decode("utf-8")
        try:
            result = json.loads(content)
        except Exception:
            result = {"raw": content}
        passed = (status == expected_status)
        print(f"[{'PASS' if passed else 'FAIL'}] {name} -> Status: {status} (Expected: {expected_status})")
        if not passed:
            print(f"    Error response: {result}")
        return passed, result
    except Exception as e:
        print(f"[FAIL] {name} -> Network error: {e}")
        return False, str(e)

print("=" * 60)
print("TESTING APAAR-SETU BACKEND SUITE (Ports 4000 & 8000)")
print("=" * 60)

# 1. Node Gateway Health
test_endpoint("Node Gateway Health", "http://localhost:4000/")

# 2. Python FastAPI Health
test_endpoint("Python FastAPI Health", "http://localhost:8000/")

# 3. Python FastAPI Merkle Hash Record
test_endpoint(
    "FastAPI W3C Merkle Hashing",
    "http://localhost:8000/api/ai/hash-record",
    method="POST",
    body={
        "apaar_id": "7841-9023-4412",
        "student_name": "Pritam Raj Chaurasiya",
        "institute_pid": "PID-1-4920182",
        "program": "B.Tech Computer Science & Engineering",
        "semester": 3,
        "sgpa": 8.40,
        "cgpa": 8.40,
        "abc_credits": 22
    },
    expected_status=200
)

# 4. Python FastAPI Forensic Scan - Authentic
test_endpoint(
    "FastAPI Forensic Scan (AUTHENTIC)",
    "http://localhost:8000/api/ai/forensic-scan",
    method="POST",
    body={
        "apaar_id": "7841-9023-4412",
        "student_name": "Pritam Raj Chaurasiya",
        "institute_pid": "PID-1-4920182",
        "semester": 3,
        "submitted_cgpa": 8.40,
        "mode": "AUTHENTIC"
    },
    expected_status=200
)

# 5. Python FastAPI Forensic Scan - Tampered (Expecting 422)
test_endpoint(
    "FastAPI Forensic Scan (TAMPERED_CGPA -> HTTP 422)",
    "http://localhost:8000/api/ai/forensic-scan",
    method="POST",
    body={
        "apaar_id": "7841-9023-4412",
        "student_name": "Pritam Raj Chaurasiya",
        "institute_pid": "PID-1-4920182",
        "semester": 3,
        "submitted_cgpa": 9.40,
        "mode": "TAMPERED_CGPA"
    },
    expected_status=422
)

# 6. Node Gateway RLS Cross-Tenant Test (Expecting 403 Forbidden)
test_endpoint(
    "Node Gateway RLS Cross-Tenant Block (HTTP 403)",
    "http://localhost:4000/api/v1/nodal/cross-tenant-test?targetPid=PID-1-3310",
    method="GET",
    headers={"Authorization": "Bearer demo-nodal-token"},
    expected_status=403
)

# 7. Node Gateway Nodal Batch Sync (Expecting 409 Conflict due to duplicate APAAR 8832-5519-1029)
test_endpoint(
    "Node Gateway Batch Sync Dual-Enrollment Block (HTTP 409)",
    "http://localhost:4000/api/v1/nodal/batch-sync",
    method="POST",
    headers={"Authorization": "Bearer demo-nodal-token"},
    body={},
    expected_status=409
)

# 8. Node Gateway DPDP Consent Inbox
test_endpoint(
    "Node Gateway Student DPDP Consents",
    "http://localhost:4000/api/v1/student/consents",
    method="GET",
    headers={"Authorization": "Bearer demo-student-token"},
    expected_status=200
)

# 9. Node Gateway DPDP Consent Update
test_endpoint(
    "Node Gateway DPDP Consent Approval with ZK Masking",
    "http://localhost:4000/api/v1/student/consents",
    method="PATCH",
    headers={"Authorization": "Bearer demo-student-token"},
    body={
        "consentId": "CONSENT-2026-991",
        "status": "APPROVED",
        "zeroKnowledgeMode": True
    },
    expected_status=200
)

# 10. Node Gateway Security Audit Stream (Chained SHA-256 logs)
test_endpoint(
    "Node Gateway Live Audit Stream",
    "http://localhost:4000/api/v1/audit-stream",
    method="GET",
    headers={"Authorization": "Bearer demo-admin-token"},
    expected_status=200
)

print("=" * 60)
print("ALL SUITE TESTS EXECUTED")
print("=" * 60)
