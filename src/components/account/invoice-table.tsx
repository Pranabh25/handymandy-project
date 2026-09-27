import { formatAmount } from "@/components/account/invoice-utils";

export type InvoiceRow = {
  key: string;
  description: string;
  detail?: string;
  hsn: string;
  qty: number;
  /** GST-inclusive unit price */
  rate: number;
  /** GST-inclusive line amount */
  gross: number;
  taxable: number;
  tax: number;
};

const th = "px-2 py-2 text-left font-sans text-[0.68rem] font-semibold tracking-wider text-muted-foreground uppercase";
const td = "px-2 py-2.5 align-top tabular-nums";

export function InvoiceTable({
  rows,
  intraState,
  totals,
  grandTotal,
}: {
  rows: InvoiceRow[];
  intraState: boolean;
  totals: { taxable: number; tax: number };
  grandTotal: number;
}) {
  return (
    <section className="py-6">
      <div className="-mx-2 overflow-x-auto print:overflow-visible">
        <table className="w-full min-w-[640px] border-collapse print:min-w-0">
          <caption className="sr-only">Invoice line items with GST breakup</caption>
          <thead>
            <tr className="border-y bg-muted/50 print:bg-transparent">
              <th scope="col" className={th}>#</th>
              <th scope="col" className={th}>Description</th>
              <th scope="col" className={th}>HSN/SAC</th>
              <th scope="col" className={`${th} text-right`}>Qty</th>
              <th scope="col" className={`${th} text-right`}>Rate</th>
              <th scope="col" className={`${th} text-right`}>Taxable value</th>
              {intraState ? (
                <>
                  <th scope="col" className={`${th} text-right`}>CGST 9%</th>
                  <th scope="col" className={`${th} text-right`}>SGST 9%</th>
                </>
              ) : (
                <th scope="col" className={`${th} text-right`}>IGST 18%</th>
              )}
              <th scope="col" className={`${th} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.key} className="border-b">
                <td className={td}>{i + 1}</td>
                <td className={`${td} min-w-40`}>
                  <span className="font-medium">{r.description}</span>
                  {r.detail ? <span className="block text-xs text-muted-foreground">{r.detail}</span> : null}
                </td>
                <td className={`${td} font-mono text-xs`}>{r.hsn}</td>
                <td className={`${td} text-right`}>{r.qty}</td>
                <td className={`${td} text-right`}>{formatAmount(r.rate)}</td>
                <td className={`${td} text-right`}>{formatAmount(r.taxable)}</td>
                {intraState ? (
                  <>
                    <td className={`${td} text-right`}>{formatAmount(r.tax / 2)}</td>
                    <td className={`${td} text-right`}>{formatAmount(r.tax / 2)}</td>
                  </>
                ) : (
                  <td className={`${td} text-right`}>{formatAmount(r.tax)}</td>
                )}
                <td className={`${td} text-right font-medium`}>{formatAmount(r.gross)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium">
              <td className={td} colSpan={5}>
                Total
              </td>
              <td className={`${td} text-right`}>{formatAmount(totals.taxable)}</td>
              {intraState ? (
                <>
                  <td className={`${td} text-right`}>{formatAmount(totals.tax / 2)}</td>
                  <td className={`${td} text-right`}>{formatAmount(totals.tax / 2)}</td>
                </>
              ) : (
                <td className={`${td} text-right`}>{formatAmount(totals.tax)}</td>
              )}
              <td className={`${td} text-right`}>{formatAmount(grandTotal)}</td>
            </tr>
            <tr className="border-t-2 border-charcoal">
              <td className="px-2 pt-3 text-base font-semibold" colSpan={intraState ? 8 : 7}>
                Grand total
              </td>
              <td className="px-2 pt-3 text-right text-base font-semibold tabular-nums whitespace-nowrap">
                ₹{formatAmount(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
