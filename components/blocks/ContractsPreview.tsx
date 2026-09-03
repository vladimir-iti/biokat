import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { contractObject, formatMillions, plural } from '@/lib/format';
import { contractsByDate, totalAmount, totalContracts } from '@/lib/queries';

export function ContractsPreview() {
  const rows = contractsByDate.slice(0, 5);

  return (
    <Section
      label="Опыт"
      title="Реестр исполненных договоров"
      lead="Заказчики, сроки и суммы — из справки о компании, подписанной генеральным директором. Открыто, потому что проверяется."
      headerAside={<Button href="/experience/">Весь реестр</Button>}
    >
      <div className="overflow-x-auto">
        <table className="table-cards w-full text-left md:min-w-[720px]">
          <caption className="sr-only">
            Последние договоры ГК «Биокат»
          </caption>
          <thead>
            <tr className="border-b border-ink/20">
              <th scope="col" className="t-label py-3 pr-4 font-medium text-steel">№</th>
              <th scope="col" className="t-label py-3 pr-4 font-medium text-steel">Заказчик</th>
              <th scope="col" className="t-label py-3 pr-4 font-medium text-steel">Объект</th>
              <th scope="col" className="t-label py-3 pr-4 font-medium text-steel">Годы</th>
              <th scope="col" className="t-label py-3 text-right font-medium text-steel">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((contract) => (
              <tr
                key={contract.id}
                className="border-b border-line transition-colors duration-150 hover:bg-teal/4"
              >
                <td data-label="№" className="py-4 pr-4 font-mono t-micro text-steel">
                  {contract.id}
                </td>
                <td data-label="Заказчик" className="py-4 pr-4 font-medium">{contract.client}</td>
                <td data-label="Объект" className="py-4 pr-4 t-small text-steel md:max-w-[38ch]">
                  {contractObject(contract.description)}
                </td>
                <td data-label="Годы" className="py-4 pr-4 font-mono t-micro whitespace-nowrap">
                  {contract.status === 'active' ? (
                    <span className="text-teal">в работе</span>
                  ) : (
                    contract.finished.slice(-4)
                  )}
                </td>
                <td data-label="Сумма" className="py-4 text-right font-mono tnum whitespace-nowrap">
                  {formatMillions(contract.amount)} млн ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 t-small text-steel">
        Всего {totalContracts}{' '}
        {plural(totalContracts, ['договор', 'договора', 'договоров'])} на{' '}
        <span className="font-mono font-medium text-ink">
          {formatMillions(totalAmount)} млн ₽
        </span>{' '}
        с 2016 по 2025 год.
      </p>
    </Section>
  );
}
