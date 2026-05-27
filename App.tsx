import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Ticket, CheckCircle, CreditCard, Sparkles, MapPin, Clock, Phone, Heart, Star, Plus, MessageSquare, X, ShieldCheck, ArrowUp, ArrowUpRight } from 'lucide-react';

// ==========================================
// 1. INTERFACES E TIPOS DE DADOS (TypeScript/JS)
// ==========================================
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'espressos' | 'gelados' | 'salgados' | 'doces' | 'especiais';
  categoryLabel: string;
  image: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  customization: { hasMilk: boolean; hasSizes: boolean; hasExtras: boolean };
}

export type CoffeeSize = 'P' | 'M' | 'G';
export type MilkOption = 'Nenhum' | 'Integral' | 'Zero Lactose' | 'Leite de Aveia' | 'Leite de Amêndoas';

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  size?: CoffeeSize;
  milk?: MilkOption;
  extras: string[];
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  customerName: string;
  orderType: 'mesa' | 'retirada';
  tableNumber?: string;
  paymentMethod: 'pix' | 'cartao' | 'dinheiro';
  status: 'recebido' | 'preparando' | 'pronto';
  timestamp: string;
  estimatedMinutes: number;
}

export interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  coffeeOrdered?: string;
}

// ==========================================
// 2. DADOS DO CARDÁPIO E DEPOIMENTOS
// ==========================================
const EXTRAS_OPTIONS = [
  { id: 'shot', name: 'Shot Extra de Espresso', price: 4.50 },
  { id: 'chantilly', name: 'Chantilly Artesanal', price: 3.00 },
  { id: 'syrup_vanilla', name: 'Xarope de Baunilha', price: 3.50 },
  { id: 'syrup_caramel', name: 'Xarope de Caramelo Salgado', price: 3.50 }
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso Tradicional',
    description: 'Espresso curto com grãos de origem única selecionados, corpo denso, notas de chocolate amargo e uma crema aveludada impecável.',
    price: 7.90,
    category: 'espressos',
    categoryLabel: 'Espresso & Co.',
    image: 'https://images.unsplash.com/photo-1510972527409-cef190317e0c?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 124,
    tags: ['Quente', 'Intenso', 'Sem Lactose'],
    customization: { hasMilk: false, hasSizes: true, hasExtras: true }
  },
  {
    id: '2',
    name: 'Cappuccino Italiano',
    description: 'A clássica sinfonia italiana: dose dupla de espresso, leite vaporizado delicadamente e uma leve e perfeita camada de espuma de leite.',
    price: 13.90,
    category: 'espressos',
    categoryLabel: 'Espresso & Co.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53f?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 98,
    tags: ['Quente', 'Cremoso', 'Contém Lactose'],
    customization: { hasMilk: true, hasSizes: true, hasExtras: true }
  },
  {
    id: '3',
    name: 'Latte Floquinho de Neve',
    description: 'Delicioso espresso premium com leite vaporizado cremoso e um sutil toque artesanal de coco ralado e chocolate branco.',
    price: 16.50,
    category: 'especiais',
    categoryLabel: 'Especiais do Barista',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 156,
    tags: ['Quente', 'Doce', 'Contém Lactose', 'Exclusivo'],
    customization: { hasMilk: true, hasSizes: true, hasExtras: true }
  },
  {
    id: '4',
    name: 'Cold Brew de Frutas Cítricas',
    description: 'Café extraído a frio por 18 horas, resultando em baixíssima acidez, combinado perfeitamente com suco fresco de laranja e gelo.',
    price: 15.00,
    category: 'gelados',
    categoryLabel: 'Bebidas Geladas',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 64,
    tags: ['Gelado', 'Frutado', 'Vegano', 'Refrescante'],
    customization: { hasMilk: false, hasSizes: false, hasExtras: true }
  },
  {
    id: '5',
    name: 'Iced Caramel Macchiato',
    description: 'Leite gelado, xarope de baunilha, gelo e uma dose de espresso fresco derramada por cima, finalizada com nossa calda artesanal de caramelo salgado.',
    price: 17.50,
    category: 'gelados',
    categoryLabel: 'Bebidas Geladas',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 112,
    tags: ['Gelado', 'Doce', 'Cremoso', 'Contém Lactose'],
    customization: { hasMilk: true, hasSizes: true, hasExtras: true }
  },
  {
    id: '7',
    name: 'Pão de Queijo Mineiro Gourmet',
    description: 'Receita tradicional usando blend de queijo canastra e meia cura. Casquinha crocante por fora e extrema maciez por dentro, servido quentinho.',
    price: 6.50,
    category: 'salgados',
    categoryLabel: 'Salgados & Lanches',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 231,
    tags: ['Quente', 'Crocante', 'Sem Glúten'],
    customization: { hasMilk: false, hasSizes: false, hasExtras: false }
  },
  {
    id: '8',
    name: 'Croissant Sabor Chocolate',
    description: 'Massa folhada incrivelmente crocante com manteiga francesa de alta qualidade, recheada generosamente com cremoso chocolate premium.',
    price: 14.90,
    category: 'doces',
    categoryLabel: 'Doces & Sobremesas',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 145,
    tags: ['Folhado', 'Doce', 'Crocante'],
    customization: { hasMilk: false, hasSizes: false, hasExtras: false }
  },
  {
    id: '11',
    name: 'Toast Rústico de Abacate e Ovo',
    description: 'Fatia de pão sourdough tostado, purê rústico de abacate temperado com limão, azeite extra virgem, pimenta calabresa e um ovo perfeitamente pochê.',
    price: 21.90,
    category: 'salgados',
    categoryLabel: 'Salgados & Lanches',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 167,
    tags: ['Salada', 'Nutritivo', 'Quente'],
    customization: { hasMilk: false, hasSizes: false, hasExtras: false }
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Paula Siqueira',
    rating: 5,
    comment: 'O Espresso Tradicional é de outro mundo! Os grãos são muito frescos e dá pra sentir as notas de chocolate. Peço pelo site e quando chego na mesa já está servido.',
    date: '2026-05-24',
    coffeeOrdered: 'Espresso Tradicional'
  },
  {
    id: 't2',
    name: 'Guilherme Mendes',
    rating: 5,
    comment: 'Sou fanático pelo Iced Caramel Macchiato e pelo Toast de Abacate. O sistema de pedidos online deles é incrivelmente rápido e elegante!',
    date: '2026-05-22',
    coffeeOrdered: 'Iced Caramel Macchiato'
  }
];

