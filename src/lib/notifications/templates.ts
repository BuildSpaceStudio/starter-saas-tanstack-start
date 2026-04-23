export const notificationTemplateSlugs = {
  welcome: 'saas-welcome',
  adminInvite: 'saas-admin-invite',
  passwordChanged: 'saas-password-changed',
  accountDeleted: 'saas-account-deleted',
} as const

export function renderWelcomeEmail(name: string) {
  return {
    subject: 'Welcome to Your Product',
    html: `<h1>Welcome, ${name}</h1><p>Your account is ready. Sign in any time to keep building.</p>`,
    text: `Welcome, ${name}. Your account is ready.`,
  }
}

export function renderAdminInviteEmail(name: string, inviter: string) {
  return {
    subject: 'You were invited to help manage Your Product',
    html: `<h1>Hello, ${name}</h1><p>${inviter} invited you to help manage Your Product as an administrator.</p>`,
    text: `${inviter} invited you to help manage Your Product as an administrator.`,
  }
}

export function renderPasswordChangedEmail(name: string) {
  return {
    subject: 'Your password changed',
    html: `<h1>Password changed</h1><p>${name}, this confirms your password was changed.</p>`,
    text: `${name}, this confirms your password was changed.`,
  }
}

export function renderAccountDeletedEmail(name: string) {
  return {
    subject: 'Your account has been deleted',
    html: `<h1>Account deleted</h1><p>${name}, this message confirms your account has been deleted.</p>`,
    text: `${name}, this message confirms your account has been deleted.`,
  }
}
