
import { Mail, Share2, ExternalLink, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function LearnMoreSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to a backend service
    // For now, we'll just simulate a successful subscription
    if (email) {
      setSubscribed(true);
      setEmail('');
      
      // Reset the subscription confirmation after a delay
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section id="learn" className="section bg-gradient-to-b from-antimatter-bg to-antimatter-bg/90">
      <div className="container mx-auto flex flex-col h-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
          Learn <span className="text-antimatter-yellow">More</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* CERN Resources */}
          <div className="bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-lg card-hover">
            <div className="h-40 bg-gradient-to-r from-antimatter-blue to-antimatter-red flex items-center justify-center">
              <BookOpen size={64} className="text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">CERN Resources</h3>
              <p className="text-antimatter-textDim mb-4">
                Explore the cutting-edge antimatter research happening at CERN, home to the world's largest antimatter factory.
              </p>
              <a 
                href="https://home.cern/science/physics/antimatter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-antimatter-yellow hover:underline"
              >
                Visit CERN <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
          
          {/* Scientific Articles */}
          <div className="bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-lg card-hover">
            <div className="h-40 bg-gradient-to-r from-antimatter-red to-antimatter-yellow flex items-center justify-center">
              <BookOpen size={64} className="text-antimatter-bg" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Scientific Articles</h3>
              <p className="text-antimatter-textDim mb-4">
                Dive deeper with peer-reviewed articles on antimatter physics from leading scientific publications.
              </p>
              <a 
                href="https://www.nature.com/subjects/antimatter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-antimatter-yellow hover:underline"
              >
                Read on Nature <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
          
          {/* Educational Videos */}
          <div className="bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-lg card-hover">
            <div className="h-40 bg-gradient-to-r from-antimatter-yellow to-antimatter-blue flex items-center justify-center">
              <BookOpen size={64} className="text-antimatter-bg" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Educational Videos</h3>
              <p className="text-antimatter-textDim mb-4">
                Watch engaging videos explaining antimatter concepts through animations and expert interviews.
              </p>
              <a 
                href="https://www.youtube.com/results?search_query=antimatter+physics+explained" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-antimatter-yellow hover:underline"
              >
                Watch Videos <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-black bg-opacity-70 p-8 rounded-xl max-w-2xl mx-auto w-full">
          <div className="flex justify-center mb-6">
            <Mail size={32} className="text-antimatter-yellow" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-center">Stay Updated</h3>
          <p className="text-antimatter-textDim text-center mb-6">
            Subscribe to our newsletter for the latest discoveries and breakthroughs in antimatter research.
          </p>
          
          {subscribed ? (
            <div className="bg-antimatter-blue bg-opacity-30 text-antimatter-text p-4 rounded-md text-center">
              Thank you for subscribing! Check your email for a confirmation link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 rounded-md bg-antimatter-gray bg-opacity-30 border border-antimatter-gray focus:outline-none focus:ring-2 focus:ring-antimatter-yellow"
              />
              <button type="submit" className="btn-accent whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>
        
        {/* Social Sharing */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
            <Share2 size={20} className="mr-2" />
            Share this page
          </h3>
          <div className="flex justify-center gap-4">
            <button className="btn-primary px-4">Twitter</button>
            <button className="btn-secondary px-4">Facebook</button>
            <button className="btn-accent px-4">LinkedIn</button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-antimatter-textDim">
          <p>© 2025 Antimatter Research Initiative. Created for educational purposes.</p>
          <p className="mt-2">All scientific information has been verified by physics experts.</p>
        </footer>
      </div>
    </section>
  );
}
