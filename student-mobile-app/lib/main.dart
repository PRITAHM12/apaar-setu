import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const ApaarPassportApp());
}

class ApaarPassportApp extends StatelessWidget {
  const ApaarPassportApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'APAAR Academic Passport',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E3A8A), // Sovereign Royal Blue
          primary: const Color(0xFF1E3A8A),
          secondary: const Color(0xFF10B981), // Trust Emerald
          surface: const Color(0xFFF8FAFC),
        ),
        fontFamily: 'Roboto',
      ),
      home: const StudentPassportScreen(),
    );
  }
}

class StudentPassportScreen extends StatefulWidget {
  const StudentPassportScreen({super.key});

  @override
  State<StudentPassportScreen> createState() => _StudentPassportScreenState();
}

class _StudentPassportScreenState extends State<StudentPassportScreen> {
  static const String baseUrl = 'http://localhost:4000';
  
  bool _maskApaar = true;
  bool _isApproved = false;
  bool _zeroKnowledge = true;
  bool _isLoading = false;
  String _merkleRoot = '0x8f92e41b7c2091a41c5d6e7f8a9b0c1d2e3f4a5b';
  int _auditEventCount = 1;

  final String _studentName = 'Pritam Raj Chaurasiya';
  final String _apaarId = '7841-9023-4412';
  final String _institute = 'Lakshmi Narain College of Technology Excellence';
  final String _program = 'B.Tech Computer Science & Engineering';

  @override
  void initState() {
    super.initState();
    _fetchConsentStatus();
    _fetchAuditStreamCount();
  }

  Future<void> _fetchConsentStatus() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/student/consents'),
        headers: {'Authorization': 'Bearer demo-student-token'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final consents = data['consents'] as List<dynamic>?;
        if (consents != null && consents.isNotEmpty) {
          final first = consents.first;
          setState(() {
            _isApproved = first['status'] == 'APPROVED';
            _zeroKnowledge = first['zero_knowledge_mode'] ?? true;
          });
        }
      }
    } catch (e) {
      debugPrint('Consent fetch fallback: $e');
    }
  }

  Future<void> _fetchAuditStreamCount() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/audit-stream'),
        headers: {'Authorization': 'Bearer demo-student-token'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _auditEventCount = data['count'] ?? 1;
        });
      }
    } catch (e) {
      debugPrint('Audit stream fetch: $e');
    }
  }

  Future<void> _toggleConsent(bool approve) async {
    setState(() => _isLoading = true);
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/api/v1/student/consents'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-student-token',
        },
        body: jsonEncode({
          'consentId': 'CONSENT-2026-991',
          'status': approve ? 'APPROVED' : 'REVOKED',
          'zeroKnowledgeMode': _zeroKnowledge,
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          _isApproved = approve;
        });
        _fetchAuditStreamCount();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                approve 
                  ? 'Verification Access Approved (24 Hours)' 
                  : 'Verification Access Revoked',
              ),
              backgroundColor: approve ? const Color(0xFF10B981) : Colors.redAccent,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Consent patch error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  String _displayApaar() {
    if (!_maskApaar) return _apaarId;
    final parts = _apaarId.split('-');
    if (parts.length == 3) {
      return 'XXXX-XXXX-${parts[2]}';
    }
    return 'XXXX-XXXX-4412';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text(
          'APAAR Academic Passport',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, size: 20),
            onPressed: () {
              _fetchConsentStatus();
              _fetchAuditStreamCount();
            },
            tooltip: 'Refresh Ledger',
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Holographic Passport Card
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.shield, color: Color(0xFF10B981), size: 20),
                          SizedBox(width: 8),
                          Text(
                            'W3C CREDENTIAL PASSPORT',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF10B981)),
                        ),
                        child: const Text(
                          'ACTIVE',
                          style: TextStyle(
                            color: Color(0xFF10B981),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      // Simulated QR Container
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.qr_code_2, size: 58, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _studentName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Text(
                                  _displayApaar(),
                                  style: const TextStyle(
                                    color: Color(0xFF93C5FD),
                                    fontSize: 12,
                                    fontFamily: 'Courier',
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                GestureDetector(
                                  onTap: () => setState(() => _maskApaar = !_maskApaar),
                                  child: Icon(
                                    _maskApaar ? Icons.visibility : Icons.visibility_off,
                                    color: Colors.white70,
                                    size: 16,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _institute,
                              style: const TextStyle(color: Colors.white60, fontSize: 10),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.black26,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'SHA-256 Merkle Root:',
                          style: TextStyle(color: Colors.white60, fontSize: 10),
                        ),
                        Text(
                          '${_merkleRoot.substring(0, 16)}...',
                          style: const TextStyle(
                            color: Color(0xFF10B981),
                            fontFamily: 'Courier',
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Bento Summary Row
            Row(
              children: [
                Expanded(
                  child: Card(
                    elevation: 1,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(14.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('ABC CREDITS', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text('68', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          Text('Semesters 1-3', style: TextStyle(fontSize: 10, color: Color(0xFF10B981), fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Card(
                    elevation: 1,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(14.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('CGPA LEDGER', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text('8.40', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                          Text('W3C Anchored', style: TextStyle(fontSize: 10, color: Colors.blueGrey)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // DPDP Act 2023 Consent Wallet Card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.privacy_tip, color: Color(0xFFF59E0B), size: 20),
                            SizedBox(width: 8),
                            Text(
                              'DPDP Act 2023 Consent Wallet',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: _isApproved ? const Color(0xFFD1FAE5) : const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            _isApproved ? 'APPROVED' : 'PENDING',
                            style: TextStyle(
                              color: _isApproved ? const Color(0xFF065F46) : const Color(0xFF92400E),
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        )
                      ],
                    ),
                    const Divider(height: 24),
                    const Text('Requester: Infosys Campus Hiring BGV Portal', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
                    const SizedBox(height: 4),
                    const Text('Scope: B.Tech CSE Sem 1-3 Verified Transcript & CGPA', style: TextStyle(color: Colors.black54, fontSize: 11)),
                    const SizedBox(height: 4),
                    const Text('Duration: 24-Hour Ephemeral Access Token', style: TextStyle(color: Colors.black54, fontSize: 11)),
                    const SizedBox(height: 12),
                    
                    // ZK Toggle Switch
                    SwitchListTile(
                      dense: true,
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Zero-Knowledge Mode', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      subtitle: const Text('Mask Aadhaar & Address; assert CGPA >= 7.50', style: TextStyle(fontSize: 10)),
                      value: _zeroKnowledge,
                      activeColor: const Color(0xFF1E3A8A),
                      onChanged: (val) => setState(() => _zeroKnowledge = val),
                    ),
                    const SizedBox(height: 10),

                    // Approve / Revoke Action Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        icon: _isLoading
                            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : Icon(_isApproved ? Icons.lock : Icons.lock_open, size: 16),
                        label: Text(_isApproved ? 'Revoke 24h Access' : 'Approve 24h Access'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isApproved ? Colors.redAccent : const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: _isLoading ? null : () => _toggleConsent(!_isApproved),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
