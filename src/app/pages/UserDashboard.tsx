import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Activity, Globe, User, LogOut, ChevronDown, Sparkles, X, Clock, Target, Zap, Apple, Dumbbell, Phone, MapPin, Mail, Linkedin, Menu } from 'lucide-react';
import Logo from "../../assets/Logo.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const hospitalData = [
  {
    id: 1,
    name: "Government General Hospital",
    doctor: "Dr. S. Rao (Gynecologist)",
    phone: "+91 89123 45678",
    address: "Vizianagaram, Andhra Pradesh",
    lat: 18.1067,
    lng: 83.3956,
  },
  {
    id: 2,
    name: "Care Women Hospital",
    doctor: "Dr. Anjali Devi",
    phone: "+91 98765 43210",
    address: "Ring Road, Vizianagaram",
    lat: 18.1089,
    lng: 83.3981,
  },
  {
    id: 3,
    name: "Sri Sai Multi Speciality Hospital",
    doctor: "Dr. K. Prasad",
    phone: "+91 91234 56789",
    address: "Dasannapeta, Vizianagaram",
    lat: 18.1045,
    lng: 83.3922,
  },
];

const healthTipsData = {
  yoga: [
    {
      id: 'y1',
      name: 'Butterfly Pose (Baddha Konasana)',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      duration: '5-10 minutes',
      bestTime: 'Morning or Evening',
      difficulty: 'Beginner',
      steps: [
        'Sit on the floor with your spine straight',
        'Bend your knees and bring your feet together',
        'Hold your feet with your hands',
        'Gently flap your knees up and down like butterfly wings',
        'Breathe deeply and hold for 1-5 minutes'
      ],
      benefits: [
        'Relieves menstrual discomfort and regulates cycles',
        'Stimulates ovaries and improves reproductive health',
        'Reduces stress and anxiety',
        'Stretches inner thighs and hips',
        'Helps manage PCOD symptoms'
      ],
      precautions: 'Avoid if you have knee or groin injuries'
    },
    {
      id: 'y2',
      name: 'Cobra Pose (Bhujangasana)',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      duration: '3-5 minutes',
      bestTime: 'Morning',
      difficulty: 'Beginner',
      steps: [
        'Lie on your stomach with legs extended',
        'Place palms under shoulders',
        'Slowly lift your chest off the ground',
        'Keep elbows slightly bent',
        'Hold for 15-30 seconds, breathe deeply'
      ],
      benefits: [
        'Stimulates abdominal organs',
        'Regulates thyroid function',
        'Improves blood circulation',
        'Relieves menstrual irregularities',
        'Strengthens spine and reduces fatigue'
      ],
      precautions: 'Avoid during pregnancy or if you have back injuries'
    },
    {
      id: 'y3',
      name: "Child's Pose (Balasana)",
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
      duration: '5-10 minutes',
      bestTime: 'Anytime',
      difficulty: 'Beginner',
      steps: [
        'Kneel on the floor with knees hip-width apart',
        'Sit back on your heels',
        'Fold forward, extending arms in front',
        'Rest forehead on the ground',
        'Breathe deeply and relax'
      ],
      benefits: [
        'Reduces stress and anxiety',
        'Relieves menstrual cramps',
        'Calms the nervous system',
        'Stretches hips, thighs, and ankles',
        'Promotes relaxation and better sleep'
      ],
      precautions: 'Avoid if pregnant or have knee injuries'
    }
  ],
  nutrition: [
    {
      id: 'n1',
      name: 'Spinach (Palak)',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
      category: 'Leafy Green',
      nutrients: {
        iron: '2.7mg per 100g',
        protein: '2.9g per 100g',
        folate: '194mcg per 100g',
        vitaminC: '28mg per 100g',
        calcium: '99mg per 100g'
      },
      benefits: [
        'Rich in iron - prevents and treats anaemia',
        'High folate content supports reproductive health',
        'Antioxidants reduce inflammation in PCOD',
        'Low glycemic index helps regulate blood sugar',
        'Supports healthy menstrual cycles'
      ],
      recommendedIntake: '100-150g daily (cooked)',
      bestConsumedWith: 'Vitamin C foods (lemon, tomatoes) for better iron absorption',
      recipes: ['Palak Paneer', 'Spinach Smoothie', 'Spinach Dal']
    },
    {
      id: 'n2',
      name: 'Pomegranate (Anar)',
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800',
      category: 'Fruit',
      nutrients: {
        iron: '0.3mg per 100g',
        vitaminC: '10.2mg per 100g',
        folate: '38mcg per 100g',
        antioxidants: 'High levels of polyphenols',
        fiber: '4g per 100g'
      },
      benefits: [
        'Boosts haemoglobin levels naturally',
        'Rich in antioxidants for hormonal balance',
        'Improves blood circulation',
        'Supports uterine health',
        'Helps manage PCOD symptoms'
      ],
      recommendedIntake: '1 medium fruit or 1 cup seeds daily',
      bestConsumedWith: 'Morning breakfast or as mid-day snack',
      recipes: ['Pomegranate Juice', 'Fruit Salad', 'Smoothie Bowl']
    },
    {
      id: 'n3',
      name: 'Almonds (Badam)',
      image: 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=800',
      category: 'Nuts',
      nutrients: {
        protein: '21g per 100g',
        iron: '3.7mg per 100g',
        calcium: '269mg per 100g',
        magnesium: '270mg per 100g',
        vitaminE: '25.6mg per 100g'
      },
      benefits: [
        'Excellent source of plant-based iron',
        'Supports hormonal balance with healthy fats',
        'Reduces inflammation in PCOD',
        'Improves insulin sensitivity',
        'Provides sustained energy'
      ],
      recommendedIntake: '8-10 soaked almonds daily',
      bestConsumedWith: 'Soak overnight, eat in the morning on empty stomach',
      recipes: ['Almond Milk', 'Energy Bars', 'Almond Butter']
    }
  ],
  exercise: [
    {
      id: 'e1',
      name: 'Brisk Walking',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
      duration: '30-45 minutes',
      intensity: 'Moderate',
      caloriesBurned: '150-200 cal/30 mins',
      steps: [
        'Wear comfortable shoes with good support',
        'Maintain upright posture with shoulders back',
        'Swing arms naturally',
        'Walk at a pace where you can talk but not sing',
        'Aim for 3-5 times per week'
      ],
      benefits: [
        'Improves insulin sensitivity (helps PCOD)',
        'Boosts circulation and haemoglobin production',
        'Reduces stress and balances hormones',
        'Low impact - suitable for all fitness levels',
        'Regulates menstrual cycles'
      ],
      bestTime: 'Morning (6-8 AM) or Evening (5-7 PM)',
      equipment: 'Comfortable walking shoes'
    },
    {
      id: 'e2',
      name: 'Cycling',
      image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800',
      duration: '20-30 minutes',
      intensity: 'Moderate to High',
      caloriesBurned: '200-300 cal/30 mins',
      steps: [
        'Adjust bike seat to proper height',
        'Start with 5-minute warm-up at slow pace',
        'Gradually increase speed',
        'Maintain steady breathing',
        'Cool down for 5 minutes at the end'
      ],
      benefits: [
        'Excellent cardiovascular exercise',
        'Helps with weight management for PCOD',
        'Strengthens leg muscles',
        'Improves endurance and stamina',
        'Boosts mood and reduces anxiety'
      ],
      bestTime: 'Morning or Evening',
      equipment: 'Bicycle or stationary bike'
    },
    {
      id: 'e3',
      name: 'Strength Training (Light Weights)',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      duration: '20-30 minutes',
      intensity: 'Moderate',
      caloriesBurned: '100-150 cal/30 mins',
      steps: [
        'Start with 2-5 kg dumbbells',
        'Warm up with 5 minutes of stretching',
        'Perform 3 sets of 12-15 reps per exercise',
        'Focus on major muscle groups',
        'Rest 30-60 seconds between sets'
      ],
      benefits: [
        'Builds lean muscle mass',
        'Improves insulin sensitivity (crucial for PCOD)',
        'Boosts metabolism and aids weight management',
        'Strengthens bones and prevents osteoporosis',
        'Increases energy levels'
      ],
      bestTime: 'Morning or Afternoon',
      equipment: 'Light dumbbells (2-5kg), resistance bands'
    }
  ]
};

