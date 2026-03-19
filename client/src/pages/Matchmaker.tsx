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
    readPdf: "Read / PDF",
    borrowArchive: "Borrow",
    viewGoogle: "Preview",
    retakeQuiz: "Back to Home",
    goBack: "Restart Quiz",
    backBtn: "Back",
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
    readPdf: "اقرأ / PDF",
    borrowArchive: "استعارة",
    viewGoogle: "معاينة",
    retakeQuiz: "العودة للرئيسية",
    goBack: "إعادة الاختبار",
    backBtn: "رجوع",
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

type LinkType = "pdf" | "borrow" | "search";

const RESULTS_DATA = {
  A: {
    title: { en: "The Deep Thinker", ar: "المفكر العميق" },
    description: {
      en: "You seek books that challenge your perspective, feature complex prose, and linger in your mind long after you've closed the cover.",
      ar: "تبحث عن الكتب التي تتحدى وجهة نظرك، وتتميز بنثر معقد، وتبقى في ذهنك طويلاً بعد أن تغلق الغلاف."
    },
    placeholderColor: "bg-[#2c3e50]", // Warm Navy
    books: [
      {
        title: { en: "1984", ar: "١٩٨٤" },
        author: { en: "George Orwell", ar: "جورج أورويل" },
        description: { en: "A dystopian social science fiction novel and cautionary tale.", ar: "رواية خيال علمي اجتماعي بائسة وحكاية تحذيرية." },
        reason: { en: "Challenges your views on society, truth, and freedom.", ar: "تتحدى وجهات نظرك حول المجتمع والحقيقة والحرية." },
        link: "https://gutenberg.net.au/ebooks01/0100021h.html",
        linkType: "pdf" as LinkType,
        coverUrl: "https://images-na.ssl-images-amazon.com/images/P/0451524934.01.LZZZZZZZ.jpg",
      },
      {
        title: { en: "The Secret History", ar: "التاريخ السري" },
        author: { en: "Donna Tartt", ar: "دونا تارت" },
        description: { en: "An inverted detective story exploring beauty, terror, and morality.", ar: "قصة بوليسية مقلوبة تستكشف الجمال والرعب والأخلاق." },
        reason: { en: "Masterfully atmospheric dark academia exploring moral ambiguity.", ar: "أكاديمية مظلمة رائعة الجو تستكشف الغموض الأخلاقي." },
        link: "https://archive.org/search?query=The+Secret+History+Donna+Tartt",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/3w0YEAAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "Season of Migration to the North", ar: "موسم الهجرة إلى الشمال" },
        author: { en: "Tayeb Salih", ar: "الطيب صالح" },
        description: { en: "A classic post-colonial Arabic novel exploring East-West relations.", ar: "رواية عربية كلاسيكية عن ما بعد الاستعمار تستكشف العلاقات بين الشرق والغرب." },
        reason: { en: "Offers profound philosophical insights into identity and culture.", ar: "تقدم رؤى فلسفية عميقة حول الهوية والثقافة." },
        link: "https://archive.org/search?query=Season+of+Migration+to+the+North",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/_hZjaWrQtmcC?fife=w400-h600",
      },
      {
        title: { en: "Children of the Alley", ar: "أولاد حارتنا" },
        author: { en: "Naguib Mahfouz", ar: "نجيب محفوظ" },
        description: { en: "An allegorical novel tracing the history of human existence.", ar: "رواية رمزية تتتبع تاريخ الوجود البشري." },
        reason: { en: "Deep, symbolic, and thought-provoking classic literature.", ar: "كلاسيكية أدبية عميقة ورمزية ومثيرة للتفكير." },
        link: "https://archive.org/search?query=Children+of+the+Alley+Naguib+Mahfouz",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/LvZMDAAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "Notes from Underground", ar: "رسائل من تحت الأرض" },
        author: { en: "Fyodor Dostoevsky", ar: "فيودور دوستويفسكي" },
        description: { en: "A profound existentialist novel exploring human nature and suffering.", ar: "رواية وجودية عميقة تستكشف الطبيعة البشرية والمعاناة." },
        reason: { en: "A brilliant, unfiltered look into the complexity of the human mind.", ar: "نظرة رائعة وغير مفلترة في تعقيد العقل البشري." },
        link: "https://www.gutenberg.org/ebooks/600",
        linkType: "pdf" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/hU5Wk0o_iCoC?fife=w400-h600",
      }
    ]
  },
  B: {
    title: { en: "The Escapist", ar: "الهارب من الواقع" },
    description: {
      en: "You read to journey to other worlds, experience thrilling adventures, and let your imagination soar. Reality is highly overrated.",
      ar: "أنت تقرأ لتسافر إلى عوالم أخرى، وتختبر مغامرات مثيرة، وتدع خيالك يحلق. الواقع مبالغ في تقديره."
    },
    placeholderColor: "bg-[#b05c52]", // Muted Terracotta
    books: [
      {
        title: { en: "Dune", ar: "كثيب (ديون)" },
        author: { en: "Frank Herbert", ar: "فرانك هربرت" },
        description: { en: "An epic science fiction masterpiece set on a desert planet.", ar: "تحفة خيال علمي ملحمية تدور أحداثها على كوكب صحراوي." },
        reason: { en: "Unmatched world-building that completely absorbs you.", ar: "بناء عالم لا مثيل له يمتصك بالكامل." },
        link: "https://archive.org/search?query=Dune+Frank+Herbert",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/nrRKDwAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "The Night Circus", ar: "السيرك الليلي" },
        author: { en: "Erin Morgenstern", ar: "إيرين مورجينستيرن" },
        description: { en: "A phantasmagorical fairy tale set in a magical circus.", ar: "حكاية خرافية خيالية تدور أحداثها في سيرك سحري." },
        reason: { en: "A sensory-rich experience full of magic and wonder.", ar: "تجربة غنية بالحواس مليئة بالسحر والعجب." },
        link: "https://archive.org/search?query=The+Night+Circus",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/gwsgL3ZNuqkC?fife=w400-h600",
      },
      {
        title: { en: "One Thousand and One Nights", ar: "ألف ليلة وليلة" },
        author: { en: "Various", ar: "مؤلفون مختلفون" },
        description: { en: "A collection of Middle Eastern folk tales compiled in Arabic.", ar: "مجموعة من الحكايات الشعبية الشرق أوسطية جمعت باللغة العربية." },
        reason: { en: "The ultimate collection of enchanting and magical escapist stories.", ar: "المجموعة المطلقة من القصص الساحرة والخيالية." },
        link: "https://www.gutenberg.org/ebooks/19860",
        linkType: "pdf" as LinkType,
        coverUrl: "https://images-na.ssl-images-amazon.com/images/P/0140449388.01.LZZZZZZZ.jpg",
      },
      {
        title: { en: "Utopia", ar: "يوتوبيا" },
        author: { en: "Ahmed Khaled Tawfik", ar: "أحمد خالد توفيق" },
        description: { en: "A chilling futuristic thriller exploring social division.", ar: "قصة إثارة مستقبلية مرعبة تستكشف الانقسام الاجتماعي." },
        reason: { en: "A gripping alternate reality that keeps you hooked.", ar: "واقع بديل مشوق يبقيك منتبهاً." },
        link: "https://www.hindawi.org/books/42946571/",
        linkType: "pdf" as LinkType,
      },
      {
        title: { en: "The Hobbit", ar: "الهوبيت" },
        author: { en: "J.R.R. Tolkien", ar: "ج.ر.ر. تولكين" },
        description: { en: "A classic fantasy adventure following a reluctant hero.", ar: "مغامرة خيالية كلاسيكية تتبع بطلاً متردداً." },
        reason: { en: "The perfect journey into a richly detailed magical world.", ar: "الرحلة المثالية إلى عالم سحري غني بالتفاصيل." },
        link: "https://archive.org/search?query=The+Hobbit+Tolkien",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/LLSpngEACAAJ?fife=w400-h600",
      }
    ]
  },
  C: {
    title: { en: "The Motivational Seeker", ar: "الباحث عن التحفيز" },
    description: {
      en: "You view reading as a tool for growth. You want actionable insights, real-world wisdom, and the inspiration to become your best self.",
      ar: "أنت تنظر إلى القراءة كأداة للنمو. تريد رؤى قابلة للتنفيذ، وحكمة من العالم الحقيقي، والإلهام لتصبح أفضل نسخة من نفسك."
    },
    placeholderColor: "bg-[#7a8b76]", // Sage Green
    books: [
      {
        title: { en: "Atomic Habits", ar: "العادات الذرية" },
        author: { en: "James Clear", ar: "جيمس كلير" },
        description: { en: "An easy and proven way to build good habits and break bad ones.", ar: "طريقة سهلة ومثبتة لبناء عادات جيدة وكسر العادات السيئة." },
        reason: { en: "Provides clear, actionable steps for everyday self-improvement.", ar: "يقدم خطوات واضحة وقابلة للتنفيذ لتحسين الذات يومياً." },
        link: "https://archive.org/search?query=Atomic+Habits+James+Clear",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/XfFvDwAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "Man's Search for Meaning", ar: "الإنسان يبحث عن المعنى" },
        author: { en: "Viktor E. Frankl", ar: "فيكتور إي. فرانكل" },
        description: { en: "A profound memoir of finding purpose in the darkest of times.", ar: "مذكرات عميقة حول إيجاد الهدف في أحلك الأوقات." },
        reason: { en: "Offers deep inspiration and shifts your life perspective.", ar: "يقدم إلهاماً عميقاً ويغير نظرتك للحياة." },
        link: "https://archive.org/search?query=Mans+Search+for+Meaning",
        linkType: "borrow" as LinkType,
        coverUrl: "https://images-na.ssl-images-amazon.com/images/P/080701429X.01.LZZZZZZZ.jpg",
      },
      {
        title: { en: "Renew Your Life", ar: "جدد حياتك" },
        author: { en: "Muhammad al-Ghazali", ar: "محمد الغزالي" },
        description: { en: "Islamic perspective on self-help inspired by Dale Carnegie.", ar: "منظور إسلامي لتطوير الذات مستوحى من ديل كارنيجي." },
        reason: { en: "Practical spiritual and mental guidance for a better life.", ar: "إرشادات روحية وعقلية عملية لحياة أفضل." },
        link: "https://www.hindawi.org/books/64515239/",
        linkType: "pdf" as LinkType,
      },
      {
        title: { en: "Because You Are God", ar: "لأنك الله" },
        author: { en: "Ali Bin Jaber Al-Fifi", ar: "علي بن جابر الفيفي" },
        description: { en: "A journey to the depths of spirituality and self-peace.", ar: "رحلة إلى أعماق الروحانية والسلام الذاتي." },
        reason: { en: "Highly motivating for spiritual and emotional well-being.", ar: "محفز للغاية للرفاهية الروحية والعاطفية." },
        link: "https://archive.org/search?query=%D9%84%D8%A3%D9%86%D9%83+%D8%A7%D9%84%D9%84%D9%87",
        linkType: "borrow" as LinkType,
      },
      {
        title: { en: "Meditations", ar: "التأملات" },
        author: { en: "Marcus Aurelius", ar: "ماركوس أوريليوس" },
        description: { en: "A series of personal writings on Stoic philosophy.", ar: "سلسلة من الكتابات الشخصية حول الفلسفة الرواقية." },
        reason: { en: "Timeless wisdom on self-discipline and inner strength.", ar: "حكمة خالدة حول الانضباط الذاتي والقوة الداخلية." },
        link: "https://www.gutenberg.org/ebooks/2680",
        linkType: "pdf" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/brSidvTKfcQC?fife=w400-h600",
      }
    ]
  },
  D: {
    title: { en: "The Romantic Dreamer", ar: "الحالم الرومانسي" },
    description: {
      en: "You are drawn to stories of deep connection, passion, and emotional journeys. You read to feel the soaring highs of love.",
      ar: "تنجذب إلى قصص الاتصال العميق والعاطفة والرحلات العاطفية. تقرأ لتشعر بأعلى مستويات الحب."
    },
    placeholderColor: "bg-[#b88691]", // Dusty Rose
    books: [
      {
        title: { en: "Pride and Prejudice", ar: "كبرياء وتحامل" },
        author: { en: "Jane Austen", ar: "جين أوستن" },
        description: { en: "The ultimate classic romance dealing with manners and matrimony.", ar: "الرومانسية الكلاسيكية المطلقة التي تتناول الأخلاق والزواج." },
        reason: { en: "A beautifully written, timeless love story with sharp wit.", ar: "قصة حب خالدة ومكتوبة بشكل جميل بذكاء حاد." },
        link: "https://www.gutenberg.org/ebooks/1342",
        linkType: "pdf" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/uY6MEAAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "The Seven Husbands of Evelyn Hugo", ar: "أزواج إيفلين هيوغو السبعة" },
        author: { en: "Taylor Jenkins Reid", ar: "تايلور جينكينز ريد" },
        description: { en: "A glamorous, heartbreaking tale of Hollywood love and secrets.", ar: "قصة ساحرة ومفجعة عن حب هوليوود وأسرارها." },
        reason: { en: "Delivers the emotional depth and passionate romance you crave.", ar: "يقدم العمق العاطفي والرومانسية العاطفية التي تتوق إليها." },
        link: "https://archive.org/search?query=The+Seven+Husbands+of+Evelyn+Hugo",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/s8X3yQEACAAJ?fife=w400-h600",
      },
      {
        title: { en: "Black Suits You so Well", ar: "الأسود يليق بك" },
        author: { en: "Ahlam Mosteghanemi", ar: "أحلام مستغانمي" },
        description: { en: "A tale of love, pride, and sorrow in the Arab world.", ar: "حكاية حب وكبرياء وحزن في العالم العربي." },
        reason: { en: "Richly poetic and highly emotional romantic literature.", ar: "أدب رومانسي شاعري غني وعاطفي للغاية." },
        link: "https://www.google.com/search?q=Black+Suits+You+so+Well+book",
        linkType: "search" as LinkType,
      },
      {
        title: { en: "In My Heart is a Hebrew Female", ar: "في قلبي أنثى عبرية" },
        author: { en: "Khawla Hamdi", ar: "خولة حمدي" },
        description: { en: "A touching love story crossing religious and cultural bounds.", ar: "قصة حب مؤثرة تتخطى الحدود الدينية والثقافية." },
        reason: { en: "A poignant exploration of love overcoming major obstacles.", ar: "استكشاف مؤثر للحب الذي يتغلب على العقبات الكبرى." },
        link: "https://archive.org/search?query=%D9%81%D9%8A+%D9%82%D9%84%D8%A8%D9%8A+%D8%A3%D9%86%D8%AB%D9%89+%D8%B9%D8%A8%D8%B1%D9%8A%D8%A9",
        linkType: "borrow" as LinkType,
      },
      {
        title: { en: "Jane Eyre", ar: "جين أير" },
        author: { en: "Charlotte Brontë", ar: "شارلوت برونتي" },
        description: { en: "A classic romance featuring a strong-willed heroine and a brooding hero.", ar: "رومانسية كلاسيكية تتميز ببطلة قوية الإرادة وبطل غامض." },
        reason: { en: "A deeply emotional story of love, morality, and independence.", ar: "قصة عاطفية عميقة عن الحب والأخلاق والاستقلال." },
        link: "https://www.gutenberg.org/ebooks/1260",
        linkType: "pdf" as LinkType,
        coverUrl: "https://images-na.ssl-images-amazon.com/images/P/0141441143.01.LZZZZZZZ.jpg",
      }
    ]
  },
  E: {
    title: { en: "The Cultural Explorer", ar: "المستكشف الثقافي" },
    description: {
      en: "You read to travel without moving. You love discovering new cultures, historical eras, and diverse human experiences.",
      ar: "أنت تقرأ لتسافر دون أن تتحرك. تحب اكتشاف ثقافات جديدة وعصور تاريخية وتجارب إنسانية متنوعة."
    },
    placeholderColor: "bg-[#d4a373]", // Warm Ochre
    books: [
      {
        title: { en: "The Kite Runner", ar: "عداء الطائرة الورقية" },
        author: { en: "Khaled Hosseini", ar: "خالد حسيني" },
        description: { en: "A heartbreaking story of friendship and redemption in Afghanistan.", ar: "قصة مفجعة عن الصداقة والفداء في أفغانستان." },
        reason: { en: "Deeply immerses you in a rich culture and poignant history.", ar: "يغمرك بعمق في ثقافة غنية وتاريخ مؤثر." },
        link: "https://archive.org/search?query=The+Kite+Runner",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/ykWQEAAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "Pachinko", ar: "باتشينكو" },
        author: { en: "Min Jin Lee", ar: "مين جين لي" },
        description: { en: "A sweeping saga of a Korean family living in Japan.", ar: "ملحمة شاملة لعائلة كورية تعيش في اليابان." },
        reason: { en: "A beautifully detailed exploration of immigrant identities and resilience.", ar: "استكشاف مفصل بشكل جميل لهويات المهاجرين والمرونة." },
        link: "https://archive.org/search?query=Pachinko+Min+Jin+Lee",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/AV6HtAEACAAJ?fife=w400-h600",
      },
      {
        title: { en: "The Granada Trilogy", ar: "ثلاثية غرناطة" },
        author: { en: "Radwa Ashour", ar: "رضوى عاشور" },
        description: { en: "A masterpiece chronicling the fall of Moorish Spain.", ar: "تحفة فنية تؤرخ لسقوط إسبانيا المغاربية." },
        reason: { en: "An incredible historical journey through a fascinating culture.", ar: "رحلة تاريخية مذهلة عبر ثقافة رائعة." },
        link: "https://archive.org/search?query=The+Granada+Trilogy",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/K3kuQnjHMi0C?fife=w400-h600",
      },
      {
        title: { en: "Azazeel", ar: "عزازيل" },
        author: { en: "Youssef Ziedan", ar: "يوسف زيدان" },
        description: { en: "A tale of religious conflict and personal turmoil in the 5th century.", ar: "حكاية عن الصراع الديني والاضطراب الشخصي في القرن الخامس." },
        reason: { en: "Rich historical setting that vividly transports you to the past.", ar: "بيئة تاريخية غنية تنقلك بوضوح إلى الماضي." },
        link: "https://www.hindawi.org/books/98370960/",
        linkType: "pdf" as LinkType,
      },
      {
        title: { en: "Things Fall Apart", ar: "أشياء تتداعى" },
        author: { en: "Chinua Achebe", ar: "تشينوا أتشيبي" },
        description: { en: "A powerful novel about the impact of colonialism in Nigeria.", ar: "رواية قوية حول تأثير الاستعمار في نيجيريا." },
        reason: { en: "An essential cultural narrative that expands your worldview.", ar: "سرد ثقافي أساسي يوسع نظرتك للعالم." },
        link: "https://archive.org/search?query=Things+Fall+Apart+Chinua+Achebe",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/2plPEAAAQBAJ?fife=w400-h600",
      }
    ]
  },
  F: {
    title: { en: "The Action Adventurer", ar: "مغامر الحركة" },
    description: {
      en: "You need fast-paced plots, high stakes, and adrenaline. You want stories that keep you on the edge of your seat.",
      ar: "أنت بحاجة إلى حبكات سريعة الوتيرة، ومخاطر عالية، وأدرينالين. تريد قصصاً تبقيك على حافة مقعدك."
    },
    placeholderColor: "bg-[#4a4e69]", // Deep Slate
    books: [
      {
        title: { en: "The Hunger Games", ar: "مباريات الجوع" },
        author: { en: "Suzanne Collins", ar: "سوزان كولنز" },
        description: { en: "A thrilling dystopian survival game with political undertones.", ar: "لعبة بقاء بائسة ومثيرة ذات دلالات سياسية." },
        reason: { en: "Incredibly fast-paced with non-stop action and high stakes.", ar: "سريع الوتيرة بشكل لا يصدق مع حركة لا تتوقف ومخاطر عالية." },
        link: "https://archive.org/search?query=The+Hunger+Games",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/sJdUAzLUNyAC?fife=w400-h600",
      },
      {
        title: { en: "The Da Vinci Code", ar: "شفرة دا فينشي" },
        author: { en: "Dan Brown", ar: "دان براون" },
        description: { en: "A breathless global treasure hunt full of puzzles.", ar: "بحث عالمي يحبس الأنفاس عن كنز مليء بالألغاز." },
        reason: { en: "A perfect blend of mystery, action, and suspenseful plot twists.", ar: "مزيج مثالي من الغموض والحركة وتحولات الحبكة المشوقة." },
        link: "https://archive.org/search?query=The+Da+Vinci+Code",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/YuDl2Wl651AC?fife=w400-h600",
      },
      {
        title: { en: "Bilal's Code", ar: "شفرة بلال" },
        author: { en: "Ahmed Khaireddine", ar: "أحمد خيري العمري" },
        description: { en: "A dynamic narrative intertwining history and modern struggle.", ar: "سرد ديناميكي يتشابك فيه التاريخ والنضال الحديث." },
        reason: { en: "Keeps you engaged with its energetic flow and compelling story.", ar: "يبقيك متفاعلاً مع تدفقه الحيوي وقصته المقنعة." },
        link: "https://www.google.com/search?q=Bilal%27s+Code+book",
        linkType: "search" as LinkType,
      },
      {
        title: { en: "The Blue Elephant", ar: "الفيل الأزرق" },
        author: { en: "Ahmed Mourad", ar: "أحمد مراد" },
        description: { en: "A psychological thriller involving murder, madness, and mystery.", ar: "قصة إثارة نفسية تتضمن القتل والجنون والغموض." },
        reason: { en: "A mind-bending, suspenseful ride that you won't be able to put down.", ar: "رحلة مشوقة ومذهلة للعقل لن تتمكن من التوقف عن قراءتها." },
        link: "https://archive.org/search?query=%D8%A7%D9%84%D9%81%D9%8A%D9%84+%D8%A7%D9%84%D8%A3%D8%B2%D8%B1%D9%82",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/BY8mDAAAQBAJ?fife=w400-h600",
      },
      {
        title: { en: "The Martian", ar: "المريخي" },
        author: { en: "Andy Weir", ar: "آندي وير" },
        description: { en: "A gripping sci-fi survival story of an astronaut stranded on Mars.", ar: "قصة بقاء خيال علمي مشوقة لرائد فضاء تقطعت به السبل على المريخ." },
        reason: { en: "High-stakes survival action mixed with clever problem-solving.", ar: "إجراءات بقاء عالية المخاطر ممزوجة بحل ذكي للمشكلات." },
        link: "https://archive.org/search?query=The+Martian+Andy+Weir",
        linkType: "borrow" as LinkType,
        coverUrl: "https://books.google.com/books/publisher/content/images/frontcover/2NIpDAAAQBAJ?fife=w400-h600",
      }
    ]
  }
};

