/**
 * Bridge AI+BCI Platform - Pricing Page Component
 * Beautiful pricing page with subscription plans and Stripe integration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Zap, Brain, Crown, Sparkles, Users, Clock,
  Target, TrendingUp, Shield, HeadphonesIcon, Download,
  Star, ArrowRight, CreditCard, Gift
} from 'lucide-react';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPlans(data.data.plans);
        // Find current plan if user is authenticated
        const currentUserPlan = data.data.plans.find(plan => plan.isCurrentPlan);
        if (currentUserPlan) {
          setCurrentPlan(currentUserPlan.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    if (planId === 'free' || planId === currentPlan) return;

    setCheckoutLoading(planId);
    try {
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      const data = await response.json();
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const planFeatures = {
    free: [
      '5 Neural Training Sessions/month',
      'Basic BCI metrics',
      'Standard scenarios (family, workplace)',
      'Email support',
      'Mobile app access'
    ],
    basic: [
      '25 Neural Training Sessions/month',
      'Advanced BCI analytics',
      'All training scenarios',
      'Progress tracking & reports',
      'Data export functionality',
      'Priority email support'
    ],
    pro: [
      '100 Neural Training Sessions/month',
      'Advanced BCI analytics',
      'AI-powered training coach',
      'Custom scenario creation',
      'Detailed neural reports',
      'Progress sharing',
      'API access',
      'Priority support'
    ],
    premium: [
      'Unlimited training sessions',
      'Real-time neural monitoring',
      'Personal AI coach',
      'Custom scenario library',
      'Advanced neural analytics',
      'White-label options',
      'Dedicated success manager',
      '24/7 phone support',
      'Early access to new features'
    ]
  };

  const planIcons = {
    free: Brain,
    basic: Zap,
    pro: Target,
    premium: Crown
  };

  const planColors = {
    free: 'from-slate-600 to-slate-700 border-slate-500',
    basic: 'from-blue-600 to-indigo-700 border-blue-500',
    pro: 'from-purple-600 to-violet-700 border-purple-500',
    premium: 'from-amber-500 to-orange-600 border-amber-400'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {' '}Neural Journey
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Unlock the full potential of AI+BCI communication training. 
              Transform your neural pathways and revolutionize how you connect with others.
            </p>
          </motion.div>

          {/* Annual/Monthly Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center mb-12"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    !isAnnual
                      ? 'bg-amber-500 text-slate-900'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                    isAnnual
                      ? 'bg-amber-500 text-slate-900'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <Gift className="w-4 h-4" />
                  <span className="text-green-400 text-sm font-bold">Save 20%</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const Icon = planIcons[plan.id] || Brain;
            const isPopular = plan.id === 'pro';
            const isCurrent = plan.id === currentPlan;
            const annualPrice = plan.price * 12 * 0.8; // 20% discount
            const displayPrice = isAnnual ? annualPrice : plan.price;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 border backdrop-blur-xl ${
                  isPopular
                    ? 'bg-gradient-to-b from-purple-600/20 to-violet-700/20 border-purple-400 scale-105'
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                } transition-all duration-300 hover:scale-105`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Current Plan
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${planColors[plan.id]} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  <div className="mb-4">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold text-white">Free</div>
                    ) : (
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">
                          ${((isAnnual ? annualPrice : plan.price) / 100).toFixed(0)}
                        </span>
                        <span className="text-slate-400 ml-2">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      </div>
                    )}
                    
                    {isAnnual && plan.price > 0 && (
                      <div className="text-green-400 text-sm mt-1">
                        Save ${((plan.price * 12 * 0.2) / 100).toFixed(0)}/year
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {planFeatures[plan.id]?.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  {plan.id === 'free' ? (
                    <button className="w-full py-4 bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : isCurrent ? (
                    <button className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold cursor-not-allowed">
                      ✓ Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                        isPopular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {checkoutLoading === plan.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Upgrade Now</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Compare Neural Training Features
          </h2>
          <p className="text-xl text-slate-400">
            See what each plan includes to enhance your communication skills
          </p>
        </motion.div>

        <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-6 px-8 text-white font-semibold">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-6 px-4 text-white font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Monthly Training Sessions', free: '5', basic: '25', pro: '100', premium: 'Unlimited' },
                  { feature: 'BCI Neural Monitoring', free: 'Basic', basic: 'Advanced', pro: 'Advanced', premium: 'Real-time' },
                  { feature: 'AI Training Coach', free: '❌', basic: '❌', pro: '✅', premium: '✅ Personal' },
                  { feature: 'Custom Scenarios', free: '❌', basic: '❌', pro: '✅', premium: '✅ Library' },
                  { feature: 'Neural Analytics', free: 'Basic', basic: 'Advanced', pro: 'Advanced', premium: 'Premium' },
                  { feature: 'Data Export', free: '❌', basic: '✅', pro: '✅', premium: '✅' },
                  { feature: 'API Access', free: '❌', basic: '❌', pro: '✅', premium: '✅' },
                  { feature: 'Support', free: 'Email', basic: 'Priority Email', pro: 'Priority', premium: '24/7 Phone' },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-slate-800/20' : ''}>
                    <td className="py-4 px-8 text-slate-300 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.free}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.basic}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.pro}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "What is BCI neural training?",
                answer: "BCI (Brain-Computer Interface) neural training uses real-time brain monitoring to provide feedback during communication practice, helping you develop better neural pathways for conflict resolution and empathy."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
              },
              {
                question: "Is my neural data secure?",
                answer: "Absolutely. All neural data is encrypted end-to-end and stored securely. We never share your brain data with third parties."
              },
              {
                question: "Do I need special hardware?",
                answer: "For basic training, no special hardware is needed. For advanced BCI features, we partner with consumer EEG device manufacturers."
              },
              {
                question: "How quickly will I see results?",
                answer: "Most users report improvements in communication skills within 2-3 weeks of regular training. Neural pathway changes can be measured after just a few sessions."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center space-x-8 space-y-4">
            <div className="flex items-center space-x-2 text-slate-400">
              <Shield className="w-6 h-6 text-green-400" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Users className="w-6 h-6 text-purple-400" />
              <span>Trusted by 50K+ Users</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Star className="w-6 h-6 text-amber-400" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl border-y border-amber-500/30">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Communication?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of users who have revolutionized their neural communication pathways with Bridge.
            </p>
            <button
              onClick={() => handleUpgrade('pro')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-12 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center space-x-3 mx-auto"
            >
              <Brain className="w-6 h-6" />
              <span>Start Your Neural Journey</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
