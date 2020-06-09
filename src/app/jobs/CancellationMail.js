import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  } // Com o get na frente eu consigo chama a classe por meio do import ex: cancellationMail.key()

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date),"'dia' dd 'de' MMMM', ás' H:mm'h'", {
          locale: pt
        }),
      },
    });
  }
}

export default new CancellationMail();
