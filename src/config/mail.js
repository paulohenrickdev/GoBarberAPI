export default {
  host: process.env.MAIL_HOST, // Isso vem do mailTrap
  port: process.env.MAIL_PORT, // vem do mailTrap
  secure: false,
  auth: {
    user: process.env.MAIL_USER, // vem do mailTrap
    pass: process.env.MAIL_PASS, // vem do mailTrap
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  }
};
