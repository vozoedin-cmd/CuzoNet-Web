import { AiQueryRequest, AiQueryResponse, AiSource } from '../api/ai-assistant.service';

const demoSources: Record<string, AiSource> = {
  'net-1': { id: 'net-1', type: 'Network', title: 'Estado Core', summary: 'El router principal (10.0.0.1) reporta 45% CPU.' },
  'bill-1': { id: 'bill-1', type: 'Billing', title: 'Facturación Mensual', summary: 'Se han recaudado $45M este mes (86% del proyectado).' },
  'mon-1': { id: 'mon-1', type: 'Monitoring', title: 'Disponibilidad Nodo Norte', summary: 'El Nodo Norte tiene un uptime de 99.8% en los últimos 7 días.' },
};

export const processDemoQuery = async (request: AiQueryRequest): Promise<AiQueryResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let answer = `[DATOS DEMO] Entiendo tu consulta: "${request.message}". Esta es una respuesta simulada estática para fines de demostración.`;
      let sources: AiSource[] = [];

      const lmsg = request.message.toLowerCase();
      if (lmsg.includes('red') || lmsg.includes('estado')) {
        answer = '[DATOS DEMO] La red se encuentra operando normalmente. El uso promedio del CPU en el Core es del 45%. No se reportan nodos críticos caídos en este momento.';
        sources = [demoSources['net-1']];
      } else if (lmsg.includes('factura') || lmsg.includes('deuda') || lmsg.includes('ingreso')) {
        answer = '[DATOS DEMO] La recaudación actual del mes es de $45,000,000, lo que representa una tasa de cobranza del 86.5%. La morosidad se ubica en un nivel estable.';
        sources = [demoSources['bill-1']];
      } else if (lmsg.includes('monitoreo') || lmsg.includes('nodo')) {
        answer = '[DATOS DEMO] El Nodo Norte, uno de los enlaces principales, mantiene un uptime del 99.8%. No se detectan anomalías de ruteo.';
        sources = [demoSources['mon-1']];
      }

      resolve({
        conversationId: request.conversationId || crypto.randomUUID(),
        messageId: crypto.randomUUID(),
        answer,
        sources,
        suggestedQuestions: [
          { id: 'q1', text: '¿Cuál es el estado general de la red?' },
          { id: 'q2', text: '¿Cuál es la deuda total registrada?' },
          { id: 'q3', text: '¿Qué nodos aparecen degradados?' },
        ],
        createdAt: new Date().toISOString()
      });
    }, 1500); // Simulando latencia de red/procesamiento
  });
};
