import React, { useState, useEffect } from 'react';
import { 
  Tractor, BookOpen, Leaf, Sprout, Fish, Phone, 
  CheckCircle2, CreditCard, Send, HeartHandshake, MapPin, 
  Mail, MessageCircle, FileSpreadsheet, Building, Milk,
  Settings, Edit3, Save, X, ArrowLeft, Download, AlertCircle, ListOrdered, CheckCircle, Package, Plus, Trash2, FileText, Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

const defaultProducts = [
  { id: 1, name: 'ব্রয়লার মুরগি পালন এ-টু-জেড', price: 199, image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'লেয়ার মুরগি ও ডিম উৎপাদন', price: 249, image: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'ছাগল পালন ব্যবসা গাইড', price: 299, image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'গরু মোটাতাজাকরণ বিজনেস প্ল্যান', price: 399, image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'ডেইরি খামার স্টার্টআপ গাইড', price: 499, image: 'https://images.unsplash.com/photo-1511117833845-4df3303d7db2?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'মৎস্য চাষ পূর্ণাঙ্গ গাইড', price: 299, image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80' },
  { id: 7, name: 'হাঁস পালন ব্যবসা গাইড', price: 199, image: 'https://images.unsplash.com/photo-1555627196-1faeabe3a918?auto=format&fit=crop&w=400&q=80' },
  { id: 8, name: 'খামারের আয়-ব্যয় এক্সেল শিট', price: 149, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80' },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'status' | 'tracking'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('khamar_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('khamar_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'khamar_orders') {
        setOrders(JSON.parse(e.newValue || '[]'));
      }
      if (e.key === 'khamar_products') {
        setProducts(JSON.parse(e.newValue || '[]'));
      }
    };
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorage);
    }
  }, []);

  const updateProducts = (newProducts: any[]) => {
    try {
      localStorage.setItem('khamar_products', JSON.stringify(newProducts));
      setProducts(newProducts);
      return { success: true };
    } catch (error: any) {
      console.error('Storage error:', error);
      return { success: false, error: 'ফাইল সাইজ অনেক বড়। দয়া করে ছোট সাইজের ছবি বা PDF আপলোড করুন।' };
    }
  };

  const updateOrders = (newOrders: any[]) => {
    setOrders(newOrders);
    localStorage.setItem('khamar_orders', JSON.stringify(newOrders));
  };

  const handleBuy = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleSubmitOrder = (orderData: any) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      date: new Date().toISOString()
    };
    const newOrders = [newOrder, ...orders];
    updateOrders(newOrders);
    setCurrentOrderId(newOrder.id);
    setCurrentView('status');
    window.scrollTo(0, 0);
  };

  if (currentPath === '/admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
    }
    return <AdminDashboard products={products} setProducts={updateProducts} orders={orders} setOrders={updateOrders} onLogout={() => setIsAdminAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-earth-50 font-sans">
      <Navbar onHome={() => setCurrentView('home')} onTrack={() => {
        setCurrentView('tracking');
        window.scrollTo(0, 0);
      }} />
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <AboutUs />
            <Services />
            <SampleTopics />
            <Products products={products} onBuy={handleBuy} />
            <WhyChooseUs />
          </>
        )}
        {currentView === 'checkout' && selectedProduct && (
          <CheckoutPage 
            product={selectedProduct} 
            onCancel={() => setCurrentView('home')}
            onSubmit={handleSubmitOrder}
          />
        )}
        {currentView === 'status' && currentOrderId && (
          <OrderStatusPage 
            orderId={currentOrderId} 
            orders={orders}
            products={products}
            onBack={() => setCurrentView('home')}
          />
        )}
        {currentView === 'tracking' && (
          <TrackingPage orders={orders} products={products} onBack={() => setCurrentView('home')} />
        )}
      </main>
      <Footer />
    </div>
  );
}

