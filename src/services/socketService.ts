import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '../store/notificationStore';

class SocketService {
  private socket: Socket | null = null;
  
  connect(userId: string) {
    this.socket = io('YOUR_WEBSOCKET_SERVER_URL', {
      auth: { userId }
    });
    
    this.setupListeners();
  }
  
  private setupListeners() {
    if (!this.socket) return;
    
    this.socket.on('notification', (notification) => {
      useNotificationStore.getState().addNotification(notification);
    });
    
    // Exemplo de eventos que podem gerar notificações
    this.socket.on('new_order', (order) => {
      useNotificationStore.getState().addNotification({
        title: 'Novo Pedido',
        message: `Pedido #${order.id} recebido de ${order.client}`,
        type: 'info'
      });
    });
    
    this.socket.on('low_stock', (item) => {
      useNotificationStore.getState().addNotification({
        title: 'Estoque Baixo',
        message: `${item.name} está com estoque baixo (${item.quantity} unidades)`,
        type: 'warning'
      });
    });
    
    this.socket.on('service_completed', (service) => {
      useNotificationStore.getState().addNotification({
        title: 'Serviço Concluído',
        message: `Serviço ${service.type} para ${service.client} foi finalizado`,
        type: 'success'
      });
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();