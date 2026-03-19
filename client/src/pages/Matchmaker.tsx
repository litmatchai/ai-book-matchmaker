import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Sparkles, Feather, ArrowRight, RefreshCcw, Languages, ExternalLink, ArrowLeft } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";

type Step = "home" | "quiz" | "results";
type AnswerValue = "A" | "B" | "C" | "D" | "E" | "F";
type Language = "en" | "ar";

const UI_TEXT = {
  en: {
    title: "LitMatch",
    heroTitle1: "Discover your next ",
    heroTitle2: "literary obsession.",
    heroSubtitle: "Take our curated personality assessment to reveal your unique reader archetype and uncover books tailored specifically to your soul.",
    startBtn: "Begin the Assessment",
    questionOf: (curr: number, total: number) => `Question ${curr} of ${total}`,
    yourArchetype: "Your Reader Archetype",
    whyItFits: "Why it fits you:",
    descriptionText: "Description:",
    readLink: "Read / PDF",
    retakeQuiz: "Back to Home",
    goBack: "Restart Quiz",
    by: "by",
  },
  ar: {
    title: "ليت ماتش",
    heroTitle1: "اكتشف ",
    heroTitle2: "شغفك الأدبي القادم.",
    heroSubtitle: "قم بإجراء تقييم الشخصية المنسق الخاص بنا للكشف عن نمط القارئ الفريد الخاص بك واكتشاف الكتب المصممة خصيصًا لروحك.",
    startBtn: "ابدأ التقييم",
    questionOf: (curr: number, total: number) => `السؤال ${curr} من ${total}`,
    yourArchetype: "نمط القارئ الخاص بك",
    whyItFits: "لماذا يناسبك:",
    descriptionText: "الوصف:",
    readLink: "اقرأ / PDF",
    retakeQuiz: "العودة للرئيسية",
    goBack: "إعادة الاختبار",
    by: "بقلم",
  }
};

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: {
      en: "What do you primarily look for when choosing a new book?",
      ar: "عما تبحث بشكل أساسي عند اختيار كتاب جديد؟"
    },
    options: [
      { value: "A", en: "Deep philosophical meaning and complex themes", ar: "معنى فلسفي عميق ومواضيع معقدة", icon: Feather },
      { value: "B", en: "A complete escape from reality", ar: "الهروب التام من الواقع", icon: Sparkles },
      { value: "C", en: "Practical advice and self-improvement", ar: "نصائح عملية وتطوير الذات", icon: ArrowRight },
      { value: "D", en: "Deep emotional connection and romance", ar: "ارتباط عاطفي عميق ورومانسية", icon: Feather },
      { value: "E", en: "Discovering new cultures and histories", ar: "اكتشاف ثقافات وتواريخ جديدة", icon: BookOpen },
      { value: "F", en: "Thrills, action, and high excitement", ar: "الإثارة والحركة والحماس الشديد", icon: Sparkles },
    ],
  },
  {
    id: "q2",
    question: {
      en: "How do you want to feel after finishing the last page?",
      ar: "كيف تريد أن تشعر بعد الانتهاء من الصفحة الأخيرة؟"
    },
    options: [
      { value: "A", en: "Intellectually stimulated and slightly challenged", ar: "محفز فكرياً ومتحدٍ بعض الشيء", icon: Feather },
      { value: "B", en: "Thoroughly entertained and breathless", ar: "مستمتع تماماً ومحبوس الأنفاس", icon: Sparkles },
      { value: "C", en: "Inspired and ready to take action in my life", ar: "ملهم ومستعد لاتخاذ إجراء في حياتي", icon: ArrowRight },
      { value: "D", en: "Heartwarmed and emotionally fulfilled", ar: "دافئ القلب ومكتفٍ عاطفياً", icon: Feather },
      { value: "E", en: "Culturally enriched and worldly", ar: "مثقف عالمياً ومغنى ثقافياً", icon: BookOpen },
      { value: "F", en: "Adrenaline-fueled and eager for more", ar: "مليء بالأدرينالين ومتشوق للمزيد", icon: Sparkles },
    ],
  },
  {
    id: "q3",
    question: {
      en: "Which setting appeals to you the most right now?",
      ar: "أي بيئة تروق لك أكثر في الوقت الحالي؟"
    },
    options: [
      { value: "A", en: "A historically rich, atmospheric city with secrets", ar: "مدينة غنية تاريخياً ومليئة بالأسرار", icon: Feather },
      { value: "B", en: "A magical realm or a distant, futuristic planet", ar: "عالم سحري أو كوكب مستقبلي بعيد", icon: Sparkles },
      { value: "C", en: "A modern, bustling environment focused on success", ar: "بيئة حديثة صاخبة تركز على النجاح", icon: ArrowRight },
      { value: "D", en: "A picturesque countryside or cozy small town", ar: "ريف خلاب أو بلدة صغيرة مريحة", icon: Feather },
      { value: "E", en: "Diverse global landscapes and real-world locations", ar: "مناظر طبيعية عالمية متنوعة ومواقع حقيقية", icon: BookOpen },
      { value: "F", en: "Dangerous, high-stakes arenas or survival scenarios", ar: "ساحات خطيرة ومواقف بقاء على قيد الحياة", icon: Sparkles },
    ],
  },
  {
    id: "q4",
    question: {
      en: "What kind of protagonist do you prefer following?",
      ar: "ما نوع بطل الرواية الذي تفضل متابعته؟"
    },
    options: [
      { value: "A", en: "A deeply flawed character dealing with moral ambiguity", ar: "شخصية معيبة بشدة تتعامل مع الغموض الأخلاقي", icon: Feather },
      { value: "B", en: "An ordinary person thrown into an extraordinary adventure", ar: "شخص عادي يُلقى في مغامرة غير عادية", icon: Sparkles },
      { value: "C", en: "A real-world successful figure sharing their journey", ar: "شخصية ناجحة في العالم الحقيقي تشارك رحلتها", icon: ArrowRight },
      { value: "D", en: "A passionate lover fighting against the odds", ar: "محب شغوف يقاتل ضد الصعاب", icon: Feather },
      { value: "E", en: "A traveler or immigrant navigating multiple identities", ar: "مسافر أو مهاجر يتنقل بين هويات متعددة", icon: BookOpen },
      { value: "F", en: "A skilled survivor facing impossible challenges", ar: "ناجٍ ماهر يواجه تحديات مستحيلة", icon: Sparkles },
    ],
  },
  {
    id: "q5",
    question: {
      en: "What is your typical reading pace?",
      ar: "ما هي وتيرة القراءة المعتادة لديك؟"
    },
    options: [
      { value: "A", en: "I read slowly, savoring the prose and themes", ar: "أقرأ ببطء، متذوقاً النثر والمواضيع", icon: Feather },
      { value: "B", en: "I binge-read in one sitting until 3 AM", ar: "أقرأ بنهم في جلسة واحدة حتى 3 صباحاً", icon: Sparkles },
      { value: "C", en: "I read a chapter a day to process and apply the lessons", ar: "أقرأ فصلاً يومياً لمعالجة وتطبيق الدروس", icon: ArrowRight },
      { value: "D", en: "I read in cozy afternoon bursts", ar: "أقرأ في فترات بعد الظهر المريحة", icon: Feather },
      { value: "E", en: "I do immersive deep dives on weekends", ar: "أقوم بالغوص العميق في القراءة خلال عطلات نهاية الأسبوع", icon: BookOpen },
      { value: "F", en: "Fast-paced page turning, can't put it down", ar: "تقليب سريع للصفحات، لا يمكنني ترك الكتاب", icon: Sparkles },
    ],
  },
  {
    id: "q6",
    question: {
      en: "Which element is most crucial for a book to hold your attention?",
      ar: "ما هو العنصر الأكثر أهمية لكي يجذب الكتاب انتباهك؟"
    },
    options: [
      { value: "A", en: "Intricate layers of underlying themes", ar: "طبقات معقدة من المواضيع الأساسية", icon: Feather },
      { value: "B", en: "Incredible world-building", ar: "بناء عالم مذهل", icon: Sparkles },
      { value: "C", en: "Clear, actionable advice", ar: "نصائح واضحة وقابلة للتنفيذ", icon: ArrowRight },
      { value: "D", en: "Strong character relationships", ar: "علاقات شخصية قوية", icon: Feather },
      { value: "E", en: "Authentic representation of diverse lives", ar: "تمثيل أصيل للحياة المتنوعة", icon: BookOpen },
      { value: "F", en: "Unpredictable plot twists", ar: "تحولات غير متوقعة في القصة", icon: Sparkles },
    ],
  },
  {
    id: "q7",
    question: {
      en: "When do you usually find time to read?",
      ar: "متى تجد وقتاً للقراءة عادة؟"
    },
    options: [
      { value: "A", en: "Late at night in complete silence", ar: "في وقت متأخر من الليل في صمت تام", icon: Feather },
      { value: "B", en: "Whenever I desperately need a break", ar: "كلما احتجت بشدة إلى استراحة", icon: Sparkles },
      { value: "C", en: "During my structured morning routine", ar: "خلال روتيني الصباحي المنظم", icon: ArrowRight },
      { value: "D", en: "On rainy afternoons with tea", ar: "في فترات بعد الظهر الممطرة مع الشاي", icon: Feather },
      { value: "E", en: "While commuting or traveling", ar: "أثناء التنقل أو السفر", icon: BookOpen },
      { value: "F", en: "Anytime I crave an adrenaline rush", ar: "في أي وقت أتوق فيه لاندفاع الأدرينالين", icon: Sparkles },
    ],
  },
  {
    id: "q8",
    question: {
      en: "What life goal currently resonates most with you?",
      ar: "أي هدف في الحياة يتردد صداه معك أكثر حالياً؟"
    },
    options: [
      { value: "A", en: "Understanding the human condition", ar: "فهم الطبيعة البشرية", icon: Feather },
      { value: "B", en: "Finding joy, wonder, and magic", ar: "العثور على الفرح والعجب والسحر", icon: Sparkles },
      { value: "C", en: "Achieving personal success and mastery", ar: "تحقيق النجاح الشخصي والتمكن", icon: ArrowRight },
      { value: "D", en: "Finding true love and deep connection", ar: "إيجاد الحب الحقيقي والاتصال العميق", icon: Feather },
      { value: "E", en: "Experiencing the world and its people", ar: "تجربة العالم وشعوبه", icon: BookOpen },
      { value: "F", en: "Conquering challenges and fears", ar: "قهر التحديات والمخاوف", icon: Sparkles },
    ],
  }
] as const;

