import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <LegalDoc title="Política de Privacidade" updated="julho de 2026">
      <LegalSection title="1. Responsável pelo tratamento">
        <p>
          O responsável pelo tratamento dos seus dados pessoais é <strong>Sérgio Fonseca</strong>,
          psicólogo especialista. Para qualquer questão sobre privacidade, contacte{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-brand font-medium">{CONTACT.email}</a> ou {CONTACT.phone}.
        </p>
      </LegalSection>

      <LegalSection title="2. Que dados recolhemos">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><strong>Dados de conta:</strong> nome, endereço de email e palavra-passe (guardada de forma cifrada).</li>
          <li><strong>Dados de compra:</strong> registos das formações e sessões adquiridas e respetivos pagamentos.</li>
          <li><strong>Dados de utilização:</strong> inscrições, progresso e mensagens colocadas no chat de dúvidas das formações.</li>
          <li><strong>Dados técnicos:</strong> cookies estritamente essenciais ao funcionamento da sessão.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalidades e base legal">
        <p>Tratamos os seus dados para: (a) criar e gerir a sua conta e o acesso aos conteúdos — <em>execução de contrato</em>; (b) processar pagamentos e emitir faturação — <em>obrigação legal</em>; (c) comunicar consigo sobre as suas compras; (d) garantir a segurança da plataforma — <em>interesse legítimo</em>.</p>
      </LegalSection>

      <LegalSection title="4. Dados clínicos e sigilo profissional">
        <p>
          O acompanhamento clínico presencial ou online rege-se pelo <strong>sigilo profissional</strong> e pelo Código
          Deontológico da Ordem dos Psicólogos Portugueses. Esta plataforma <strong>não se destina ao registo de
          dados clínicos de saúde</strong>; não partilhe informação clínica sensível através do chat de dúvidas.
        </p>
      </LegalSection>

      <LegalSection title="5. Partilha de dados">
        <p>Os seus dados nunca são vendidos. Podem ser processados por prestadores que nos apoiam (por exemplo, processamento de pagamentos e alojamento), sempre sob contrato e apenas no necessário à prestação do serviço.</p>
      </LegalSection>

      <LegalSection title="6. Conservação">
        <p>Conservamos os dados enquanto a sua conta existir e pelos prazos exigidos por lei (por exemplo, obrigações fiscais). Pode pedir a eliminação a qualquer momento, salvo quando a lei exigir a sua conservação.</p>
      </LegalSection>

      <LegalSection title="7. Os seus direitos (RGPD)">
        <p>Tem direito a aceder, retificar, apagar, limitar e opor-se ao tratamento dos seus dados, bem como à sua portabilidade. Para exercer estes direitos, contacte {CONTACT.email}. Tem ainda o direito de reclamar junto da Comissão Nacional de Proteção de Dados (CNPD).</p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>Utilizamos apenas cookies essenciais, necessários para manter a sua sessão autenticada. Não usamos cookies de publicidade ou de rastreio de terceiros.</p>
      </LegalSection>

      <LegalSection title="9. Alterações">
        <p>Esta política pode ser atualizada. A data da última atualização encontra-se no topo da página.</p>
      </LegalSection>
    </LegalDoc>
  );
}
