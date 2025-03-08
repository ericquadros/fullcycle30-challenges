import EventDispatcherConfig from "./event-dispatcher-config";

export default function initializeApp(): void {
  // Inicializar event dispatcher e registrar handlers
  EventDispatcherConfig.initialize();
  
  // Aqui você pode adicionar outras inicializações necessárias
  // Por exemplo:
  // - Conexão com banco de dados
  // - Configuração de variáveis de ambiente
  // - Inicialização de outros serviços
} 