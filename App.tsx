
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { Admin } from './pages/Admin';
import { EbookDetail } from './pages/EbookDetail';
import { Contact } from './pages/Contact';
import { storage } from './services/storage';
import { GradFlow } from './components/GradFlow';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FacebookPixel = () => {
  const { config } = useFirebase();
  useEffect(() => {
    // Favicon update
    if (config.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = config.favicon;
    }

    if (config.fbPixelId) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.fbPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, [config]);
  return null;
};

const App: React.FC = () => {
  return (
    <FirebaseProvider>
      <Router>
        <FacebookPixel />
        <ScrollToTop />
        <div className="min-h-screen relative text-slate-100 selection:bg-purple-500/30">
          <GradFlow />
          <Navbar />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/ebook/:id" element={<EbookDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloating />
        </div>
      </Router>
    </FirebaseProvider>
  );
};

export default App;