const RESULTS_DATA = {
  A: {
    title: { en: "The Deep Thinker", ar: "المفكر العميق" },
    description: {
      en: "You seek books that challenge your perspective, feature complex prose, and linger in your mind long after you've closed the cover.",
      ar: "تبحث عن الكتب التي تتحدى وجهة نظرك، وتتميز بنثر معقد، وتبقى في ذهنك طويلاً بعد أن تغلق الغلاف."
    },
    books: [
      {
        title: { en: "1984", ar: "١٩٨٤" },
        author: { en: "George Orwell", ar: "جورج أورويل" },
        description: { en: "A dystopian social science fiction novel and cautionary tale.", ar: "رواية خيال علمي اجتماعي بائسة وحكاية تحذيرية." },
        reason: { en: "Challenges your views on society, truth, and freedom.", ar: "تتحدى وجهات نظرك حول المجتمع والحقيقة والحرية." },
        link: "https://www.gutenberg.org/ebooks/1524",
        coverColor: "bg-[#1E293B]"
      },
      {
        title: { en: "The Secret History", ar: "التاريخ السري" },
        author: { en: "Donna Tartt", ar: "دونا تارت" },
        description: { en: "An inverted detective story exploring beauty, terror, and morality.", ar: "قصة بوليسية مقلوبة تستكشف الجمال والرعب والأخلاق." },
        reason: { en: "Masterfully atmospheric dark academia exploring moral ambiguity.", ar: "أكاديمية مظلمة رائعة الجو تستكشف الغموض الأخلاقي." },
        coverColor: "bg-[#333333]"
      },
      {
        title: { en: "Season of Migration to the North", ar: "موسم الهجرة إلى الشمال" },
        author: { en: "Tayeb Salih", ar: "الطيب صالح" },
        description: { en: "A classic post-colonial Arabic novel exploring East-West relations.", ar: "رواية عربية كلاسيكية عن ما بعد الاستعمار تستكشف العلاقات بين الشرق والغرب." },
        reason: { en: "Offers profound philosophical insights into identity and culture.", ar: "تقدم رؤى فلسفية عميقة حول الهوية والثقافة." },
        link: "https://archive.org/",
        coverColor: "bg-[#711E1E]"
      },
      {
        title: { en: "Children of the Alley", ar: "أولاد حارتنا" },
        author: { en: "Naguib Mahfouz", ar: "نجيب محفوظ" },
        description: { en: "An allegorical novel tracing the history of human existence.", ar: "رواية رمزية تتتبع تاريخ الوجود البشري." },
        reason: { en: "Deep, symbolic, and thought-provoking classic literature.", ar: "كلاسيكية أدبية عميقة ورمزية ومثيرة للتفكير." },
        coverColor: "bg-[#4A2E1B]"
      }
    ]
  },
  B: {
    title: { en: "The Escapist", ar: "الهارب من الواقع" },
    description: {
      en: "You read to journey to other worlds, experience thrilling adventures, and let your imagination soar. Reality is highly overrated.",
      ar: "أنت تقرأ لتسافر إلى عوالم أخرى، وتختبر مغامرات مثيرة، وتدع خيالك يحلق. الواقع مبالغ في تقديره."
    },
    books: [
      {
        title: { en: "Dune", ar: "كثيب (ديون)" },
        author: { en: "Frank Herbert", ar: "فرانك هربرت" },
        description: { en: "An epic science fiction masterpiece set on a desert planet.", ar: "تحفة خيال علمي ملحمية تدور أحداثها على كوكب صحراوي." },
        reason: { en: "Unmatched world-building that completely absorbs you.", ar: "بناء عالم لا مثيل له يمتصك بالكامل." },
        link: "https://archive.org/",
        coverColor: "bg-[#C48C5E]"
      },
      {
        title: { en: "The Night Circus", ar: "السيرك الليلي" },
        author: { en: "Erin Morgenstern", ar: "إيرين مورجينستيرن" },
        description: { en: "A phantasmagorical fairy tale set in a magical circus.", ar: "حكاية خرافية خيالية تدور أحداثها في سيرك سحري." },
        reason: { en: "A sensory-rich experience full of magic and wonder.", ar: "تجربة غنية بالحواس مليئة بالسحر والعجب." },
        coverColor: "bg-[#2A2A2A]"
      },
      {
        title: { en: "One Thousand and One Nights", ar: "ألف ليلة وليلة" },
        author: { en: "Various", ar: "مؤلفون مختلفون" },
        description: { en: "A collection of Middle Eastern folk tales compiled in Arabic.", ar: "مجموعة من الحكايات الشعبية الشرق أوسطية جمعت باللغة العربية." },
        reason: { en: "The ultimate collection of enchanting and magical escapist stories.", ar: "المجموعة المطلقة من القصص الساحرة والخيالية." },
        link: "https://www.gutenberg.org/",
        coverColor: "bg-[#8B5CF6]"
      },
      {
        title: { en: "Utopia", ar: "يوتوبيا" },
        author: { en: "Ahmed Khaled Tawfik", ar: "أحمد خالد توفيق" },
        description: { en: "A chilling futuristic thriller exploring social division.", ar: "قصة إثارة مستقبلية مرعبة تستكشف الانقسام الاجتماعي." },
        reason: { en: "A gripping alternate reality that keeps you hooked.", ar: "واقع بديل مشوق يبقيك منتبهاً." },
        coverColor: "bg-[#334155]"
      }
    ]
  },
  C: {
    title: { en: "The Motivational Seeker", ar: "الباحث عن التحفيز" },
    description: {
      en: "You view reading as a tool for growth. You want actionable insights, real-world wisdom, and the inspiration to become your best self.",
      ar: "أنت تنظر إلى القراءة كأداة للنمو. تريد رؤى قابلة للتنفيذ، وحكمة من العالم الحقيقي، والإلهام لتصبح أفضل نسخة من نفسك."
    },
    books: [
      {
        title: { en: "Atomic Habits", ar: "العادات الذرية" },
        author: { en: "James Clear", ar: "جيمس كلير" },
        description: { en: "An easy and proven way to build good habits and break bad ones.", ar: "طريقة سهلة ومثبتة لبناء عادات جيدة وكسر العادات السيئة." },
        reason: { en: "Provides clear, actionable steps for everyday self-improvement.", ar: "يقدم خطوات واضحة وقابلة للتنفيذ لتحسين الذات يومياً." },
        link: "https://archive.org/",
        coverColor: "bg-[#EAB308]"
      },
      {
        title: { en: "Man's Search for Meaning", ar: "الإنسان يبحث عن المعنى" },
        author: { en: "Viktor E. Frankl", ar: "فيكتور إي. فرانكل" },
        description: { en: "A profound memoir of finding purpose in the darkest of times.", ar: "مذكرات عميقة حول إيجاد الهدف في أحلك الأوقات." },
        reason: { en: "Offers deep inspiration and shifts your life perspective.", ar: "يقدم إلهاماً عميقاً ويغير نظرتك للحياة." },
        coverColor: "bg-[#15803D]"
      },
      {
        title: { en: "Renew Your Life", ar: "جدد حياتك" },
        author: { en: "Muhammad al-Ghazali", ar: "محمد الغزالي" },
        description: { en: "Islamic perspective on self-help inspired by Dale Carnegie.", ar: "منظور إسلامي لتطوير الذات مستوحى من ديل كارنيجي." },
        reason: { en: "Practical spiritual and mental guidance for a better life.", ar: "إرشادات روحية وعقلية عملية لحياة أفضل." },
        link: "https://archive.org/",
        coverColor: "bg-[#047857]"
      },
      {
        title: { en: "Because You Are God", ar: "لأنك الله" },
        author: { en: "Ali Bin Jaber Al-Fifi", ar: "علي بن جابر الفيفي" },
        description: { en: "A journey to the depths of spirituality and self-peace.", ar: "رحلة إلى أعماق الروحانية والسلام الذاتي." },
        reason: { en: "Highly motivating for spiritual and emotional well-being.", ar: "محفز للغاية للرفاهية الروحية والعاطفية." },
        coverColor: "bg-[#3B82F6]"
      }
    ]
  },
  D: {
    title: { en: "The Romantic Dreamer", ar: "الحالم الرومانسي" },
    description: {
      en: "You are drawn to stories of deep connection, passion, and emotional journeys. You read to feel the soaring highs of love.",
      ar: "تنجذب إلى قصص الاتصال العميق والعاطفة والرحلات العاطفية. تقرأ لتشعر بأعلى مستويات الحب."
    },
    books: [
      {
        title: { en: "Pride and Prejudice", ar: "كبرياء وتحامل" },
        author: { en: "Jane Austen", ar: "جين أوستن" },
        description: { en: "The ultimate classic romance dealing with manners and matrimony.", ar: "الرومانسية الكلاسيكية المطلقة التي تتناول الأخلاق والزواج." },
        reason: { en: "A beautifully written, timeless love story with sharp wit.", ar: "قصة حب خالدة ومكتوبة بشكل جميل بذكاء حاد." },
        link: "https://www.gutenberg.org/ebooks/1342",
        coverColor: "bg-[#BE185D]"
      },
      {
        title: { en: "The Seven Husbands of Evelyn Hugo", ar: "أزواج إيفلين هيوغو السبعة" },
        author: { en: "Taylor Jenkins Reid", ar: "تايلور جينكينز ريد" },
        description: { en: "A glamorous, heartbreaking tale of Hollywood love and secrets.", ar: "قصة ساحرة ومفجعة عن حب هوليوود وأسرارها." },
        reason: { en: "Delivers the emotional depth and passionate romance you crave.", ar: "يقدم العمق العاطفي والرومانسية العاطفية التي تتوق إليها." },
        coverColor: "bg-[#9D174D]"
      },
      {
        title: { en: "Black Suits You so Well", ar: "الأسود يليق بك" },
        author: { en: "Ahlam Mosteghanemi", ar: "أحلام مستغانمي" },
        description: { en: "A tale of love, pride, and sorrow in the Arab world.", ar: "حكاية حب وكبرياء وحزن في العالم العربي." },
        reason: { en: "Richly poetic and highly emotional romantic literature.", ar: "أدب رومانسي شاعري غني وعاطفي للغاية." },
        coverColor: "bg-[#111827]"
      },
      {
        title: { en: "In My Heart is a Hebrew Female", ar: "في قلبي أنثى عبرية" },
        author: { en: "Khawla Hamdi", ar: "خولة حمدي" },
        description: { en: "A touching love story crossing religious and cultural bounds.", ar: "قصة حب مؤثرة تتخطى الحدود الدينية والثقافية." },
        reason: { en: "A poignant exploration of love overcoming major obstacles.", ar: "استكشاف مؤثر للحب الذي يتغلب على العقبات الكبرى." },
        coverColor: "bg-[#7E22CE]"
      }
    ]
  },
  E: {
    title: { en: "The Cultural Explorer", ar: "المستكشف الثقافي" },
    description: {
      en: "You read to travel without moving. You love discovering new cultures, historical eras, and diverse human experiences.",
      ar: "أنت تقرأ لتسافر دون أن تتحرك. تحب اكتشاف ثقافات جديدة وعصور تاريخية وتجارب إنسانية متنوعة."
    },
    books: [
      {
        title: { en: "The Kite Runner", ar: "عداء الطائرة الورقية" },
        author: { en: "Khaled Hosseini", ar: "خالد حسيني" },
        description: { en: "A heartbreaking story of friendship and redemption in Afghanistan.", ar: "قصة مفجعة عن الصداقة والفداء في أفغانستان." },
        reason: { en: "Deeply immerses you in a rich culture and poignant history.", ar: "يغمرك بعمق في ثقافة غنية وتاريخ مؤثر." },
        coverColor: "bg-[#B45309]"
      },
      {
        title: { en: "Pachinko", ar: "باتشينكو" },
        author: { en: "Min Jin Lee", ar: "مين جين لي" },
        description: { en: "A sweeping saga of a Korean family living in Japan.", ar: "ملحمة شاملة لعائلة كورية تعيش في اليابان." },
        reason: { en: "A beautifully detailed exploration of immigrant identities and resilience.", ar: "استكشاف مفصل بشكل جميل لهويات المهاجرين والمرونة." },
        coverColor: "bg-[#0F766E]"
      },
      {
        title: { en: "The Granada Trilogy", ar: "ثلاثية غرناطة" },
        author: { en: "Radwa Ashour", ar: "رضوى عاشور" },
        description: { en: "A masterpiece chronicling the fall of Moorish Spain.", ar: "تحفة فنية تؤرخ لسقوط إسبانيا المغاربية." },
        reason: { en: "An incredible historical journey through a fascinating culture.", ar: "رحلة تاريخية مذهلة عبر ثقافة رائعة." },
        coverColor: "bg-[#854D0E]"
      },
      {
        title: { en: "Azazeel", ar: "عزازيل" },
        author: { en: "Youssef Ziedan", ar: "يوسف زيدان" },
        description: { en: "A tale of religious conflict and personal turmoil in the 5th century.", ar: "حكاية عن الصراع الديني والاضطراب الشخصي في القرن الخامس." },
        reason: { en: "Rich historical setting that vividly transports you to the past.", ar: "بيئة تاريخية غنية تنقلك بوضوح إلى الماضي." },
        link: "https://archive.org/",
        coverColor: "bg-[#431407]"
      }
    ]
  },
  F: {
    title: { en: "The Action Adventurer", ar: "مغامر الحركة" },
    description: {
      en: "You need fast-paced plots, high stakes, and adrenaline. You want stories that keep you on the edge of your seat.",
      ar: "أنت بحاجة إلى حبكات سريعة الوتيرة، ومخاطر عالية، وأدرينالين. تريد قصصاً تبقيك على حافة مقعدك."
    },
    books: [
      {
        title: { en: "The Hunger Games", ar: "مباريات الجوع" },
        author: { en: "Suzanne Collins", ar: "سوزان كولنز" },
        description: { en: "A thrilling dystopian survival game with political undertones.", ar: "لعبة بقاء بائسة ومثيرة ذات دلالات سياسية." },
        reason: { en: "Incredibly fast-paced with non-stop action and high stakes.", ar: "سريع الوتيرة بشكل لا يصدق مع حركة لا تتوقف ومخاطر عالية." },
        coverColor: "bg-[#991B1B]"
      },
      {
        title: { en: "The Da Vinci Code", ar: "شفرة دا فينشي" },
        author: { en: "Dan Brown", ar: "دان براون" },
        description: { en: "A breathless global treasure hunt full of puzzles.", ar: "بحث عالمي يحبس الأنفاس عن كنز مليء بالألغاز." },
        reason: { en: "A perfect blend of mystery, action, and suspenseful plot twists.", ar: "مزيج مثالي من الغموض والحركة وتحولات الحبكة المشوقة." },
        coverColor: "bg-[#57534E]"
      },
      {
        title: { en: "Bilal's Code", ar: "شفرة بلال" },
        author: { en: "Ahmed Khaireddine", ar: "أحمد خيري العمري" },
        description: { en: "A dynamic narrative intertwining history and modern struggle.", ar: "سرد ديناميكي يتشابك فيه التاريخ والنضال الحديث." },
        reason: { en: "Keeps you engaged with its energetic flow and compelling story.", ar: "يبقيك متفاعلاً مع تدفقه الحيوي وقصته المقنعة." },
        coverColor: "bg-[#065F46]"
      },
      {
        title: { en: "The Blue Elephant", ar: "الفيل الأزرق" },
        author: { en: "Ahmed Mourad", ar: "أحمد مراد" },
        description: { en: "A psychological thriller involving murder, madness, and mystery.", ar: "قصة إثارة نفسية تتضمن القتل والجنون والغموض." },
        reason: { en: "A mind-bending, suspenseful ride that you won't be able to put down.", ar: "رحلة مشوقة ومذهلة للعقل لن تتمكن من التوقف عن قراءتها." },
        link: "https://archive.org/",
        coverColor: "bg-[#1E3A8A]"
      }
    ]
  }
};

