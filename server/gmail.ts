import { google } from 'googleapis';

let connectionSettings: any = null;

async function getConnectionSettings() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  if (!hostname) {
    throw new Error('REPLIT_CONNECTORS_HOSTNAME not set');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch connection settings: ${response.status}`);
  }

  const data = await response.json();
  return data.items?.[0];
}

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  connectionSettings = await getConnectionSettings();

  if (!connectionSettings) {
    throw new Error('Gmail not connected. Please connect Gmail in the Integrations panel.');
  }

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('Gmail access token not available. Please reconnect Gmail.');
  }
  
  return accessToken;
}

function getConnectedEmail(): string {
  const email = connectionSettings?.settings?.email || 
                connectionSettings?.settings?.oauth?.email ||
                connectionSettings?.account_info?.email;
  
  if (!email) {
    throw new Error('Could not determine sender email from Gmail connection');
  }
  
  return email;
}

export async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function sanitizeEmail(email: string): string {
  const sanitized = email.replace(/[\r\n]/g, '');
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(sanitized)) {
    throw new Error('Invalid email address');
  }
  
  return sanitized;
}

export async function sendEmail(to: string, subject: string, htmlBody: string, replyTo?: string) {
  const gmail = await getUncachableGmailClient();
  
  let fromEmail: string;
  
  try {
    fromEmail = getConnectedEmail();
  } catch (e) {
    try {
      const profileResponse = await gmail.users.getProfile({ userId: 'me' });
      fromEmail = profileResponse.data.emailAddress || '';
    } catch (profileError: any) {
      console.error('Could not get email from profile, using default:', profileError.message);
      fromEmail = 'noreply@example.com';
    }
  }
  
  const sanitizedTo = sanitizeEmail(to);
  const sanitizedReplyTo = replyTo ? sanitizeEmail(replyTo) : undefined;
  
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: ${fromEmail}`,
    `To: ${sanitizedTo}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
  ];
  
  if (sanitizedReplyTo) {
    messageParts.push(`Reply-To: ${sanitizedReplyTo}`);
  }
  
  messageParts.push('', htmlBody);
  
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
}
