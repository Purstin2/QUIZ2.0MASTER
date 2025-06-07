// Facebook Pixel tracking functions with robust error handling
declare global {
  interface Window {
    pixelId: string;
    utmify: any;
  }
}

// Helper function to track events with fallback
export const trackPixelEvent = (eventName: string, parameters?: any) => {
  try {
    if (typeof window !== 'undefined') {
      // Aguarda um pouco para o script carregar se necessário
      const attemptTracking = () => {
        if (window.utmify && typeof window.utmify === 'function') {
          window.utmify('track', eventName, parameters);
          console.log(`✅ Pixel event tracked: ${eventName}`, parameters);
          return true;
        }
        return false;
      };

      // Tenta imediatamente
      if (attemptTracking()) {
        return;
      }

      // Se não conseguiu, tenta novamente após um delay
      setTimeout(() => {
        if (!attemptTracking()) {
          console.warn(`⚠️ Pixel tracking failed for: ${eventName}`, parameters);
          // Aqui você pode implementar tracking alternativo
          // Por exemplo, enviar para Google Analytics
          sendToAlternativeTracking(eventName, parameters);
        }
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Error tracking pixel event:', error);
    sendToAlternativeTracking(eventName, parameters);
  }
};

// Função de tracking alternativo (pode ser Google Analytics, etc.)
const sendToAlternativeTracking = (eventName: string, parameters?: any) => {
  try {
    // Exemplo: enviar para Google Analytics se disponível
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'Quiz',
        event_label: parameters?.content_name || eventName,
        value: parameters?.value || 0
      });
      console.log(`📊 Alternative tracking (GA): ${eventName}`);
    } else {
      // Ou salvar localmente para enviar depois
      const trackingData = {
        event: eventName,
        parameters,
        timestamp: new Date().toISOString()
      };
      
      const savedEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
      savedEvents.push(trackingData);
      localStorage.setItem('pendingEvents', JSON.stringify(savedEvents));
      console.log(`💾 Event saved locally: ${eventName}`);
    }
  } catch (error) {
    console.error('Failed to send to alternative tracking:', error);
  }
};

// Função para reenviar eventos salvos quando o pixel estiver disponível
export const retryPendingEvents = () => {
  try {
    const pendingEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
    
    if (pendingEvents.length > 0 && window.utmify) {
      pendingEvents.forEach((event: any) => {
        trackPixelEvent(event.event, event.parameters);
      });
      
      // Limpa os eventos após enviar
      localStorage.removeItem('pendingEvents');
      console.log(`🔄 Resent ${pendingEvents.length} pending events`);
    }
  } catch (error) {
    console.error('Error retrying pending events:', error);
  }
};

// Specific tracking functions for our quiz
export const trackQuizStart = () => {
  trackPixelEvent('InitiateCheckout', {
    content_name: 'Quiz de Saúde Iniciado',
    content_category: 'Quiz',
    value: 0,
    currency: 'BRL'
  });
};

export const trackQuizProgress = (step: number, totalSteps: number) => {
  const progress = Math.round((step / totalSteps) * 100);
  trackPixelEvent('AddToCart', {
    content_name: `Quiz Progresso ${progress}%`,
    content_category: 'Quiz Progress',
    value: progress,
    currency: 'BRL'
  });
};

export const trackEmailCapture = (email: string) => {
  trackPixelEvent('Lead', {
    content_name: 'Email Capturado',
    content_category: 'Lead Generation',
    value: 19.90,
    currency: 'BRL'
  });
};

export const trackQuizComplete = (userScore: number) => {
  trackPixelEvent('CompleteRegistration', {
    content_name: 'Quiz Completo',
    content_category: 'Quiz Completion',
    value: userScore,
    currency: 'BRL'
  });
};

export const trackOfferView = (price: number) => {
  trackPixelEvent('ViewContent', {
    content_name: 'Oferta Visualizada',
    content_category: 'Offer',
    value: price,
    currency: 'BRL'
  });
};

export const trackPurchaseIntent = (price: number) => {
  trackPixelEvent('AddPaymentInfo', {
    content_name: 'Intenção de Compra',
    content_category: 'Purchase Intent',
    value: price,
    currency: 'BRL'
  });
};

// Função para verificar se o pixel está funcionando
export const checkPixelStatus = () => {
  if (typeof window !== 'undefined') {
    const hasUtmify = window.utmify && typeof window.utmify === 'function';
    const hasPixelId = window.pixelId;
    
    console.log('🔍 Pixel Status:', {
      utmifyLoaded: hasUtmify,
      pixelIdSet: hasPixelId,
      pixelId: window.pixelId
    });
    
    return hasUtmify && hasPixelId;
  }
  return false;
};