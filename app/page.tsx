import BriefingForm from "@/components/BriefingForm";

// Página totalmente interativa e sem dados de servidor: não faz sentido
// pré-renderizar estaticamente no build, então forçamos renderização
// dinâmica para evitar problemas de build por variáveis de ambiente.
export const dynamic = "force-dynamic";

export default function Home() {
  return <BriefingForm />;
}
