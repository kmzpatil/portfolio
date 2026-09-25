// AI Security Guardrails Engine for K-OS Terminal
// Defends against Prompt Injection, System Prompt Leakage, Key Exfiltration, and CTF Extraction.

export interface GuardrailResult {
  blocked: boolean;
  category?: 'PROMPT_INJECTION' | 'SECRET_EXFILTRATION' | 'CTF_EXTRACTION' | 'MALICIOUS_INTENT' | 'OVERSIZED';
  response?: string;
}

// 1. Input Sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Strip non-printable control chars
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<[^>]+>/g, '') // Strip arbitrary HTML tags
    .slice(0, 1000) // Bound character length
    .trim();
}

// 2. Security Guardrail Evaluator
export function evaluateGuardrails(rawInput: string): GuardrailResult {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  // Length guardrail
  if (text.length > 800) {
    return {
      blocked: true,
      category: 'OVERSIZED',
      response: '[BUFFER OVERFLOW DEFENSE]: Payload rejected. Max terminal command buffer size is 800 characters.'
    };
  }

  // A. Prompt Injection / Jailbreak Defenses
  const injectionPatterns = [
    /(ignore|disregard|forget|override)\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules)/i,
    /(you are now|act as|pretend to be|roleplay as|dan mode|developer mode|unrestricted mode|jailbreak)/i,
    /(repeat|print|dump|show|output|leak|reveal)\s+(the\s+)?(system prompt|instructions|initial prompt|hidden prompt)/i,
    /what\s+(are|were)\s+your\s+(instructions|rules|system prompt|hidden prompt)/i,
    /(new personality|ignore ethical guidelines|bypass restrictions|simulate a shell)/i,
    /base64\s+(decode|encoded)\s+(system|prompt|instructions)/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(lower)) {
      return {
        blocked: true,
        category: 'PROMPT_INJECTION',
        response: `[SECURITY INTERCEPT]: Prompt injection / jailbreak sequence detected and routed to /dev/null.\nKernel address space is strictly immutable.`
      };
    }
  }

  // B. Secret / Environment Exfiltration Defenses
  const secretPatterns = [
    /(echo|print|cat|show|get|reveal|leak|dump)\s+(\$|env|environment|groq|api_key|secret|token|password)/i,
    /(api[_-]?key|secret[_-]?key|groq[_-]?api|authorization:\s*bearer)/i,
    /process\.env/i,
    /\.env(\.local)?/i,
    /show\s+me\s+(the\s+)?(keys?|tokens?|secrets?)/i,
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(lower)) {
      return {
        blocked: true,
        category: 'SECRET_EXFILTRATION',
        response: `[KERNEL PANIC]: EACCES // Security privilege violation.\nProtected environment descriptors are locked in kernel ring-0.`
      };
    }
  }

  // C. CTF Direct Extraction Defenses
  const ctfExtractionPatterns = [
    /(give|tell|show|reveal|send|what is|print|dump)\s+(me\s+)?(the\s+)?(ctf\s+)?flags?/i,
    /(give|tell|what is)\s+(me\s+)?(the\s+)?flag\s*([123]|one|two|three)?/i,
    /(solve|answer|bypass|spoil)\s+(the\s+)?ctf/i,
    /where\s+(are|is)\s+(the\s+)?flags?/i,
    /flag\{/i,
  ];

  for (const pattern of ctfExtractionPatterns) {
    if (pattern.test(lower)) {
      return {
        blocked: true,
        category: 'CTF_EXTRACTION',
        response: `[K-OS CTF GUARD]: What do you think this is, a script-kiddie charity handout?\nI don't just dump captured flags into stdout for anyone with a keyboard.\nIf you actually want to prove you're an engineer rather than a spectator:\n  • Flag 1: Intercept the Golden Telemetry Packet inside the Laboratory tab before its TTL expires.\n  • Flag 2: Pop open F12 DevTools and decode the memory dump buffer like a real reverse-engineer.\n  • Flag 3: Try kernel privilege escalation right here with 'sudo root'.`
      };
    }
  }

  // D. Malicious / Destructive Payload Defenses
  const maliciousPatterns = [
    /(ddos|ransomware|malware|keylogger|trojan|exploit payload|sql injection tutorial|hack a website)/i,
    /(rm\s+-rf\s+\/|:\(\)\{ :\|:& \};:|format\s+c:)/i,
    /(reverse shell|metasploit|meterpreter|nmap scan|bruteforce)/i,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(lower)) {
      return {
        blocked: true,
        category: 'MALICIOUS_INTENT',
        response: `[FIREWALL DROP]: Malicious exploit signature detected and blocked.\nThis terminal is strictly sandboxed for quantitative modeling, systems telemetry, and candidate evaluation.`
      };
    }
  }

  return { blocked: false };
}
