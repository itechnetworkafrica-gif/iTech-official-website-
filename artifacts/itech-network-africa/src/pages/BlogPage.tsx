import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const categories = ["All", "Technology", "AI", "Business", "Africa Tech"];

const blogPosts = [
  {
    id: 1,
    title: "How Artificial Intelligence is Reshaping African Retail",
    excerpt: "Discover how predictive analytics and computer vision are helping local supermarkets reduce waste and optimize inventory management.",
    category: "AI",
    author: "Michael Osei",
    date: "Feb 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Cloud Migration Guide for West African Enterprises",
    excerpt: "A step-by-step approach to moving legacy on-premise systems to scalable, secure cloud infrastructure while managing latency.",
    category: "Technology",
    author: "James Koffi",
    date: "Jan 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Why Cybersecurity Must Be Priority #1 in 2026",
    excerpt: "With the rapid digitization of financial services, safeguarding customer data is no longer optional. Here's what you need to know.",
    category: "Business",
    author: "Sarah Johnson",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Building Mobile Apps for Low-Bandwidth Environments",
    excerpt: "Technical strategies for developing native applications that perform flawlessly even on 2G and 3G networks.",
    category: "Technology",
    author: "David Mensah",
    date: "Jan 04, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "The Rise of Pan-African Tech Hubs",
    excerpt: "How cities like Monrovia, Accra, and Lagos are collaborating to build the next generation of global software engineers.",
    category: "Africa Tech",
    author: "Wilmot Kerkulah",
    date: "Dec 20, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Automating HR: Beyond Basic Payroll",
    excerpt: "How modern enterprise software is transforming human resources from an administrative burden to a strategic advantage.",
    category: "Business",
    author: "Aisha Diallo",
    date: "Dec 12, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Demystifying Machine Learning Models",
    excerpt: "A non-technical explanation of how custom algorithms are trained and deployed in corporate environments.",
    category: "AI",
    author: "Michael Osei",
    date: "Nov 30, 2025",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "E-Governance: Digitizing the Public Sector",
    excerpt: "Case studies on how digital citizen portals are increasing transparency and efficiency in government services.",
    category: "Africa Tech",
    author: "Sarah Johnson",
    date: "Nov 15, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Choosing the Right Database Architecture",
    excerpt: "SQL vs NoSQL vs NewSQL: Making the right structural choices for high-scale enterprise applications.",
    category: "Technology",
    author: "James Koffi",
    date: "Nov 02, 2025",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredPosts = activeCategory === "All" 
    ? blogPosts.slice(1) // exclude first post which is featured
    : blogPosts.filter(p => p.category === activeCategory);
    
  const featuredPost = blogPosts[0];

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <PageHero 
        badge="Insights & News"
        title="Blog & Insights"
        subtitle="Thoughts, technical deep dives, and perspectives on the evolving landscape of enterprise technology in Africa."
      />

      {/* Featured Article */}
      {activeCategory === "All" && (
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8 border-b border-[#E5E7EB]">
          <h2 className="text-2xl font-bold text-[#111827] mb-8">Featured Insight</h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-8 items-center bg-[#F8F9FA] rounded-3xl overflow-hidden border border-[#E5E7EB] group cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="h-[300px] lg:h-[400px] overflow-hidden relative">
              <div className="absolute inset-0 bg-[#0A1929]/20 group-hover:bg-transparent transition-colors z-10"></div>
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="p-8 lg:p-12">
              <div className="inline-block px-3 py-1 rounded-full bg-[#3CB52A]/20 text-[#3CB52A] text-xs font-bold uppercase tracking-wider mb-6">
                {featuredPost.category}
              </div>
              <h3 className="text-3xl font-bold text-[#111827] mb-4 group-hover:text-[#3CB52A] transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#E5E7EB]">
                <div>
                  <div className="text-sm font-bold text-[#111827]">{featuredPost.author}</div>
                  <div className="text-xs text-[#6B7280] flex items-center gap-2 mt-1">
                    {featuredPost.date} <span className="w-1 h-1 rounded-full bg-[#E5E7EB]"></span> <Clock size={12} /> {featuredPost.readTime}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827] group-hover:bg-[#3CB52A] group-hover:text-white group-hover:border-[#3CB52A] transition-colors">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8 w-full sticky top-[60px] lg:top-[72px] bg-white/90 backdrop-blur-md z-30">
        <div className="flex overflow-x-auto pb-4 -mb-4 hide-scrollbar gap-2 md:gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-[#0A1929] text-white shadow-md' 
                  : 'bg-[#F8F9FA] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 lg:py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#3CB52A]/50 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-[#0A1929]/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[#111827] text-xs font-bold uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#3CB52A] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-[#6B7280] text-sm mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E5E7EB]">
                  <div>
                    <div className="text-xs font-bold text-[#111827]">{post.author}</div>
                    <div className="text-[11px] text-[#6B7280]">{post.date}</div>
                  </div>
                  <div className="text-xs font-medium text-[#6B7280] flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded-md">
                    <Clock size={12} /> {post.readTime}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
