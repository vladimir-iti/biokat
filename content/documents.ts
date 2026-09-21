import { plural } from '@/lib/format';
import { registryPeriod, totalContracts } from '@/lib/queries';
import type { DocumentItem } from '@/lib/types';

export const documents: DocumentItem[] = [
  {
    id: 'license-mchs',
    kind: 'license',
    title: 'Лицензия МЧС России',
    summary:
      'Деятельность по монтажу, техническому обслуживанию и ремонту средств обеспечения пожарной безопасности зданий и сооружений. Одиннадцать видов работ, срок действия не ограничен.',
    meta: [
      { label: 'Номер', value: '77-Б/05039' },
      { label: 'Дата выдачи', value: '02.06.2017' },
      { label: 'Срок действия', value: 'Бессрочно' },
      { label: 'Выдана', value: 'ГУ МЧС России по г. Москве' },
    ],
    file: '/documents/license-mchs.pdf',
    preview: '/images/documents/license-mchs',
  },
  {
    id: 'sro-design',
    kind: 'sro',
    title: 'СРО на проектирование',
    summary:
      'Выписка из реестра членов саморегулируемой организации. Право осуществлять подготовку проектной документации по договору подряда.',
    meta: [
      { label: 'СРО', value: 'АС «Объединение проектировщиков «УниверсалПроект»' },
      { label: 'Реестровый номер СРО', value: 'СРО-П-179-12122012' },
      { label: 'Номер члена', value: '190924/181' },
      { label: 'Дата регистрации', value: '19.09.2024' },
      { label: 'Статус', value: 'Действующий член' },
    ],
    file: '/documents/sro-design.pdf',
    preview: '/images/documents/sro-design',
  },
  {
    id: 'sro-construction',
    kind: 'sro',
    title: 'СРО на строительство',
    summary:
      'Выписка из реестра членов саморегулируемой организации. Право вести строительство, реконструкцию и капитальный ремонт объектов капитального строительства по договору строительного подряда.',
    meta: [
      { label: 'СРО', value: 'Ассоциация «Архитектурное наследие»' },
      { label: 'Реестровый номер СРО', value: 'СРО-С-230-07092010' },
      { label: 'Номер члена', value: '030624/095' },
      { label: 'Дата регистрации', value: '03.06.2024' },
      { label: 'Уровень ответственности', value: 'Первый — до 90 млн ₽ по договору' },
      { label: 'Статус', value: 'Действующий член' },
    ],
    file: '/documents/sro-construction.pdf',
    preview: '/images/documents/sro-construction',
  },
  {
    id: 'certificate-nku',
    kind: 'certificate',
    title: 'Сертификат соответствия на щитовое оборудование',
    summary:
      'Подтверждение соответствия низковольтных комплектных устройств требованиям технического регламента Таможенного союза.',
    meta: [
      { label: 'Номер', value: 'ТС RU C-RU.ЭМ02.В.00438' },
      { label: 'Дата', value: '18.12.2015' },
    ],
    note: 'Документ предыдущего юридического лица. Действующий сертификат предоставляется по запросу.',
  },
  {
    id: 'iso-9001',
    kind: 'certificate',
    title: 'Сертификат ISO 9001',
    summary: 'Система менеджмента качества при выполнении электромонтажных работ.',
    meta: [
      { label: 'Номер', value: 'СДС.РТТ.СМК.0042-13' },
      { label: 'Дата', value: '17.06.2013' },
    ],
    note: 'Документ предыдущего юридического лица. Действующий сертификат предоставляется по запросу.',
  },
  {
    id: 'passport',
    kind: 'sample',
    title: 'Паспорт шкафа и инструкция по эксплуатации',
    summary:
      'Каждое изделие собственного производства сопровождается паспортом, инструкцией по эксплуатации и гарантийными обязательствами.',
    meta: [
      { label: 'Гарантия', value: '12 месяцев по умолчанию' },
      { label: 'Расширенная гарантия', value: 'До 5 лет по отдельным контрактам' },
    ],
    note: 'Образец документации предоставляется по запросу.',
  },
];

export const downloads = [
  {
    id: 'company-card',
    title: 'Карточка компании',
    description: 'Реквизиты, банковские счета, руководство',
    file: '/documents/company-card.pdf',
    format: 'PDF',
  },
  {
    id: 'contracts-registry',
    title: 'Реестр исполненных договоров',
    description: `${totalContracts} ${plural(totalContracts, ['договор', 'договора', 'договоров'])} ${registryPeriod}`,
    file: '/documents/contracts-registry.pdf',
    format: 'PDF',
  },
];
