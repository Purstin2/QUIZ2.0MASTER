// Facebook Pixel tracking functions
declare global {
  interface Window {
    pixelId: string;
    utmify: any;
  }
}

// Helper function to track events
export const trackPixelEvent = (eventName: string, parameters?: any) => {
  try {
    if (typeof window !== 'undefined' && window.utmify) {
      window.utmify('track', eventName, parameters);
      console.log(`Pixel event tracked: ${eventName}`, parameters);
    }
  } catch (error) {
    console.error('Error tracking pixel event:', error);
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