// All copy is transcribed from the Zaghalil (زغاليل) website design.
// Items marked `sample: true` were not specified in the design and must be
// confirmed by the client before launch.

export type CharacterId =
  | "zaghloul"
  | "qalqas"
  | "naanaa"
  | "zouina"
  | "basal"
  | "wezza"
  | "otteya";

export type Character = {
  id: CharacterId;
  name: string;
  traits?: string;
  card: string; // card background
  edge: string; // darker toy-block edge
  plush: string; // 3D stand-in colour while official art is missing
  tile: string; // product image background (shop grid / product page)
};

export const characters: Character[] = [
  { id: "zaghloul", name: "زغلول", traits: "ذكي، خلوق، مهمل أحيانًا", card: "#CAF4C3", edge: "#9fdb93", plush: "#7fd36b", tile: "#A9D8EA" },
  { id: "qalqas", name: "قلقس", traits: "حنون، مبهج، بريء", card: "#FBE6F0", edge: "#f1c4d8", plush: "#f6a9c4", tile: "#F7C9DA" },
  { id: "naanaa", name: "نعناعة", card: "#ECE5F2", edge: "#d4c6e2", plush: "#c9a6e0", tile: "#D9C8EC" },
  { id: "zouina", name: "زوينة", card: "#FBDCDC", edge: "#f2b8b8", plush: "#ffffff", tile: "#F1C6EF" },
  { id: "basal", name: "السيد بصل أخضر", card: "#FBF3DA", edge: "#efdfae", plush: "#e8c99a", tile: "#D6CCB8" },
  { id: "wezza", name: "الوزة لطيفة", card: "#F7D3CF", edge: "#eeaea7", plush: "#ffd56b", tile: "#F1D3C2" },
  { id: "otteya", name: "أوتّيه", card: "#EFEEC4", edge: "#dedc98", plush: "#a7d9ec", tile: "#DCEFB9" },
];

export const characterById = Object.fromEntries(characters.map((c) => [c.id, c])) as Record<
  CharacterId,
  Character
>;

/** Seat order on the hero swing, left → right as drawn in the design. */
export const swingCast: CharacterId[] = ["wezza", "naanaa", "qalqas", "zaghloul", "zouina", "basal"];

export const nav = [
  { label: "الرئيسية", href: "/" },
  { label: "الشخصيات", href: "/characters" },
  { label: "حكايتنا", href: "/about" },
  { label: "الدكان", href: "/products" },
  { label: "كاريير", href: "/careers" },
  { label: "اتصل بنا", href: "/contact" },
] as const;

export const hero = {
  titleTop: "اهلاً بيك فـــي",
  titleWorld: "عـالم",
  titleBrand: "زغاليل",
  body: "شخصيات كرتونية مصرية تصنع محتوى ترفيهي آمن وممتع لكل أفراد العائلة. من سن 7 لـ 77 سنة.",
  cta: "استكشف الشخصيات",
};

export const ticker = [
  "حلقة جديدة نزلت... يلا اتفرجوا!!",
  "كل شوية في حاجة جديدة... تعالى شوفها",
  "شحن مجاني للطلبات اللي فوق ٥٠٠ جنيه",
  "رجوع المدرسة بقى ألطف مع منتجات زغاليل",
  "أول عالم كرتوني مصري متكامل",
];

