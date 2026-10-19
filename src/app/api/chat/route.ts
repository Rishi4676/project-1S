import { NextRequest, NextResponse } from 'next/server';
import { getLiveWeather, getLiveMandiPrices, getLiveAgriNews } from '@/lib/api';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  location?: {
    name?: string;
    district?: string;
    lat?: number;
    lng?: number;
  };
  language?: 'en' | 'ta';
}

const AGRI_KEYWORDS = [
  'crop', 'paddy', 'rice', 'cotton', 'tomato', 'sugarcane', 'maize', 'groundnut', 'onion', 'coconut',
  'wheat', 'vegetable', 'fruit', 'plant', 'harvest', 'sow', 'seed', 'yield', 'acre', 'field',
  'soil', 'fertilizer', 'urea', 'dap', 'mop', 'npk', 'manure', 'compost', 'vermicompost', 'carbon', 'ph',
  'water', 'irrigation', 'drip', 'borewell', 'pond', 'rain', 'monsoon', 'drought', 'weather', 'temp', 'spray',
  'pest', 'disease', 'fungus', 'insect', 'worm', 'bollworm', 'blight', 'leaf', 'root', 'rot', 'pesticide', 'neem',
  'scheme', 'subsidy', 'pm-kisan', 'pmkisan', 'kusum', 'solar', 'insurance', 'pmfby', 'mandi', 'price',
  'organic', 'panchagavya', 'jeevamrutham', 'bio', 'cow', 'dairy', 'livestock', 'cattle', 'goat', 'poultry',
  'விவசாயம்', 'பயிர்', 'நெல்', 'தக்காளி', 'பருத்தி', 'மண்', 'உரம்', 'யூரியா', 'பாசனம்', 'சொட்டுநீர்',
  'பூச்சி', 'நோய்', 'மருந்து', 'வானிலை', 'மழை', 'மானிய', 'திட்டம்', 'சந்தை', 'மாடு', 'ஆடு', 'விதை'
];

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { messages, location, language = 'en' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid query message.' },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content?.trim();
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'Query message cannot be empty.' },
        { status: 400 }
      );
    }

    const isTamil = language === 'ta' || /[\u0B80-\u0BFF]/.test(lastUserMessage);
    const lowerQuery = lastUserMessage.toLowerCase();

    // 1. Check if query is agricultural
    const isAgri = AGRI_KEYWORDS.some((kw) => lowerQuery.includes(kw));

    // Handle non-agricultural queries strictly and politely
    if (!isAgri && lowerQuery.length > 5) {
      const nonAgriExemptions = ['hi', 'hello', 'who are you', 'help', 'வணக்கம்', 'யார் நீ'];
      const isGreeting = nonAgriExemptions.some((g) => lowerQuery.startsWith(g));

      if (!isGreeting) {
        const redirectMessage = isTamil
          ? 'வணக்கம்! நான் கிசான் மித்ரா AI வேளாண்மை உதவியாளர். பயிர் சாகுபடி, மண் நலம், உரம், பூச்சி மேலாண்மை, பாசனம், மானியங்கள் மற்றும் கால்நடை பராமரிப்பு தொடர்பான விவசாயக் கேள்விகளுக்கு மட்டுமே நான் வழிகாட்டுகிறேன். உங்கள் விவசாயம் தொடர்பாக ஏதேனும் கேள்வி இருந்தால் கேட்கவும்.'
          : 'Hello! I am Kisan Mitra AI, an agriculture-dedicated advisor. I can only answer questions related to crop cultivation, soil health, fertilizers, pest control, irrigation, government schemes, and livestock. Please ask an agriculture-related question.';
        
        return NextResponse.json({
          reply: redirectMessage,
          isAgricultural: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    }

    // 2. Check if external AI API Key is provided (e.g. GEMINI_API_KEY)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const systemPrompt = `You are "Kisan Mitra AI", an expert agricultural advisor collaborating with ICAR and TNAU standards.
Your role: Provide safe, scientifically verified, practical farming advice to farmers.
Topics: Crops, soil health, fertilizers (exact NPK/Urea/DAP dosage), irrigation (FAO-56 drip run-time), crop diseases and organic/chemical treatments (CIBRC verified), weather farming advice, subsidies (PM-KISAN, PM-KUSUM, PMFBY), and livestock.
Guidelines:
1. Always keep advice actionable, safe, and farmer-friendly.
2. If language is Tamil (${isTamil ? 'true' : 'false'}), respond fluently in natural Tamil (தமிழ்).
3. If user location is known (${location?.name || 'Tamil Nadu'}), use regional agricultural context.
4. If a question is not related to agriculture, politely decline and redirect to farming topics.
5. If pest or crop symptoms are vague, ask for crop age, leaf symptoms, or soil type.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                ...messages.map((m) => ({
                  role: m.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: m.content }],
                })),
              ],
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.4,
              },
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const generatedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
          return NextResponse.json({
            reply: generatedText,
            source: 'Gemini-1.5-Flash (Agri Engine)',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      } catch (externalErr) {
        console.warn('External AI call failed, falling back to local expert engine:', externalErr);
      }
    }

    // 3. High-Performance Agronomic Expert Knowledge Engine
    // Generates safe, practical ICAR/TNAU certified advice tailored to query
    const reply = await generateExpertAgriResponse(lowerQuery, isTamil, location);

    return NextResponse.json({
      reply,
      source: 'ICAR-TNAU Agricultural Expert Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Agri Chatbot API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process farming query. Please try again in a moment.' },
      { status: 500 }
    );
  }
}

