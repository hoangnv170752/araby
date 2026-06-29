import type { Translations } from "./en";

export const tr: Translations = {
  // Navigation
  nav: {
    features: "Özellikler",
    market: "Pazar",
    roadmap: "Yol Haritası",
    joinWaitlist: "Bekleme Listesine Katıl",
    demo: "Demo",
    tryIt: "Dene",
  },

  // Hero
  hero: {
    eyebrow: "İslami Dijital Platform",
    titleLine1: "İnancınız.",
    titleLine2: "Dijitalleştirildi.",
    titleLine3: "Bağlandı.",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    description:
      "Bir sonraki namazınızı önceden bilin. Kur'an'ı 40'tan fazla nüshada okuyun. Hicri takvimle yaşayın. Her gün Allah'ın yeni bir ismini keşfedin.",
    cta: "Bekleme Listesine Katıl",
    ctaNote: "Erken erişim · Spam yok",
  },

  // Stats
  stats: {
    muslimUsers: {
      num: "1.9 Milyar",
      label: "Dünya genelinde Müslüman kullanıcı",
    },
    halalEconomy: {
      num: "2 Trilyon $",
      label: "Küresel helal ekonomisi",
    },
    wellnessMarket: {
      num: "7.3 Milyar $",
      label: "2033'e kadar manevi sağlık uygulamaları pazarı",
    },
  },

  // Features
  features: {
    eyebrow: "İçerik",
    title: "Altı sütun. Tek uygulama.",
    prayerTimes: {
      title: "Namaz Vakitleri",
      desc: "Dünyanın her şehri için gerçek zamanlı güncellenen doğru namaz programları. Bir sonraki namaza geri sayım, özelleştirilebilir bildirim uyarıları.",
      api: "↳ Araby API · /prayer-times",
    },
    hijriCalendar: {
      title: "Hicri Takvim",
      desc: "Miladi ve İslami tarihler arasında dönüştürme yapın. Ramazan, Bayram ve tüm önemli İslami günleri otomatik olarak takip edin.",
      api: "↳ Araby API · /hijri-calendar",
    },
    quranReader: {
      title: "Kur'an Okuyucu",
      desc: "Kur'an-ı Kerim'in tam metni, çoklu baskılar, çeviriler, arama ve günlük tefekkür için rastgele ayet özelliği.",
      api: "↳ Araby API · /quran",
    },
    asmaAlHusna: {
      title: "Esmaü'l-Hüsna",
      desc: "Allah'ın 99 güzel ismini keşfedin — Arapça yazılış, transliterasyon ve anlam ile. Her gün bir isim öne çıkarılır.",
      api: "↳ Araby API · /asma-al-husna",
    },
    halalFinder: {
      title: "Helal Restoran Bulucu",
      desc: "Yakınınızdaki helal sertifikalı restoran ve yemek mekanlarını keşfedin. Mutfak türü, puan ve sertifikasyon standardına göre filtreleyin — dünyanın her yerinde.",
      api: "↳ Araby API · /halal-places  · Yakında",
    },
    arabicLearning: {
      title: "Arapça Öğren",
      desc: "Başlangıç ve orta düzey öğrenciler için tasarlanmış interaktif dersler — Arap alfabesinden Kur'an kelime dağarcığına kadar, sesli telaffuz rehberleriyle.",
      api: "↳ Araby API · /arabic-learning  · Yakında",
    },
  },

  // Try It (Live Demo)
  tryIt: {
    eyebrow: "Canlı Demo",
    title: "Şimdi deneyin",
    description: "Gerçek veriler, gerçek API'ler — kayıt gerekmez.",
    tabs: {
      prayer: "Namaz Vakitleri",
      hijri: "Hicri Takvim",
      husna: "Esmaü'l-Hüsna",
      ayah: "Rastgele Ayet",
    },
    prayer: {
      title: "Namaz Vakitleri",
      desc: "Dünya genelinde herhangi bir şehir için doğru namaz programını alın.",
      country: "Ülke",
      city: "Şehir",
      method: "Hesaplama Yöntemi",
      fetchTimes: "Vakitleri Getir",
      loading: "Canlı veriler alınıyor…",
      emptyState: "Bir şehir girin ve Vakitleri Getir'e tıklayın ↑",
      next: "Sıradaki",
    },
    hijri: {
      title: "Hicri Takvim",
      desc: "Herhangi bir Miladi tarihi İslami Hicri takvime dönüştürün.",
      date: "Tarih",
      convert: "Tarihi Dönüştür",
      emptyState: "Bir tarih seçin ve Dönüştür'e tıklayın ↑",
      gregorian: "Miladi",
      hijriLabel: "Hicri · İslami",
      designation: "İşaret",
    },
    husna: {
      title: "Esmaü'l-Hüsna",
      desc: "Allah'ın 99 güzel isminden her birini keşfedin.",
      nameNumber: "İsim numarası (1–99)",
      showName: "İsmi Göster",
      random: "Rastgele ↻",
      emptyState: "Bir numara seçin ve İsmi Göster'e tıklayın ↑",
      nameOf: "{number}. isim / 99",
    },
    ayah: {
      title: "Rastgele Ayet",
      desc: "Kur'an'dan rastgele seçilen bir ayet — Arapça metin ve Türkçe çeviri ile.",
      translation: "Çeviri",
      drawAyah: "Ayet Çek ↻",
      emptyState: 'Bir ayet almak için "Ayet Çek"e tıklayın ↑',
      surah: "Sure",
      verse: "Ayet",
    },
  },

  // Monetization
  monetization: {
    eyebrow: "Nasıl Para Kazanır",
    title: "Bu topluluk için tasarlanmış üç gelir akışı",
    stream1: {
      label: "Akış 01",
      title: "Freemium Abonelikler",
      desc: "Temel özellikler sonsuza kadar ücretsiz. Premium katman, reklamsız deneyim, çevrimdışı Kur'an sesi, gelişmiş namaz analitiği ve widget'lar sunar.",
      potential: "Tahmini kullanıcı başına aylık 2-5$ · Yüksek elde tutma",
    },
    stream2: {
      label: "Akış 02",
      title: "Ramazan Dönem Geliri",
      desc: "İslami uygulama oturumları Ramazan'da %15 artış gösterir. Sınırlı süreli premium paketler, bağış özellikleri ve sponsorlu hayır kampanyaları büyük mevsimsel gelir sağlar.",
      potential: "Ramazan 2025'te toplam 1.7 Milyar $ uygulama geliri",
      badge: "En uygun",
    },
    stream3: {
      label: "Akış 03",
      title: "B2B API ve White Label",
      desc: "Platformu camilere, İslami okullara ve helal işletmelere lisanslayın. MENA ve Güneydoğu Asya'daki bölgesel pazarlar için white-label versiyonları.",
      potential: "Daha yüksek marjlar · Yinelenen B2B sözleşmeleri",
    },
  },

  // Market
  market: {
    eyebrow: "Pazar Fırsatı",
    title: "Şimdi neden doğru zaman",
    stats: {
      downloads: {
        num: "62M+",
        label: "Muslim Pro indirmeleri — sıfır pazarlama bütçesiyle yapıldı",
      },
      valuation: {
        num: "300 Milyon $",
        label: "Helal yatırım uygulaması Wahed'in değerlemesi",
      },
      population: {
        num: "2.2 Milyar",
        label: "2030'a kadar öngörülen küresel Müslüman nüfusu",
      },
      retention: {
        num: "Günlük",
        label: "Kullanıcılar İslami uygulamaları günde birden fazla kez açar — olağanüstü elde tutma",
      },
    },
    textTitle: "İslami uygulamalar göründüğünden daha iyi para kazanır",
    textP1:
      "Muslim Pro gelirinin %90'ını reklamlardan, %10'unu aboneliklerden elde eder — kullanıcılarının çoğunluğu gelişmekte olan pazarlarda olmasına rağmen. İndirmeler ve gelir arasındaki açık fırsattır.",
    textP2:
      "Arap Körfezi, Birleşik Krallık ve Kuzey Amerika'daki kullanıcılar çok daha yüksek oranlarda dönüşüm yapar ve abonelik başına küresel ortalamanın çok üzerinde ödeme yapar.",
    highlight:
      "Önemli içgörü: Quran Majeed gelirinin sadece %8.1'i Hindistan ve Pakistan'dan geldi — bu ülkeler indirmelerin %35.6'sını oluşturmasına rağmen. Önce diasporayı hedefleyin.",
  },

  // Roadmap
  roadmap: {
    eyebrow: "İnşa Planı",
    title: "MVP'den ekosisteme",
    phase1: {
      phase: "Aşama 1",
      title: "Temel Dini Araçlar",
      desc: "Dört API destekli özellikle başlayın: namaz vakitleri, Hicri takvim, Kur'an okuyucu, Esmaü'l-Hüsna. Arapça, İngilizce ve bir bölgesel dil için UX ve yerelleştirmeyi mükemmelleştirin.",
      tags: ["Namaz Vakitleri API", "Hicri Takvim", "Kur'an API", "El-Hüsna API"],
    },
    phase2: {
      phase: "Aşama 2",
      title: "Etkileşim ve Elde Tutma",
      desc: "Günlük ayet bildirimleri, tesbih sayacı, dua kütüphanesi ve cami bulucu ekleyin. Freemium katmanı tanıtın. İlk Ramazan kampanyasını çalıştırın.",
      tags: ["Bildirimler", "Çevrimdışı mod", "Freemium"],
    },
    phase3: {
      phase: "Aşama 3",
      title: "Topluluk ve Gelir",
      desc: "Topluluk özelliklerini açın: İslami Soru-Cevap, yerel etkinlikler, helal rehberi. Camiler ve İslami okullar için B2B white-label teklifini başlatın. Hayır bağışı entegrasyonunu keşfedin.",
      tags: ["Topluluk", "B2B API", "Bağışlar", "Pazar Yeri"],
    },
  },

  // CTA
  cta: {
    arabic: "السلام عليكم",
    title: "Lansman olduğunda ilk siz öğrenin.",
    subtitle: "Bekleme listesine katılın. Herkese açık lansmandan önce erken erişim için sizinle iletişime geçeceğiz.",
    emailPlaceholder: "email@adresiniz.com",
    feedbackPlaceholder: "Düşünceleriniz veya istediğiniz özellikler? (isteğe bağlı)",
    button: "Bekleme Listesine Katıl",
    success: "✓ Listedesiniz! Sizinle iletişime geçeceğiz.",
  },

  // Footer
  footer: {
    builtWith: "AlAdhan & AlQuran Cloud API'leri ile yapıldı · 2026",
  },
};
