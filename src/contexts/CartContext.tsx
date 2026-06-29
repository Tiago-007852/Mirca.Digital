import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  sendToWhatsApp: (
    clientName: string, 
    phone: string, 
    notes: string,
    clientDetails?: {
      email?: string;
      company?: string;
      service?: string;
      budget?: string;
      deadline?: string;
    }
  ) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mirca_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mirca_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const sendToWhatsApp = (
    clientName: string, 
    phone: string, 
    notes: string,
    clientDetails?: {
      email?: string;
      company?: string;
      service?: string;
      budget?: string;
      deadline?: string;
    }
  ) => {
    const hasPrices = items.some((item) => item.product.price && item.product.priceVisible);

    const productsList = items
      .map((item) => {
        const hasPrice = item.product.price && item.product.priceVisible;
        const itemPrice = hasPrice
          ? ` (Kz ${item.product.price!.toLocaleString('pt-AO')} cada)`
          : '';
        const itemTotal = hasPrice
          ? ` - Subtotal: Kz ${(item.product.price! * item.quantity).toLocaleString('pt-AO')}`
          : '';
        return `• ${item.product.name} (Qtd: ${item.quantity})${itemPrice}${itemTotal}`;
      })
      .join('\n');

    const totalStr = hasPrices
      ? `\n💰 *Total Estimado*: Kz ${items.reduce((sum, item) => {
          if (item.product.price && item.product.priceVisible) {
            return sum + item.product.price * item.quantity;
          }
          return sum;
        }, 0).toLocaleString('pt-AO')}\n`
      : '';

    const companyStr = clientDetails?.company || '';
    const emailStr = clientDetails?.email || '';
    const serviceStr = clientDetails?.service || '';
    const budgetStr = clientDetails?.budget || '';
    const deadlineStr = clientDetails?.deadline || '';

    const message = `Olá MIRCA, gostaria de solicitar um orçamento para os seguintes produtos:

📦 *PRODUTOS SELECIONADOS*:
${productsList}
${totalStr}
👤 *DADOS DO CLIENTE*:
• *Nome*: ${clientName}
• *Telefone*: ${phone}${companyStr ? `\n• *Empresa*: ${companyStr}` : ''}${emailStr ? `\n• *E-mail*: ${emailStr}` : ''}${serviceStr ? `\n• *Serviço*: ${serviceStr}` : ''}${budgetStr ? `\n• *Orçamento*: ${budgetStr}` : ''}${deadlineStr ? `\n• *Prazo*: ${deadlineStr}` : ''}

📝 *DETALHES / NOTAS ADICIONAIS*:
${notes || 'Sem observações adicionais.'}

*Solicitado via mirca.digital*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/244948170046?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        sendToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