export const story = {
  eyebrow: "حكايتنا",
  title: "إزاي بدأ كل ده؟",
  lead: "عالم زغاليل بدأ من حلم بسيط: نعمل شخصيات مصرية أصلية، تتكلم بلسان المصريين، وتنشر الفرح في كل بيت.",
  cta: "كمل حكايتنا",
  more:
    "زغاليل أول عالم كرتوني مصري متكامل: شخصيات أصلية بتتكلم بلسان المصريين وبتقدم محتوى آمن وممتع للعيلة كلها. النهارده عالم زغاليل بيمتد لأبعد من المحتوى، من خلال منتجات مستوحاة من شخصياتنا وقصصنا، ليصبح بإمكان محبي زغاليل الاحتفاظ بجزء من هذا العالم معهم أينما ذهبوا.",
  vision: {
    title: "رؤيتنا",
    body: "أن نصنع عالمًا ترفيهيًا عربيًا أصيلًا يضيف لحظات من السعادة والبهجة إلى الحياة اليومية لكل عائلة.",
  },
  mission: {
    title: "رسالتنا",
    body: "تقديم محتوى ممتع وآمن وتجارب إبداعية تجعل الإنترنت مكانًا أكثر إشراقًا، وتمنح جمهورنا سببًا جديدًا للابتسام.",
  },
  milestones: [
    { year: 2021, title: "أول رسمة على الورق", body: "زغلول كان أول شخصية ترسم، بهدف بسيط: نخلق صحاب جدد للأطفال المصريين.", color: "#F8A88E" },
    { year: 2022, title: "اكتمال العالم", body: "أوتية و السيد بصل اخضر انضموا للعيلة، وبدأنا نبني عالم زغاليل بكل تفاصيله.", color: "#D6E07A" },
    { year: 2024, title: "أول حلقة وصلت لمليون مشاهدة", body: "بدأنا نوصل لبيوت كتير، والعيلة المصرية رحبت بزغاليل بحب كبير.", color: "#F2B6E4" },
    { year: 2026, title: "عالم زغاليل يفتح أبوابه", body: "دلوقتي بقى عندنا منتجات، شراكات، وتجارب جديدة كل شهر.", color: "#FFCC1A" },
  ],
};

export const mission = {
  kicker: "مهمة زغاليل بسيطة:",
  line1: "نرسم الضحكة في كل",
  line2: "بيت مصري",
  body:
    "زغاليل أول عالم كرتوني مصري متكامل: شخصيات أصلية بتتكلم بلسان المصريين وبتقدم محتوى آمن وممتع للعيلة كلها. هدفنا إننا نجمع العالم ده في مكان واحد؛ تتعرف فيه على الشلة، تتفرج على الحلقات والأغاني، تتسوق من الدكان، وتشتغل معانا لو عندك براند.",
};

export const crew = {
  eyebrow: "الشخصيات",
  title: "اتعرف على الشلة",
  sub: "سبع شخصيات، كل واحد ليه لونه وكاركتره وطبعه",
};

export const partners = {
  eyebrow: "شركاء الرحلة",
  title: "اللي شاركونا الرحلة",
  stats: [
    { value: 50, prefix: "+", suffix: "", label: "شراكة ناجحة" },
    { value: 2, prefix: "+", suffix: "M", label: "مشاهدة شهرياً" },
    { value: 120, prefix: "+", suffix: "", label: "فعالية وحدث" },
    { value: 98, prefix: "", suffix: "٪", label: "رضا العملاء" },
  ],
  logos: [
    { id: "uula", name: "UULA", latin: true },
    { id: "eva-pharma", name: "EVA PHARMA", latin: true },
    { id: "mrsool", name: "مرسول" },
    { id: "khotwh", name: "خطوة" },
    { id: "al-adwaa", name: "الأضواء" },
    { id: "bahia", name: "بهية" },
    { id: "spacetoon", name: "سبيستون" },
    { id: "oppo", name: "oppo", latin: true },
  ],
};

