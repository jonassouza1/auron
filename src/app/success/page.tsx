import { Suspense } from "react";
import SuccessPageContent from "./SuccessPageContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