async function generateExpertAgriResponse(
  query: string,
  isTa: boolean,
  location?: { name?: string; district?: string; lat?: number; lng?: number }
): Promise<string> {
  const locName = location?.name?.split(' ')[0] || (isTa ? 'உங்கள் பகுதி' : 'Your area');

  // GREETINGS
  if (query.includes('hello') || query.includes('hi') || query.includes('who are you') || query.includes('வணக்கம்') || query.includes('யார் நீ')) {
    return isTa
      ? `வணக்கம்! நான் கிசான் மித்ரா (Kisan Mitra) விவசாய AI ஆலோசகர். ${locName} பகுதிக்கான பயிர் சாகுபடி, மண் பரிசோதனை, உரம் கணக்கீடு, பூச்சி/நோய் கட்டுப்பாடு, சொட்டுநீர்ப் பாசனம், அரசு மானியங்கள் மற்றும் சந்தை விலைகள் பற்றி என்னிடம் கேட்கலாம். இன்று உங்கள் வயலுக்கு நான் எவ்வாறு உதவட்டும்?`
      : `Hello! I am Kisan Mitra, your dedicated AI Agriculture Assistant for ${locName}. You can ask me about crop selection, soil test & NPK dosage, pest & disease identification, drip irrigation timing, live government subsidies, and Mandi prices. How can I help your farm today?`;
  }

  // WEATHER & SPRAY ADVISORY (with Live Data Verification)
  if (query.includes('weather') || query.includes('வானிலை') || query.includes('rain') || query.includes('மழை') || query.includes('spray') || query.includes('தெளிக்க')) {
    try {
      const lat = location?.lat || 9.9252;
      const lng = location?.lng || 78.1198;
      const liveData = await getLiveWeather(lat, lng, location?.name || 'Local Station');

      if (isTa) {
        return `🌦️ **${liveData.locationName} நேரலை வானிலை அறிக்கை (Open-Meteo Real-Time)**:\n` +
          `• தற்போதைய வெப்பநிலை: **${liveData.temp}°C** (உணரப்படுவது: ${liveData.feelsLike}°C)\n` +
          `• மழை வாய்ப்பு: **${liveData.rainProbability}%**\n` +
          `• ஈரப்பதம்: **${liveData.humidity}%** | காற்றின் வேகம்: **${liveData.windSpeed} km/h**\n\n` +
          `💧 **மருந்து தெளிப்பு ஆலோசனை**: **${liveData.sprayAdvisory}** — ${liveData.sprayMessage}\n\n` +
          `📌 *ஆலோசனை*: காற்று 15 km/h-க்கு குறைவாகவும் மழை வாய்ப்பு 20%-க்கு குறைவாகவும் இருக்கும் போது மட்டுமே பூச்சிக்கொல்லி மருந்துகளை தெளிக்கவும்.`;
      } else {
        return `🌦️ **Real-Time Weather Report for ${liveData.locationName} (Open-Meteo API)**:\n` +
          `• Current Temperature: **${liveData.temp}°C** (Feels like ${liveData.feelsLike}°C)\n` +
          `• Rain Probability: **${liveData.rainProbability}%**\n` +
          `• Relative Humidity: **${liveData.humidity}%** | Wind Speed: **${liveData.windSpeed} km/h**\n\n` +
          `💧 **Spray Window Status**: **${liveData.sprayAdvisory}** — ${liveData.sprayMessage}\n\n` +
          `📌 *Field Tip*: Always spray liquid fertilizers or insecticides in early morning (6:30–9:00 AM) or late afternoon (4:30–6:00 PM) to avoid UV degradation and leaf scorching.`;
      }
    } catch (e) {
      return isTa
        ? `வானிலை தகவல் பெற முடியவில்லை. பொதுவாக 20%-க்கு மேல் மழை வாய்ப்பு இருக்கும் போது பூச்சிக்கொல்லி தெளிப்பதை தவிர்க்கவும்.`
        : `Could not retrieve live weather at this moment. As a standard safety rule, avoid spraying chemicals if rain probability exceeds 25% or wind speed exceeds 15 km/h.`;
    }
  }

  // MANDI MARKET PRICES
  if (query.includes('mandi') || query.includes('price') || query.includes('விலை') || query.includes('சந்தை') || query.includes('market')) {
    const prices = await getLiveMandiPrices();
    if (isTa) {
      const priceLines = prices.map((p) => `• **${p.commodityTa}** (${p.mandiLocation}): **₹${p.modalPrice.toLocaleString('en-IN')}/குவிண்டால்** [போக்கு: ${p.trend === 'UP' ? '📈 உயர்வு' : '📊 சீரானது'}]`).join('\n');
      return `📊 **நேரலை APMC மண்டை சந்தை விலை நிலவரம் (Live Verified Feed)**:\n\n${priceLines}\n\n📌 *குறிப்பு*: அரசு நேரடி நெல் கொள்முதல் நிலையங்களில் (DPC) பொது ரக நெல்லுக்கு குறைந்தபட்ச ஆதரவு விலை (MSP) குவிண்டாலுக்கு ₹2,300-2,350 வழங்கப்படுகிறது.`;
    } else {
      const priceLines = prices.map((p) => `• **${p.commodityEn}** (${p.mandiLocation}): **₹${p.modalPrice.toLocaleString('en-IN')}/Qtl** [Trend: ${p.trend}]`).join('\n');
      return `📊 **Live Agricultural Mandi Market Rates (APMC Verified)**:\n\n${priceLines}\n\n📌 *MSP Notice*: Central Govt Minimum Support Price (MSP) for Paddy common variety is active at local Direct Purchase Centers. Check our Schemes page for subsidy details.`;
    }
  }

  // PESTS & DISEASES (Tomato Blight, Paddy Blast, Bollworm, Mealybugs)
  if (query.includes('pest') || query.includes('disease') || query.includes('பூச்சி') || query.includes('நோய்') || query.includes('leaf') || query.includes('இலை') || query.includes('blight') || query.includes('blast') || query.includes('bollworm')) {
    if (query.includes('paddy') || query.includes('rice') || query.includes('நெல்')) {
      return isTa
        ? `🌾 **நெல் பயிர் நோய் & பூச்சி மேலாண்மை (TNAU வழிகாட்டல்)**:\n\n` +
          `1. **குலை நோய் (Blast)**: இலைகளில் கண் வடிவ அல்லது வைர வடிவ புள்ளிகள் தோன்றும்.\n` +
          `   • *இயற்கை கட்டுப்பாடு*: சூடோமோனாஸ் புளோரசன்ஸ் 10 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.\n` +
          `   • *ரசாயன தீர்வு*: டிரைசைக்ளசோல் 75% WP @ 0.6 கிராம்/லிட்டர் தண்ணீரில் தெளிக்கவும்.\n\n` +
          `2. **இலை சுருட்டுப் புழு (Leaf Folder)**: இலைகள் நீளவாக்கில் சுருண்டு காணப்படும்.\n` +
          `   • *தீர்வு*: ஏக்கருக்கு 5 மஞ்சள் ஒட்டுப் பொறிகள் வைக்கவும் அல்லது வேப்ப எண்ணெய் 3% (30 மி.லி/லிட்டர்) தெளிக்கவும்.\n\n` +
          `📌 நீங்கள் எந்த அறிகுறியைக் காண்கிறீர்கள்? உங்கள் பயிரின் வயதை குறிப்பிட்டால் கூடுதல் துல்லியமாக உதவ முடியும்.`
        : `🌾 **Paddy / Rice Disease & Pest Management (ICAR & TNAU Standards)**:\n\n` +
          `1. **Blast Fungus (Pyricularia oryzae)**: Diamond/spindle-shaped lesions with grey centers.\n` +
          `   • *Bio-Control*: Spray *Pseudomonas fluorescens* @ 10g/L or NSKE 5%.\n` +
          `   • *Chemical Standard*: Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L at boot-leaf stage.\n\n` +
          `2. **Paddy Leaf Folder**: Leaves folded longitudinally with white scrapes.\n` +
          `   • *Remedy*: Release *Trichogramma chilonis* egg parasitoids @ 5 cards/ha or spray Neem Seed Kernel Extract (NSKE 5%).\n\n` +
          `📌 What symptoms are visible on your field? Share your crop age (days after transplanting) for exact dosage.`;
    }

    if (query.includes('tomato') || query.includes('தக்காளி')) {
      return isTa
        ? `🍅 **தக்காளி இலை கருகல் & காய்ப்புழு மேலாண்மை**:\n\n` +
          `1. **கொள்ளை நோய் / இலைக் கருகல் (Late Blight)**: இலை விளிம்புகளில் கருமை நிற நீர் போன்ற புள்ளிகள்.\n` +
          `   • *தீர்வு*: காப்பர் ஆக்சிகுளோரைடு (COC 50% WP) 2.5 கிராம்/லிட்டர் அல்லது மேன்கோசெப் 75% WP 2 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.\n\n` +
          `2. **காய்ப்புழு (Fruit Borer)**: காய்களில் துளைகள் காணப்படும்.\n` +
          `   • *தீர்வு*: ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை (Pheromone traps) அமைக்கவும். தீவிர தாக்குதலுக்கு குளோராண்ட்ரானிலிப்ரோல் 18.5% SC @ 0.3 மி.லி/லிட்டர் தெளிக்கவும்.`
        : `🍅 **Tomato Blight & Fruit Borer Diagnostic Solutions**:\n\n` +
          `1. **Late Blight (Phytophthora infestans)**: Dark water-soaked lesions on leaf margins rapidly expanding under humid weather.\n` +
          `   • *Treatment*: Spray Copper Oxychloride 50% WP @ 2.5g/L or Mancozeb 75% WP @ 2g/L. Ensure complete undersurface leaf coverage.\n\n` +
          `2. **Tomato Fruit Borer (Helicoverpa armigera)**: Caterpillars boring into fruits with entry holes.\n` +
          `   • *Bio-Treatment*: Install Helilure Pheromone traps @ 5/acre. Spray *Bacillus thuringiensis* (Bt) @ 2g/L or Neem formulation 10,000 ppm @ 2ml/L.`;
    }

    return isTa
      ? `🐛 **பொதுவான பயிர் பாதுகாப்பு வழிகாட்டல்**:\n` +
        `• சாறு உறிஞ்சும் பூச்சிகளுக்கு (அசுவினி, தத்துப்பூச்சி): வேப்ப எண்ணெய் 3% அல்லது இமிடாக்ளோப்ரிட் 17.8% SL @ 0.3 மி.லி/லிட்டர்.\n` +
        `• பூஞ்சை நோய்களுக்கு: சூடோமோனாஸ் அல்லது டிரைக்கோடெர்மா விரிடி இயற்கை பூஞ்சாணக்கொல்லி 5 கிராம்/லிட்டர்.\n\n` +
        `📌 துல்லியமான மருந்து பரிந்துரைக்கு உங்கள் **பயிரின் பெயர்** மற்றும் **இலைகளில் காணப்படும் அறிகுறிகளை** (மஞ்சள் நிறம், புள்ளிகள், சுருட்டல்) விரிவாகக் கூறவும்.`
      : `🐛 **Crop Pest & Disease Advisory (ICAR Protocols)**:\n` +
        `• **Sucking Pests (Aphids, Jassids, Thrips)**: Spray 3% Neem Oil with mild soap or Imidacloprid 17.8% SL @ 0.3ml/L.\n` +
        `• **Fungal Leaf Spots**: Spray Mancozeb 75% WP @ 2g/L or apply bio-fungicide *Trichoderma viride* @ 5g/L.\n\n` +
        `📌 For an exact recommendation, please specify: (1) Crop name, (2) Plant stage/age, and (3) Visual symptoms (leaf curling, discoloration, spots).`;
  }

  // FERTILIZERS & SOIL HEALTH (NPK, Urea, DAP, Soil Types)
  if (query.includes('fertilizer') || query.includes('உரம்') || query.includes('soil') || query.includes('மண்') || query.includes('urea') || query.includes('யூரியா') || query.includes('dap') || query.includes('npk')) {
    return isTa
      ? `🧪 **மண் வளம் & உரம் பயன்பாட்டு வழிகாட்டி (ICAR RDF தரநிலை)**:\n\n` +
        `1. **அடி உரம் (Basal Application)**: நடவு அல்லது விதைப்பின் போது பாஸ்பரஸ் (DAP) முழு அளவையும், யூரியா மற்றும் பொட்டாஷில் (MOP) 40% அளவையும் இட வேண்டும்.\n` +
        `2. **மேல் உரம் (Top Dressing)**:\n` +
        `   • தூர்கட்டும் பருவம் (30-35 நாள்): யூரியா 30% + பொட்டாஷ் 25%\n` +
        `   • பூக்கும் பருவம் (55-60 நாள்): எஞ்சிய யூரியா 30% + பொட்டாஷ் 25%\n\n` +
        `🌱 **மண் வளம் பெருக்க**: ஏக்கருக்கு 5 டன் மக்கிய தொழுஉரம் + 100 கி.கி வேப்பம் பிண்ணாக்கு இடுவது மண்ணின் நுண்ணுயிர் பெருக்கத்தை அதிகரித்து நைட்ரஜன் விரயத்தைத் தடுக்கும்.\n\n` +
        `📌 துல்லியமான எடையைக் கணக்கிட முகப்பில் உள்ள **மண் & உரம் கால்குலேட்டர் (Soil Calculator)** பக்கத்தைப் பயன்படுத்தலாம்!`
      : `🧪 **Scientific Soil & Fertilizer Management (ICAR & TNAU Recommended Dose)**:\n\n` +
        `1. **Basal Dose (Land Preparation / Sowing)**:\n` +
        `   • Apply 100% of required Phosphorus (DAP/SSP), along with 40% Nitrogen (Urea) and 50% Potassium (MOP).\n` +
        `   • Mix with 100 kg Neem Cake per acre to slow down nitrogen leaching.\n\n` +
        `2. **Split Top Dressing Schedule**:\n` +
        `   • **Vegetative Stage (30 Days)**: 30% Urea + 25% MOP.\n` +
        `   • **Flowering/Panicle Initiation (60 Days)**: Remaining 30% Urea + 25% MOP.\n\n` +
        `🌱 **Organic Enrichment**: Incorporate 5 tonnes well-decomposed FYM or 1 tonne Vermicompost with *Azospirillum* & *Phosphobacteria* @ 2 kg/acre.\n\n` +
        `📌 You can calculate the exact kilograms for your acreage directly on our **Soil Calculator** tool!`;
  }

  // IRRIGATION & WATER TABLE
  if (query.includes('irrigation') || query.includes('பாசனம்') || query.includes('water') || query.includes('தண்ணீர்') || query.includes('drip') || query.includes('சொட்டுநீர்') || query.includes('borewell') || query.includes('போர்வெல்')) {
    return isTa
      ? `💧 **சொட்டுநீர்ப் பாசனம் & நிலத்தடி நீர் வழிகாட்டல்**:\n\n` +
        `• **பாசன நேரம்**: தக்காளி, பருத்தி மற்றும் காய்கறிப் பயிர்களுக்கு நாள் ஒன்றுக்கு 1.5 முதல் 2.5 மணி நேரம் சொட்டுநீர்ப் பாசனம் போதுமானது (டிரிப்பர் வேகம்: 4 லிட்டர்/மணி).\n` +
        `• **பாசன நேரம் அட்டவணை**: காலை 6:00 - 8:00 மணி அல்லது மாலை 5:00 - 7:00 மணிக்கு பாசனம் செய்வது ஆவியாதல் இழப்பைக் குறைக்கும்.\n` +
        `• **போர்வெல் பாதுகாப்பு**: மழைநீரை போர்வெல் அருகில் 10x10 அடி வடிகட்டி குழி அமைத்து நிலத்தடிக்குள் செலுத்துவதன் மூலம் நீர் மட்டம் உயரும்.\n\n` +
        `📌 துல்லியமான தினசரி பாசன நேரத்திற்கு நமது **பாசன வழிகாட்டி (Smart Irrigation)** பக்கத்தைப் பார்வையிடவும்.`
      : `💧 **Smart Irrigation & Groundwater Advisory (FAO-56 Protocol)**:\n\n` +
        `• **Drip Run-Time**: For vegetables and cash crops (Tomato, Cotton, Chillies), standard drip run-time is 1.5 to 2.5 hours/day (with 4 LPH drippers).\n` +
        `• **Optimal Timing**: Split irrigation into early morning (6:00–8:00 AM) and evening (5:00–7:00 PM) to avoid solar evaporation loss.\n` +
        `• **Borewell Recharge**: Install a sand-gravel filter pit (10x10 ft) near borewell heads to divert surface monsoon runoff and elevate water table depth.\n\n` +
        `📌 Visit our **Smart Irrigation** and **Groundwater Radar** pages for customized farm pond dimensions and run-times.`;
  }

  // GOVERNMENT SCHEMES & SUBSIDIES
  if (query.includes('scheme') || query.includes('subsidy') || query.includes('திட்டம்') || query.includes('pm-kisan') || query.includes('kusum') || query.includes('மானியம்')) {
    return isTa
      ? `🏛️ **முக்கிய அரசு விவசாய மானியத் திட்டங்கள் (2026-27 நேரலை)**:\n\n` +
        `1. **பிரதமர் கிசான் (PM-KISAN)**: தகுதியுள்ள அனைத்து விவசாயிகளுக்கும் ஆண்டுக்கு ₹6,000 (3 தவணைகளாக ₹2,000). ஆதார் e-KYC pmkisan.gov.in தளத்தில் கட்டாயம்.\n` +
        `2. **பிரதமர் குசும் (PM-KUSUM)**: விவசாய பம்ப்செட்டுகளுக்கு 80% மானியத்தில் சோலார் பம்புகள் வழங்கும் திட்டம்.\n` +
        `3. **சொட்டுநீர்ப் பாசன மானியம் (KAVIASP)**: சிறு மற்றும் குறு விவசாயிகளுக்கு 100% இலவச சொட்டுநீர் அமைப்பு, இதர விவசாயிகளுக்கு 75% மானியம்.\n` +
        `4. **பயிர் காப்பீடு (PMFBY)**: குறைந்த பிரீமியத்தில் (ரபி 1.5%, காரிஃப் 2%) இயற்கை பேரிடர் இழப்பீட்டு பாதுகாப்பு.\n\n` +
        `📌 நேரடி இணையதளத்தில் விண்ணப்பிக்க முகப்பில் உள்ள **நேரலை திட்டங்கள் (Live Schemes)** பக்கத்திற்குச் செல்லவும்.`
      : `🏛️ **Key Government Agricultural Schemes & Grants (2026-27 Active)**:\n\n` +
        `1. **PM-KISAN Samman Nidhi**: ₹6,000/year in 3 installments of ₹2,000 directly to farmer bank accounts. Aadhaar e-KYC mandatory on pmkisan.gov.in.\n` +
        `2. **PM-KUSUM Solar Scheme**: Up to 80% subsidy on 5HP & 7.5HP off-grid solar agriculture pumpsets.\n` +
        `3. **Micro-Irrigation Subsidy (PMKSY / KAVIASP)**: 100% free drip irrigation for small & marginal farmers (<5 acres); 75% subsidy for other farmers in Tamil Nadu.\n` +
        `4. **PMFBY Crop Insurance**: Comprehensive financial cover against floods, drought, and pests at subsidized premiums (1.5% Rabi / 2.0% Kharif).\n\n` +
        `📌 To apply directly, visit our **Live Schemes** directory page with official portal links.`;
  }

  // LIVESTOCK & DAIRY
  if (query.includes('cow') || query.includes('dairy') || query.includes('cattle') || query.includes('மாடு') || query.includes('கால்நடை') || query.includes('goat') || query.includes('ஆடு')) {
    return isTa
      ? `🐄 **கால்நடை & பால்பண்ணை பராமரிப்பு ஆலோசனை**:\n\n` +
        `• **தீவன மேலாண்மை**: கறவை மாடுகளுக்கு 10-15 கி.கி பசுந்தீவனம் (கோ.எஃப்.எஸ் 29 / நேப்பியர்) + 5 கி.கி உலர் தீவனம் + 2-3 கி.கி அடர்தீவனம் அளிக்க வேண்டும்.\n` +
        `• **அசோலா (Azolla) தீவனம்**: பசுந்தீவனத்துடன் நாள் ஒன்றுக்கு 1.5-2 கி.கி அசோலா கொடுப்பது பால் உற்பத்தியை 10-15% வரை அதிகரிக்கும் மற்றும் புரத சத்தை கூட்டும்.\n` +
        `• **தடுப்பூசி**: கோமாரி நோய் (FMD) தடுப்பூசியை 6 மாதங்களுக்கு ஒருமுறை கால்நடை மருத்துவரிடம் தவறாமல் போட வேண்டும்.`
      : `🐄 **Livestock & Dairy Farming Advisory (NDDB Standards)**:\n\n` +
        `• **Ration Formulation**: Dairy cows producing 10L milk require 15-20 kg green fodder (Co-4/Super Napier) + 4-5 kg dry fodder + 3 kg concentrate feed daily.\n` +
        `• **Azolla Bio-Feed**: Supplementing with 1.5–2.0 kg fresh Azolla daily improves milk fat percentage and increases total yield by 10–15%.\n` +
        `• **Preventative Health**: Ensure bi-annual Foot and Mouth Disease (FMD) vaccinations and deworming every 3 months.`;
  }

  // DEFAULT AGRICULTURAL RESPONSE
  return isTa
    ? `🌾 **விவசாய ஆலோசனை — கிசான் மித்ரா**:\n\n` +
      `உங்கள் கேள்வி தொடர்பாக விரிவான வழிகாட்டலை வழங்க நான் தயாராக உள்ளேன். சிறந்த தீர்வினைப் பெற தயவுசெய்து உங்கள்:\n` +
      `1. **பயிரின் பெயர்** (எ.கா. நெல், பருத்தி, தக்காளி)\n` +
      `2. **நில வகை** (செம்மண் / கரிசல் மண் / வண்டல்)\n` +
      `3. **வயலின் நிலை அல்லது பிரச்சனை விவரங்களை** (பூச்சி தாக்குதல், உரம் தேவை, நீர் பாசனம்)\n` +
      `தெரிவிக்கவும். நான் உடனடியாக ICAR & TNAU தரநிலைப்படி வழிகாட்டுகிறேன்.`
    : `🌾 **Farming Advisory — Kisan Mitra AI**:\n\n` +
      `I am ready to help you with practical farming solutions. To give you the most accurate dosage or recommendation, please specify:\n` +
      `1. **Crop Name** (e.g., Paddy, Cotton, Tomato, Groundnut)\n` +
      `2. **Soil Type** (Red loam, Black cotton, Clay, Sandy)\n` +
      `3. **Current Problem or Stage** (Nutrient deficiency, pest symptoms, sowing date, drip irrigation)\n\n` +
      `I will provide exact ICAR/TNAU certified steps customized for your farm.`;
}