export const services = {
  eyebrow: "بنقدم ايه",
  title: "بنقدم ايه",
  sub: "بنرسم الابتسامة بأكتر من طريقة",
  body:
    "من محتوى يضحك، لأغاني بتتردد، لعروض حية على المسرح... كل اللي بنعمله يبقى جزء من عالم زغاليل، وابتسامة تفضل مع الناس.",
  cta: "يلا نشتغل سوا",
  items: [
    {
      id: "ads",
      scene: "service-ads",
      title: "إعلانات زغاليل",
      body: "نقدم حملات إعلانية ومحتوى ترويجي مبتكر من خلال شخصيات زغاليل المحبوبة، لمساعدة العلامات التجارية على الوصول إلى جمهورها بطريقة ممتعة وقريبة من العائلة. يتم نشر المحتوى عبر منصات زغاليل الرقمية لتحقيق تفاعل وانتشار أكبر.",
      prefill: "عايزين نعمل حملة إعلانية مع زغاليل لبراندنا:",
    },
    {
      id: "sponsor",
      scene: "service-sponsorship",
      title: "رعاية حلقات وأغاني زغاليل",
      body: "نوفر للعلامات التجارية فرصة رعاية حلقات وأغاني زغاليل، مع دمج ظهور الجهة الراعية داخل المحتوى بصورة طبيعية وجذابة تعزز الوعي بالعلامة التجارية وتخلق ارتباطا إيجابيا لدى الجمهور.",
      prefill: "مهتمين برعاية حلقة أو أغنية من زغاليل:",
    },
    {
      id: "theatre",
      scene: "service-theatre",
      title: "عروض زغاليل المسرحية",
      body: "نقدم عروضًا مسرحية حية وممتعة تناسب الأطفال والعائلات، بمشاركة شخصيات زغاليل المحبوبة. يمكن تنظيم العروض داخل المدارس والنوادي والفعاليات والمهرجانات والحفلات، لتوفير تجربة ترفيهية تفاعلية لا تُنسى.",
      prefill: "عايزين نحجز عرض مسرحي لزغاليل في:",
    },
  ],
} as const;

export type ShopCategoryId = "stickers" | "notebooks" | "gifts" | "merch";

export const shop = {
  eyebrow: "الدكان",
  title: "دكان زغاليل",
  categories: [
    { id: "stickers", name: "ستيكرز", bg: "#D6ECF2", edge: "#A7D9EC" },
    { id: "notebooks", name: "نوت بوك", bg: "#F6F2CB", edge: "#E0DB8F" },
    { id: "gifts", name: "هدايا تذكارية", bg: "#F7E5D3", edge: "#EDC6A6" },
    { id: "merch", name: "منتجات زغاليل", bg: "#E1F5DC", edge: "#BFE8B5" },
  ] as { id: ShopCategoryId; name: string; bg: string; edge: string }[],
};

export type Product = {
  id: string;
  category: ShopCategoryId;
  name: string;
  tagline?: string;
  price: number; // EGP
  oldPrice?: number;
  rating?: number;
  character: CharacterId;
  sample?: boolean;
};

export const products: Product[] = [
  { id: "sticker-zaghloul-official", category: "stickers", name: "ستيكر زغلول الرسمي", tagline: "ذكي، خلوق، مهمل أحيانًا", price: 400, oldPrice: 490, rating: 4.5, character: "zaghloul" },
  { id: "sticker-zaghloul", category: "stickers", name: "ستيكرز زغلول", price: 280, character: "zaghloul" },
  { id: "sticker-zouina", category: "stickers", name: "ستيكرز زوينة", price: 280, character: "zouina" },
  { id: "sticker-wezza", category: "stickers", name: "ستيكرز الوزة لطيفة", price: 280, character: "wezza" },
  { id: "sticker-basal", category: "stickers", name: "ستيكرز السيد بصل أخضر", price: 280, character: "basal" },
  { id: "sticker-qalqas", category: "stickers", name: "ستيكرز قلقس", tagline: "حنون، مبهج، بريء", price: 280, character: "qalqas" },
  { id: "sticker-naanaa", category: "stickers", name: "ستيكرز نعناعة", price: 280, character: "naanaa", sample: true },
  { id: "sticker-otteya", category: "stickers", name: "ستيكرز أوتّيه", price: 280, character: "otteya", sample: true },
  { id: "notebook-zaghloul", category: "notebooks", name: "نوت بوك زغلول", price: 150, character: "zaghloul", sample: true },
  { id: "notebook-naanaa", category: "notebooks", name: "نوت بوك نعناعة", price: 150, character: "naanaa", sample: true },
  { id: "gift-mug-qalqas", category: "gifts", name: "مج قلقس", price: 220, character: "qalqas", sample: true },
  { id: "gift-keychain-otteya", category: "gifts", name: "ميدالية أوتّيه", price: 90, character: "otteya", sample: true },
  { id: "merch-tee-zaghloul", category: "merch", name: "تيشيرت زغاليل", price: 450, character: "zaghloul", sample: true },
  { id: "merch-plush-zouina", category: "merch", name: "عروسة زوينة", price: 520, character: "zouina", sample: true },
];

