import { cn } from '@/lib/cn';

/**
 * Адрес, в котором ссылкой на карту становится только улица с домом.
 * Индекс, город и район остаются обычным текстом: кликать по ним незачем.
 */
export function AddressLink({
  address,
  street,
  map,
  className,
}: {
  address: string;
  street: string;
  map: string;
  className?: string;
}) {
  const at = address.lastIndexOf(street);
  if (at < 0) return <>{address}</>;

  return (
    <>
      {address.slice(0, at)}
      <a
        href={map}
        target="_blank"
        rel="noreferrer"
        className={cn('link-draw font-medium text-teal', className)}
      >
        {street}
      </a>
      {address.slice(at + street.length)}
    </>
  );
}