// ==========================================
// 3. COMPONENTE PRINCIPAL (App.tsx)
// ==========================================
export default function App() {
  // Lógica de Persistência Local
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('grao_devoto_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('grao_devoto_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [testimonials, setTestimonials] = useState<Feedback[]>(() => {
    try {
      const saved = localStorage.getItem('grao_devoto_testimonials');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    } catch { return INITIAL_TESTIMONIALS; }
  });

  // UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartBouncing, setCartBouncing] = useState(false);

  // Cardápio Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Customization Modal State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<CoffeeSize>('M');
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>('Integral');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [modalQty, setModalQty] = useState<number>(1);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Quiz State
  const [quizStep, setQuizStep] = useState<number>(0); // 0: Start, 1: Temp, 2: Leite, 3: Sabor, 4: Result
  const [quizAnswers, setQuizAnswers] = useState({ temperature: '', milk: '', flavor: '' });
  const [quizRecommendation, setQuizRecommendation] = useState<MenuItem | null>(null);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<number>(1); // 1: Rev, 2: Form, 3: Pix QR
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ type: 'ok' | 'err', text: string } | null>(null);

  // Checkout Form fields
  const [customerName, setCustomerName] = useState<string>('');
  const [orderType, setOrderType] = useState<'mesa' | 'retirada'>('mesa');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [cashChange, setCashChange] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Live Order Status Timeline Simulation
  const [simulatedStatus, setSimulatedStatus] = useState<'recebido' | 'preparando' | 'pronto'>('recebido');
  const [simulatedTime, setSimulatedTime] = useState<number>(300); // 5 min default

  // Feedback form state inside Section
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  // Post-order feedback state inside Modal
  const [postReviewRating, setPostReviewRating] = useState(5);
  const [postReviewComment, setPostReviewComment] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  // Calculate Cart Metrics
  const totalCartItems = cart.reduce((acc, cr) => acc + cr.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    let p = item.menuItem.price;
    if (item.size === 'M') p += 2.50;
    if (item.size === 'G') p += 4.50;
    if (item.milk === 'Leite de Aveia' || item.milk === 'Leite de Amêndoas') p += 3.50;
    if (item.milk === 'Zero Lactose') p += 1.50;

    item.extras.forEach(ext => {
      if (ext.includes('Shot')) p += 4.50;
      else if (ext.includes('Chantilly')) p += 3.00;
      else if (ext.includes('Baunilha') || ext.includes('Caramelo')) p += 3.50;
    });
    return acc + (p * item.quantity);
  }, 0);

  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // EFFECTS
  useEffect(() => {
    localStorage.setItem('grao_devoto_cart', JSON.stringify(cart));
    if (totalCartItems > 0) {
      setCartBouncing(true);
      const timer = setTimeout(() => setCartBouncing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cart, totalCartItems]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('grao_devoto_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('grao_devoto_active_order');
    }
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('grao_devoto_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const sections = ['hero', 'menu', 'quiz', 'testimonials'];
      const scrollPosition = window.scrollY + 250;
      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(sect);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timeline Order simulator effects
  useEffect(() => {
    if (!activeOrder) return;
    setSimulatedStatus('recebido');
    setSimulatedTime(activeOrder.estimatedMinutes * 60);

    const s1 = setTimeout(() => setSimulatedStatus('preparando'), 8000);
    const s2 = setTimeout(() => setSimulatedStatus('pronto'), 22000);

    const interval = setInterval(() => {
      setSimulatedTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearInterval(interval);
    };
  }, [activeOrder]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Add to cart logical workflow
  const handleAddToCart = (
    item: MenuItem,
    qty: number,
    size?: CoffeeSize,
    milk?: MilkOption,
    exts?: string[],
    notes?: string
  ) => {
    const extKey = exts ? [...exts].sort().join('-') : '';
    const cartId = `${item.id}-${size || ''}-${milk || ''}-${extKey}-${notes || ''}`;

    setCart(prev => {
      const match = prev.find(ci => ci.cartId === cartId);
      if (match) {
        return prev.map(ci => ci.cartId === cartId ? { ...ci, quantity: ci.quantity + qty } : ci);
      }
      return [...prev, { cartId, menuItem: item, quantity: qty, size, milk, extras: exts || [], notes }];
    });

    setShowToast(item.name);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setSelectedSize('M');
    setSelectedMilk(item.customization.hasMilk ? 'Integral' : 'Nenhum');
    setSelectedExtras([]);
    setCustomNotes('');
    setModalQty(1);
  };

  const handleConfirmCustomize = () => {
    if (!customizingItem) return;
    handleAddToCart(
      customizingItem,
      modalQty,
      customizingItem.customization.hasSizes ? selectedSize : undefined,
      customizingItem.customization.hasMilk ? selectedMilk : undefined,
      selectedExtras,
      customNotes.trim() || undefined
    );
    setCustomizingItem(null);
  };

  const handleCouponApply = () => {
    const cd = couponCode.trim().toUpperCase();
    if (cd === 'CAFE15') {
      setDiscountPercent(15);
      setCouponMsg({ type: 'ok', text: 'Excelente! Cupom CAFE15 aplicado: 15% Desconto' });
    } else if (cd === 'GRATA') {
      setDiscountPercent(10);
      setCouponMsg({ type: 'ok', text: 'Ótimo! Cupom GRATA aplicado: 10% Desconto' });
    } else {
      setCouponMsg({ type: 'err', text: 'Cupom inválido. Experimente "CAFE15"' });
    }
  };

  const handleOrderTypeSelector = (type: 'mesa' | 'retirada') => {
    setOrderType(type);
    setTableNumber('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    if (orderType === 'mesa' && !tableNumber.trim()) return;

    if (paymentMethod === 'pix' && checkoutStep !== 3) {
      setCheckoutStep(3); // Go to QR code scan view first
    } else {
      finalizeOrder();
    }
  };

  const finalizeOrder = () => {
    setIsSubmittingOrder(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        items: [...cart],
        subtotal,
        discount: discountAmount,
        total: grandTotal,
        customerName: customerName.trim(),
        orderType,
        tableNumber: orderType === 'mesa' ? tableNumber.trim() : undefined,
        paymentMethod,
        status: 'recebido',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: orderType === 'mesa' ? 6 : 10,
      };
      setActiveOrder(newOrder);
      setCart([]);
      setIsCartOpen(false);
      setCheckoutStep(1);
      setCouponCode('');
      setDiscountPercent(0);
      setCouponMsg(null);
      setCustomerName('');
      setTableNumber('');
      setIsSubmittingOrder(false);
    }, 1500);
  };

  // Quiz logic simulation
  const handleQuizAnswer = (quizKey: 'temperature' | 'milk' | 'flavor', value: string) => {
    const updated = { ...quizAnswers, [quizKey]: value };
    setQuizAnswers(updated);

    if (quizKey === 'temperature') setQuizStep(2);
    else if (quizKey === 'milk') setQuizStep(3);
    else if (quizKey === 'flavor') {
      // Barista recommendation matching engine
      let pool = [...MENU_ITEMS];
      if (updated.temperature === 'hot') pool = pool.filter(el => el.tags.includes('Quente'));
      else pool = pool.filter(el => el.tags.includes('Gelado'));

      if (updated.milk === 'yes') pool = pool.filter(el => el.customization.hasMilk || el.tags.includes('Cremoso'));
      else pool = pool.filter(el => !el.customization.hasMilk);

      if (updated.flavor === 'sweet') pool = pool.filter(el => el.tags.includes('Doce') || el.category === 'doces');
      else if (updated.flavor === 'intense') pool = pool.filter(el => el.tags.includes('Intenso') || el.category === 'espressos');

      const recommendation = pool[0] || (updated.temperature === 'hot' ? MENU_ITEMS[1] : MENU_ITEMS[3]);
      setQuizRecommendation(recommendation);
      setQuizStep(4);
    }
  };

  const handleAddQuizRecommended = () => {
    if (!quizRecommendation) return;
    handleAddToCart(quizRecommendation, 1);
    setIsCartOpen(true);
    setQuizStep(0);
    setQuizAnswers({ temperature: '', milk: '', flavor: '' });
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;

    const newFeedback: Feedback = {
      id: Math.random().toString(),
      name: revName.trim(),
      rating: revRating,
      comment: revComment.trim(),
      date: new Date().toISOString().split('T')[0],
      coffeeOrdered: 'Cappuccino Italiano'
    };

    setTestimonials(prev => [newFeedback, ...prev]);
    setRevSuccess(true);
    setRevName('');
    setRevComment('');
    setTimeout(() => {
      setRevSuccess(false);
      setShowFeedbackForm(false);
    }, 2000);
  };

  const handlePostReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postReviewComment.trim() || !activeOrder) return;

    const newFeedback: Feedback = {
      id: Math.random().toString(),
      name: activeOrder.customerName,
      rating: postReviewRating,
      comment: postReviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      coffeeOrdered: activeOrder.items[0]?.menuItem.name || 'Café Especial'
    };

    setTestimonials(prev => [newFeedback, ...prev]);
    setPostSuccess(true);
    setPostReviewComment('');
    setTimeout(() => {
      setPostSuccess(false);
      setActiveOrder(null);
    }, 2000);
  };

  // Cardápio filtration logical metrics
  const filteredMenuItems = MENU_ITEMS.filter(it => {
    const matchesCat = selectedCategory === 'all' || it.category === selectedCategory;
    const matchesSearch = it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          it.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || it.tags.includes(selectedTag);
    return matchesCat && matchesSearch && matchesTag;
  });

  return (
    <div className="bg-[#fdfaf7] text-stone-800 font-sans min-h-screen relative flex flex-col justify-between selection:bg-[#eddcd0] selection:text-coffee-950">
      
      {/* ==========================================
          0. ESTILOS DE ANIMAÇÃO CSS NATIVOS (Inline)
         ========================================== */}
      <style>{`
        @keyframes steam {
          0% { transform: translateY(35px) scale(0.9); opacity: 0; }
          40% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-70px) scale(1.3); opacity: 0; }
        }
        @keyframes beanFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        .steam-line-1 { animation: steam 4s infinite ease-in-out; }
        .steam-line-2 { animation: steam 3.5s infinite ease-in-out 1.2s; }
        .steam-line-3 { animation: steam 4.5s infinite ease-in-out 0.6s; }
        .bean-float-1 { animation: beanFloat 6s infinite ease-in-out; }
        .bean-float-2 { animation: beanFloat 8s infinite ease-in-out 1s; }
        .bean-float-3 { animation: beanFloat 7s infinite ease-in-out 2s; }
        .pulse-glowing { animation: pulseSoft 2.5s infinite ease-in-out; }
        .drawer-slide { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in-quick { animation: fadeIn 0.25s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ==========================================
          1. BARRA DE NAVEGAÇÃO FLUTUANTE (Navbar)
         ========================================== */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#291811]/90 backdrop-blur-md shadow-xl py-3 border-b border-[#492b1f]/40 text-stone-100'
          : 'bg-gradient-to-b from-[#291811]/70 to-transparent py-5 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleScrollTo('hero')}
              className="flex items-center space-x-2.5 group cursor-pointer text-left"
              id="nav-logo"
            >
              <div className="bg-[#935d43] group-hover:bg-[#a97559] text-white p-2.5 rounded-full transition-all duration-300 shadow-md group-hover:scale-105">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-xl tracking-tight block text-white group-hover:text-[#dbbeab] transition-colors">
                  Grão Devoto
                </span>
                <span className="text-[10px] tracking-wider uppercase font-mono block text-[#dbbeab]/80">
                  Cafeteira Online
                </span>
              </div>
            </button>

            {/* Links de navegação Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { title: 'Início', id: 'hero' },
                { title: 'Cardápio', id: 'menu' },
                { title: 'Simulador ideal', id: 'quiz' },
                { title: 'Opiniões', id: 'testimonials' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.id)}
                  className={`text-sm font-medium tracking-wide transition-all relative hover:text-white cursor-pointer ${
                    activeSection === link.id ? 'text-[#dbbeab] font-bold' : 'text-stone-200'
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {link.title}
                  {activeSection === link.id && (
                    <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#c2987e] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Botões do Carrinho e Menu de Celular */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-xs text-stone-200">
                <Clock className="w-3.5 h-3.5 text-[#dbbeab]" />
                <span>08:00 às 21:00</span>
              </div>

              {/* Botão carrinho interativo */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative bg-[#935d43] hover:bg-[#a97559] text-white p-2.5 rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
                  cartBouncing ? 'scale-110' : ''
                }`}
                id="navbar-cart-trigger"
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-[#291811] font-mono text-xs font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#291811] shadow-inner">
                    {totalCartItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-stone-200 hover:text-white transition-colors p-1"
                id="menu-mobile-nav"
              >
                <span className="font-bold text-lg">{isMobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Responsivo Celular */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#291811] border-b border-stone-800 py-3 px-4 space-y-2" id="mobile-menu-container">
            {['hero', 'menu', 'quiz', 'testimonials'].map((sectionId) => (
              <button
                key={sectionId}
                onClick={() => handleScrollTo(sectionId)}
                className="block w-full text-left py-2 px-3 text-stone-200 hover:bg-stone-850 hover:text-white text-sm rounded-xl transition-colors cursor-pointer"
              >
                {sectionId === 'hero' ? 'Início' : sectionId === 'menu' ? 'Cardápio' : sectionId === 'quiz' ? 'Simulador ideal' : 'Opiniões'}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ==========================================
          2. BANNER DE INTRDUÇÃO (Hero Section)
         ========================================== */}
      <section
        id="hero"
        className="relative min-h-screen bg-gradient-to-br from-[#291811] via-[#492b1f] to-[#291811] text-white flex items-center pt-24 pb-12 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none filter blur-3xl">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#c2987e] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600 rounded-full" />
        </div>

        {/* Grãos Flutuando decorativos em CSS */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
          <div className="absolute top-[22%] left-[8%] text-3xl opacity-50 bean-float-1">☕</div>
          <div className="absolute bottom-[23%] left-[16%] text-xl opacity-35 bean-float-2">🫘</div>
          <div className="absolute top-[32%] right-[11%] text-2xl opacity-45 bean-float-3">🫘</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Texto Descritivo */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-stone-800/80 border border-stone-700 rounded-full px-3.5 py-1 text-xs text-[#dbbeab] font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cafés Especiais & Extração Perfeita</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-[1.1] text-white">
                  O aroma de <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dbbeab] via-amber-400 to-[#c2987e]">
                    momentos únicos
                  </span> <br />
                  em cada xícara.
                </h1>

                <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-lg">
                  No <strong className="text-white">Grão Devoto</strong>, selecionamos grãos arábica premium de torra artesanal. Faça o pedido online e consuma na mesa sem filas ou retire quentinho no balcão!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleScrollTo('menu')}
                  className="px-6 py-3.5 bg-[#935d43] hover:bg-[#a97559] text-white rounded-full font-bold transition-all shadow-md flex items-center justify-center space-x-2 hover:scale-102 active:scale-95 cursor-pointer text-sm"
                  id="hero-book-btn"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Cardápio & Pedido Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleScrollTo('quiz')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-full font-medium transition-all flex items-center justify-center text-sm cursor-pointer"
                  id="hero-quiz-trigger"
                >
                  <span>Descobrir Café Ideal</span>
                </button>
              </div>

              {/* Badges de Destaques */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-800/60 max-w-md text-xs font-mono">
                <div>
                  <span className="block text-xl font-bold text-white font-serif">4.9 ★</span>
                  <span className="text-stone-400 block text-[10px]">Avaliação Local</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-white font-serif">18 Horas</span>
                  <span className="text-stone-400 block text-[10px]">Cold Brew Lento</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-white font-serif">Arábica</span>
                  <span className="text-stone-400 block text-[10px]">100% Fazenda</span>
                </div>
              </div>
            </div>

            {/* Copo Interativo com Partículas de Vapor via CSS */}
            <div className="lg:col-span-5 flex justify-center pb-6">
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
                
                {/* Linhas circulares de fundo */}
                <div className="absolute inset-0 border border-stone-800 rounded-full animate-spin [animation-duration:50s]" />
                <div className="absolute inset-8 border border-dashed border-stone-700/60 rounded-full animate-spin [animation-duration:25s] [animation-direction:reverse]" />

                {/* Copo de Café Principal Flutuando */}
                <div className="relative z-20 flex flex-col items-center translate-y-[-10px] sm:translate-y-0">
                  
                  {/* Linhas de fumaça geradas em puro CSS */}
                  <div className="absolute top-[-70px] w-20 h-16 flex justify-around pointer-events-none">
                    <div className="w-1.5 h-10 bg-gradient-to-t from-orange-200 to-transparent rounded-full opacity-60 filter blur-[1px] steam-line-1" />
                    <div className="w-1.5 h-12 bg-gradient-to-t from-orange-200 to-transparent rounded-full opacity-60 filter blur-[1px] steam-line-2" />
                    <div className="w-1.5 h-8 bg-gradient-to-t from-orange-250 to-transparent rounded-full opacity-60 filter blur-[1px] steam-line-3" />
                  </div>

                  {/* Renderização do Copo */}
                  <div className="w-44 h-40 relative">
                    <div className="w-full h-full bg-gradient-to-b from-[#a97559] via-[#935d43] to-[#492b1f] rounded-b-[50px] rounded-t-[5px] shadow-2xl border-t-4 border-stone-200 relative overflow-hidden">
                      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 text-white/20 flex flex-col items-center">
                        <Coffee className="w-8 h-8" />
                        <span className="text-[8px] uppercase tracking-widest font-mono mt-1 text-center font-bold">Devoto</span>
                      </div>
                      <div className="absolute top-0 right-3 w-4 h-full bg-white/5 skew-x-12" />
                    </div>
                    {/* Alça do copo */}
                    <div className="absolute top-[18%] right-[-24px] w-10 h-20 border-[10px] border-[#935d43] rounded-r-full shadow-md" />
                    {/* Sombra */}
                    <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-40 h-4 bg-black/40 rounded-full filter blur-md animate-pulse" />
                  </div>

                </div>

                <div className="absolute right-[5%] bottom-[15%] z-30 bg-[#291811]/90 border border-stone-850 p-3 rounded-2xl shadow-xl flex items-center space-x-2 backdrop-blur-sm">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                  <div className="text-left">
                    <span className="block text-[8px] text-[#dbbeab] uppercase font-mono tracking-wider">Mesa ou balcão</span>
                    <span className="block text-xs font-bold text-white">Pedidos Bombando 🔥</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          ATIVO MONITOR BANNER (Se houver pedido pendente)
         ========================================== */}
      {activeOrder && (
        <div className="max-w-7xl mx-auto px-4 mt-6 w-full text-left" id="order-active-banner">
          <div className="bg-amber-500 rounded-3xl p-6 shadow-xl border border-amber-400 text-[#291811] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-black/15 text-black px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase">
                Barista Preparando! ⏱️
              </span>
              <h3 className="font-serif font-bold text-lg">
                Olá {activeOrder.customerName}, o pedido #{activeOrder.id} está no forno/máquina!
              </h3>
              <p className="text-xs text-[#492b1f] font-light">
                O barista está moendo os grãos frescos e vaporizando seu leite. Clique para abrir seu painel de preparo.
              </p>
            </div>
            <button
              onClick={() => {
                // Force triggering state reset/revalidation
                const overlay = document.getElementById('order-live-progress-overlay');
                if (overlay) overlay.style.display = 'flex';
              }}
              className="px-5 py-2.5 bg-[#291811] hover:bg-black text-white rounded-full font-bold text-xs shadow transition-colors cursor-pointer"
            >
              Exibir Timeline de Preparo
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          3. CARDÁPIO COMPLETO COM FILTROS (Menu Section)
         ========================================== */}
      <section id="menu" className="py-20 bg-stone-50 text-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-sm font-semibold text-[#935d43] uppercase tracking-widest block mb-1 font-mono">Grãos Selecionados</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#291811]">Cardápio da Cafeteria</h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              Personalize o café com leite sem lactose, mude para copos maiores ou escolha xarope de caramelo e confeitos finos.
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/50 mb-8 space-y-4">
            
            {/* Categorias Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
              {[
                { id: 'all', label: 'Todos', emoji: '🍽️' },
                { id: 'espressos', label: 'Espresso & Co.', emoji: '☕' },
                { id: 'gelados', label: 'Gelados', emoji: '❄️' },
                { id: 'salgados', label: 'Salgados', emoji: '🥐' },
                { id: 'doces', label: 'Sobremesas', emoji: '🍰' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedTag(null); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id ? 'bg-[#291811] text-white shadow-md' : 'bg-stone-100 hover:bg-stone-200 text-stone-705'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-3 border-t border-stone-105">
              {/* Barra de Busca rápida */}
              <div className="md:col-span-6 relative">
                <input
                  type="text"
                  placeholder="Procura cappuccino, toast, pão de queijo, croissant...?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#fdfaf7] border border-stone-200 rounded-xl pl-4 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-[#935d43] focus:outline-none"
                />
              </div>

              {/* Filtros por Tags de Dieta ou Temperatura */}
              <div className="md:col-span-6 flex items-center space-x-1.5 overflow-x-auto justify-start md:justify-end py-1 scrollbar-hide">
                <span className="text-[10px] font-mono text-stone-400">Filtrar:</span>
                {['Quente', 'Gelado', 'Vegano', 'Crocante', 'Doces'].map(tg => (
                  <button
                    key={tg}
                    onClick={() => setSelectedTag(prev => prev === tg ? null : tg)}
                    className={`px-3 py-1 rounded-full text-[11px] border cursor-pointer transition-all ${
                      selectedTag === tg ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' : 'bg-stone-50 border-stone-200 font-medium'
                    }`}
                  >
                    {tg}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Grid de Itens do Cardápio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="menu-items-grid">
            {filteredMenuItems.map(item => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenCustomize(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-150 hover:border-[#eddcd0] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                  id={`card-item-${item.id}`}
                >
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />

                    {/* Like heart */}
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full border transition-all ${
                        isFav ? 'bg-red-50 text-red-500 border-red-200' : 'bg-black/25 text-white border-white/10'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Exclusivo Tag */}
                    {item.tags.includes('Exclusivo') && (
                      <span className="absolute top-2.5 left-2.5 bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wide">
                        ★ Exclusivo
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 bg-black/50 px-2 py-0.5 rounded text-[11px] text-white">
                      <span className="text-amber-400">★</span>
                      <span className="font-semibold">{item.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#935d43] uppercase tracking-wider block font-bold">{item.categoryLabel}</span>
                      <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#935d43] transition-colors">{item.name}</h3>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-sans min-h-[32px]">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-3">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">Preço</span>
                        <span className="font-sans font-extrabold text-base text-stone-900">
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                      <div className="bg-[#eddcd0] text-[#7a4b35] group-hover:bg-[#935d43] group-hover:text-white p-2 rounded-xl transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-200 max-w-sm mx-auto" id="no-filtered-results">
              <span className="text-3xl block">☕</span>
              <h4 className="font-bold text-stone-800 text-sm mt-2">Nenhum produto encontrado</h4>
              <p className="text-xs text-stone-500 mt-1 px-4">Tente remover filtros locais ou reajustar termos digitados.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedTag(null); }}
                className="mt-3 bg-[#935d43] text-white px-3 py-1.5 rounded-full text-[10px] uppercase font-bold"
              >
                Ver Cardápio Inteiro
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          4. MODAL DE PERSONALIZAÇÃO (Drink Customize Modal)
         ========================================== */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in-quick">
          <div onClick={() => setCustomizingItem(null)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          
          <div className="bg-white rounded-3xl shadow-2xl relative w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col z-10 text-left border">
            <button onClick={() => setCustomizingItem(null)} className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 overflow-y-auto flex-Grow space-y-4">
              <div className="flex gap-4 items-start">
                <img src={customizingItem.image} alt={customizingItem.name} className="w-24 h-20 object-cover rounded-xl shadow-inner shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <span className="text-[10px] font-mono text-[#935d43] uppercase tracking-wider block font-bold">{customizingItem.categoryLabel}</span>
                  <h3 className="text-xl font-bold font-serif text-stone-900">{customizingItem.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{customizingItem.description}</p>
                </div>
              </div>

              {/* Seção Custom - Tem tamanhos */}
              {customizingItem.customization.hasSizes && (
                <div className="space-y-1.5 border-t border-stone-100 pt-3">
                  <span className="text-xs font-bold text-stone-900 block">Tamanho da Bebida:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'P', label: 'Pequeno', detail: '150ml', add: 'Base' },
                      { id: 'M', label: 'Médio', detail: '300ml', add: '+R$ 2.50' },
                      { id: 'G', label: 'Grande', detail: '450ml', add: '+R$ 4.50' }
                    ].map(sz => (
                      <button
                        key={sz.id}
                        onClick={() => setSelectedSize(sz.id as CoffeeSize)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedSize === sz.id ? 'bg-[#fdfaf7] border-[#935d43] font-bold text-[#c2987e]' : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <span className="block text-xs">{sz.label}</span>
                        <span className="block text-[9px] text-stone-400 font-mono mt-0.5">{sz.detail} • {sz.add}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seção Custom - Tem Leite */}
              {customizingItem.customization.hasMilk && (
                <div className="space-y-1.5 border-t border-stone-105 pt-3">
                  <span className="text-xs font-bold text-stone-900 block">Escolha uma opção de Leite:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Integral', add: 'Incluso' },
                      { name: 'Zero Lactose', add: '+R$ 1.50' },
                      { name: 'Leite de Aveia', add: '+R$ 3.50' },
                      { name: 'Nenhum Leite', add: 'Incluso' }
                    ].map(milk => (
                      <button
                        key={milk.name}
                        onClick={() => setSelectedMilk(milk.name as MilkOption)}
                        className={`px-3 py-2 rounded-xl text-left border flex justify-between items-center text-xs cursor-pointer ${
                          selectedMilk === milk.name ? 'bg-[#fdfaf7] border-[#935d43] font-bold text-stone-900' : 'bg-white border-stone-200 text-stone-500'
                        }`}
                      >
                        <span>{milk.name}</span>
                        <span className="text-[10px] font-mono text-[#935d43]">{milk.add}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seção Custom - Tem Confeitos extras */}
              {customizingItem.customization.hasExtras && (
                <div className="space-y-1.5 border-t border-stone-100 pt-3">
                  <span className="text-xs font-bold text-stone-900 block">Deseja Extras Adicionais?</span>
                  <div className="grid grid-cols-2 gap-2">
                    {EXTRAS_OPTIONS.map(ext => {
                      const isSel = selectedExtras.includes(ext.name);
                      return (
                        <button
                          key={ext.id}
                          onClick={() => {
                            setSelectedExtras(prev => prev.includes(ext.name) ? prev.filter(e => e !== ext.name) : [...prev, ext.name]);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex justify-between items-center text-xs cursor-pointer ${
                            isSel ? 'bg-[#fdfaf7] border-[#935d43] font-bold' : 'bg-white border-stone-200'
                          }`}
                        >
                          <span>{ext.name}</span>
                          <span className="text-[10px] font-mono text-[#935d43]">+R$ {ext.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notas ao barista */}
              <div className="space-y-1 border-t border-stone-100 pt-3">
                <label htmlFor="notes-textarea" className="text-xs font-bold text-stone-900 block">Escreva uma nota para o barista:</label>
                <textarea
                  id="notes-textarea"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ex: sem açúcar, com bastante espuma, leite bem quente..."
                  rows={2}
                  className="w-full bg-[#fdfaf7] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-[#935d43] focus:outline-none"
                />
              </div>
            </div>

            {/* Controles de Quantidade e Preço Final */}
            <div className="bg-stone-50 p-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-stone-200/80 p-1 rounded-xl">
                <button onClick={() => setModalQty(prev => Math.max(1, prev - 1))} className="w-7 h-7 bg-white rounded-lg font-bold text-sm flex items-center justify-center">-</button>
                <span className="text-xs font-bold font-mono px-1">{modalQty}</span>
                <button onClick={() => setModalQty(prev => prev + 1)} className="w-7 h-7 bg-white rounded-lg font-bold text-sm flex items-center justify-center">+</button>
              </div>

              <button
                onClick={handleConfirmCustomize}
                className="px-5 py-2.5 bg-[#935d43] hover:bg-[#a97559] text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Confirmar no Carrinho</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          5. SIMULADOR INTREATIVE BARISTA QUIZ
         ========================================== */}
      <section id="quiz" className="py-20 bg-gradient-to-b from-stone-100 to-[#fdfaf7] relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <div className="mb-10">
            <span className="text-sm font-semibold text-[#935d43] uppercase tracking-widest block mb-1 font-mono">Barista Inteligente</span>
            <h2 className="text-3xl font-bold font-serif text-[#291811]">Ache seu Café Ideal</h2>
            <p className="mt-2 text-stone-600 max-w-md mx-auto text-sm sm:text-base">
              Responda a 3 perguntas simples e nosso barista virtual dirá qual a melhor recomendação para o seu paladar ou humor do dia!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border max-w-xl mx-auto min-h-[280px] flex flex-col justify-center">
            {quizStep === 0 && (
              <div className="space-y-5" id="quiz-intro">
                <div className="w-12 h-12 bg-[#fdfaf7] border border-stone-200.50 rounded-full flex items-center justify-center mx-auto text-[#935d43]">☕</div>
                <h3 className="text-lg font-bold text-stone-900">Como está o seu dia hoje?</h3>
                <p className="text-xs text-stone-500 font-light">Vamos combinar as suas preferências com o nosso estoque especial para dar o diagnóstico certeiro.</p>
                <button
                  onClick={() => setQuizStep(1)}
                  className="px-5 py-2.5 bg-[#291811] hover:bg-black text-white text-xs font-bold rounded-full transition-all tracking-wide cursor-pointer"
                >
                  Falar com o Barista Virtual →
                </button>
              </div>
            )}

            {quizStep === 1 && (
              <div className="space-y-4 text-left" id="quiz-temperature">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Pergunta 1 de 3</span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">Como prefere a temperatura da sua bebida hoje?</h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button onClick={() => handleQuizAnswer('temperature', 'hot')} className="p-4 rounded-xl border text-left bg-stone-50 hover:bg-[#fdfaf7] hover:border-[#935d43] transition-all cursor-pointer">
                    <span className="text-xl block">🔥</span>
                    <strong className="block text-xs font-serif text-stone-900 mt-1">Quente & Confortante</strong>
                  </button>
                  <button onClick={() => handleQuizAnswer('temperature', 'cold')} className="p-4 rounded-xl border text-left bg-stone-50 hover:bg-[#fdfaf7] hover:border-[#935d43] transition-all cursor-pointer">
                    <span className="text-xl block">❄️</span>
                    <strong className="block text-xs font-serif text-stone-900 mt-1">Sim, Gelado Extra</strong>
                  </button>
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="space-y-4 text-left" id="quiz-milk">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Pergunta 2 de 3</span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">Você gosta de cremosidade de leite vegetal ou integral?</h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button onClick={() => handleQuizAnswer('milk', 'yes')} className="p-4 rounded-xl border text-left bg-stone-50 hover:bg-[#fdfaf7] hover:border-[#935d43] transition-all cursor-pointer">
                    <span className="text-xl block">🥛</span>
                    <strong className="block text-xs text-stone-900 mt-1">Sim, adoro leite cremoso</strong>
                  </button>
                  <button onClick={() => handleQuizAnswer('milk', 'no')} className="p-4 rounded-xl border text-left bg-stone-50 hover:bg-[#fdfaf7] hover:border-[#935d43] transition-all cursor-pointer">
                    <span className="text-xl block">☕</span>
                    <strong className="block text-xs text-stone-900 mt-1">Quero Espresso Puro</strong>
                  </button>
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="space-y-4 text-left" id="quiz-flavor">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Pergunta 3 de 3</span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">Qual sabor que mais te atrai neste momento?</h3>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button onClick={() => handleQuizAnswer('flavor', 'sweet')} className="p-3 rounded-lg border text-left bg-stone-50 text-xs hover:border-[#935d43]" id="quiz-flavor-sweet">🍯 Doce & Calda</button>
                  <button onClick={() => handleQuizAnswer('flavor', 'intense')} className="p-3 rounded-lg border text-left bg-stone-50 text-xs hover:border-[#935d43]" id="quiz-flavor-strong">⚡ Forte / Intenso</button>
                  <button onClick={() => handleQuizAnswer('flavor', 'savory')} className="p-3 rounded-lg border text-left bg-stone-50 text-xs hover:border-[#935d43]" id="quiz-flavor-salty">🥐 Lanche Salgado</button>
                </div>
              </div>
            )}

            {quizStep === 4 && quizRecommendation && (
              <div className="space-y-4 text-center" id="quiz-recommendation-block">
                <span className="text-[10px] bg-amber-100 text-amber-850 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">Resultado do Barista!</span>
                
                <div className="flex gap-4 items-center bg-stone-50 p-4 rounded-xl border text-left">
                  <img src={quizRecommendation.image} alt={quizRecommendation.name} className="w-20 h-16 object-cover rounded-lg shadow-inner" referrerPolicy="no-referrer" />
                  <div className="space-y-0.5 flex-1">
                    <h4 className="font-serif font-bold text-stone-900 text-sm leading-tight">{quizRecommendation.name}</h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight">{quizRecommendation.description}</p>
                    <span className="block text-xs font-bold text-[#c2987e] pt-1">Base: R$ {quizRecommendation.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 justify-center shadow-inner">
                  <button onClick={handleAddQuizRecommended} className="px-4 py-2 bg-[#935d43] text-white text-xs font-bold rounded-full cursor-pointer">Pedir Esta Sugestão</button>
                  <button onClick={() => setQuizStep(0)} className="px-3 py-2 bg-stone-100 text-stone-600 text-xs rounded-full border cursor-pointer">Refazer Ajustes</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ==========================================
          6. SEÇÃO DE DEPOIMENTOS E AVALIAÇÃO DINÂMICA
         ========================================== */}
      <section id="testimonials" className="py-20 bg-stone-50/70 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 text-left">
            <div>
              <span className="text-sm font-semibold text-[#935d43] uppercase tracking-widest block mb-1 font-mono">Dedicado aos Clientes</span>
              <h2 className="text-3xl font-serif font-bold text-stone-900">O que falam de nós</h2>
              <p className="text-stone-550 text-xs sm:text-sm mt-1">Queremos saber sua opinião, publique depoimentos reais para nos ajudar!</p>
            </div>
            <button
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              className="px-5 py-2.5 bg-[#291811] hover:bg-black text-white text-xs font-semibold rounded-full border shadow cursor-pointer transition-colors"
            >
              {showFeedbackForm ? 'Fechar Avaliação' : 'Enviar Avaliação'}
            </button>
          </div>

          {/* Formulário para avaliar */}
          {showFeedbackForm && (
            <div className="bg-white rounded-3xl p-5 border shadow-md max-w-xl mx-auto mb-10 text-left fade-in-quick">
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <span className="text-xs font-bold text-stone-900 block font-serif">Como foi sua caneca de café?</span>
                
                <div className="grid grid-cols-2 gap-3 font-medium text-xs">
                  <div className="space-y-1">
                    <label htmlFor="reviewer-name-field" className="text-stone-600">Seu Nome:</label>
                    <input
                      id="reviewer-name-field"
                      type="text"
                      required
                      placeholder="Ex: Clara Lima"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full bg-[#fdfaf7] border border-stone-200 rounded-xl p-2 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-600 block">Dê sua Nota:</label>
                    <div className="flex space-x-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button key={st} type="button" onClick={() => setRevRating(st)}>
                          <Star className={`w-4 h-4 ${st <= revRating ? 'text-amber-500 fill-current' : 'text-stone-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="reviewer-comment-field" className="text-xs text-stone-600">Comentário descritivo:</label>
                  <textarea
                    id="reviewer-comment-field"
                    required
                    placeholder="O Cappuccino estava na temperatura ideal? A casca do croissant estava crocante?"
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    rows={2}
                    className="w-full bg-[#fdfaf7] border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:outline-none"
                  />
                </div>

                <button type="submit" className="bg-[#935d43] hover:bg-[#a97559] text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                  Publicar Depoimento
                </button>
                {revSuccess && <p className="text-green-650 text-[11px] font-bold font-mono">✔ Obrigado! Avaliação publicada com sucesso.</p>}
              </form>
            </div>
          )}

          {/* Cards de testemunhas em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="testimonials-view-list">
            {testimonials.map(review => (
              <div key={review.id} className="bg-white rounded-3xl p-5 shadow-sm border text-left flex flex-col justify-between" id={`review-card-${review.id}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-stone-50 p-2 rounded-xl">
                    <div className="flex space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-stone-150'}`} />
                      ))}
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center px-1.5 py-0.5 rounded font-mono font-bold">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> Devoto Verificado
                    </span>
                  </div>
                  <p className="text-xs text-stone-605 italic">"{review.comment}"</p>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3.5 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-[#eddcd0] text-[#7a4b35] font-serif font-semibold rounded-full flex items-center justify-center text-xs">
                      {review.name[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-900 leading-none">{review.name}</span>
                      <span className="block text-[9px] text-stone-400 font-mono mt-0.5">{review.date}</span>
                    </div>
                  </div>
                  {review.coffeeOrdered && (
                    <span className="text-[10px] bg-stone-50 border text-stone-600 px-2 py-0.5 rounded font-mono truncate">{review.coffeeOrdered}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          7. INFORMAÇÕES ADICIONAIS DE AMBIENTE (Salão)
         ========================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Foto e badge */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=700&auto=format&fit=crop"
                alt="Nosso salão decorado"
                className="rounded-3xl shadow shadow-neutral-100 border object-cover w-full h-[320px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent rounded-3xl" />
              <div className="absolute bottom-5 left-5 bg-white p-3 rounded-2xl shadow-md border max-w-xs text-left text-xs">
                <strong className="block text-stone-900">Trabalho & Tomadas</strong>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">Ambiente adaptado com Wi-Fi veloz e tomadas seguras em cada banquinho.</p>
              </div>
            </div>

            {/* Texto Descritivo */}
            <div className="space-y-4 text-left">
              <span className="text-sm font-semibold text-[#935d43] uppercase tracking-widest block font-mono">Experiência Real</span>
              <h2 className="text-3xl font-serif font-semibold text-stone-900 leading-tight">Um refúgio delicioso na Savassi</h2>
              <p className="text-stone-550 text-sm font-light">
                Trabalhamos com pequenos agricultores das fazendas mineiras. Além de beber no nosso espaço aconchegante, você pode pedir moagem na hora para levar para casa.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 pt-1 leading-normal font-medium">
                <div>✔ Espaço pet-friendly 🐾</div>
                <div>✔ Estacionamento grátis 🚙</div>
                <div>✔ Moagem na hora do grão 🫘</div>
                <div>✔ Opção sem glúten / lactose 🥐</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          8. RODAPÉ DE CONTATO E DIREITOS (Footer)
         ========================================== */}
      <footer className="bg-[#291811] text-stone-300 pt-12 pb-6 border-t border-[#492b1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-800">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="bg-[#935d43] p-2 rounded-full text-white"><Coffee className="w-4 h-4" /></div>
                <span className="font-serif font-bold text-xl text-white">Grão Devoto</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Espaço planejado meticulosamente para amantes do bom cappuccino e derivados saudáveis. Realize pedidos online e retire rápido no balcão express ou consuma confortavelmente.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <span className="block text-white font-mono uppercase text-xs font-bold">Atalhos rápidos</span>
              <div className="flex flex-col space-y-1.5 text-xs text-stone-400">
                <button onClick={() => handleScrollTo('hero')} className="hover:text-white text-left">Início</button>
                <button onClick={() => handleScrollTo('menu')} className="hover:text-white text-left">Cardápio On-line</button>
                <button onClick={() => handleScrollTo('quiz')} className="hover:text-white text-left">Barista Virtual</button>
                <button onClick={() => handleScrollTo('testimonials')} className="hover:text-white text-left">Opiniões de Clientes</button>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <span className="block text-white font-mono uppercase text-xs font-bold">Informações</span>
              <p className="flex items-center gap-1.5 text-stone-405"><MapPin className="w-3.5 h-3.5 text-[#dbbeab]" /> Savassi, Belo Horizonte - MG</p>
              <p className="flex items-center gap-1.5 text-stone-405"><Clock className="w-3.5 h-3.5 text-[#dbbeab]" /> Aberto todos os dias: das 08h às 21h</p>
              <p className="flex items-center gap-1.5 text-stone-405"><Phone className="w-3.5 h-3.5 text-[#dbbeab]" /> (31) 98765-4321</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-500 gap-2 text-center md:text-left">
            <span>© 2026 Grão Devoto Cafeteria. Todos os direitos reservados.</span>
            <span className="flex items-center gap-1">Desenvolvido com carinho, café fresquinho e tecnologia ☕</span>
            <button onClick={() => handleScrollTo('hero')} className="flex items-center gap-1 hover:text-white cursor-pointer select-none">
              <span>Topo</span> <ArrowUp className="w-3 h-3" />
            </button>
          </div>

        </div>
      </footer>

      {/* ==========================================
          9. DRAWER DO CARRINHO DE COMPRAS E CHECKOUT
         ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden fade-in-quick">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full drawer-slide text-left" id="cart-drawer-panel">
              
              <div className="px-5 py-4 bg-[#291811] text-white flex justify-between items-center border-b">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4.5 h-4.5 text-[#dbbeab]" />
                  <span className="font-serif font-bold text-base">Revisão do Pedido</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-300 hover:text-white p-1">
                  ✕
                </button>
              </div>

              {/* Corpo de Rolagem */}
              <div className="flex-grow overflow-y-auto p-5 space-y-5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3" id="cart-drawer-empty">
                    <span className="text-4xl block">🛍️</span>
                    <strong className="block text-stone-800 text-sm">Nenhum item adicionado</strong>
                    <p className="text-xs text-stone-450 px-4 leading-normal">Escolha lanches saborosos, espressos ou sobremesas em nosso cardápio.</p>
                    <button onClick={() => setIsCartOpen(false)} className="bg-[#935d43] text-white px-4 py-2 rounded-full text-xs font-semibold cursor-pointer">
                      Ver Cardápio
                    </button>
                  </div>
                ) : (
                  checkoutStep === 1 ? (
                    <div className="space-y-4" id="cart-step-review">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-stone-400 border-b pb-1.5">
                        <span>Produtos</span>
                        <button onClick={() => setCart([])} className="text-red-500 hover:text-red-700 flex items-center gap-0.5">
                          <Trash2 className="w-3 h-3" /> Esvaziar
                        </button>
                      </div>

                      {/* Lista de Itens no carrinho */}
                      <div className="space-y-3.5 divide-y divide-stone-100">
                        {cart.map(it => {
                          let p = it.menuItem.price;
                          if (it.size === 'M') p += 2.50;
                          if (it.size === 'G') p += 4.50;
                          if (it.milk === 'Leite de Aveia' || it.milk === 'Leite de Amêndoas') p += 3.50;
                          if (it.milk === 'Zero Lactose') p += 1.50;
                          return (
                            <div key={it.cartId} className="flex gap-3 pt-3 first:pt-0">
                              <img src={it.menuItem.image} alt={it.menuItem.name} className="w-14 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex-1 text-xs">
                                <div className="flex justify-between items-start font-bold">
                                  <span>{it.menuItem.name} {it.size ? `(${it.size})` : ''}</span>
                                  <button onClick={() => setCart(prev => prev.filter(c => c.cartId !== it.cartId))} className="text-stone-300 hover:text-red-550">✕</button>
                                </div>
                                <div className="text-[10px] text-stone-500 space-y-0.5 mt-0.5 font-mono">
                                  {it.milk && it.milk !== 'Nenhum' && <div>Leite: {it.milk}</div>}
                                  {it.extras.length > 0 && <div>Extras: {it.extras.join(', ')}</div>}
                                  {it.notes && <div className="text-amber-700 italic">" {it.notes} "</div>}
                                </div>
                                <div className="flex justify-between items-center pt-1 mt-1">
                                  <span className="font-extrabold text-stone-900">{(p * it.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  <div className="flex items-center space-x-1.5 bg-stone-150 p-0.5 rounded-lg">
                                    <button onClick={() => {
                                      if (it.quantity > 1) {
                                        setCart(prev => prev.map(c => c.cartId === it.cartId ? { ...c, quantity: c.quantity - 1 } : c));
                                      }
                                    }} className="w-4 h-4 bg-white rounded flex items-center justify-center font-bold font-mono">-</button>
                                    <span className="text-[10px] font-bold font-mono w-4 text-center">{it.quantity}</span>
                                    <button onClick={() => {
                                      setCart(prev => prev.map(c => c.cartId === it.cartId ? { ...c, quantity: c.quantity + 1 } : c));
                                    }} className="w-4 h-4 bg-white rounded flex items-center justify-center font-bold font-mono">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desconto con cupom cupom */}
                      <div className="pt-4 border-t border-stone-100 space-y-2">
                        <label htmlFor="coupon-drawer-input" className="text-xs font-bold text-stone-750 flex items-center gap-1 mt-0.5">
                          <Ticket className="w-3.5 h-3.5 text-[#935d43]" />
                          <span>Cupom de Desconto?</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="coupon-drawer-input"
                            type="text"
                            placeholder="Ex: CAFE15 ou GRATA"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 flex-grow uppercase font-semibold"
                          />
                          <button onClick={handleCouponApply} className="bg-stone-850 text-white rounded-lg px-3 py-1 text-xs font-bold cursor-pointer">Aplicar</button>
                        </div>
                        {couponMsg && (
                          <span className={`block text-[10px] font-mono font-medium ${couponMsg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
                            {couponMsg.text}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : checkoutStep === 2 ? (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4" id="checkout-form-block">
                      <div className="flex justify-between items-center border-b pb-2">
                        <button type="button" onClick={() => setCheckoutStep(1)} className="text-stone-500 text-xs flex items-center gap-0.5"><ArrowLeft className="w-3.5 h-3.5" /> Voltar</button>
                        <span className="text-xs font-mono text-stone-400">Dados de Atendimento</span>
                      </div>

                      {/* Nome do Cliente */}
                      <div className="space-y-1">
                        <label htmlFor="checkout-name" className="text-xs font-bold text-stone-800 block">Como gostaria de ser chamado?</label>
                        <input
                          id="checkout-name"
                          type="text"
                          required
                          placeholder="Quem vai saborear?"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#fdfaf7] border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold"
                        />
                      </div>

                      {/* Tipo de serviço Mesa ou no Balcao */}
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-stone-800 block">Tipo do Pedido:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => handleOrderTypeSelector('mesa')} className={`p-2.5 rounded-xl border text-center transition-all ${
                            orderType === 'mesa' ? 'bg-[#fdfaf7] border-[#935d43] font-bold text-[#c2987e]' : 'bg-white border-stone-200 text-stone-500'
                          }`}>Consumir na Mesa</button>
                          <button type="button" onClick={() => handleOrderTypeSelector('retirada')} className={`p-2.5 rounded-xl border text-center transition-all ${
                            orderType === 'retirada' ? 'bg-[#fdfaf7] border-[#935d43] font-bold text-[#c2987e]' : 'bg-white border-stone-200 text-stone-505'
                          }`}>Pegar no Balcão</button>
                        </div>
                      </div>

                      {orderType === 'mesa' && (
                        <div className="bg-[#fdfaf7] border rounded-xl p-3 space-y-1.5" id="table-selection">
                          <label htmlFor="mesa-number-checkout" className="text-xs font-bold text-stone-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Informe o número da sua Mesa (1 a 15):
                          </label>
                          <input
                            id="mesa-number-checkout"
                            type="number"
                            required={orderType === 'mesa'}
                            min={1}
                            max={15}
                            placeholder="Mesa n°"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="bg-white border text-center font-bold px-2.5 py-1.5 text-xs rounded w-24"
                          />
                        </div>
                      )}

                      {/* Forma de pagamento */}
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-stone-800 block">Selecione o Pagamento:</span>
                        <div className="grid grid-cols-3 gap-1.5 font-sans">
                          {[
                            { id: 'pix', label: 'Pix ⚡' },
                            { id: 'cartao', label: 'Cartão 💳' },
                            { id: 'dinheiro', label: 'Dinheiro 💵' }
                          ].map(pay => (
                            <button
                              key={pay.id}
                              type="button"
                              onClick={() => {
                                setPaymentMethod(pay.id as any);
                                setCashChange('');
                              }}
                              className={`p-2 rounded-lg border text-center text-xs transition-all ${
                                paymentMethod === pay.id ? 'bg-[#eddcd0] border-[#935d43] font-bold' : 'bg-white border-stone-200 text-stone-500'
                              }`}
                            >
                              {pay.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {paymentMethod === 'dinheiro' && (
                        <div className="space-y-1">
                          <label htmlFor="dinheiro-troco" className="text-xs text-stone-500">Troco para quanto?</label>
                          <input id="dinheiro-troco" type="text" placeholder="Ex: troco para R$50,00" value={cashChange} onChange={(e) => setCashChange(e.target.value)} className="w-full bg-[#fdfaf7] border border-stone-105 rounded px-2.5 py-1.5 text-xs" />
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="space-y-5 text-center" id="checkout-pix-step">
                      <div className="flex justify-between items-center border-b pb-2">
                        <button type="button" onClick={() => setCheckoutStep(2)} className="text-stone-550 text-xs flex items-center gap-0.5"><ArrowLeft className="w-3.5 h-3.5" /> Voltar</button>
                        <span className="text-xs font-mono text-stone-400">Pagamento PIX</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs text-stone-500 leading-normal max-w-xs mx-auto">Insira o Pix copiando o código abaixo ou escaneando pelo celular do banco para o barista receber imediato.</p>
                        
                        {/* Simulação QR design com inline pure CSS */}
                        <div className="w-36 h-36 border-4 border-[#291811] p-2 rounded-xl mx-auto bg-white relative">
                          <div className="w-full h-full bg-[radial-gradient(#291811_2px,transparent_2px)] [background-size:8s_8px] opacity-80" />
                          <div className="absolute inset-4 bg-white/95 rounded flex items-center justify-center font-mono text-[9px] font-bold flex-col text-[#935d43]">
                            <span>PIX INSTANTÂNEO</span>
                            <span className="animate-bounce mt-1">☕</span>
                          </div>
                        </div>

                        {/* Copy Code banner */}
                        <div className="flex justify-between items-center bg-stone-50 p-2 rounded-xl border text-xs gap-2">
                          <code className="text-[10px] font-mono select-all truncate max-w-[200px] text-stone-500">00020126360014br.gov.bcb.pix0114graodevoto2026cafe</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText("00020126360014br.gov.bcb.pix0114graodevoto2026cafe");
                              alert("Código Copiado! Adicione no App de Bancos. 🎉");
                            }}
                            className="bg-[#935d43] text-white px-2.5 py-1 rounded-md text-[10px] font-bold"
                          >
                            Copiar
                          </button>
                        </div>

                        <button
                          onClick={finalizeOrder}
                          disabled={isSubmittingOrder}
                          className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Já fiz o Pagamento Pix!</span>
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Botão de Rodapé do Drawer */}
              {cart.length > 0 && (
                <div className="bg-stone-50 p-5 border-t space-y-3.5">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between"><span>Subtotal:</span><strong>R$ {subtotal.toFixed(2)}</strong></div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-green-600 font-bold"><span>Desconto ({discountPercent}%):</span><span>- R$ {discountAmount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between text-stone-900 border-t border-stone-200 pt-2 text-base font-extrabold font-serif">
                      <span>Total Geral:</span><span>R$ {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutStep === 1 ? (
                    <button onClick={() => setCheckoutStep(2)} className="w-full py-3.5 bg-[#291811] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-full shadow flex items-center justify-center space-x-1">
                      <span>Ir Para Atendimento</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : checkoutStep === 2 ? (
                    <button
                      onClick={finalizeOrder}
                      disabled={isSubmittingOrder || !customerName.trim() || (orderType === 'mesa' && !tableNumber.trim())}
                      className="w-full py-3.5 bg-[#935d43] hover:bg-[#a97559] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow flex items-center justify-center space-x-2 disabled:bg-stone-300 disabled:pointer-events-none cursor-pointer"
                    >
                      {isSubmittingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Finalizar Pedido • R$ {grandTotal.toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          10. MONITOR DINÂMICO DE PREPARO (OrderProgress)
         ========================================== */}
      {activeOrder && (
        <div id="order-live-progress-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in-quick" style={{ display: 'flex' }}>
          <div onClick={() => setActiveOrder(null)} className="absolute inset-0 bg-[#291811]/70 backdrop-blur-md" />

          <div className="bg-white rounded-3xl shadow-2xl relative w-full max-w-md overflow-hidden z-10 border border-stone-200">
            
            <div className="bg-[#291811] text-white p-5 space-y-1 relative">
              <span className="bg-[#492b1f] px-2.5 py-0.5 rounded text-[10px] font-mono text-amber-300 font-bold uppercase block w-max">Ticket #{activeOrder.id}</span>
              <h3 className="text-xl font-bold font-serif">Seu Pedido Chegou!</h3>
              <p className="text-xs text-stone-300 leading-normal">Moagem dos grãos, infusão sob pressão e vaporização em tempo real.</p>
            </div>

            <div className="p-5 space-y-4 text-left">
              
              {/* Animacao e status */}
              <div className="bg-[#fdfaf7] rounded-2xl p-4 border flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#eddcd0] rounded-full flex items-center justify-center text-[#935d43] relative font-bold">
                  ☕
                  {simulatedStatus === 'preparando' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />}
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-mono uppercase tracking-widest">Barista Status</span>
                  <span className="text-sm font-extrabold text-[#291811]" id="status-live-tracking-badge">
                    {simulatedStatus === 'recebido' ? 'Pedido Recebido pelo caixa' : simulatedStatus === 'preparando' ? 'Moendo grãos arábica selecionados...' : activeOrder.orderType === 'mesa' ? `Prontinho! Café servido na Mesa ${activeOrder.tableNumber}!` : 'Pronto para Retirada no Balcão! 🎉'}
                  </span>
                </div>
              </div>

              {/* Minutos restante countdown */}
              <div className="flex items-center justify-between text-stone-700 bg-stone-50 p-3 rounded-xl border text-xs">
                <span className="flex items-center gap-1 font-semibold"><Clock className="w-4 h-4 text-[#935d43]" /> Cronômetro de Extração:</span>
                <span className="font-mono font-bold text-stone-900">
                  {simulatedTime > 0 ? `${Math.floor(simulatedTime / 60)}:${(simulatedTime % 60) < 10 ? '0' : ''}${simulatedTime % 60} min` : 'Quentinho pronto! 😍'}
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border">
                  <div className="h-full bg-gradient-to-r from-[#935d43] to-amber-500 transition-all duration-1000" style={{ width: simulatedStatus === 'recebido' ? '25%' : simulatedStatus === 'preparando' ? '65%' : '100%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span className={simulatedStatus === 'recebido' ? 'font-bold text-[#c2987e]' : ''}>1. Caixa</span>
                  <span className={simulatedStatus === 'preparando' ? 'font-bold text-[#c2987e]' : ''}>2. Extraindo</span>
                  <span className={simulatedStatus === 'pronto' ? 'font-bold text-emerald-600' : ''}>3. Servido</span>
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border text-xs text-stone-605 space-y-1 font-medium leading-relaxed">
                <div className="flex justify-between"><span>Cliente:</span><strong>{activeOrder.customerName}</strong></div>
                <div className="flex justify-between"><span>Entrega:</span><strong className="capitalize">{activeOrder.orderType === 'mesa' ? `Mesa n° ${activeOrder.tableNumber}` : 'Retirada Express'}</strong></div>
                <div className="flex justify-between"><span>Pagamento via:</span><strong className="uppercase">{activeOrder.paymentMethod}</strong></div>
              </div>

              {/* Avaliação opcional do barista após conclusão */}
              {simulatedStatus === 'pronto' && (
                <div className="pt-3 border-t border-dashed space-y-3" id="post-order-review-form">
                  <p className="text-xs font-bold font-serif text-stone-900 text-center">Gostou da velocidade do Barista? Deixe sua nota para o salão:</p>
                  <form onSubmit={handlePostReviewSubmit} className="space-y-2 bg-[#fdfaf7] border rounded-xl p-3">
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button key={st} type="button" onClick={() => setPostReviewRating(st)}>
                          <Star className={`w-5 h-5 ${st <= postReviewRating ? 'text-amber-500 fill-current' : 'text-stone-200'}`} />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Espuma impecável! Gostei do pão de queijo..."
                      value={postReviewComment}
                      onChange={(e) => setPostReviewComment(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs focus:ring-1 focus:outline-none"
                    />
                    <button type="submit" className="w-full bg-[#291811] text-white text-xs py-1.5 rounded-lg font-bold cursor-pointer">Enviar Avaliação do Balcão</button>
                    {postSuccess && <p className="text-emerald-700 text-[10px] font-mono text-center">★ Obrigado! Nota enviada com êxito.</p>}
                  </form>
                </div>
              )}

            </div>

            <div className="p-4 bg-stone-50 border-t flex justify-end">
              <button onClick={() => setActiveOrder(null)} className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-701 rounded-full text-xs font-semibold cursor-pointer">Fechar Visualização</button>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO FLUTUANTE TOAST */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-55 bg-[#291811] px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-[#492b1f] fade-in-quick" id="floater-toast">
          <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
          <div className="text-left">
            <strong className="block text-white text-xs leading-none">{showToast}</strong>
            <span className="text-[10px] text-stone-300">Foi adicionado com sucesso ao seu pedido! 🛍️</span>
          </div>
        </div>
      )}

    </div>
  );
}
