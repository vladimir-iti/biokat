import { cn } from '@/lib/cn';

/** Моноширинная метка. Всё, что маркируется в реальности, набрано этой ролью. */
export function Label({
  children,
  className,
  as: Tag = 'span',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'div' | 'p';
}) {
  return (
    <Tag className={cn('t-label font-mono text-steel', className)}>{children}</Tag>
  );
}
