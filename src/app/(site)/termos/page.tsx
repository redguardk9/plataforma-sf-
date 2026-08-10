import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "Termos e Condições" };

export default function TermosPage() {
  return (
    <LegalDoc title="Termos e Condições" updated="julho de 2026">
      <LegalSection title="1. Objeto">
        <p>Estes termos regulam a utilização da plataforma de Sérgio Fonseca — nomeadamente a criação de conta, a inscrição em formações, a marcação de sessões e o acesso aos conteúdos. Ao criar conta ou efetuar uma marcação, aceita estes termos.</p>
      </LegalSection>

      <LegalSection title="2. Conta">
        <p>Compromete-se a fornecer dados verdadeiros e a manter a confidencialidade da sua palavra-passe. É responsável pela atividade realizada na sua conta.</p>
      </LegalSection>

      <LegalSection title="3. Formações e pagamentos">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><strong>Formações gravadas:</strong> concedem acesso ao respetivo conteúdo após confirmação do pagamento.</li>
          <li><strong>Formações em direto:</strong> a inscrição garante lugar na data indicada, sujeita a vagas disponíveis.</li>
          <li>Os preços são indicados em euros. O acesso é ativado após a confirmação do pagamento.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Direito de livre resolução">
        <p>Nos termos da lei do consumidor, dispõe de 14 dias para resolver o contrato. Este direito pode não se aplicar a conteúdos digitais cujo acesso já tenha sido iniciado com o seu consentimento expresso, conforme permitido pela lei.</p>
      </LegalSection>

      <LegalSection title="5. Propriedade intelectual">
        <p>Todos os conteúdos (vídeos, textos, materiais) são propriedade de Sérgio Fonseca e destinam-se a uso pessoal e intransmissível. É proibida a reprodução, partilha ou revenda sem autorização.</p>
      </LegalSection>

      <LegalSection title="6. Chat de dúvidas">
        <p>O chat de cada formação destina-se a questões sobre os conteúdos. Não é um canal de aconselhamento clínico nem de emergência.</p>
      </LegalSection>

      <LegalSection title="7. Aviso importante">
        <p>Os conteúdos formativos e informativos não substituem acompanhamento clínico. <strong>Em situação de emergência ou risco, contacte o 112 ou a Linha SNS 24 (808 24 24 24).</strong></p>
      </LegalSection>

      <LegalSection title="8. Lei aplicável">
        <p>Estes termos regem-se pela lei portuguesa. Para questões, contacte {CONTACT.email} ou {CONTACT.phone}.</p>
      </LegalSection>
    </LegalDoc>
  );
}
