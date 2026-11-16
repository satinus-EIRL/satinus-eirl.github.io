/**
 * Satinus E.I.R.L. — Términos de uso v1.0
 * Fuente compartida: web (terms-gate, terminos.html) y app HEX Scanner.
 * Metadatos: legal/terms-v1.json
 */
(function (global) {
  'use strict';

  var META = {
    version: '1.0',
    effectiveDate: '2026-07-09',
    holder: 'Satinus E.I.R.L.',
    contact: 'satinuseirl@gmail.com',
    jurisdiction: 'Chile',
    fullUrl: 'https://satinus.net/terminos.html',
    storageKey: 'satinus_terms_accepted_v1',
  };

  var LOCALES = {
    es: {
      title: 'Términos de uso',
      subtitle: 'Satinus E.I.R.L. — sitio web, documentación y aplicación HEX Scanner',
      gateLead:
        'Antes de continuar, lee y acepta los términos que rigen el uso de nuestros servicios digitales.',
      acceptLabel: 'He leído y acepto los términos de uso',
      continueLabel: 'Continuar',
      declineLabel: 'No acepto',
      readFull: 'Leer texto completo',
      declineMessage:
        'Debes aceptar los términos de uso para utilizar el sitio web, la documentación publicada y las herramientas en línea de Satinus E.I.R.L.',
      sections: [
        {
          id: 'scope',
          title: '1. Alcance',
          body:
            'Estos términos regulan el acceso y uso del sitio web satinus.net, su documentación técnica, la herramienta web HEX: Encoder / Decoder y la aplicación móvil HEX Scanner (APK), en conjunto los «Servicios». Al acceder por primera vez o al instalar la aplicación, usted acepta estos términos.',
        },
        {
          id: 'nature',
          title: '2. Naturaleza del servicio',
          body:
            'Los Servicios se ofrecen con fines de experimentación, evaluación técnica, educación y difusión controlada del formato HEX V8. La aplicación móvil se distribuye como versión de evaluación de campo (preprint/alpha). No constituyen un producto comercial terminado ni un servicio de misión crítica.',
        },
        {
          id: 'permitted',
          title: '3. Uso permitido',
          body:
            'Uso gratuito para pruebas personales, actividades académicas, evaluación del protocolo, generación de símbolos de prueba y lectura con las herramientas proporcionadas, conforme a la documentación publicada.',
        },
        {
          id: 'prohibited',
          title: '4. Uso no permitido',
          body:
            'Queda prohibida la ingeniería inversa, descompilación, extracción o redistribución de las librerías de decodificación internas; el uso comercial o en entornos lucrativos sin licencia; la eliminación de avisos de autoría; y cualquier uso que vulnere la legislación aplicable o los derechos de terceros.',
        },
        {
          id: 'ip',
          title: '5. Propiedad intelectual',
          body:
            'El protocolo HEX V8, los algoritmos de codificación y decodificación, el know-how de implementación y las marcas asociadas son propiedad de Satinus E.I.R.L., amparados por la legislación chilena de propiedad intelectual (Ley N° 17.336). El acceso a los Servicios no transfiere derechos de propiedad ni licencia de integración en productos de terceros.',
        },
          {
          id: 'privacy',
          title: '6. Privacidad y datos',
          body:
            'El procesamiento de imagen para decodificación HEX en la aplicación móvil es local en el dispositivo; no se envían capturas de cámara a servidores de Satinus por defecto. El formulario de contacto del sitio web transmite los datos que usted ingrese con el único fin de responder su consulta. El sitio no usa cookies de seguimiento; puede almacenar en localStorage la preferencia de idioma y la aceptación de estos términos. Detalle: privacidad.html.',
        },
        {
          id: 'warranty',
          title: '7. Sin garantías',
          body:
            'Los Servicios se proporcionan «tal cual» (as-is), sin garantía de disponibilidad continua, idoneidad para un fin particular, lectura exitosa en todas las condiciones ópticas o de impresión, ni ausencia de errores.',
        },
        {
          id: 'liability',
          title: '8. Limitación de responsabilidad',
          body:
            'En la medida permitida por la ley chilena, Satinus E.I.R.L. no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso de los Servicios.',
        },
        {
          id: 'collaboration',
          title: '9. Colaboración y licencias',
          body:
            'Satinus E.I.R.L. está abierta a colaboración investigativa (acceso ampliado bajo solicitud y compromiso de citación) y a licenciamiento comercial (integración en software propio, despliegue corporativo o white-label). Consultas: satinuseirl@gmail.com.',
        },
        {
          id: 'changes',
          title: '10. Modificaciones',
          body:
            'Satinus E.I.R.L. puede actualizar estos términos. La versión vigente se publicará en el sitio web con su fecha de vigencia. El uso continuado tras cambios materiales implica aceptación de la nueva versión.',
        },
        {
          id: 'law',
          title: '11. Ley aplicable',
          body:
            'Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia se someterá a los tribunales ordinarios de Chile, salvo disposición legal imperativa en contrario.',
        },
      ],
    },
    en: {
      title: 'Terms of use',
      subtitle: 'Satinus E.I.R.L. — website, documentation, and HEX Scanner app',
      gateLead:
        'Before continuing, please read and accept the terms governing use of our digital services.',
      acceptLabel: 'I have read and accept the terms of use',
      continueLabel: 'Continue',
      declineLabel: 'I do not accept',
      readFull: 'Read full text',
      declineMessage:
        'You must accept the terms of use to access the Satinus E.I.R.L. website, published documentation, and online tools.',
      sections: [
        {
          id: 'scope',
          title: '1. Scope',
          body:
            'These terms govern access to and use of the website satinus.net, its technical documentation, the HEX: Encoder / Decoder web tool, and the HEX Scanner mobile application (APK), collectively the «Services». By first accessing or installing the app, you accept these terms.',
        },
        {
          id: 'nature',
          title: '2. Nature of the service',
          body:
            'The Services are provided for experimentation, technical evaluation, education, and controlled dissemination of the HEX V8 format. The mobile app is distributed as a field evaluation (preprint/alpha) build. They are not a finished commercial product or a mission-critical service.',
        },
        {
          id: 'permitted',
          title: '3. Permitted use',
          body:
            'Free use for personal testing, academic activities, protocol evaluation, generating test symbols, and reading with the provided tools, in accordance with published documentation.',
        },
        {
          id: 'prohibited',
          title: '4. Prohibited use',
          body:
            'Reverse engineering, decompilation, extraction, or redistribution of internal decoding libraries is prohibited, as is commercial or for-profit use without a license, removal of attribution notices, or any use that violates applicable law or third-party rights.',
        },
        {
          id: 'ip',
          title: '5. Intellectual property',
          body:
            'The HEX V8 protocol, encoding and decoding algorithms, implementation know-how, and associated marks are owned by Satinus E.I.R.L., protected under Chilean intellectual property law (Law No. 17,336). Access to the Services does not transfer ownership or a license to integrate into third-party products.',
        },
        {
          id: 'privacy',
          title: '6. Privacy and data',
          body:
            'HEX image decoding in the mobile app runs locally on the device; camera captures are not sent to Satinus servers by default. The website contact form transmits data you submit solely to respond to your inquiry.',
        },
        {
          id: 'warranty',
          title: '7. No warranties',
          body:
            'The Services are provided «as is», without warranty of continuous availability, fitness for a particular purpose, successful reads under all optical or print conditions, or freedom from errors.',
        },
        {
          id: 'liability',
          title: '8. Limitation of liability',
          body:
            'To the extent permitted by Chilean law, Satinus E.I.R.L. shall not be liable for direct, indirect, incidental, or consequential damages arising from use or inability to use the Services.',
        },
        {
          id: 'collaboration',
          title: '9. Collaboration and licensing',
          body:
            'Satinus E.I.R.L. welcomes research collaboration (extended access on request with citation commitment) and commercial licensing (integration, corporate deployment, or white-label). Contact: satinuseirl@gmail.com.',
        },
        {
          id: 'changes',
          title: '10. Changes',
          body:
            'Satinus E.I.R.L. may update these terms. The current version will be published on the website with its effective date. Continued use after material changes constitutes acceptance of the new version.',
        },
        {
          id: 'law',
          title: '11. Governing law',
          body:
            'These terms are governed by the laws of the Republic of Chile. Any dispute shall be submitted to the ordinary courts of Chile, unless mandatory law provides otherwise.',
        },
      ],
    },
    pt: {
      title: 'Termos de uso',
      subtitle: 'Satinus E.I.R.L. — site, documentação e aplicativo HEX Scanner',
      gateLead:
        'Antes de continuar, leia e aceite os termos que regem o uso dos nossos serviços digitais.',
      acceptLabel: 'Li e aceito os termos de uso',
      continueLabel: 'Continuar',
      declineLabel: 'Não aceito',
      readFull: 'Ler texto completo',
      declineMessage:
        'Você deve aceitar os termos de uso para utilizar o site, a documentação publicada e as ferramentas on-line da Satinus E.I.R.L.',
      sections: [
        {
          id: 'scope',
          title: '1. Escopo',
          body:
            'Estes termos regulam o acesso e uso do site satinus.net, sua documentação técnica, a ferramenta web HEX: Encoder / Decoder e o aplicativo móvel HEX Scanner (APK), em conjunto os «Serviços». Ao acessar pela primeira vez ou instalar o aplicativo, você aceita estes termos.',
        },
        {
          id: 'nature',
          title: '2. Natureza do serviço',
          body:
            'Os Serviços são oferecidos para experimentação, avaliação técnica, educação e divulgação controlada do formato HEX V8. O aplicativo móvel é distribuído como versão de avaliação de campo (preprint/alpha). Não constituem produto comercial finalizado nem serviço de missão crítica.',
        },
        {
          id: 'permitted',
          title: '3. Uso permitido',
          body:
            'Uso gratuito para testes pessoais, atividades acadêmicas, avaliação do protocolo, geração de símbolos de teste e leitura com as ferramentas fornecidas, conforme a documentação publicada.',
        },
        {
          id: 'prohibited',
          title: '4. Uso não permitido',
          body:
            'É proibida a engenharia reversa, descompilação, extração ou redistribuição das bibliotecas internas de decodificação; uso comercial ou lucrativo sem licença; remoção de avisos de autoria; e qualquer uso que viole a legislação aplicável ou direitos de terceiros.',
        },
        {
          id: 'ip',
          title: '5. Propriedade intelectual',
          body:
            'O protocolo HEX V8, os algoritmos de codificação e decodificação, o know-how de implementação e as marcas associadas são propriedade da Satinus E.I.R.L., amparados pela legislação chilena de propriedade intelectual (Lei N° 17.336). O acesso aos Serviços não transfere direitos de propriedade nem licença de integração em produtos de terceiros.',
        },
        {
          id: 'privacy',
          title: '6. Privacidade e dados',
          body:
            'O processamento de imagem para decodificação HEX no aplicativo móvel é local no dispositivo; capturas da câmera não são enviadas aos servidores da Satinus por padrão. O formulário de contato do site transmite os dados que você informar apenas para responder sua consulta.',
        },
        {
          id: 'warranty',
          title: '7. Sem garantias',
          body:
            'Os Serviços são fornecidos «no estado em que se encontram» (as-is), sem garantia de disponibilidade contínua, adequação a um fim específico, leitura bem-sucedida em todas as condições ópticas ou de impressão, ou ausência de erros.',
        },
        {
          id: 'liability',
          title: '8. Limitação de responsabilidade',
          body:
            'Na medida permitida pela lei chilena, a Satinus E.I.R.L. não será responsável por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da impossibilidade de uso dos Serviços.',
        },
        {
          id: 'collaboration',
          title: '9. Colaboração e licenças',
          body:
            'A Satinus E.I.R.L. está aberta à colaboração investigativa (acesso ampliado mediante solicitação e compromisso de citação) e a licenciamento comercial (integração em software próprio, implantação corporativa ou white-label). Contato: satinuseirl@gmail.com.',
        },
        {
          id: 'changes',
          title: '10. Modificações',
          body:
            'A Satinus E.I.R.L. pode atualizar estes termos. A versão vigente será publicada no site com sua data de vigência. O uso continuado após alterações materiais implica aceitação da nova versão.',
        },
        {
          id: 'law',
          title: '11. Lei aplicável',
          body:
            'Estes termos são regidos pelas leis da República do Chile. Qualquer controvérsia será submetida aos tribunais ordinários do Chile, salvo disposição legal imperativa em contrário.',
        },
      ],
    },
  };

  global.SatinusTerms = {
    meta: META,
    locales: LOCALES,
    getLocale: function (lang) {
      if (LOCALES[lang]) return LOCALES[lang];
      return LOCALES.es;
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
