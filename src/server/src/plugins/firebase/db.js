const wordsBank = [
  'زمن',
  'عام',
  'اشخاص',
  'الطريق',
  'يوم',
  'رجل',
  'شيء',
  'النساء',
  'الحياة',
  'طفل',
  'العالمية',
  'مدرسة',
  'حالة',
  'أسرة',
  'طالب علم',
  'مجموعة',
  'بلد',
  'مشكلة',
  'كف',
  'جزء',
  'مكان',
  'قضية',
  'أسبوع',
  'شركة',
  'النظام',
  'برنامج',
  'سؤال',
  'عمل',
  'حكومة',
  'رقم',
  'ليل',
  'نقطة',
  'الصفحة الرئيسية',
  'ماء',
  'غرفة',
  'أم',
  'منطقة',
  'مال',
  'قصة',
  'حقيقة',
  'شهر',
  'كثيرا',
  'حق',
  'دراسة',
  'كتاب',
  'عين',
  'مهنة',
  'كلمة',
  'اعمال',
  'القضية',
  'جانب',
  'طيب القلب',
  'رئيس',
  'منزل',
  'الخدمات',
  'صديق',
  'الآب',
  'قوة',
  'ساعة',
  'لعبه',
  'خط',
  'النهاية',
  'عضو',
  'القانون',
  'سيارة',
  'مدينة'
];

function get(count) {
  const words = [];
  while (true) {
    const j = Math.floor(Math.random() * wordsBank.length);
    const word = wordsBank[j];
    if (!~words.indexOf(word)) {
      words.push(word);
      if (words.length === count) {
        break;
      }
    }
  }
  return words;
}

module.exports = {
  get
};
