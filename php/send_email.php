<?php
/**
 * send_email.php — Saurabh Giri Portfolio 2.0
 * POST-only, server-validated, sanitized contact form handler.
 * Returns JSON {success: bool, message: string}
 */

// ── HEADERS ───────────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// ── METHOD CHECK ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── SESSION-BASED RATE LIMITING ───────────────────────────
session_start();
require_once __DIR__ . '/config.php';

$now = time();
if (!isset($_SESSION['cf_times'])) {
    $_SESSION['cf_times'] = [];
}
// Purge old entries outside the window
$_SESSION['cf_times'] = array_filter(
    $_SESSION['cf_times'],
    fn($t) => ($now - $t) < $rate_limit_window
);
if (count($_SESSION['cf_times']) >= $rate_limit_max) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many submissions. Please wait a few minutes.']);
    exit;
}

// ── HONEYPOT ──────────────────────────────────────────────
// If the hidden honeypot field is filled, it's a bot — silently discard.
if (!empty($_POST['website'])) {
    // Return fake success to confuse bots
    echo json_encode(['success' => true, 'message' => 'Message received. Thank you.']);
    exit;
}

// ── INPUT SANITIZATION ────────────────────────────────────
function clean(string $value, int $maxLen = 500): string
{
    $value = trim($value);
    $value = substr($value, 0, $maxLen);
    $value = strip_tags($value);
    return $value;
}

// Strip newlines from any value that goes into an email header
function clean_header(string $value): string
{
    return preg_replace('/[\r\n]+/', ' ', clean($value, 200));
}

$name     = clean($_POST['name']     ?? '', 100);
$email    = clean($_POST['email']    ?? '', 254);
$interest = clean($_POST['interest'] ?? '', 100);
$message  = clean($_POST['message']  ?? '', 2000);

// ── SERVER-SIDE VALIDATION ────────────────────────────────
$errors = [];

if (mb_strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
$allowed_interests = [
    'Web development',
    'Security / forensics',
    'UI/UX design',
    'Photography',
    'Something else',
];
if (!in_array($interest, $allowed_interests, true)) {
    $errors[] = 'Please select a valid interest.';
}
if (mb_strlen($message) < 5) {
    $errors[] = 'Message must be at least 5 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ── HEADER INJECTION PREVENTION ───────────────────────────
$safe_name    = clean_header($name);
$safe_email   = clean_header($email);
$safe_interest = clean_header($interest);

// ── BUILD EMAIL ───────────────────────────────────────────
$timestamp = date('Y-m-d H:i:s T');
$subject   = "Portfolio Contact — {$safe_name}";

$body  = "NEW PORTFOLIO CONTACT\n";
$body .= str_repeat('-', 48) . "\n\n";
$body .= "Name:     {$safe_name}\n";
$body .= "Email:    {$safe_email}\n";
$body .= "Interest: {$safe_interest}\n\n";
$body .= "Message:\n";
$body .= str_repeat('-', 48) . "\n";
$body .= wordwrap($message, 80, "\n", true) . "\n";
$body .= str_repeat('-', 48) . "\n\n";
$body .= "Submitted: {$timestamp}\n";

// ── MAIL HEADERS ──────────────────────────────────────────
$headers  = "From: {$site_name} <no-reply@{$site_domain}>\r\n";
$headers .= "Reply-To: {$safe_name} <{$safe_email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// ── SEND ──────────────────────────────────────────────────
$sent = false;

if ($use_smtp) {
    /**
     * SMTP path — uncomment and configure once PHPMailer is installed via Composer.
     * See README.md → "SMTP Configuration" for instructions.
     *
     * require_once __DIR__ . '/../vendor/autoload.php';
     * $mail = new PHPMailer\PHPMailer\PHPMailer(true);
     * try {
     *     $mail->isSMTP();
     *     $mail->Host       = $smtp_host;
     *     $mail->SMTPAuth   = true;
     *     $mail->Username   = $smtp_user;
     *     $mail->Password   = $smtp_pass;
     *     $mail->SMTPSecure = $smtp_secure;
     *     $mail->Port       = $smtp_port;
     *     $mail->setFrom("no-reply@{$site_domain}", $site_name);
     *     $mail->addAddress($recipient_email, $recipient_name);
     *     $mail->addReplyTo($safe_email, $safe_name);
     *     $mail->Subject = $subject;
     *     $mail->Body    = $body;
     *     $mail->send();
     *     $sent = true;
     * } catch (Exception $e) {
     *     // Log internally; never expose $mail->ErrorInfo to visitor
     *     error_log("Mailer error: " . $mail->ErrorInfo);
     * }
     */
    error_log('SMTP is enabled in config but PHPMailer is not installed. See README.md.');
    $sent = false;
} else {
    // Native PHP mail() — works on most shared hosts that permit it
    $additional_params = "-f no-reply@{$site_domain}";
    $sent = mail($recipient_email, $subject, $body, $headers, $additional_params);
}

// ── RECORD ATTEMPT FOR RATE LIMITING ─────────────────────
if ($sent) {
    $_SESSION['cf_times'][] = $now;
}

// ── RESPONSE ─────────────────────────────────────────────
if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully. I will get back to you soon.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Message could not be sent. Please try again or contact me directly via social links.'
    ]);
}
