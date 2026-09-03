import { BusNode } from '@/components/motion/BusNode';
import { Reveal } from '@/components/motion/Reveal';
import { Container } from '@/components/ui/Container';
import { BusLabel } from '@/components/motion/BusLabel';
import { cn } from '@/lib/cn';

type Tone = 'paper' | 'panel' | 'ink';

const tones: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  panel: 'bg-panel text-ink',
  ink: 'bg-ink text-paper [--bus-label-idle:#ffffff]',
};

/**
 * Секция страницы. Слева — узел на шине и отвод к содержимому,
 * ровно как на однолинейной схеме.
 */
export function Section({
  id,
  label,
  title,
  lead,
  tone = 'paper',
  className,
  headerAside,
  children,
}: {
  id?: string;
  label?: string;
  title?: React.ReactNode;
  lead?: React.ReactNode;
  tone?: Tone;
  className?: string;
  headerAside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const hasHeader = Boolean(label || title || lead);

  return (
    <section
      id={id}
      className={cn('py-24 md:py-32 lg:py-40', tones[tone], className)}
    >
      <Container>
        <div
          data-bus-row
          className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]"
        >
          {/* Узел ставится только там, где есть название блока: иначе
              линия уходила бы вправо в пустоту */}
          <div className="relative hidden lg:block" aria-hidden="true">
            {label && <BusNode />}
          </div>

          <div>
            {hasHeader && (
              <Reveal>
                <header
                  className={cn(
                    'mb-10 md:mb-16',
                    headerAside && 'md:flex md:items-end md:justify-between md:gap-10',
                  )}
                >
                  <div>
                    {label && <BusLabel className="mb-6">{label}</BusLabel>}
                    {title && <h2 className="t-h2 max-w-[20ch]">{title}</h2>}
                    {lead && (
                      <div
                        className={cn(
                          't-lead measure mt-8',
                          tone === 'ink' ? 'text-paper/70' : 'text-steel',
                        )}
                      >
                        {lead}
                      </div>
                    )}
                  </div>
                  {headerAside && (
                    <div className="mt-8 shrink-0 md:mt-0">{headerAside}</div>
                  )}
                </header>
              </Reveal>
            )}
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