const BookCover = ({ coverUrl, title, color }: { coverUrl?: string, title: string, color: string }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className={`h-[220px] shrink-0 relative flex items-center justify-center overflow-hidden ${color}`}>
      {!imageError && coverUrl && (
        <img 
          src={coverUrl} 
          alt={title} 
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center z-20"
        />
      )}
    </div>
  )
}

export default function Matchmaker() {
  const [step, setStep] = useState<Step>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [resultType, setResultType] = useState<AnswerValue | null>(null);
  const [direction, setDirection] = useState<number>(1);

  const t = UI_TEXT[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
  };

  const startQuiz = () => {
    setDirection(1);
    setStep("quiz");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (value: AnswerValue) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentQuestionIndex].id]: value };
    setAnswers(newAnswers);
    setDirection(1);

    setTimeout(() => {
      if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        calculateResults(newAnswers);
      }
    }, 250);
  };

  const goBack = () => {
    setDirection(-1);
    if (step === "quiz") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      } else {
        setStep("home");
      }
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
    setDirection(-1);
    setStep("home");
    setResultType(null);
  };

  const goBackToQuiz = () => {
    setDirection(-1);
    setStep("quiz");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResultType(null);
  };

  const getLinkText = (type: LinkType) => {
    switch(type) {
      case "borrow": return t.borrowArchive;
      case "search": return t.viewGoogle;
      case "pdf": default: return t.readPdf;
    }
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isRtl = language === "ar";
  
  const quizVariants = {
    enter: (dir: number) => {
      const offset = 30 * dir;
      return {
        x: isRtl ? -offset : offset,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => {
      const offset = -30 * dir;
      return {
        x: isRtl ? -offset : offset,
        opacity: 0,
      };
    }
  };

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
        <AnimatePresence mode="wait" custom={direction}>
          {step === "home" && (
            <motion.div
              key="home"
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={quizVariants}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              className="max-w-3xl w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6 flex items-center justify-between text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={goBack}
                    className="hover:bg-primary/5 text-primary rounded-full px-4"
                  >
                    {isRtl ? <ArrowRight className="ml-2 w-4 h-4" /> : <ArrowLeft className="mr-2 w-4 h-4" />}
                    {t.backBtn}
                  </Button>
                  <span className="tracking-widest uppercase hidden sm:inline-block">
                    {t.questionOf(currentQuestionIndex + 1, QUIZ_QUESTIONS.length)}
                  </span>
                </div>
                <div className="flex gap-1.5" dir="ltr">
                  {QUIZ_QUESTIONS.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx <= currentQuestionIndex ? "w-8 bg-primary" : "w-4 bg-primary/20"}`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuestionIndex}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={quizVariants}
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
                          const isSelected = answers[currentQuestion.id] === option.value;
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(option.value as AnswerValue)}
                              className={`w-full text-start p-6 rounded-xl border group transition-all duration-300 flex items-center gap-5 hover:-translate-y-0.5 
                                ${isSelected 
                                  ? "border-primary bg-primary/5 shadow-sm" 
                                  : "border-border/50 hover:border-primary hover:bg-primary/5"
                                }`}
                              data-testid={`button-answer-${currentQuestion.id}-${option.value}`}
                            >
                              <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-colors 
                                ${isSelected 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-secondary/50 group-hover:bg-primary text-secondary-foreground group-hover:text-primary-foreground"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`text-lg font-medium transition-colors ${isSelected ? "text-primary" : "group-hover:text-primary"}`}>
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
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={quizVariants}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.2 }}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
                {RESULTS_DATA[resultType].books.map((book, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                    className="flex"
                  >
                    <Card className="flex flex-col w-full border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-card">
                      
                      <BookCover 
                        coverUrl={(book as any).coverUrl}
                        title={book.title[language]}
                        color={RESULTS_DATA[resultType].placeholderColor}
                      />

                      <CardContent className="p-5 flex flex-col flex-1">
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

                        <div className="mt-5 pt-4 border-t border-border/30 text-center">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full rounded-full hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                            asChild
                          >
                            <a href={book.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                              {getLinkText(book.linkType)}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        </div>
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