const HelpModal = ({ onClose, lang }) => {
  const helpTranslations = {
    en: { title: "About This Project", author: "Author", developers: "Developed by", contact: "Contact", close: "Close" },
    te: { title: "ఈ ప్రాజెక్ట్ గురించి", author: "రచయిత", developers: "అభివృద్ధి చేసినవారు", contact: "సంప్రదించండి", close: "మూసివేయండి" },
    hi: { title: "इस परियोजना के बारे में", author: "लेखक", developers: "विकसित किया गया", contact: "संपर्क करें", close: "बंद करें" }
  };
  const t = helpTranslations[lang];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px", animation: "fadeIn 0.3s ease-out" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: "600px", borderRadius: "16px", overflow: "hidden", animation: "slideUp 0.4s ease-out", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", padding: "24px", color: "white", position: "relative" }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={20} color="white" />
          </button>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "700" }}>{t.title}</h2>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.95 }}>Women's Health Intelligence Platform</p>
        </div>
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "24px", padding: "16px", background: "linear-gradient(135deg, #F3E8FF, #FDF2F8)", borderRadius: "12px", border: "1px solid rgba(139,92,246,0.2)" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="#8B5CF6" />{t.author}
            </h3>
            <p style={{ margin: 0, fontSize: "15px", color: "#4B5563", fontWeight: "600" }}>G. Jayasuma</p>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={18} color="#EC4899" />{t.developers}
            </h3>
            {[{ name: "K. Pravallika", url: "https://www.linkedin.com/in/kundum-pravallika-4a1249296/" }, { name: "T. Madhu Sarvani", url: "https://www.linkedin.com/in/madhu-sarvani-381999302" }].map((dev) => (
              <div key={dev.name} style={{ marginBottom: "12px", padding: "14px", background: "#FFFFFF", borderRadius: "10px", border: "1px solid rgba(139,92,246,0.15)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "600", color: "#1F2937" }}>{dev.name}</p>
                <a href={dev.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#0A66C2", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}>
                  <Linkedin size={16} />LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px", background: "#E0F2FE", border: "1px solid #7DD3FC", borderRadius: "12px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "700", color: "#0C4A6E", display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={16} />{t.contact}
            </h3>
            <a href="mailto:pravallikakundum18@gmail.com" style={{ color: "#0369A1", textDecoration: "none", fontSize: "13px", wordBreak: "break-all" }}>
              pravallikakundum18@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactModal = ({ onClose }) => {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px", animation: "fadeIn 0.3s ease-out" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: "1100px", height: "85vh", borderRadius: "16px", overflow: "hidden", animation: "slideUp 0.4s ease-out", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>
        {/* Mobile: stacked layout, Desktop: side by side */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }} className="contact-modal-inner">
          {/* Map */}
          <div style={{ height: "250px", flexShrink: 0 }} className="contact-map">
            <iframe
              title="Vizianagaram Hospitals Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30446.789!2d83.3956!3d18.1067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3be5fd17e68c99%3A0x5c9c3b8e5f8b8b8b!2sVizianagaram%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              style={{ border: 0, width: "100%", height: "100%" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {/* Hospital List */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "linear-gradient(135deg, #F9F5FF, #FAE8FF)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700", color: "#1F2937" }}>Nearby Hospitals</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#6B7280" }}>Specialized care for women's health</p>
              </div>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <X size={20} color="#6B7280" />
              </button>
            </div>
            {hospitalData.map((h) => (
              <div key={h.id} style={{ marginBottom: "12px", padding: "16px", borderRadius: "12px", border: "1px solid rgba(139,92,246,0.2)", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "700", color: "#1F2937" }}>{h.name}</h3>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                  <User size={15} color="#8B5CF6" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ margin: 0, fontSize: "13px", color: "#4B5563" }}>{h.doctor}</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                  <MapPin size={15} color="#EC4899" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ margin: 0, fontSize: "13px", color: "#4B5563" }}>{h.address}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone size={15} color="#10B981" />
                  <a href={`tel:${h.phone}`} style={{ margin: 0, fontSize: "13px", color: "#10B981", fontWeight: "600", textDecoration: "none" }}>{h.phone}</a>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "16px", padding: "14px", background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#92400E", lineHeight: "1.6" }}>
                💡 <strong>Note:</strong> For emergencies, call 108 (Ambulance) or visit the nearest hospital immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, color }) => (
  <div style={{ background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)', padding: '14px', borderRadius: '10px', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ color }}>{icon}</div>
    <div>
      <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '13px', color: '#1F2937', fontWeight: '600' }}>{value}</div>
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{icon}</span>{title}
    </h3>
    {children}
  </div>
);

const HealthTipModal = ({ type, tipIndex, onClose }) => {
  if (tipIndex === null) return null;
  const tips = healthTipsData[type];
  const [currentIndex, setCurrentIndex] = useState(tipIndex);
  const tip = tips[currentIndex];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '12px', animation: 'fadeIn 0.3s ease-out' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '16px', maxWidth: '900px', width: '100%', maxHeight: '92vh', overflow: 'auto', position: 'relative', animation: 'slideUp 0.4s ease-out' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <X size={20} color="#6B7280" />
        </button>

        {/* Header Image */}
        <div style={{ height: '200px', background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${tip.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', color: 'white' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700', textShadow: '0 2px 8px rgba(0,0,0,0.3)', paddingRight: '40px' }}>{tip.name}</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
            {type === 'yoga' && (<>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>{tip.difficulty}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>⏱️ {tip.duration}</span>
            </>)}
            {type === 'nutrition' && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)', display: 'inline-block', width: 'fit-content' }}>{tip.category}</span>}
            {type === 'exercise' && (<>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>{tip.intensity}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>🔥 {tip.caloriesBurned}</span>
            </>)}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {type === 'yoga' && (<>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <InfoCard icon={<Clock size={18} />} label="Duration" value={tip.duration} color="#8B5CF6" />
              <InfoCard icon={<Target size={18} />} label="Best Time" value={tip.bestTime} color="#EC4899" />
            </div>
            <Section title="Steps to Perform" icon="📝">
              <ol style={{ margin: 0, paddingLeft: '18px', color: '#4B5563', lineHeight: '1.8', fontSize: '14px' }}>
                {tip.steps.map((step, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>)}
              </ol>
            </Section>
            <Section title="Health Benefits" icon="💚">
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#4B5563', lineHeight: '1.8', fontSize: '14px' }}>
                {tip.benefits.map((b, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>)}
              </ul>
            </Section>
            {tip.precautions && <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '14px' }}>
              <p style={{ margin: 0, color: '#92400E', fontSize: '13px', fontWeight: '500' }}>⚠️ <strong>Precautions:</strong> {tip.precautions}</p>
            </div>}
          </>)}

          {type === 'nutrition' && (<>
            <Section title="Nutritional Profile" icon="📊">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {Object.entries(tip.nutrients).map(([key, value]) => (
                  <div key={key} style={{ background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div style={{ fontSize: '13px', color: '#1F2937', fontWeight: '700' }}>{value}</div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Health Benefits for Women" icon="💚">
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#4B5563', lineHeight: '1.8', fontSize: '14px' }}>
                {tip.benefits.map((b, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>)}
              </ul>
            </Section>
            <Section title="How to Consume" icon="🍽️">
              <div style={{ background: '#E0F2FE', border: '1px solid #7DD3FC', borderRadius: '8px', padding: '14px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#0C4A6E', fontSize: '13px' }}><strong>Recommended Intake:</strong> {tip.recommendedIntake}</p>
                <p style={{ margin: 0, color: '#0C4A6E', fontSize: '13px' }}><strong>Best Consumed:</strong> {tip.bestConsumedWith}</p>
              </div>
            </Section>
            {tip.recipes && <Section title="Recipe Ideas" icon="👩‍🍳">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tip.recipes.map((recipe, idx) => <span key={idx} style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>{recipe}</span>)}
              </div>
            </Section>}
          </>)}

          {type === 'exercise' && (<>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <InfoCard icon={<Clock size={18} />} label="Duration" value={tip.duration} color="#8B5CF6" />
              <InfoCard icon={<Zap size={18} />} label="Intensity" value={tip.intensity} color="#EC4899" />
              <InfoCard icon={<Target size={18} />} label="Best Time" value={tip.bestTime} color="#3B82F6" />
            </div>
            <Section title="How to Perform" icon="📝">
              <ol style={{ margin: 0, paddingLeft: '18px', color: '#4B5563', lineHeight: '1.8', fontSize: '14px' }}>
                {tip.steps.map((step, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>)}
              </ol>
            </Section>
            <Section title="Health Benefits" icon="💚">
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#4B5563', lineHeight: '1.8', fontSize: '14px' }}>
                {tip.benefits.map((b, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>)}
              </ul>
            </Section>
            <div style={{ background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', padding: '14px' }}>
              <p style={{ margin: 0, color: '#6B21A8', fontSize: '13px', fontWeight: '500' }}>🏋️ <strong>Equipment Needed:</strong> {tip.equipment}</p>
            </div>
          </>)}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
            <button onClick={() => setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>← Prev</button>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{currentIndex + 1} / {tips.length}</div>
            <button onClick={() => setCurrentIndex((prev) => (prev + 1) % tips.length)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HealthDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredTipCard, setHoveredTipCard] = useState(null);
  const [selectedTip, setSelectedTip] = useState({ type: null, index: null });
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const translations = {
    en: {
      appTitle: "Women's Health Intelligence",
      subtitle: "AI-Powered Anaemia & PCOD Care",
      welcome: "Welcome back",
      welcomeDesc: "Empowering adolescent girls with AI-driven health insights for early detection and prevention of Anaemia & PCOD",
      tools: "Health Screening Tools",
      healthTips: "Weekly Health Tips",
      loading: "Loading your dashboard...",
      profile: "Profile",
      logout: "Logout",
      footer: "Built for preventive healthcare using AI",
      disclaimer: "AI predictions are assistive and not a medical diagnosis",
      tapToExplore: "Tap to explore",
      contact: "Contact",
      about: "About",
      features: {
        anaemia: { title: "Anaemia Detector", desc: "AI-based screening using haemoglobin levels and body parameters for early detection.", btn: "Check Anaemia" },
        pcod: { title: "PCOD Detector", desc: "AI-based risk prediction using menstrual patterns and health indicators.", btn: "Check PCOD" },
        combined: { title: "Combined Assessment", desc: "Integrated Anaemia and PCOD analysis for holistic wellness insights.", btn: "Check Overall Health" },
      },
      tips: {
        yoga: { title: "Yoga & Meditation", subtitle: "Mind-body wellness" },
        nutrition: { title: "Nutrition Guide", subtitle: "Healthy foods for women" },
        exercise: { title: "Exercise Routines", subtitle: "Stay active, stay healthy" }
      }
    },
    te: {
      appTitle: "మహిళల ఆరోగ్య మేధస్సు",
      subtitle: "AI ఆధారిత అనీమియా & PCOD సంరక్షణ",
      welcome: "మళ్లీ స్వాగతం",
      welcomeDesc: "అనీమియా మరియు PCOD ను ముందుగా గుర్తించేందుకు AI ఆధారిత ఆరోగ్య సమాచారం",
      tools: "ఆరోగ్య స్క్రీనింగ్ సాధనాలు",
      healthTips: "వారపు ఆరోగ్య చిట్కాలు",
      loading: "లోడ్ అవుతోంది...",
      profile: "ప్రొఫైల్",
      logout: "లాగ్ అవుట్",
      footer: "AI ఆధారిత నివారణ ఆరోగ్య సంరక్షణ",
      disclaimer: "ఇవి వైద్య నిర్ధారణలు కావు",
      tapToExplore: "తెరవడానికి నొక్కండి",
      contact: "సంప్రదించండి",
      about: "గురించి",
      features: {
        anaemia: { title: "అనీమియా పరీక్ష", desc: "హిమోగ్లోబిన్ ఆధారంగా AI స్క్రీనింగ్.", btn: "అనీమియా తనిఖీ" },
        pcod: { title: "PCOD పరీక్ష", desc: "మాసిక ధర్మ సూచకాల ఆధారంగా ముందస్తు అంచనా.", btn: "PCOD తనిఖీ" },
        combined: { title: "సంపూర్ణ ఆరోగ్య పరీక్ష", desc: "అనీమియా & PCOD సమగ్ర విశ్లేషణ.", btn: "ఆరోగ్య స్థితి చూడండి" },
      },
      tips: {
        yoga: { title: "యోగా & ధ్యానం", subtitle: "మనో-శారీరక సంరక్షణ" },
        nutrition: { title: "పోషకాహార మార్గదర్శి", subtitle: "ఆరోగ్యకరమైన ఆహారం" },
        exercise: { title: "వ్యాయామ విధానాలు", subtitle: "చురుకుగా ఉండండి" }
      }
    },
    hi: {
      appTitle: "महिला स्वास्थ्य बुद्धिमत्ता",
      subtitle: "AI आधारित एनीमिया और PCOD देखभाल",
      welcome: "स्वागत है",
      welcomeDesc: "एनीमिया और PCOD की प्रारंभिक पहचान हेतु AI आधारित स्वास्थ्य जानकारी",
      tools: "स्वास्थ्य जांच उपकरण",
      healthTips: "साप्ताहिक स्वास्थ्य सुझाव",
      loading: "लोड हो रहा है...",
      profile: "प्रोफ़ाइल",
      logout: "लॉगआउट",
      footer: "AI आधारित निवारक स्वास्थ्य सेवा",
      disclaimer: "यह चिकित्सीय निदान नहीं है",
      tapToExplore: "खोलने के लिए क्लिक करें",
      contact: "संपर्क करें",
      about: "के बारे में",
      features: {
        anaemia: { title: "एनीमिया जांच", desc: "हीमोग्लोबिन आधारित AI स्क्रीनिंग।", btn: "एनीमिया जांचें" },
        pcod: { title: "PCOD जांच", desc: "मासिक धर्म संकेतकों पर आधारित जांच।", btn: "PCOD जांचें" },
        combined: { title: "संयुक्त स्वास्थ्य जांच", desc: "एनीमिया और PCOD का व्यापक विश्लेषण।", btn: "स्वास्थ्य जांचें" },
      },
      tips: {
        yoga: { title: "योग और ध्यान", subtitle: "मन-शरीर कल्याण" },
        nutrition: { title: "पोषण गाइड", subtitle: "स्वस्थ भोजन" },
        exercise: { title: "व्यायाम दिनचर्या", subtitle: "सक्रिय रहें" }
      }
    },
  };

  const t = translations[lang];

  const features = [
    { id: 1, icon: Droplets, title: t.features.anaemia.title, description: t.features.anaemia.desc, buttonText: t.features.anaemia.btn, color: '#8B5CF6', route: '/anaemia-check' },
    { id: 2, icon: Heart, title: t.features.pcod.title, description: t.features.pcod.desc, buttonText: t.features.pcod.btn, color: '#EC4899', route: '/pcod-check' },
    { id: 3, icon: Activity, title: t.features.combined.title, description: t.features.combined.desc, buttonText: t.features.combined.btn, color: '#9333EA', route: '/combined-check' }
  ];

  const healthTips = [
    { id: 'yoga', title: t.tips.yoga.title, subtitle: t.tips.yoga.subtitle, icon: '🧘‍♀️', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(168,85,247,0.9))' },
    { id: 'nutrition', title: t.tips.nutrition.title, subtitle: t.tips.nutrition.subtitle, icon: '🥗', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.9), rgba(251,113,133,0.9))' },
    { id: 'exercise', title: t.tips.exercise.title, subtitle: t.tips.exercise.subtitle, icon: '🏃‍♀️', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(37,99,235,0.9))' }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          let parsedUser = JSON.parse(storedUser);
          if (parsedUser.user && typeof parsedUser.user === 'object') {
            parsedUser = { ...parsedUser.user, username: parsedUser.user.full_name || parsedUser.user.name || parsedUser.user.username, name: parsedUser.user.full_name || parsedUser.user.name };
            localStorage.setItem('user', JSON.stringify(parsedUser));
          } else if (!parsedUser.username && parsedUser.full_name) {
            parsedUser.username = parsedUser.full_name;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
          setUserData(parsedUser);
        }
        if (!token) { window.location.href = '/login'; return; }
        try {
          const userResponse = await fetch(`${API_BASE_URL}/auth/profile`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
          if (userResponse.ok) {
            const apiUser = await userResponse.json();
            const userObj = apiUser.user || apiUser;
            const updatedUser = { id: userObj.id, username: userObj.full_name || userObj.name || userObj.username || userObj.identifier, full_name: userObj.full_name || userObj.name, name: userObj.full_name || userObj.name, email: userObj.email, role: userObj.role || 'user', age: userObj.age, roll_no: userObj.roll_no };
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else if (userResponse.status === 401) {
            localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; return;
          }
        } catch (apiError) { console.log("API fetch failed, using localStorage data:", apiError); }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (!userData) { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }
      } finally { setLoading(false); }
    };
    fetchDashboardData();
  }, []);

  const handleProfileClick = async (action) => {
    if (action === 'logout') {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
      } catch (err) { console.error('Logout error:', err); } finally {
        localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login';
      }
    } else if (action === 'profile') { window.location.href = '/profile'; }
    setShowProfileMenu(false); setShowMobileMenu(false);
  };

  const getDisplayName = () => {
    if (!userData) return 'User';
    return userData.username || userData.full_name || userData.name || userData.identifier || userData.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getDisplayName();
    if (name === 'User') return 'U';
    return (name.includes('@') ? name.split('@')[0] : name).charAt(0).toUpperCase();
  };

  const toggleLang = () => {
    const next = lang === "en" ? "te" : lang === "te" ? "hi" : "en";
    setLang(next); localStorage.setItem("lang", next);
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #F9F5FF 0%, #FAE8FF 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #E9D5FF', borderTop: '4px solid #8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280', fontSize: '15px', fontWeight: '500' }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #F9F5FF 0%, #FAE8FF 100%)', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ===== HEADER ===== */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(139,92,246,0.1)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }} className="dashboard-header">
        
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }} onClick={() => window.location.href = '/'}>
            <img src={Logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="header-title">{t.appTitle}</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="header-subtitle">{t.subtitle}</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-nav">
          <button onClick={toggleLang} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '13px', fontWeight: '500', padding: '6px 10px', borderRadius: '6px', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3E8FF'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
            <Globe size={16} />{lang.toUpperCase()}
          </button>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderRadius: '8px', transition: 'all 0.3s ease', backgroundColor: showProfileMenu ? '#F3E8FF' : 'transparent' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '13px' }}>{getUserInitials()}</div>
              <div style={{ textAlign: 'left' }} className="profile-name-block">
                <p style={{ margin: 0, fontSize: '11px', color: '#9CA3AF' }}>{t.welcome},</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1F2937', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getDisplayName()}</p>
              </div>
              <ChevronDown size={16} color="#6B7280" style={{ transition: 'transform 0.3s ease', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.15)', boxShadow: '0 8px 24px rgba(139,92,246,0.15)', minWidth: '160px', overflow: 'hidden', animation: 'dropDown 0.3s ease-out', zIndex: 200 }}>
                <button onClick={() => handleProfileClick('profile')} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#1F2937', fontSize: '13px', fontWeight: '500', borderBottom: '1px solid rgba(139,92,246,0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F3E8FF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  <User size={16} color="#8B5CF6" />{t.profile}
                </button>
                <button onClick={() => handleProfileClick('logout')} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontSize: '13px', fontWeight: '500' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  <LogOut size={16} color="#EF4444" />{t.logout}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav: Avatar + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-nav">
          <button onClick={toggleLang} style={{ background: '#F3E8FF', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', color: '#8B5CF6', fontSize: '12px', fontWeight: '600' }}>
            {lang.toUpperCase()}
          </button>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }} onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {getUserInitials()}
          </div>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <Menu size={22} color="#6B7280" />
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(139,92,246,0.1)', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 90, animation: 'dropDown 0.3s ease-out' }} className="mobile-menu">
          <div style={{ padding: '10px 0', borderBottom: '1px solid #F3F4F6', marginBottom: '8px' }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#9CA3AF' }}>{t.welcome},</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1F2937' }}>{getDisplayName()}</p>
          </div>
          <button onClick={() => handleProfileClick('profile')} style={{ width: '100%', padding: '10px 0', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>
            <User size={18} color="#8B5CF6" />{t.profile}
          </button>
          <button onClick={() => handleProfileClick('logout')} style={{ width: '100%', padding: '10px 0', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontSize: '14px', fontWeight: '500' }}>
            <LogOut size={18} color="#EF4444" />{t.logout}
          </button>
        </div>
      )}

      {/* ===== MAIN ===== */}
      <main style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }} className="dashboard-main">

        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.08))', borderRadius: '14px', padding: '20px', marginBottom: '24px', border: '2px solid rgba(139,92,246,0.15)', animation: 'slideDown 0.6s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Sparkles size={26} color="#8B5CF6" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#1F2937' }}>
                {t.welcome}, {getDisplayName()}! 👋
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#8B5CF6', fontWeight: '500', lineHeight: '1.6' }}>
                {t.welcomeDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#8B5CF6" />{t.healthTips}
          </h2>
          <div className="tips-grid" style={{ display: 'grid', gap: '14px' }}>
            {healthTips.map((tip, idx) => (
              <div
                key={tip.id}
                onClick={() => setSelectedTip({ type: tip.id, index: 0 })}
                onMouseEnter={() => setHoveredTipCard(tip.id)}
                onMouseLeave={() => setHoveredTipCard(null)}
                style={{
                  height: '180px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  background: `${tip.gradient}, url(${tip.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  transition: 'all 0.3s ease',
                  transform: hoveredTipCard === tip.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredTipCard === tip.id ? '0 16px 32px rgba(139,92,246,0.35)' : '0 4px 12px rgba(0,0,0,0.1)',
                  animation: `slideUp 0.6s ease-out ${idx * 0.1}s backwards`
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '18px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{tip.icon}</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{tip.title}</h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>{tip.subtitle}</p>
                  <div style={{ fontSize: '12px', color: 'white', fontWeight: '500', opacity: 0.9 }}>{t.tapToExplore} →</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screening Tools */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '700', color: '#1F2937' }}>{t.tools}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onClick={() => window.location.href = feature.route}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '16px',
                    border: hoveredCard === feature.id ? '2px solid #8B5CF6' : '2px solid rgba(139,92,246,0.1)',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === feature.id ? 'translateX(4px)' : 'translateX(0)',
                    boxShadow: hoveredCard === feature.id ? '0 8px 24px rgba(139,92,246,0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    animation: `slideUp 0.5s ease-out ${idx * 0.1}s backwards`,
                  }}
                  className="feature-card"
                >
                  {/* Mobile: stacked, Desktop: row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={28} color={feature.color} strokeWidth={1.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>{feature.title}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }} className="feature-desc">{feature.description}</p>
                    </div>
                  </div>
                  <button
                    style={{ marginTop: '12px', width: '100%', padding: '10px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(139,92,246,0.25)' }}
                    className="feature-btn"
                  >
                    <span>✓</span>{feature.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid rgba(139,92,246,0.1)', padding: '20px 16px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }} className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B5CF6', fontSize: '13px', fontWeight: '500' }}>
            <Heart size={15} />© 2025 {t.appTitle}
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>{t.footer}</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => setShowContactModal(true)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
              onMouseEnter={(e) => e.target.style.color = '#8B5CF6'}
              onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
              {t.contact}
            </button>
            <button onClick={() => setShowHelpModal(true)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
              onMouseEnter={(e) => e.target.style.color = '#8B5CF6'}
              onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
              {t.about}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', borderTop: '1px solid rgba(139,92,246,0.05)', paddingTop: '12px', width: '100%' }}>{t.disclaimer}</div>
        </div>
      </footer>

      {/* Modals */}
      {selectedTip.type && <HealthTipModal type={selectedTip.type} tipIndex={selectedTip.index} onClose={() => setSelectedTip({ type: null, index: null })} />}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} lang={lang} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; }

        /* Mobile (default): show mobile-nav, hide desktop-nav */
        .mobile-nav { display: flex !important; }
        .desktop-nav { display: none !important; }
        .mobile-menu { display: block !important; }
        .profile-name-block { display: none !important; }

        /* Tips: 1 column on mobile */
        .tips-grid { grid-template-columns: 1fr; }

        /* Feature card: full-width button on mobile */
        .feature-btn { display: flex !important; }
        .feature-desc { display: block; }

        /* Header title: shorter on mobile */
        .header-title { font-size: 14px !important; }
        .header-subtitle { display: none !important; }

        /* Tablet (640px+) */
        @media (min-width: 640px) {
          .dashboard-header { padding: 14px 24px !important; }
          .dashboard-main { padding: 24px !important; }
          .header-title { font-size: 16px !important; }
          .header-subtitle { display: block !important; }
          .tips-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .feature-card { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 20px !important; padding: 20px !important; }
          .feature-btn { width: auto !important; margin-top: 0 !important; white-space: nowrap; flex-shrink: 0; padding: 10px 24px !important; }
        }

        /* Desktop (1024px+) */
        @media (min-width: 1024px) {
          .dashboard-header { padding: 16px 40px !important; }
          .dashboard-main { padding: 40px !important; }
          .mobile-nav { display: none !important; }
          .desktop-nav { display: flex !important; }
          .mobile-menu { display: none !important; }
          .profile-name-block { display: block !important; }
          .header-title { font-size: 18px !important; }
          .footer-inner { flex-direction: row !important; justify-content: space-between !important; text-align: left !important; }
          footer { padding: 28px 40px !important; }
          .contact-modal-inner { flex-direction: row !important; }
          .contact-map { height: 100% !important; flex: 1.2 !important; }
        }
      `}</style>
    </div>
  );
}