export default function Matchmaker() {
  const [step, setStep] = useState<Step>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [resultType, setResultType] = useState<AnswerValue | null>(null);

  const t = UI_TEXT[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
  };

  const startQuiz = () => {
    setStep("quiz");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (value: AnswerValue) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentQuestionIndex].id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: Record<string, AnswerValue>) => {
    const counts: Record<AnswerValue, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    Object.values(finalAnswers).forEach((val) => {
      counts[val]++;
    });

    let maxKey: AnswerValue = "A";
    let maxVal = 0;
    (Object.entries(counts) as [AnswerValue, number][]).forEach(([key, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    });

    setResultType(maxKey);
    setStep("results");
  };

  const resetQuizToHome = () => {
    setStep("home");
    setResultType(null);
  };

  const goBackToQuiz = () => {
    setStep("quiz");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResultType(null);
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isRtl = language === "ar";

  return (
    <div 
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover mix-blend-multiply" />
      </div>
      
      <header className="w-full py-6 px-8 border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-primary">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-xl font-bold font-serif tracking-wide">{t.title}</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleLanguage}
          className="rounded-full gap-2 text-primary border-primary/20 hover:bg-primary/5"
          data-testid="button-translate"
        >
          <Languages className="w-4 h-4" />
          {language === "en" ? "عربي" : "English"}
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl w-full text-center space-y-8 py-12"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 text-primary">
                <Feather className="w-8 h-8" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
                {t.heroTitle1} <span className="italic text-primary">{t.heroTitle2}</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto font-sans leading-relaxed">
                {t.heroSubtitle}
              </p>
              
              <div className="pt-8">
                <Button 
                  onClick={startQuiz}
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  data-testid="button-start-quiz"
                >
                  {t.startBtn}
                  {isRtl ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl w-full"
            >
              <div className="mb-8 flex items-center justify-between text-sm font-medium text-muted-foreground">
                <span className="tracking-widest uppercase">
                  {t.questionOf(currentQuestionIndex + 1, QUIZ_QUESTIONS.length)}
                </span>
                <div className="flex gap-1.5" dir="ltr">
                  {QUIZ_QUESTIONS.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx <= currentQuestionIndex ? "w-8 bg-primary" : "w-4 bg-primary/20"}`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-border/60 shadow-xl overflow-hidden bg-card/80 backdrop-blur-md">
                    <CardContent className="p-8 md:p-10">
                      <h3 className="text-3xl font-serif font-medium mb-10 text-foreground leading-snug" data-testid={`text-question-${currentQuestion.id}`}>
                        {currentQuestion.question[language]}
                      </h3>
                      
                      <div className="space-y-4">
                        {currentQuestion.options.map((option, idx) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(option.value as AnswerValue)}
                              className="w-full text-start p-6 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/5 group transition-all duration-300 flex items-center gap-5 hover:-translate-y-0.5"
                              data-testid={`button-answer-${currentQuestion.id}-${option.value}`}
                            >
                              <div className="w-12 h-12 shrink-0 rounded-full bg-secondary/50 group-hover:bg-primary text-secondary-foreground group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-lg font-medium group-hover:text-primary transition-colors">
                                {option[language]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {step === "results" && resultType && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.2 }}
              className="max-w-6xl w-full py-10"
            >
              <div className="text-center mb-16 space-y-4">
                <p className="text-primary font-medium tracking-widest uppercase text-sm">{t.yourArchetype}</p>
                <h2 className="text-5xl md:text-6xl font-bold font-serif text-foreground" data-testid="text-result-title">
                  {RESULTS_DATA[resultType].title[language]}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
                  {RESULTS_DATA[resultType].description[language]}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {RESULTS_DATA[resultType].books.map((book, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                    className="flex"
                  >
                    <Card className="flex flex-col w-full border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <div className={`h-48 ${book.coverColor} shrink-0 relative flex items-center justify-center overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 w-28 h-40 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex flex-col items-center justify-center p-3 text-center transform group-hover:scale-105 transition-transform duration-500">
                           <BookOpen className="w-6 h-6 text-white/80 mb-2" />
                           <span className="text-white/90 font-serif font-bold text-[10px] leading-tight">
                             {book.title[language]}
                           </span>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="mb-4">
                          <h4 className="text-lg font-bold font-serif mb-1 group-hover:text-primary transition-colors leading-tight" data-testid={`text-book-title-${idx}`}>
                            {book.title[language]}
                          </h4>
                          <p className="text-sm text-muted-foreground italic">{t.by} {book.author[language]}</p>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <p className="text-foreground/80 text-sm leading-relaxed">
                            <span className="font-semibold text-primary block mb-1">{t.descriptionText}</span>
                            {book.description[language]}
                          </p>
                          <p className="text-foreground/80 text-sm leading-relaxed border-t border-border/50 pt-4">
                            <span className="font-semibold text-primary block mb-1">{t.whyItFits}</span>
                            {book.reason[language]}
                          </p>
                        </div>

                        {book.link && (
                          <div className="mt-6 pt-4 border-t border-border/30">
                            <Button 
                              variant="secondary" 
                              className="w-full gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                              asChild
                            >
                              <a href={book.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                                {t.readLink}
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={goBackToQuiz}
                  className="rounded-full px-6 py-6 text-base gap-2"
                  data-testid="button-go-back"
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t.goBack}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={resetQuizToHome}
                  className="rounded-full px-6 py-6 text-base gap-2"
                  data-testid="button-retake-home"
                >
                  {t.retakeQuiz}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}