function Navbar({ onHome, onTrack }: { onHome: () => void, onTrack: () => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
            <Sprout className="w-8 h-8 text-brand-600" />
            <span className="font-serif font-bold text-xl text-earth-900 tracking-tight">
              খামার উদ্যোক্তা গাইড
            </span>
          </div>
          <div className="hidden md:flex flex-1 justify-end items-center space-x-8">
            <a href="#about" onClick={onHome} className="text-sm font-medium text-earth-800 hover:text-brand-600 transition-colors">আমাদের সম্পর্কে</a>
            <a href="#services" onClick={onHome} className="text-sm font-medium text-earth-800 hover:text-brand-600 transition-colors">সেবাসমূহ</a>
            <a href="#products" onClick={onHome} className="text-sm font-medium text-earth-800 hover:text-brand-600 transition-colors">ই-বুকসমূহ</a>
            <button onClick={onTrack} className="text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors">অর্ডার চেক করুন</button>
            <a href="#products" onClick={onHome} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors">
              অর্ডার করুন
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white py-24 sm:py-32">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/50 text-brand-100 text-sm font-medium mb-8 border border-brand-700/50">
            <Leaf className="w-4 h-4" />
            বাংলাদেশের জন্য ডিজিটাল খামার গাইডলাইন
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl sm:text-7xl font-serif font-bold tracking-tight text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          আপনার খামার ব্যবসা<br />
          <span className="text-brand-500 italic">আজই শুরু করুন</span>
        </motion.h1>
        
        <motion.p 
          className="max-w-2xl text-xl text-brand-50 mb-10 leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          নতুন উদ্যোক্তাদের জন্য সহজ বাংলায় গাইডলাইন, লাভ-ক্ষতির হিসাব এবং ধাপে ধাপে খামার ব্যবসা কৌশল।
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#products" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand-900 bg-brand-500 hover:bg-brand-400 rounded-full transition-colors">
            ই-বুক দেখুন
          </a>
          <a href="https://wa.me/8801919892751?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%96%E0%A6%BE%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%89%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A7%8B%E0%A6%95%E0%A7%8D%E0%A6%A4%E0%A6%BE%20%E0%A6%97%E0%A6%BE%E0%A6%87%E0%A6%A1%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%87-%E0%A6%AC%E0%A7%81%E0%A6%95%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-brand-700 hover:bg-brand-800 rounded-full transition-colors">
            <MessageCircle className="w-5 h-5 mr-2" />
            হোয়াটসঅ্যাপ পরামর্শ
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function AboutUs() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-earth-900 mb-6 relative inline-block">
              আমাদের সম্পর্কে
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-brand-500 -mb-2 rounded-full"></span>
            </h2>
            <p className="text-lg text-earth-800 mb-6 leading-relaxed">
              <strong>খামার উদ্যোক্তা গাইড</strong> হলো বাংলাদেশের নতুন খামারি, গ্রামীণ উদ্যোক্তা, শিক্ষার্থী ও ক্ষুদ্র ব্যবসায়ীদের জন্য একটি ডিজিটাল খামার গাইডলাইন প্ল্যাটফর্ম।
            </p>
            <p className="text-lg text-earth-800 leading-relaxed">
              আমাদের মূল লক্ষ্য হলো সহজ বাংলা ই-বুক, লাভ-ক্ষতির হিসাব, ব্যবস্থাপনা টিপস ও রোগপ্রতিরোধ গাইডের মাধ্যমে লাভজনক খামার ব্যবসা শুরু করতে সহায়তা করা।
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-earth-50 p-6 rounded-2xl flex flex-col gap-3 border border-earth-100">
              <Tractor className="w-8 h-8 text-brand-600" />
              <h3 className="font-semibold text-earth-900">কৃষি সর্বদা প্রথমে</h3>
              <p className="text-sm text-earth-800">বাংলাদেশের স্থানীয় খামার-ভিত্তিক ব্যবসার ওপর ফোকাস।</p>
            </div>
            <div className="bg-brand-50 p-6 rounded-2xl flex flex-col gap-3 mt-8 border border-brand-100">
              <BookOpen className="w-8 h-8 text-brand-600" />
              <h3 className="font-semibold text-earth-900">সহজ বাংলা</h3>
              <p className="text-sm text-earth-800">নতুনদের জন্য সহজ বাংলায় লেখা রিসোর্স।</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const services = [
  { icon: Leaf, title: 'হাঁস-মুরগি গাইড' },
  { icon: Sprout, title: 'ছাগল পালন ব্যবসা' },
  { icon: Building, title: 'গরু মোটাতাজাকরণ' },
  { icon: Milk, title: 'ডেইরি খামার প্ল্যান' },
  { icon: Fish, title: 'মৎস্য চাষ গাইড' },
  { icon: FileSpreadsheet, title: 'লাভ-ক্ষতি হিসাব' },
  { icon: HeartHandshake, title: 'রোগ ও খাদ্য ব্যবস্থাপনা' },
  { icon: MessageCircle, title: 'হোয়াটসঅ্যাপ পরামর্শ' },
];

function Services() {
  return (
    <section id="services" className="py-24 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">আমাদের সেবাসমূহ</h2>
          <p className="text-lg text-earth-800">বাংলাদেশের প্রধান গবাদি পশু ও খামারের ওপর বিস্তারিত দিকনির্দেশনা।</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:border-brand-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-earth-900">{service.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const sampleTopics = [
  {
    title: 'ব্রয়লার মুরগি পালন',
    topics: ['Farm house setup', 'Chick selection', 'Feed chart', 'Vaccine schedule', 'Disease control', 'Profit calculation', 'Selling strategy']
  },
  {
    title: 'ছাগল পালন ব্যবসা',
    topics: ['Breed selection', 'Housing system', 'Food management', 'Disease prevention', 'Breeding plan', 'Monthly cost calculation', 'Profit plan']
  },
  {
    title: 'গরু মোটাতাজাকরণ',
    topics: ['Cow selection', 'Fattening feed formula', 'Care routine', 'Medicine and vaccine', 'Eid market selling strategy', 'Investment planning']
  }
];

function SampleTopics() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">ই-বুকের ভেতরে যা থাকছে</h2>
          <p className="text-lg text-earth-800">আমাদের বিস্তারিত খামার গাইডে কভার করা বিষয়গুলোর এক ঝলক।</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {sampleTopics.map((category, idx) => (
            <div key={idx} className="bg-earth-50 rounded-2xl p-8 border border-earth-100">
              <h3 className="text-xl font-serif font-semibold text-brand-800 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.topics.map((topic, i) => (
                  <li key={i} className="flex items-start text-earth-800">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products({ products, onBuy }: { products: any[], onBuy: (p: any) => void }) {
  return (
    <section id="products" className="py-24 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">ই-বুকসমূহ</h2>
            <p className="text-lg text-earth-800">হোয়াটসঅ্যাপ বা ইমেইলের মাধ্যমে তাৎক্ষণিক PDF ফাইল পৌঁছে দেওয়া হবে।</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-earth-100 flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative h-56 w-full mb-4">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl shadow-sm border border-earth-100" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-earth-100 border border-earth-200 flex flex-col items-center justify-center text-earth-400 gap-2">
                    <FileText className="w-8 h-8 opacity-50" />
                    <span className="text-xs font-medium">No Cover</span>
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-3 right-3 bg-earth-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-sm">
                    {product.category}
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-brand-700 shadow-sm flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  PDF গাইড
                </div>
              </div>
              <div className="flex flex-col flex-grow px-2 pb-2">
                <h3 className="font-semibold text-earth-900 mb-1 leading-snug">{product.name}</h3>
                {product.shortDesc && (
                  <p className="text-sm text-earth-600 mb-3 line-clamp-2">{product.shortDesc}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-earth-100">
                   <span className="text-2xl font-bold text-brand-600">৳{product.price}</span>
                   <button onClick={() => onBuy(product)} className="text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer">
                     এখনই কিনুন <Send className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const reasons = [
    "সহজ বাংলায় খামার গাইড",
    "নতুনদের জন্য সহজ ব্যাখ্যা",
    "স্বল্প বাজেটের ব্যবসা আইডিয়া",
    "লাভ-ক্ষতির হিসাব অন্তর্ভুক্ত",
    "হোয়াটসঅ্যাপ বা ইমেইলে PDF ডেলিভারি",
    "বাংলাদেশের বাজারের জন্য উপযুক্ত",
    "প্র্যাক্টিক্যাল খামার ব্যবসা প্ল্যানিং",
    "নতুন উদ্যোক্তাদের জন্য সাপোর্ট"
  ];
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
             <h2 className="text-3xl font-serif font-bold text-earth-900 mb-6">কেন আমাদের বেছে নিবেন?</h2>
             <p className="text-lg text-earth-800 mb-8">আমরা বাংলাদেশের খামার বাস্তবতার ওপর ভিত্তি করে কার্যকরী পরামর্শ প্রদান করি। কোনো অবাস্তব কথা নয়, শুধু প্র্যাক্টিক্যাল গাইডলাইন যা আপনাকে সফল করতে সাহায্য করবে।</p>
             <div className="grid sm:grid-cols-2 gap-4">
                {reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                    <span className="font-medium text-earth-800 text-sm leading-snug">{r}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="relative border border-earth-100 bg-earth-50 rounded-3xl p-8 sm:p-12">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-100 rounded-full blur-2xl opacity-50"></div>
            <h3 className="text-xl font-bold font-serif mb-6 text-brand-900">আজই শুরু করুন</h3>
            <p className="text-earth-800 italic mb-8 border-l-4 border-brand-500 pl-6 py-2 bg-white rounded-r-lg shadow-sm font-serif text-lg leading-relaxed">
              "একটি সফল খামার ব্যবসার জন্য সঠিক পরিকল্পনা, টিকাদান শিডিউল এবং সঠিক খরচের হিসেব অনেক গুরুত্বপূর্ণ।"
            </p>
            <div className="flex gap-4 items-center">
               <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-earth-200 flex items-center justify-center text-xs font-bold text-earth-600 shadow-sm z-10" style={{ zIndex: 10 - i }}>
                      ✓
                    </div>
                  ))}
               </div>
               <div className="text-sm flex flex-col justify-center font-medium text-earth-800">
                  <span className="text-brand-600 font-bold block">১,০০০+</span>
                  সফল উদ্যোক্তা
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutPage({ product, onCancel, onSubmit }: { product: any, onCancel: () => void, onSubmit: (data: any) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'bKash'|'Nagad'|'Rocket'>('bKash');
  const [trxId, setTrxId] = useState('');

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !trxId) return;
    onSubmit({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      productId: product.id,
      productName: product.name,
      price: product.price,
      paymentMethod: method,
      transactionId: trxId,
    });
  };

  return (
    <section className="py-16 bg-earth-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onCancel} className="flex items-center text-earth-600 hover:text-brand-600 mb-8 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> ই-বুক পেজে ফিরে যান
        </button>

        <div className="bg-white rounded-3xl border border-earth-200 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-brand-900 p-8 text-white flex flex-col justify-center">
              <h3 className="text-brand-100 font-medium text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> নির্বাচিত ই-বুক
              </h3>
              <div className="mb-6 rounded-xl overflow-hidden border border-brand-800 bg-brand-800/50 p-2 shadow-lg h-48 sm:h-auto">
                <img src={product.image} alt={product.name} className="w-full h-full sm:h-48 object-cover rounded-lg" />
              </div>
              <h4 className="font-serif text-xl font-bold mb-2">{product.name}</h4>
              <p className="text-brand-300 font-medium mb-8">PDF গাইড</p>
              <div className="mt-auto">
                <span className="text-sm font-medium text-brand-300 mb-1 block">মোট মূল্য</span>
                <span className="text-4xl font-bold text-white">৳{product.price}</span>
              </div>
            </div>

            <div className="md:col-span-3 p-8">
               <h3 className="text-2xl font-serif font-bold text-earth-900 mb-6">অর্ডার ফর্ম</h3>
               <form onSubmit={submitForm} className="space-y-6">
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold text-earth-800 mb-1">আপনার নাম</label>
                     <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow" placeholder="নাম লিখুন" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-earth-800 mb-1">মোবাইল নাম্বার</label>
                       <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow" placeholder="017XX..." />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-earth-800 mb-1">ইমেইল বা হোয়াটসঅ্যাপ নাম্বার</label>
                       <input required type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow" placeholder="mail@example.com" />
                     </div>
                   </div>
                 </div>

                 <div className="border-t border-earth-200 pt-6">
                   <label className="block text-sm font-semibold text-earth-900 mb-3">পেমেন্ট মাধ্যম</label>
                   <div className="grid grid-cols-3 gap-3 mb-6">
                     {['bKash', 'Nagad', 'Rocket'].map(m => (
                       <button
                         key={m}
                         type="button"
                         onClick={() => setMethod(m as any)}
                         className={`py-3 px-2 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center justify-center gap-1
                           ${method === m ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-earth-200 bg-white text-earth-600 hover:bg-earth-50'}`}
                       >
                         {m}
                       </button>
                     ))}
                   </div>

                   <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-6 text-sm">
                     <p className="font-semibold text-brand-900 mb-2">পেমেন্ট করার নিয়ম:</p>
                     <p className="text-earth-800 mb-1 text-base">আপনার পছন্দের ই-বুকের মূল্য নিচের নাম্বারে Send Money করুন।</p>
                     <p className="text-earth-800 mb-1 text-base">{method} Send Money: <span className="font-bold text-brand-700 text-lg ml-1">{method === 'Nagad' ? '01911255263' : '01911401793'}</span></p>
                     <p className="text-red-600 font-bold mt-3 mb-1">অবশ্যই Send Money করবেন। Cash Out করবেন না।</p>
                     <p className="text-earth-700 text-xs">পেমেন্ট করার পর Transaction ID লিখে অর্ডার সাবমিট করুন। আপনার পেমেন্ট যাচাই হওয়ার পর PDF ডাউনলোড বাটন চালু হবে।</p>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-earth-800 mb-1">ট্রানজেকশন আইডি</label>
                     <input required type="text" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors uppercase placeholder:normal-case font-mono" placeholder="TrxID লিখুন" />
                   </div>
                 </div>

                 <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-md shadow-brand-600/20 flex items-center justify-center gap-2">
                   <CheckCircle className="w-5 h-5" /> অর্ডার সাবমিট করুন
                 </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrackingPage({ orders, products, onBack }: { orders: any[], products: any[], onBack: () => void }) {
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => 
      o.customerPhone === phone && 
      o.transactionId && 
      o.transactionId.toLowerCase() === trxId.toLowerCase()
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleDownload = (product: any) => {
    const link = product?.pdfLink || product?.pdfUrl;
    if (link) {
      window.open(link, '_blank');
    } else {
      alert("দুঃখিত, এই ই-বুকের PDF লিংক পাওয়া যায়নি। অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।");
    }
  };

  return (
    <section className="py-24 bg-earth-50 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-earth-200 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
             <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
               <Package className="w-8 h-8" />
             </div>
             <h2 className="text-3xl font-serif font-bold text-earth-900 mb-2">অর্ডার ট্র্যাকিং</h2>
             <p className="text-earth-600">আপনার মোবাইল নাম্বার ও ট্রানজেকশন আইডি দিয়ে অর্ডারের অবস্থা জানুন।</p>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4 mb-8">
             <div>
               <label className="block text-sm font-semibold text-earth-800 mb-1">মোবাইল নাম্বার</label>
               <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:outline-none focus:border-brand-500" placeholder="017XXXXXXX" />
             </div>
             <div>
               <label className="block text-sm font-semibold text-earth-800 mb-1">ট্রানজেকশন আইডি</label>
               <input required type="text" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:outline-none focus:border-brand-500 uppercase" placeholder="TrxID" />
             </div>
             <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors mt-2">অর্ডার দেখুন</button>
          </form>

          {hasSearched && (
            <div className="border-t border-earth-100 pt-8">
               {searchedOrder ? (() => {
                 const product = products.find(p => p.id === searchedOrder.productId);
                 return (
                   <div className="bg-earth-50 border border-earth-100 rounded-2xl p-6 text-center">
                     <div className="mb-4">
                        <span className="text-xs font-bold bg-earth-200 text-earth-700 px-2 py-1 rounded">Transaction: {searchedOrder.transactionId}</span>
                     </div>
                     <h3 className="font-bold text-lg text-earth-900 mb-1">{searchedOrder.productName}</h3>
                     <p className="text-earth-600 font-medium mb-4">মূল্য: ৳{searchedOrder.price} • {searchedOrder.paymentMethod}</p>
                     
                     <div className="bg-white rounded-xl p-4 mb-6 border border-earth-100 text-left">
                        {searchedOrder.status === 'pending' && (
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                               <p className="font-bold text-amber-700">পেমেন্ট যাচাই হচ্ছে</p>
                               <p className="text-sm text-earth-600 mt-1">আপনার পেমেন্ট যাচাই করা হচ্ছে। অনুমোদন হলে PDF ডাউনলোড করতে পারবেন।</p>
                            </div>
                          </div>
                        )}
                        {searchedOrder.status === 'approved' && (
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                               <p className="font-bold text-green-700">অর্ডার অনুমোদিত</p>
                               <p className="text-sm text-earth-600 mt-1">আপনার অর্ডার অনুমোদিত হয়েছে। এখন PDF ডাউনলোড করুন।</p>
                            </div>
                          </div>
                        )}
                        {searchedOrder.status === 'rejected' && (
                          <div className="flex items-start gap-3">
                            <X className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                               <p className="font-bold text-red-700">পেমেন্ট বাতিল হয়েছে</p>
                               <p className="text-sm text-earth-600 mt-1">আপনার পেমেন্ট তথ্য সঠিক নয়। আবার যোগাযোগ করুন।</p>
                            </div>
                          </div>
                        )}
                     </div>

                     {searchedOrder.status === 'approved' && (
                       <button onClick={() => handleDownload(product)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                         <Download className="w-5 h-5" /> PDF ডাউনলোড করুন
                       </button>
                     )}
                   </div>
                 );
               })() : (
                 <div className="text-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                   এই তথ্য দিয়ে কোনো অর্ডার পাওয়া যায়নি। মোবাইল নাম্বার ও ট্রানজেকশন আইডি সঠিকভাবে লিখুন।
                 </div>
               )}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button onClick={onBack} className="text-earth-600 font-medium hover:text-brand-600 transition-colors">
              হোমপেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderStatusPage({ orderId, orders, products, onBack }: { orderId: string, orders: any[], products: any[], onBack: () => void }) {
  const order = orders.find(o => o.id === orderId);

  if (!order) return <div className="py-24 text-center">অর্ডার পাওয়া যায়নি।</div>;

  const handleDownload = () => {
    const product = products.find(p => p.id === order.productId);
    const link = product?.pdfLink || product?.pdfUrl;
    if (link) {
      window.open(link, '_blank');
    } else {
      alert("দুঃখিত, এই ই-বুকের PDF লিংক পাওয়া যায়নি। অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।");
    }
  };

  return (
    <section className="py-24 bg-earth-50 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-earth-200 shadow-sm text-center">
          
          {order.status === 'pending' && (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">পেমেন্ট যাচাই হচ্ছে</h2>
              <p className="text-lg text-earth-700 mb-8 leading-relaxed">
                আপনার পেমেন্ট যাচাই করা হচ্ছে। যাচাই সম্পন্ন হলে PDF ডাউনলোড বাটন চালু হবে। এই পেজটি রিফ্রেশ করতে পারেন অথবা পরে চেক করতে পারেন।
              </p>
              <div className="bg-earth-50 p-4 rounded-xl text-left border border-earth-200 mb-8 text-sm">
                 <div className="flex justify-between mb-2 pb-2 border-b border-earth-200">
                   <span className="text-earth-500 font-medium">অর্ডার আইডি</span>
                   <span className="font-mono text-earth-900">{order.id}</span>
                 </div>
                 <div className="flex justify-between mb-2 pb-2 border-b border-earth-200">
                   <span className="text-earth-500 font-medium">প্রোডাক্ট</span>
                   <span className="font-semibold text-earth-900 text-right">{order.productName}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-earth-500 font-medium">ট্রানজেকশন আইডি</span>
                   <span className="font-mono font-bold text-brand-600">{order.transactionId}</span>
                 </div>
              </div>
            </>
          )}

          {order.status === 'approved' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-brand-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">পেমেন্ট সফল হয়েছে!</h2>
              <p className="text-lg text-earth-700 mb-8 leading-relaxed">
                আপনার পেমেন্ট সফল হয়েছে। নিচে থেকে পেমেন্ট করা ইবুকটি ডাউনলোড করুন।
              </p>
              <button onClick={handleDownload} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-3 text-lg mb-6 transform hover:-translate-y-1">
                <Download className="w-6 h-6" /> PDF ডাউনলোড করুন
              </button>
            </>
          )}

          {order.status === 'rejected' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">আপনার পেমেন্ট বাতিল হয়েছে</h2>
              <p className="text-lg text-earth-700 mb-8 leading-relaxed">
                আপনার দেওয়া ট্রানজেকশন আইডি টি সঠিক নয়। দয়া করে সঠিক তথ্য দিয়ে আবার চেষ্টা করুন অথবা আমাদের সাথে যোগাযোগ করুন।
              </p>
            </>
          )}

          <button onClick={onBack} className="text-earth-600 font-medium hover:text-brand-600 transition-colors mt-4">
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-earth-900 text-earth-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 border-b border-earth-800 pb-16 mb-12">
          
          <div className="md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
               <Sprout className="w-8 h-8 text-brand-500" />
               <span className="font-serif font-bold text-2xl text-white tracking-tight">খামার উদ্যোক্তা গাইড</span>
             </div>
             <p className="text-earth-400 mb-8 max-w-sm">
               বাংলাদেশে লাভজনক খামার ব্যবসা গড়ে তোলার বিশ্বস্ত ডিজিটাল গাইড।
             </p>
             <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center hover:bg-brand-600 transition-colors cursor-pointer text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center hover:bg-brand-600 transition-colors cursor-pointer text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
             </div>
          </div>
          
          <div id="contact">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">যোগাযোগ</h4>
            <ul className="space-y-4 text-earth-300">
               <li className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
                 <span>বাংলাদেশ</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-brand-500 flex-shrink-0" />
                 <a href="https://wa.me/8801919892751?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%96%E0%A6%BE%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%89%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A7%8B%E0%A6%95%E0%A7%8D%E0%A6%A4%E0%A6%BE%20%E0%A6%97%E0%A6%BE%E0%A6%87%E0%A6%A1%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%87-%E0%A6%AC%E0%A7%81%E0%A6%95%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">01919892751 (হোয়াটসঅ্যাপ)</a>
               </li>
               <li className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-brand-500 flex-shrink-0" />
                 <a href="mailto:mdariankhan667@gmail.com" className="hover:text-brand-400">mdariankhan667@gmail.com</a>
               </li>
               <li className="flex items-center gap-3">
                 <MessageCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                 <a href="#" className="hover:text-brand-400">খামার উদ্যোক্তা গাইড</a>
               </li>
            </ul>
          </div>
          
          <div>
             <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">পেমেন্ট মাধ্যম</h4>
             <p className="text-earth-400 mb-4 text-sm">নিচের যেকোনো মাধ্যমে আপনার পেমেন্ট সম্পন্ন করতে পারবেন:</p>
             <ul className="space-y-3">
                <li className="flex items-center gap-3 bg-earth-800/50 py-2 px-4 rounded-lg">
                  <CreditCard className="w-5 h-5 text-pink-500" />
                  <span className="font-semibold text-earth-200">bKash</span>
                </li>
                <li className="flex items-center gap-3 bg-earth-800/50 py-2 px-4 rounded-lg">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-earth-200">Nagad</span>
                </li>
                <li className="flex items-center gap-3 bg-earth-800/50 py-2 px-4 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-earth-200">Rocket</span>
                </li>
             </ul>
          </div>
          
        </div>
        
        <div className="text-center text-earth-500 text-sm flex flex-col sm:flex-row justify-between items-center">
          <p>© ২০২৬ খামার উদ্যোক্তা গাইড। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="mt-4 sm:mt-0 space-x-4">
          </div>
        </div>
      </div>
    </footer>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '225588') {
      onLogin();
    } else {
      setError('পাসওয়ার্ড ভুল হয়েছে');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-earth-200 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-earth-900 mb-6">এডমিন লগইন</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="পাসওয়ার্ড" 
              className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:outline-none focus:border-brand-500 text-center tracking-widest text-lg" 
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors">
            লগইন করুন
          </button>
        </form>
        <a href="/" className="inline-block mt-6 text-earth-500 hover:text-brand-600 font-medium text-sm transition-colors">
          হোমপেজে ফিরে যান
        </a>
      </div>
    </div>
  );
}

function AdminDashboard({ products, setProducts, orders, setOrders, onLogout }: { products: any[], setProducts: (p: any[]) => any, orders: any[], setOrders: (o: any[]) => void, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'products'|'orders'>('products');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    coverImage: '',
    pdfLink: '',
  });

  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleOpenModal = (product?: any) => {
    setMessage(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.name || '',
        category: product.category || '',
        price: product.price || '',
        description: product.fullDesc || product.shortDesc || '',
        coverImage: product.image || '',
        pdfLink: product.pdfLink || product.pdfUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        category: '',
        price: '',
        description: '',
        coverImage: '',
        pdfLink: '',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    let updatedArray = [];
    if (editingProduct) {
      updatedArray = products.map(p => 
        p.id === editingProduct.id ? { 
          ...p, 
          name: formData.title,
          category: formData.category,
          price: Number(formData.price),
          fullDesc: formData.description,
          shortDesc: formData.description,
          image: formData.coverImage,
          pdfLink: formData.pdfLink,
        } : p
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: formData.title,
        category: formData.category,
        price: Number(formData.price),
        fullDesc: formData.description,
        shortDesc: formData.description,
        image: formData.coverImage,
        pdfLink: formData.pdfLink,
        createdAt: new Date().toISOString()
      };
      updatedArray = [...products, newProduct];
    }
    
    const result = setProducts(updatedArray);
    if (result && result.success === false) {
      setMessage({ type: 'error', text: result.error || 'একটি ত্রুটি ঘটেছে।' });
    } else {
      setMessage({ type: 'success', text: 'প্রোডাক্ট সফলভাবে সেভ হয়েছে!' });
      setTimeout(() => {
        setIsProductModalOpen(false);
      }, 1500);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if(confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্ট ডিলিট করতে চান?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(newOrders);
  };

  return (
    <div className="min-h-screen bg-earth-50 font-sans p-4 sm:p-8 relative">
      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-brand-900 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold font-serif text-xl border-none m-0">
                {editingProduct ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যোগ করুন'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-brand-200 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {message && (
              <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 justify-center text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span className="font-medium text-sm">{message.text}</span>
              </div>
            )}
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-earth-800 mb-1">ই-বুকের নাম</label>
                  <input required autoFocus type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Product Title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-earth-800 mb-1">ক্যাটাগরি</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Category" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-earth-800 mb-1">মূল্য (৳)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Price" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-earth-800 mb-1">বিস্তারিত বিবরণ</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Long description" />
                </div>
                <div className="md:col-span-2 border-t border-earth-100 pt-4 mt-2">
                  <label className="block text-sm font-semibold text-earth-800 mb-2">কভার ফটো আপলোড করুন</label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2.5 bg-brand-50 text-brand-700 rounded-xl font-semibold text-sm cursor-pointer hover:bg-brand-100 transition-colors">
                      ফাইল নির্বাচন করুন
                      <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if(file) {
                          const reader = new FileReader();
                          reader.onload = ev => { if(ev.target?.result) setFormData({...formData, coverImage: ev.target.result as string}) };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                    <span className="text-sm text-earth-500">JPG, PNG বা WEBP</span>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-4">
                      <p className="text-xs text-earth-500 mb-1 font-medium">ছবি প্রিভিউ:</p>
                      <img src={formData.coverImage} alt="Preview" className="h-32 object-cover rounded-lg border border-earth-200" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 border-t border-earth-100 pt-4">
                  <label className="block text-sm font-semibold text-earth-800 mb-2">PDF Download Link</label>
                  <input type="url" required value={formData.pdfLink} onChange={e => setFormData({...formData, pdfLink: e.target.value})} className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Google Drive / Dropbox / Mega link দিন" />
                </div>
              </div>
              <div className="pt-4 border-t border-earth-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-earth-200 text-earth-700 font-medium hover:bg-earth-50 transition-colors">
                  বাতিল করুন
                </button>
                <button type="submit" disabled={message?.type === 'success'} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors flex items-center gap-2 disabled:bg-brand-400 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" /> প্রোডাক্ট সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-earth-100 overflow-hidden">
        <div className="bg-brand-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            এডমিন ড্যাশবোর্ড
          </h2>
          <div className="flex bg-brand-800 rounded-full p-1">
             <button onClick={() => setActiveTab('orders')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-brand-900' : 'text-brand-100 hover:text-white'}`}>অর্ডারসমূহ</button>
             <button onClick={() => setActiveTab('products')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white text-brand-900' : 'text-brand-100 hover:text-white'}`}>প্রোডাক্টসমূহ</button>
          </div>
          <div className="flex gap-2">
            <button onClick={onLogout} className="text-brand-100 hover:text-white text-sm font-medium transition-colors bg-brand-800 px-3 py-1.5 rounded-full">
              লগআউট
            </button>
            <a href="/" className="text-brand-100 hover:text-white text-sm font-medium transition-colors bg-brand-800 px-3 py-1.5 rounded-full">
              ওয়েবসাইটে যান
            </a>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'products' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-earth-600">Product List</p>
                <button onClick={() => handleOpenModal()} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> নতুন প্রোডাক্ট যোগ করুন
                </button>
              </div>
              
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-12 bg-earth-50 rounded-xl border border-earth-100">
                    <p className="text-earth-500">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-xl border border-earth-100 bg-earth-50/50 hover:bg-earth-50 transition-colors">
                      <div className="w-24 h-24 rounded-lg bg-earth-200 flex-shrink-0 overflow-hidden border border-earth-100 shadow-sm relative group">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-earth-400">No Img</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button onClick={() => handleOpenModal(product)} className="text-white text-xs font-semibold bg-brand-600 px-2 py-1 rounded">Edit</button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-earth-900 truncate">{product.name}</h4>
                          <div className="bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 rounded ml-auto flex-shrink-0">
                            ৳{product.price}
                          </div>
                        </div>
                        {product.category && <p className="text-xs text-earth-500 mb-2">{product.category}</p>}
                        {product.shortDesc && <p className="text-sm text-earth-600 truncate mb-2">{product.shortDesc}</p>}
                        
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-earth-100">
                          <button onClick={() => handleOpenModal(product)} className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg flex items-center transition-colors">
                            <Edit3 className="w-3.5 h-3.5 mr-1" /> এডিট করুন
                          </button>
                          <button onClick={() => handleOpenModal(product)} className="text-xs font-semibold text-earth-600 hover:bg-earth-100 px-3 py-1.5 rounded-lg flex items-center transition-colors">
                            <ImageIcon className="w-3.5 h-3.5 mr-1" /> কভার ফটো এডিট করুন
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center transition-colors">
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> ডিলিট করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-earth-600 font-medium">Customer Orders ({orders.length})</p>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-earth-50 rounded-xl border border-earth-100">
                  <Package className="w-12 h-12 text-earth-300 mx-auto mb-3" />
                  <p className="text-earth-600 font-medium">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-5 rounded-xl border border-earth-200 bg-white shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-earth-500 bg-earth-100 px-2 py-1 rounded">#{order.id.slice(-6)}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              order.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-xs text-earth-400">{new Date(order.date).toLocaleDateString()}</span>
                         </div>
                         <h4 className="font-bold text-earth-900 text-lg">{order.productName}</h4>
                         <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-earth-700">
                            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5"/> ৳{order.price}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> {order.customerName}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> {order.customerPhone}</span>
                         </div>
                         <div className="mt-4 p-3 bg-earth-50 rounded-lg border border-earth-100">
                            <span className="block text-xs text-earth-500 uppercase font-semibold mb-1">Payment Details</span>
                            <div className="flex flex-wrap gap-4 text-sm">
                               <span className="font-medium text-earth-800">Method: <span className="font-bold">{order.paymentMethod}</span></span>
                               <span className="font-medium text-earth-800">TrxID: <span className="font-mono font-bold text-brand-600 bg-brand-50 px-1 py-0.5 rounded">{order.transactionId}</span></span>
                            </div>
                         </div>
                      </div>
                      
                      {order.status === 'pending' && (
                        <div className="flex md:flex-col gap-2 w-full md:w-32 flex-shrink-0 mt-4 md:mt-0">
                           <button onClick={() => updateOrderStatus(order.id, 'approved')} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm text-center">
                             Approve
                           </button>
                           <button onClick={() => updateOrderStatus(order.id, 'rejected')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm text-center">
                             Reject
                           </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
