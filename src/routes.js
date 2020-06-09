import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store); // Rota de criação de usuario
routes.post('/sessions', SessionController.store); // Rota de autenticação

routes.use(authMiddleware);

routes.put('/users', UserController.update); // Rotda de update do usuario

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index)

routes.get('/appointments', AppointmentController.index); // Listando os agendamentos do usuario
routes.post('/appointments', AppointmentController.store); // Criando o agendameto do usuario
routes.delete('/appointments/:id', AppointmentController.delete); // Deletando o agendamento

routes.get('/schedule', ScheduleController.index); // Rota pro prestador ver sua agenda

routes.get('/notifications', NotificationController.index); // Providers veem seus agendamentos
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store); // Rota para upar arquivo de foto

export default routes;