/** Short product copy per category (not specified in the design — confirm with the client). */
export const categoryBlurb: Record<ShopCategoryId, string> = {
  stickers: "ستيكرز رسمية من عالم زغاليل، تزيّن بيها اللابتوب والنوت بوك والتليفون وتاخد الشلة معاك في كل مكان.",
  notebooks: "نوت بوك بتصميم من عالم زغاليل، رفيقك في المذاكرة والشغل وتدوين الحواديت.",
  gifts: "هدية لطيفة من عالم زغاليل، تفرّح الصغير والكبير.",
  merch: "منتج رسمي من عالم زغاليل لكل محبي الشلة.",
};

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>;

export const videos = {
  eyebrow: "فيديوهات وأغاني",
  title: "فيديوهات وأغاني وحاجات حلوة",
  items: [
    { id: "haqqi", title: "من حقي أقولك:", caption: "من فضلك اعزمني", scene: "room" as const, character: "zaghloul" as CharacterId },
    { id: "domoo3", title: "دايمًا دموع!", scene: "night" as const, character: "qalqas" as CharacterId },
    { id: "saqsaqa", title: "دراما السقسقة", scene: "living" as const, character: "qalqas" as CharacterId },
    { id: "tarawa", title: "البحث عن طراوة!", scene: "fan" as const, character: "zaghloul" as CharacterId },
    { id: "rogola", title: "هي دي الرجولة؟", scene: "living" as const, character: "qalqas" as CharacterId },
  ],
};

export const testimonials = {
  eyebrow: "آراء الناس",
  title: "اللي قالوه عننا",
  items: [
    { id: "t1", quote: "ابني بقى يقلد زغلول في كل حركة! الشخصيات حلوة ومناسبة جداً وكل القيم اللي بنحب نوصلها لأولادنا", name: "محمد علي", date: "22-3-2026", initial: "م", stars: 4 },
    { id: "t2", quote: "تعاملنا مع زغاليل في فعالية المدرسة وكان نجاح كبير، العرض الحي خلى الأطفال مبسوطين جداً", name: "مدارس النور", date: "22-3-2026", initial: "م", stars: 4 },
    { id: "t3", quote: "شراكة الإعلان مع زغلول وصلت لرسالتنا بشكل طبيعي جداً، والجمهور تفاعل بشكل رائع مع الحملة", name: "مدارس النور", date: "22-3-2026", initial: "ل", stars: 4 },
  ],
};

/** Digits only, for wa.me links. */
export const waDigits = (phone: string) => phone.replace(/\D/g, "");

export const contact = {
  eyebrow: "تعالى نتكلم",
  inviteTitle: "يلا بينا، عالم زغاليل في انتظارك",
  inviteBody: "سواء كنت جاي تتسوق، تتعاون معانا، أو بس تتفرج على حواديتنا، الباب مفتوح ليك دايماً.",
  formTitle: "تعالى نتكلم",
  fields: { name: "الاسم كامل", email: "ايميلك", message: "اكتب طلبك", messagePh: "احكيلنا فكرتك" },
  submit: "ابعتلنا",
  maxLength: 250,
  // Demo contact details — anonymised on purpose (not the brand's real inbox / number).
  phone: "+20123456789",
  email: "hello@example.com",
  studio: "Maadi, Cairo, Egypt",
};

