import { ComingSoon } from "@/components/layout/ComingSoon";

export default function NotFound() {
  return (
    <ComingSoon
      icon="search"
      titleAr="الصفحة غير موجودة"
      titleEn="Page not found"
      noteAr="الرابط الذي تبحث عنه غير متاح. عُد إلى الرئيسية وتابع التسوق."
      noteEn="The page you’re looking for isn’t available. Head back home and keep browsing."
    />
  );
}
