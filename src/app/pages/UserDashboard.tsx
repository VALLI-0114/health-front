import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Activity, Globe, User, LogOut, ChevronDown, Sparkles, X, Clock, Target, Zap, Apple, Dumbbell, Phone, MapPin, Mail, Linkedin } from 'lucide-react';
import Logo from "../../assets/Logo.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hospital Data - Static (can be replaced with API later)
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

// Health Tips Data
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
      name: 'Child\'s Pose (Balasana)',
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
      caloriesBurned: '150-200 calories per 30 mins',
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
      caloriesBurned: '200-300 calories per 30 mins',
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
      caloriesBurned: '100-150 calories per 30 mins',
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

// Help Modal Component - NEW
const HelpModal = ({ onClose, lang }) => {
  const helpTranslations = {
    en: {
      title: "About This Project",
      author: "Author",
      developers: "Developed by",
      contact: "Contact",
      close: "Close"
    },
    te: {
      title: "ఈ ప్రాజెక్ట్ గురించి",
      author: "రచయిత",
      developers: "అభివృద్ధి చేసినవారు",
      contact: "సంప్రదించండి",
      close: "మూసివేయండి"
    },
    hi: {
      title: "इस परियोजना के बारे में",
      author: "लेखक",
      developers: "विकसित किया गया",
      contact: "संपर्क करें",
      close: "बंद करें"
    }
  };

  const t = helpTranslations[lang];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "16px",
          overflow: "hidden",
          animation: "slideUp 0.4s ease-out",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          padding: "32px",
          color: "white",
          position: "relative"
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <X size={20} color="white" />
          </button>

          <h2 style={{
            margin: "0 0 8px 0",
            fontSize: "28px",
            fontWeight: "700",
            textShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}>
            {t.title}
          </h2>
          <p style={{
            margin: 0,
            fontSize: "15px",
            opacity: 0.95
          }}>
            Women's Health Intelligence Platform
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {/* Author Section */}
          <div style={{
            marginBottom: "32px",
            padding: "20px",
            background: "linear-gradient(135deg, #F3E8FF, #FDF2F8)",
            borderRadius: "12px",
            border: "1px solid rgba(139, 92, 246, 0.2)"
          }}>
            <h3 style={{
              margin: "0 0 16px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Sparkles size={20} color="#8B5CF6" />
              {t.author}
            </h3>
            <p style={{
              margin: 0,
              fontSize: "16px",
              color: "#4B5563",
              fontWeight: "600"
            }}>
              G. Jayasuma
            </p>
          </div>

          {/* Developers Section */}
          <div style={{
            marginBottom: "32px"
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <User size={20} color="#EC4899" />
              {t.developers}
            </h3>

            {/* Developer 1 - K. Pravallika */}
            <div style={{
              marginBottom: "16px",
              padding: "16px",
              background: "#FFFFFF",
              borderRadius: "10px",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <p style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1F2937"
              }}>
                K. Pravallika
              </p>
              <a
                href="https://www.linkedin.com/in/kundum-pravallika-4a1249296/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#0A66C2",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
              >
                <Linkedin size={18} />
                LinkedIn Profile
              </a>
            </div>

            {/* Developer 2 - T. Madhu Sarvani */}
            <div style={{
              padding: "16px",
              background: "#FFFFFF",
              borderRadius: "10px",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <p style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1F2937"
              }}>
                T. Madhu Sarvani
              </p>
              <a
                href="https://www.linkedin.com/in/madhu-sarvani-381999302"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#0A66C2",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
              >
                <Linkedin size={18} />
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{
            padding: "20px",
            background: "#E0F2FE",
            border: "1px solid #7DD3FC",
            borderRadius: "12px"
          }}>
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "700",
              color: "#0C4A6E",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Mail size={18} />
              {t.contact}
            </h3>
            <a
              href="mailto:pravallikakundum18@gmail.com"
              style={{
                color: "#0369A1",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                wordBreak: "break-all"
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              pravallikakundum18@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Modal Component
const ContactModal = ({ onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: "1100px",
          height: "85vh",
          borderRadius: "16px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          overflow: "hidden",
          animation: "slideUp 0.4s ease-out",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* LEFT: MAP */}
        <div style={{ position: "relative", height: "100%" }}>
          <iframe
            title="Vizianagaram Hospitals Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30446.789!2d83.3956!3d18.1067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3be5fd17e68c99%3A0x5c9c3b8e5f8b8b8b!2sVizianagaram%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
            style={{
              border: 0,
              width: "100%",
              height: "100%",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* RIGHT: HOSPITAL LIST */}
        <div style={{ padding: "32px", overflowY: "auto", background: "linear-gradient(135deg, #F9F5FF, #FAE8FF)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: "700", color: "#1F2937" }}>
                Nearby Hospitals
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>
                Specialized care for women's health
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EF4444";
                e.currentTarget.querySelector("svg").style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
                e.currentTarget.querySelector("svg").style.color = "#6B7280";
              }}
            >
              <X size={20} color="#6B7280" />
            </button>
          </div>

          {hospitalData.map((h) => (
            <div
              key={h.id}
              style={{
                marginBottom: "16px",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "#1F2937" }}>
                {h.name}
              </h3>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <User size={16} color="#8B5CF6" />
                <p style={{ margin: 0, fontSize: "14px", color: "#4B5563" }}>
                  {h.doctor}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <MapPin size={16} color="#EC4899" />
                <p style={{ margin: 0, fontSize: "14px", color: "#4B5563" }}>
                  {h.address}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={16} color="#10B981" />
                <a
                  href={`tel:${h.phone}`}
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#10B981",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  {h.phone}
                </a>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            borderRadius: "8px",
          }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#92400E", lineHeight: "1.6" }}>
              💡 <strong>Note:</strong> For emergencies, please call 108 (Ambulance) or visit the nearest hospital immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const HealthTipModal = ({ type, tipIndex, onClose }) => {
  if (tipIndex === null) return null;

  const tips = healthTipsData[type];
  const currentTip = tips[tipIndex];
  const [currentIndex, setCurrentIndex] = useState(tipIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const tip = tips[currentIndex];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}
    onClick={onClose}
    >
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        animation: 'slideUp 0.4s ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#EF4444';
            e.currentTarget.querySelector('svg').style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.querySelector('svg').style.color = '#6B7280';
          }}
        >
          <X size={20} color="#6B7280" />
        </button>

        {/* Header Image */}
        <div style={{
          height: '280px',
          background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${tip.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px',
          color: 'white'
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            {tip.name}
          </h2>
          {type === 'yoga' && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                {tip.difficulty}
              </span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                ⏱️ {tip.duration}
              </span>
            </div>
          )}
          {type === 'nutrition' && (
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              display: 'inline-block',
              width: 'fit-content',
              fontSize: '14px'
            }}>
              {tip.category}
            </span>
          )}
          {type === 'exercise' && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                {tip.intensity}
              </span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                🔥 {tip.caloriesBurned}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Yoga Content */}
          {type === 'yoga' && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <InfoCard icon={<Clock size={20} />} label="Duration" value={tip.duration} color="#8B5CF6" />
                <InfoCard icon={<Target size={20} />} label="Best Time" value={tip.bestTime} color="#EC4899" />
              </div>

              <Section title="Steps to Perform" icon="📝">
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: '1.8' }}>
                  {tip.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                  ))}
                </ol>
              </Section>

              <Section title="Health Benefits" icon="💚">
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: '1.8' }}>
                  {tip.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{benefit}</li>
                  ))}
                </ul>
              </Section>

              {tip.precautions && (
                <div style={{
                  background: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '24px'
                }}>
                  <p style={{ margin: 0, color: '#92400E', fontSize: '14px', fontWeight: '500' }}>
                    ⚠️ <strong>Precautions:</strong> {tip.precautions}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Nutrition Content */}
          {type === 'nutrition' && (
            <>
              <Section title="Nutritional Profile" icon="📊">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '12px'
                }}>
                  {Object.entries(tip.nutrients).map(([key, value]) => (
                    <div key={key} style={{
                      background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '700' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Health Benefits for Women" icon="💚">
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: '1.8' }}>
                  {tip.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{benefit}</li>
                  ))}
                </ul>
              </Section>

              <Section title="How to Consume" icon="🍽️">
                <div style={{
                  background: '#E0F2FE',
                  border: '1px solid #7DD3FC',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <p style={{ margin: '0 0 12px 0', color: '#0C4A6E', fontSize: '14px' }}>
                    <strong>Recommended Intake:</strong> {tip.recommendedIntake}
                  </p>
                  <p style={{ margin: 0, color: '#0C4A6E', fontSize: '14px' }}>
                    <strong>Best Consumed:</strong> {tip.bestConsumedWith}
                  </p>
                </div>
              </Section>

              {tip.recipes && (
                <Section title="Recipe Ideas" icon="👩‍🍳">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {tip.recipes.map((recipe, idx) => (
                      <span key={idx} style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {recipe}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* Exercise Content */}
          {type === 'exercise' && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <InfoCard icon={<Clock size={20} />} label="Duration" value={tip.duration} color="#8B5CF6" />
                <InfoCard icon={<Zap size={20} />} label="Intensity" value={tip.intensity} color="#EC4899" />
                <InfoCard icon={<Target size={20} />} label="Best Time" value={tip.bestTime} color="#3B82F6" />
              </div>

              <Section title="How to Perform" icon="📝">
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: '1.8' }}>
                  {tip.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                  ))}
                </ol>
              </Section>

              <Section title="Health Benefits" icon="💚">
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: '1.8' }}>
                  {tip.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{benefit}</li>
                  ))}
                </ul>
              </Section>

              <div style={{
                background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '24px'
              }}>
                <p style={{ margin: 0, color: '#6B21A8', fontSize: '14px', fontWeight: '500' }}>
                  🏋️ <strong>Equipment Needed:</strong> {tip.equipment}
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <button
              onClick={handlePrev}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ← Previous
            </button>
            <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
              {currentIndex + 1} of {tips.length}
            </div>
            <button
              onClick={handleNext}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)',
    padding: '16px',
    borderRadius: '10px',
    border: `1px solid ${color}30`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>
    <div style={{ color }}>{icon}</div>
    <div>
      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '600' }}>{value}</div>
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{
      margin: '0 0 16px 0',
      fontSize: '18px',
      fontWeight: '700',
      color: '#1F2937',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span>{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

export default function HealthDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
      subtitle: "AI-Powered Anaemia & PCOD Care Platform",
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
        anaemia: {
          title: "Anaemia Detector",
          desc: "AI-based screening using haemoglobin levels and body parameters. Get early detection for better health outcomes.",
          btn: "Check Anaemia",
        },
        pcod: {
          title: "PCOD Detector",
          desc: "AI-based risk prediction using menstrual patterns and health indicators. Early screening for preventive care.",
          btn: "Check PCOD",
        },
        combined: {
          title: "Combined Health Assessment",
          desc: "Integrated Anaemia and PCOD health analysis for comprehensive screening and holistic wellness insights.",
          btn: "Check Overall Health",
        },
      },
      tips: {
        yoga: {
          title: "Yoga & Meditation",
          subtitle: "Mind-body wellness practices"
        },
        nutrition: {
          title: "Nutrition Guide",
          subtitle: "Healthy foods for women"
        },
        exercise: {
          title: "Exercise Routines",
          subtitle: "Stay active, stay healthy"
        }
      }
    },
    te: {
      appTitle: "మహిళల ఆరోగ్య మేధస్సు",
      subtitle: "AI ఆధారిత అనీమియా & PCOD సంరక్షణ",
      welcome: "మళ్లీ స్వాగతం",
      welcomeDesc: "అనీమియా మరియు PCOD ను ముందుగా గుర్తించేందుకు AI ఆధారిత ఆరోగ్య సమాచారం",
      tools: "ఆరోగ్య స్క్రీనింగ్ సాధనాలు",
      healthTips: "వారపు ఆరోగ్య చిట్కాలు",
      loading: "డ్యాష్‌బోర్డ్ లోడ్ అవుతోంది...",
      profile: "ప్రొఫైల్",
      logout: "లాగ్ అవుట్",
      footer: "AI ఆధారిత నివారణ ఆరోగ్య సంరక్షణ",
      disclaimer: "ఇవి వైద్య నిర్ధారణలు కావు",
      tapToExplore: "తెరవడానికి నొక్కండి",
      contact: "సంప్రదించండి",
      about: "గురించి",
      features: {
        anaemia: {
          title: "అనీమియా పరీక్ష",
          desc: "హిమోగ్లోబిన్ ఆధారంగా AI స్క్రీనింగ్ ద్వారా మెరుగైన ఆరోగ్య ఫలితాలు పొందండి.",
          btn: "అనీమియా తనిఖీ",
        },
        pcod: {
          title: "PCOD పరీక్ష",
          desc: "మాసిక ధర్మ సూచకాల ఆధారంగా ముందస్తు అంచనా మరియు నివారణ సంరక్షణ.",
          btn: "PCOD తనిఖీ",
        },
        combined: {
          title: "సంపూర్ణ ఆరోగ్య పరీక్ష",
          desc: "అనీమియా & PCOD సమగ్ర విశ్లేషణ మరియు సంపూర్ణ ఆరోగ్య సమాచారం.",
          btn: "ఆరోగ్య స్థితి చూడండి",
        },
      },
      tips: {
        yoga: {
          title: "యోగా & ధ్యానం",
          subtitle: "మనో-శారీరక సంరక్షణ"
        },
        nutrition: {
          title: "పోషకాహార మార్గదర్శి",
          subtitle: "మహిళలకు ఆరోగ్యకరమైన ఆహారం"
        },
        exercise: {
          title: "వ్యాయామ విధానాలు",
          subtitle: "చురుకుగా ఉండండి, ఆరోగ్యంగా ఉండండి"
        }
      }
    },
    hi: {
      appTitle: "महिला स्वास्थ्य बुद्धिमत्ता",
      subtitle: "AI आधारित एनीमिया और PCOD देखभाल",
      welcome: "स्वागत है",
      welcomeDesc: "एनीमिया और PCOD की प्रारंभिक पहचान हेतु AI आधारित स्वास्थ्य जानकारी",
      tools: "स्वास्थ्य जांच उपकरण",
      healthTips: "साप्ताहिक स्वास्थ्य सुझाव",
      loading: "डैशबोर्ड लोड हो रहा है...",
      profile: "प्रोफ़ाइल",
      logout: "लॉगआउट",
      footer: "AI आधारित निवारक स्वास्थ्य सेवा",
      disclaimer: "यह चिकित्सीय निदान नहीं है",
      tapToExplore: "खोलने के लिए क्लिक करें",
      contact: "संपर्क करें",
      about: "के बारे में",
      features: {
        anaemia: {
          title: "एनीमिया जांच",
          desc: "बेहतर स्वास्थ्य परिणामों के लिए हीमोग्लोबिन आधारित AI स्क्रीनिंग।",
          btn: "एनीमिया जांचें",
        },
        pcod: {
          title: "PCOD जांच",
          desc: "मासिक धर्म संकेतकों पर आधारित निवारक देखभाल और प्रारंभिक स्क्रीनिंग।",
          btn: "PCOD जांचें",
        },
        combined: {
          title: "संयुक्त स्वास्थ्य जांच",
          desc: "एनीमिया और PCOD का व्यापक विश्लेषण और समग्र स्वास्थ्य जानकारी।",
          btn: "स्वास्थ्य जांचें",
        },
      },
      tips: {
        yoga: {
          title: "योग और ध्यान",
          subtitle: "मन-शरीर कल्याण"
        },
        nutrition: {
          title: "पोषण गाइड",
          subtitle: "महिलाओं के लिए स्वस्थ भोजन"
        },
        exercise: {
          title: "व्यायाम दिनचर्या",
          subtitle: "सक्रिय रहें, स्वस्थ रहें"
        }
      }
    },
  };

  const t = translations[lang];

  const features = [
    {
      id: 1,
      icon: Droplets,
      title: t.features.anaemia.title,
      description: t.features.anaemia.desc,
      buttonText: t.features.anaemia.btn,
      color: '#8B5CF6',
      route: '/anaemia-check'
    },
    {
      id: 2,
      icon: Heart,
      title: t.features.pcod.title,
      description: t.features.pcod.desc,
      buttonText: t.features.pcod.btn,
      color: '#EC4899',
      route: '/pcod-check'
    },
    {
      id: 3,
      icon: Activity,
      title: t.features.combined.title,
      description: t.features.combined.desc,
      buttonText: t.features.combined.btn,
      color: '#9333EA',
      route: '/combined-check'
    }
  ];

  const healthTips = [
    {
      id: 'yoga',
      title: t.tips.yoga.title,
      subtitle: t.tips.yoga.subtitle,
      icon: '🧘‍♀️',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9))'
    },
    {
      id: 'nutrition',
      title: t.tips.nutrition.title,
      subtitle: t.tips.nutrition.subtitle,
      icon: '🥗',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(251, 113, 133, 0.9))'
    },
    {
      id: 'exercise',
      title: t.tips.exercise.title,
      subtitle: t.tips.exercise.subtitle,
      icon: '🏃‍♀️',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))'
    }
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
            parsedUser = {
              ...parsedUser.user,
              username: parsedUser.user.full_name || parsedUser.user.name || parsedUser.user.username,
              name: parsedUser.user.full_name || parsedUser.user.name,
            };
            localStorage.setItem('user', JSON.stringify(parsedUser));
          } else if (!parsedUser.username && parsedUser.full_name) {
            parsedUser.username = parsedUser.full_name;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
          
          setUserData(parsedUser);
        }

        if (!token) {
          window.location.href = '/login';
          return;
        }

        try {
          const userResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (userResponse.ok) {
            const apiUser = await userResponse.json();
            const userObj = apiUser.user || apiUser;
            
            const updatedUser = {
              id: userObj.id,
              username: userObj.full_name || userObj.name || userObj.username || userObj.identifier,
              full_name: userObj.full_name || userObj.name,
              name: userObj.full_name || userObj.name,
              email: userObj.email,
              role: userObj.role || 'user',
              age: userObj.age,
              roll_no: userObj.roll_no,
            };
            
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else if (userResponse.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
        } catch (apiError) {
          console.log("API fetch failed, using localStorage data:", apiError);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (!userData) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleProfileClick = async (action) => {
    if (action === 'logout') {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (action === 'profile') {
      window.location.href = '/profile';
    }
    setShowProfileMenu(false);
  };

  const handleScreeningClick = (route) => {
    window.location.href = route;
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleTipClick = (tipType) => {
    setSelectedTip({ type: tipType, index: 0 });
  };

  const getDisplayName = () => {
    if (!userData) return 'User';
    return userData.username || userData.full_name || userData.name || userData.identifier || userData.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getDisplayName();
    if (name === 'User') return 'U';
    const displayName = name.includes('@') ? name.split('@')[0] : name;
    return displayName.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F9F5FF 0%, #FAE8FF 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid #E9D5FF', 
            borderTop: '4px solid #8B5CF6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: '500' }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F9F5FF 0%, #FAE8FF 100%)',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            cursor: 'pointer'
          }}
          onClick={handleLogoClick}
          >
           <img
  src={Logo}
  alt="Qubito Logo"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }}
/>

          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1F2937' }}>
              {t.appTitle}
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9CA3AF' }}>
              {t.subtitle}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => {
              const next = lang === "en" ? "te" : lang === "te" ? "hi" : "en";
              setLang(next);
              localStorage.setItem("lang", next);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3E8FF'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Globe size={18} />
            {lang.toUpperCase()}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: showProfileMenu ? '#F3E8FF' : 'transparent'
              }}
              onMouseEnter={(e) => !showProfileMenu && (e.currentTarget.style.backgroundColor = '#F3E8FF')}
              onMouseLeave={(e) => !showProfileMenu && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {getUserInitials()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{t.welcome},</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                  {getDisplayName()}
                </p>
              </div>
              <ChevronDown size={18} color="#6B7280" style={{
                transition: 'transform 0.3s ease',
                transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)'
              }} />
            </button>

            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)',
                minWidth: '180px',
                overflow: 'hidden',
                animation: 'dropDown 0.3s ease-out'
              }}>
                <button
                  onClick={() => handleProfileClick('profile')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#1F2937',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F3E8FF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <User size={18} color="#8B5CF6" />
                  {t.profile}
                </button>
                <button
                  onClick={() => handleProfileClick('logout')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#EF4444',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={18} color="#EF4444" />
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: '40px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.08))',
          borderRadius: '14px',
          padding: '32px 36px',
          marginBottom: '40px',
          border: '2px solid rgba(139, 92, 246, 0.15)',
          animation: 'slideDown 0.6s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <Sparkles size={32} color="#8B5CF6" strokeWidth={2} />
            <div>
              <h2 style={{
                margin: '0 0 6px 0',
                fontSize: '22px',
                fontWeight: '700',
                color: '#1F2937'
              }}>
                {t.welcome}, {getDisplayName()}! 👋
              </h2>
              <p style={{
                margin: 0,
                fontSize: '15px',
                color: '#8B5CF6',
                fontWeight: '500',
                lineHeight: '1.6'
              }}>
                {t.welcomeDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Health Tips Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1F2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={24} color="#8B5CF6" />
            {t.healthTips}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {healthTips.map((tip, idx) => (
              <div
                key={tip.id}
                onClick={() => handleTipClick(tip.id)}
                onMouseEnter={() => setHoveredTipCard(tip.id)}
                onMouseLeave={() => setHoveredTipCard(null)}
                style={{
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  background: `${tip.gradient}, url(${tip.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: hoveredTipCard === tip.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredTipCard === tip.id 
                    ? '0 20px 40px rgba(139, 92, 246, 0.4), 0 0 0 3px #8B5CF6'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  animation: `slideUp 0.6s ease-out ${idx * 0.15}s backwards`
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: hoveredTipCard === tip.id 
                    ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))'
                    : 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))',
                  transition: 'background 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '12px',
                    transform: hoveredTipCard === tip.id ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    {tip.icon}
                  </div>
                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    {tip.title}
                  </h3>
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.3)'
                  }}>
                    {tip.subtitle}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'white',
                    fontWeight: '500',
                    opacity: hoveredTipCard === tip.id ? 1 : 0.8,
                    transform: hoveredTipCard === tip.id ? 'translateX(5px)' : 'translateX(0)',
                    transition: 'all 0.3s ease'
                  }}>
                    {t.tapToExplore} →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detectors Section */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1F2937'
          }}>
            {t.tools}
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleScreeningClick(feature.route)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '26px 30px',
                    border: hoveredCard === feature.id ? '2px solid #8B5CF6' : '2px solid rgba(139, 92, 246, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: hoveredCard === feature.id ? 'translateX(8px)' : 'translateX(0)',
                    boxShadow: hoveredCard === feature.id 
                      ? '0 12px 32px rgba(139, 92, 246, 0.2)'
                      : '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    animation: `slideUp 0.5s ease-out ${idx * 0.12}s backwards`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '28px',
                    width: '100%'
                  }}
                >
                  <div style={{
                    width: '68px',
                    height: '68px',
                    background: 'linear-gradient(135deg, #F3E8FF, #FDF2F8)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === feature.id ? 'scale(1.12) rotate(-5deg)' : 'scale(1)',
                    boxShadow: hoveredCard === feature.id ? `0 8px 16px ${feature.color}20` : 'none'
                  }}>
                    <Icon size={38} color={feature.color} strokeWidth={1.5} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 10px 0',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1F2937'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#6B7280',
                      lineHeight: '1.6'
                    }}>
                      {feature.description}
                    </p>
                  </div>

                  <button
                    style={{
                      padding: '12px 32px',
                      background: hoveredCard === feature.id
                        ? 'linear-gradient(90deg, #7C3AED, #D946EF)'
                        : 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      flexShrink: 0,
                      transform: hoveredCard === feature.id ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: hoveredCard === feature.id
                        ? '0 8px 20px rgba(139, 92, 246, 0.3)'
                        : '0 4px 12px rgba(139, 92, 246, 0.2)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>✓</span>
                    {feature.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(139, 92, 246, 0.1)',
        padding: '28px 40px',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8B5CF6',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            <Heart size={16} />
            © 2025 {t.appTitle}
          </div>

          <div style={{
            fontSize: '13px',
            color: '#6B7280',
            fontWeight: '500'
          }}>
            {t.footer}
          </div>

          <div style={{
            display: 'flex',
            gap: '24px'
          }}>
            <button
              onClick={() => setShowContactModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#8B5CF6'}
              onMouseLeave={(e) => e.target.style.color = '#6B7280'}
            >
              {t.contact}
            </button>
            <button 
              onClick={() => setShowHelpModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#8B5CF6'}
              onMouseLeave={(e) => e.target.style.color = '#6B7280'}
            >
              {t.about}
            </button>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '18px',
          fontSize: '12px',
          color: '#9CA3AF',
          borderTop: '1px solid rgba(139, 92, 246, 0.05)',
          paddingTop: '18px'
        }}>
          {t.disclaimer}
        </div>
      </footer>

      {/* Health Tip Modal */}
      {selectedTip.type && (
        <HealthTipModal
          type={selectedTip.type}
          tipIndex={selectedTip.index}
          onClose={() => setSelectedTip({ type: null, index: null })}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} lang={lang} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