export const footer = {
  columns: [
    {
      title: "تصفح",
      links: [
        { label: "الشخصيات", href: "/characters" },
        { label: "حكايتنا", href: "/about" },
        { label: "المحتوى", href: "/#videos" },
        { label: "الدكان", href: "/products" },
      ],
    },
    {
      title: "تعال نتكلم",
      links: [
        { label: "الدعم", href: "/contact", prefill: "محتاج مساعدة في:" },
        { label: "إزاي نشتغل مع بعض؟", href: "/#services" },
        { label: "شروط الخدمة", href: "#terms" },
        { label: "اعمل معنا", href: "/careers" },
      ],
    },
  ],
  newsletter: { title: "اشترك في الأخبار", body: "عايز تعرف أي أول حاجة جديدة في عالم زغاليل؟", placeholder: "ايميلك هنا", cta: "اشترك" },
  socials: [
    { id: "instagram", label: "Instagram", href: "https://instagram.com/" },
    { id: "youtube", label: "YouTube", href: "https://youtube.com/" },
    { id: "facebook", label: "Facebook", href: "https://facebook.com/" },
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/${waDigits("+20123456789")}` },
    { id: "mail", label: "Email", href: "mailto:hello@example.com" },
  ] as const,
};


/* ───────────── Inner pages ───────────── */

export const charactersPage = {
  crumb: "الشخصيات",
  title: "اتعرف على الشلة",
  intro: "لكل شخصية حكاية، ولكل حكاية ضحكة ومغامرة جديدة. اكتشف عالم زغاليل وتعرف على أبطال البهجة.",
};

export const aboutPage = {
  crumb: "حكايتنا",
  title: "أهلًا بك في عالم زغاليل!",
  lead: "نحن مجموعة من الشخصيات الكرتونية المرحة التي اجتمعت بهدف واحد: نشر البهجة ورسم الابتسامة على وجوه الصغار والكبار.",
  body: "من الأغاني والحلقات والمواقف الكوميدية إلى القصص والمغامرات اليومية، نصنع محتوى عائليًا آمنًا وممتعًا يجمع أفراد الأسرة حول لحظات من الضحك والمرح.",
  highlight: "لكن زغاليل ليست مجرد شخصيات كرتونية، بل عالم متكامل مليء بالحكايات والشخصيات التي تكبر وتتطور مع جمهورها يومًا بعد يوم.",
  partners: "كما نتعاون مع العلامات التجارية والمؤسسات لتقديم حملات إبداعية وتجارب ترفيهية مختلفة، من خلال شخصياتنا المحبوبة التي تساعد على بناء تواصل حقيقي وقريب من الجمهور.",
  today: "واليوم يمتد عالم زغاليل إلى ما هو أبعد من المحتوى، من خلال منتجات مستوحاة من شخصياتنا وقصصنا، ليصبح بإمكان محبي زغاليل الاحتفاظ بجزء من هذا العالم معهم أينما ذهبوا.",
};

export const productsPage = {
  crumb: "المنتجات",
  count: (n: number | string) => `المجموعة ${n} منتج`,
  filter: "فلتر",
  all: "الكل",
  sort: { label: "الترتيب", options: [
    { id: "featured", label: "المميز" },
    { id: "price-asc", label: "السعر: من الأقل" },
    { id: "price-desc", label: "السعر: من الأعلى" },
  ] as const },
  empty: "مفيش منتجات بالفلتر ده… جرب تغيّره",
  related: "منتجات تانية ممكن تعجبك",
  perks: ["شحن مجاني للطلبات اللي فوق ٥٠٠ جنيه", "منتجات رسمية من عالم زغاليل", "بنأكد طلبك معاك قبل الشحن"],
};

export const contactPage = {
  crumb: "اتصل بنا",
  title: "تواصل مع زغاليل",
  question: "عندك سؤال؟ فكرة؟ اقتراح؟ أو حابب تتعاون معانا؟",
  body: "يسعدنا دائمًا أن نسمع منك! سواء كنت من محبي زغاليل، أو علامة تجارية تبحث عن تعاون مميز، أو جهة ترغب في تنظيم عرض أو فعالية، فريقنا جاهز لمساعدتك.",
  note: "املأ النموذج وسنتواصل معك في أقرب وقت ممكن.",
  formTitle: "تعالوا نتكلم",
};

export const careersPage = {
  crumb: "كاريير",
  title: "اشتغل مع زغاليل",
  question: "بتحب الرسم؟ التحريك؟ الكتابة أو المزيكا؟",
  body: "لو عندك موهبة وحابب تكون جزء من الشلة اللي بترسم الضحكة في كل بيت مصري، ابعتلنا نبذة عنك ولينك لشغلك.",
  note: "املأ النموذج وسنتواصل معك في أقرب وقت ممكن.",
  formTitle: "قدّم معانا",
  prefill: "حابب أشتغل معاكم في زغاليل، ودي نبذة عني:",
};
