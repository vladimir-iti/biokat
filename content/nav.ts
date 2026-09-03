export interface NavItem {
  href: string;
  title: string;
}

export const mainNav: NavItem[] = [
  { href: '/services/', title: 'Услуги' },
  { href: '/projects/', title: 'Объекты' },
  { href: '/experience/', title: 'Опыт' },
  { href: '/about/', title: 'О компании' },
  { href: '/certificates/', title: 'Документы' },
  { href: '/contacts/', title: 'Контакты' },
];

export const footerNav: NavItem[] = [
  ...mainNav,
  { href: '/privacy/', title: 'Политика конфиденциальности' },
];
